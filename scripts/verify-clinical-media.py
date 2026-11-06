"""Verify generated clinical media, timings, provenance and local path coverage.

Produces inspectable contact sheets without assigning new clinical labels.
Run only after acquisition and atlas optimization have completed.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import collections, concurrent.futures, hashlib, json, math, shutil, subprocess, sys

APP=Path(__file__).resolve().parents[1]
WORK=APP.parents[1]/'media-workspace'/'clinical'
sys.path.insert(0,str(WORK/'python-deps'))
import pydicom

PUB=APP/'public'
REVIEW=WORK/'review'; REVIEW.mkdir(parents=True,exist_ok=True)
FONT=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',15)
SMALL=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',12)

def local(url):
    p=(PUB/url.lstrip('/')).resolve()
    if PUB.resolve() not in p.parents:raise ValueError('Path leaves public folder')
    if not p.is_file():raise FileNotFoundError(p)
    return p

def tile(im,label,size=(240,220)):
    out=Image.new('RGB',size,'#171e28')
    im=im.convert('RGB');im.thumbnail((size[0]-8,size[1]-28))
    out.paste(im,((size[0]-im.width)//2,24+(size[1]-28-im.height)//2))
    ImageDraw.Draw(out).text((5,5),label,font=SMALL,fill='white')
    return out

def sheets(tiles,prefix,columns=6,rows=4,size=(240,220)):
    result=[]
    for page,start in enumerate(range(0,len(tiles),columns*rows),1):
        canvas=Image.new('RGB',(columns*size[0],rows*size[1]),'#171e28')
        for n,(im,label) in enumerate(tiles[start:start+columns*rows]):
            canvas.paste(tile(im,label,size),(n%columns*size[0],n//columns*size[1]))
        path=REVIEW/f'{prefix}-{page}.jpg';canvas.save(path,quality=91)
        result.append(str(path))
    return result

def audit_dus(r):
    video=local(r['video']);poster=local(r['poster'])
    dcm=WORK/'thrombus-originals'/(r['id']+'.dcm')
    assert hashlib.sha256(dcm.read_bytes()).hexdigest()==r['originalChecksum']
    ds=pydicom.dcmread(dcm,stop_before_pixels=True)
    phi=[key for key in ('PatientName','PatientID','PatientBirthDate','PatientAddress','PatientTelephoneNumbers') if str(getattr(ds,key,'')).strip()]
    if phi:raise ValueError(f'{r["id"]}: identity metadata requires review: {phi}')
    assert int(ds.NumberOfFrames)==r['frameCount']
    assert int(ds.Rows)==r['height'] and int(ds.Columns)==r['width']
    assert abs(1000/r['fps']-float(ds.FrameTime))<0.0001,r['id']
    args=[shutil.which('ffprobe'),'-v','error','-select_streams','v:0','-count_frames','-show_entries','stream=width,height,nb_read_frames,duration,avg_frame_rate','-of','json',str(video)]
    probe=json.loads(subprocess.check_output(args))['streams'][0]
    assert int(probe['nb_read_frames'])==r['frameCount'],r['id']
    assert abs(float(probe['duration'])-r['duration'])<0.08,r['id']
    assert r['calibration'] is None
    covered=[]
    for a in r['frameAtlases']:
        with Image.open(local(a['src'])) as im:
            assert im.size==(a['frameWidth']*a['columns'],a['frameHeight']*a['rows'])
        covered.extend(range(a['startFrame'],a['startFrame']+a['count']))
    assert covered==list(range(r['frameCount']))
    assert r['indexedFrames'] and not r['frameFiles']
    return {'id':r['id'],'frameCount':r['frameCount'],'timingVerified':r['timingVerified'],'frameTimeMs':r['frameTimeMs'],
            'videoDimensions':[probe['width'],probe['height']],'videoDuration':float(probe['duration']),
            'clearedIdentityFields':True,'burnedInAnnotationField':str(getattr(ds,'BurnedInAnnotation','')),
            'originalBytes':dcm.stat().st_size,'videoBytes':video.stat().st_size,
            'atlasBytes':sum(local(a['src']).stat().st_size for a in r['frameAtlases'])}

def indexed_frame(r,index):
    a=next(a for a in r['frameAtlases'] if a['startFrame']<=index<a['startFrame']+a['count'])
    t=index-a['startFrame'];x=t%a['columns']*a['frameWidth'];y=t//a['columns']*a['frameHeight']
    with Image.open(local(a['src'])) as im:return im.crop((x,y,x+a['frameWidth'],y+a['frameHeight']))

if __name__=='__main__':
    vision=json.loads((APP/'src'/'data'/'vision.json').read_text(encoding='utf-8'))
    dus=json.loads((APP/'src'/'data'/'dus.json').read_text(encoding='utf-8'))
    assert len(vision)==96 and len(dus)==72
    assert len({r['id'] for r in vision+dus})==168
    images=[];thermal=[]
    for r in vision:
        im=Image.open(local(r['image']));assert im.size==(r['width'],r['height'])
        original=WORK/'tricvi-originals'/(r['originalFileId']+'.jpg')
        assert hashlib.sha256(original.read_bytes()).hexdigest()==r['originalChecksum']
        local(r['thumbnail']);images.append((im.copy(),r['id']))
        if r['thermal']:
            thermal.extend([(im.copy(),r['id']+' RGB'),(Image.open(local(r['thermal'])).copy(),r['id']+' thermal')])
    contacts=sheets(images,'vision-final')+sheets(thermal,'thermal-final')
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:audits=list(pool.map(audit_dus,dus))
    cine_tiles=[]
    for r in dus:
        for index in [0,r['frameCount']//2,r['frameCount']-1]:
            cine_tiles.append((indexed_frame(r,index),f'{r["id"]} frame {index+1}/{r["frameCount"]}'))
    contacts+=sheets(cine_tiles,'dus-final',columns=3,rows=12,size=(300,240))
    files=[p for folder in ['vision','dus'] for p in (PUB/'media'/folder).rglob('*') if p.is_file()]
    summary={'verifiedOn':'2026-11-06','vision':{'records':len(vision),'sourceCaseFolders':len({r['sourceCaseId'] for r in vision}),
        'byClass':dict(collections.Counter(r['ceap'] for r in vision)),'thermalPairs':sum(bool(r['thermal']) for r in vision)},
        'dus':{'records':len(dus),'subjects':len({r['participantId'] for r in dus}),'bySite':dict(collections.Counter(r['site'] for r in dus)),
        'byCompressibility':dict(collections.Counter(r['compressibilityLabel'] for r in dus)),
        'frameCount':sum(r['frameCount'] for r in dus),'timingVerified':sum(r['timingVerified'] for r in dus),
        'atlasFiles':sum(len(r['frameAtlases']) for r in dus),'calibratedClips':sum(r['calibration'] is not None for r in dus)},
        'publicMediaBytes':sum(p.stat().st_size for p in files),'publicFileCount':len(files),'largestPublicFileBytes':max(p.stat().st_size for p in files),
        'originalDicomBytes':sum(a['originalBytes'] for a in audits),'allPathsExist':True,'allOriginalChecksumsVerified':True,
        'allCineFramesAndDurationVerified':True,'allSelectedDicomIdentityFieldsCleared':True,
        'sourceFrameTimePreferredToRoundedCineRate':True,
        'contactSheets':contacts,'clinicalReview':'Provider labels retained; independent FLEBOLAB medical review pending'}
    (WORK/'clinical-media-verification.json').write_text(json.dumps({'summary':summary,'dusAudit':audits},ensure_ascii=False,indent=2),encoding='utf-8')
    portable_summary={key:value for key,value in summary.items() if key!='contactSheets'}
    portable_summary['contactSheetCount']=len(contacts)
    (APP/'docs'/'CLINICAL_MEDIA_VERIFICATION.json').write_text(json.dumps({'summary':portable_summary,'dusAudit':audits},ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps(summary,ensure_ascii=False,indent=2))
