"""Rebuild native-dimension atlases directly from source DICOM under a budget.

Trials and staging never mutate public media. Applying requires a completed
staging report and preserves every frame, dimension, URL and temporal value.
"""
from pathlib import Path
import argparse, concurrent.futures, json, sys
APP=Path(__file__).resolve().parents[1]
WORK=APP.parents[1]/'media-workspace'/'clinical'
sys.path.insert(0,str(WORK/'python-deps'))
import numpy as np
import pydicom
from PIL import Image, ImageDraw, ImageFont
PUB=APP/'public';sys.stdout.reconfigure(encoding='utf-8')
FONT=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',17)

def frames(r):
    ds=pydicom.dcmread(WORK/'thrombus-originals'/(r['id']+'.dcm'))
    arr=ds.pixel_array
    if arr.ndim==2:arr=arr[None,...]
    if arr.dtype!=np.uint8:
        bits=int(getattr(ds,'BitsStored',8));arr=np.clip(arr,0,(1<<bits)-1).astype(np.float32)
        arr=np.rint(arr*255/((1<<bits)-1)).astype(np.uint8)
    if getattr(ds,'PhotometricInterpretation','')=='MONOCHROME1':arr=255-arr
    assert arr.shape[0]==r['frameCount'] and arr.shape[1:3]==(r['height'],r['width'])
    return arr

def build_atlas(r,a,arr):
    im=Image.new('RGB',(a['columns']*r['width'],a['rows']*r['height']),(0,0,0))
    for offset,index in enumerate(range(a['startFrame'],a['startFrame']+a['count'])):
        im.paste(Image.fromarray(arr[index]).convert('RGB'),(offset%a['columns']*r['width'],offset//a['columns']*r['height']))
    return im

def trial(records,quality):
    folder=WORK/'atlas-budget-trials';folder.mkdir(exist_ok=True)
    ids=['dus-cfv-001','dus-fv-045','dus-gs-027','dus-pv-062','dus-pv-063','dus-pv-068']
    results=[];comparisons=[]
    for r in [r for r in records if r['id'] in ids]:
        arr=frames(r);index=r['frameCount']//2
        a=next(a for a in r['frameAtlases'] if a['startFrame']<=index<a['startFrame']+a['count'])
        im=build_atlas(r,a,arr);entry={'id':r['id'],'originalDeliveryBytes':(PUB/a['src'].lstrip('/')).stat().st_size}
        row=Image.new('RGB',(4*360,380),'#171e28');draw=ImageDraw.Draw(row)
        original=Image.fromarray(arr[index]).convert('RGB')
        # A native central crop shows texture and boundaries without enhancement.
        w,h=original.size;x=max(0,w//2-170);y=max(0,h//2-170)
        box=(x,y,min(x+340,w),min(y+340,h))
        row.paste(original.crop(box),(10,30));draw.text((10,5),r['id']+' source native crop',font=FONT,fill='white')
        qualities=[58,54,52] if quality>=50 else [45,42,40]
        for col,q in enumerate(qualities,1):
            dest=folder/(r['id']+f'-q{q}.webp');im.save(dest,'WEBP',quality=q,method=6)
            entry['q'+str(q)]=dest.stat().st_size
            with Image.open(dest) as candidate:
                offset=index-a['startFrame'];ox=offset%a['columns']*w;oy=offset//a['columns']*h
                decoded=candidate.crop((ox,oy,ox+w,oy+h))
                row.paste(decoded.crop(box),(col*360+10,30))
                delta=np.asarray(decoded,dtype=np.float32)-np.asarray(original,dtype=np.float32)
                entry['psnrQ'+str(q)]=round(float(10*np.log10(255**2/np.mean(delta*delta))),2)
            draw.text((col*360+10,5),f'WebP Q{q} source DICOM',font=FONT,fill='white')
        results.append(entry);comparisons.append(row)
    sheet=Image.new('RGB',(1440,len(comparisons)*380),'#171e28')
    for i,row in enumerate(comparisons):sheet.paste(row,(0,i*380))
    sheet.save(folder/('comparisons-high.png' if quality>=50 else 'comparisons-budget.png'))
    totals={q:sum(r['q'+str(q)] for r in results)/sum(r['originalDeliveryBytes'] for r in results) for q in qualities}
    report={'sampleAtlases':results,'ratiosAgainstPreviousDelivery':totals}
    (folder/'report.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
    print(json.dumps(report,indent=2),flush=True)

def stage(records,quality):
    folder=WORK/f'atlas-budget-q{quality}';folder.mkdir(exist_ok=True)
    def one(r):
        target=folder/(r['id']+'-atlas');target.mkdir(exist_ok=True)
        arr=None;size=0
        for a in r['frameAtlases']:
            dest=target/Path(a['src']).name
            if not dest.exists():
                if arr is None:arr=frames(r)
                im=build_atlas(r,a,arr);im.save(dest,'WEBP',quality=quality,method=6)
            with Image.open(dest) as check:assert check.size==(r['width']*a['columns'],r['height']*a['rows'])
            size+=dest.stat().st_size
        print(f'Staged Q{quality} {r["id"]} {size}',flush=True)
        return {'id':r['id'],'bytes':size,'atlasFiles':len(r['frameAtlases'])}
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:results=list(pool.map(one,records))
    all_media=[p for p in (PUB/'media').rglob('*') if p.is_file()]
    atlas_old=sum((PUB/a['src'].lstrip('/')).stat().st_size for r in records for a in r['frameAtlases'])
    summary={'quality':quality,'method':6,'records':len(records),'frameCount':sum(r['frameCount'] for r in records),
        'atlasFiles':sum(r['atlasFiles'] for r in results),'atlasBytes':sum(r['bytes'] for r in results),
        'previousAtlasBytes':atlas_old,'previousAllMediaBytes':sum(p.stat().st_size for p in all_media),
        'projectedAllMediaBytes':sum(p.stat().st_size for p in all_media)-atlas_old+sum(r['bytes'] for r in results)}
    summary['projectedArchiveFrom306188012ByteBaseline']=306188012-atlas_old+summary['atlasBytes']
    summary['projectedArchiveWith4MBAdditionalBuild']=summary['projectedArchiveFrom306188012ByteBaseline']+4000000
    (folder/'report.json').write_text(json.dumps({'summary':summary,'records':results},indent=2),encoding='utf-8')
    print(json.dumps(summary),flush=True)

def apply(records,quality,max_bytes):
    folder=WORK/f'atlas-budget-q{quality}'
    report=json.loads((folder/'report.json').read_text(encoding='utf-8'))['summary']
    if report['projectedAllMediaBytes']>max_bytes:raise ValueError('Staged media exceeds requested public budget')
    before=json.dumps([(r['id'],r['frameCount'],r['width'],r['height'],r['fps'],r['frameTimeMs'],r['duration'],r['frameAtlases'],r['originalLabels']) for r in records],sort_keys=True)
    for r in records:
        for a in r['frameAtlases']:
            if not (folder/(r['id']+'-atlas')/Path(a['src']).name).is_file():raise FileNotFoundError(a['src'])
    for r in records:
        for a in r['frameAtlases']:
            source=folder/(r['id']+'-atlas')/Path(a['src']).name
            dest=PUB/a['src'].lstrip('/')
            source.replace(dest)
        r['transformations']=[x for x in r['transformations'] if 'WebP' not in x]
        r['transformations'].append(f'Native-dimension source DICOM frames packed directly into 4x4 WebP quality{quality} method6 atlases; lossy educational derivative, no resizing, no generative enhancement; every original frame index preserved')
        r['atlasEncoding']={'format':'WebP','quality':quality,'method':6,'input':'source DICOM pixels','lossy':True,'resized':False,'purpose':'educational visual comparison; not for clinical measurements'}
        (WORK/'delivery-records'/(r['id']+'.json')).write_text(json.dumps(r,ensure_ascii=False,indent=2),encoding='utf-8')
    after=json.dumps([(r['id'],r['frameCount'],r['width'],r['height'],r['fps'],r['frameTimeMs'],r['duration'],r['frameAtlases'],r['originalLabels']) for r in records],sort_keys=True)
    assert before==after
    (APP/'src/data/dus.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8')
    all_media=[p for p in (PUB/'media').rglob('*') if p.is_file()]
    final={'quality':quality,'method':6,'allPublicMediaBytes':sum(p.stat().st_size for p in all_media),'maxBudgetBytes':max_bytes,'unchangedIndexesDimensionsTimings':before==after}
    (WORK/'atlas-budget-final.json').write_text(json.dumps(final,indent=2),encoding='utf-8')
    print(json.dumps(final),flush=True)

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('mode',choices=['trial','stage','apply']);parser.add_argument('--quality',type=int,default=52);parser.add_argument('--max-bytes',type=int,default=264000000)
    args=parser.parse_args();records=json.loads((APP/'src/data/dus.json').read_text(encoding='utf-8'))
    if args.mode=='trial':trial(records,args.quality)
    elif args.mode=='stage':stage(records,args.quality)
    else:apply(records,args.quality,args.max_bytes)
