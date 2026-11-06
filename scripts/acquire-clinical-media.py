"""Acquire bounded public clinical excerpts, preserving origin and labels.

No clinical diagnosis is inferred. Original DICOM files remain in the local media
workspace, while the public bundle contains videos and photographs with credits.
"""
from __future__ import annotations
import argparse, binascii, collections, concurrent.futures, csv, hashlib, io, json
import os, pathlib, re, shutil, struct, subprocess, sys, time, urllib.request, zipfile, zlib

APP = pathlib.Path(__file__).resolve().parents[1]
PROJECT = APP.parents[1]
EVIDENCE = PROJECT / 'investigacion' / '2026-11-05' / 'evidencias'
WORK = PROJECT / 'media-workspace' / 'clinical'
OUT = APP / 'public' / 'media'
DATA = APP / 'src' / 'data'
WORK.mkdir(parents=True, exist_ok=True)
DATA.mkdir(parents=True, exist_ok=True)
sys.path.insert(0, str(WORK / 'python-deps'))
sys.stdout.reconfigure(encoding='utf-8')
AGENT = 'FLEBOLAB-public-educational-media/1.0'


def fetch(url, limit=32_000_000, headers=None):
    last = None
    for attempt in range(4):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': AGENT, **(headers or {})})
            with urllib.request.urlopen(req, timeout=80) as response:
                data = response.read(limit + 1)
                if len(data) > limit: raise ValueError('Response exceeds bounded request size')
                return data, dict(response.headers), response.status
        except Exception as error:
            last = error
            if attempt < 3: time.sleep(1.5 * (attempt + 1))
    raise last


def save_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding='utf-8')


def path_parts(folder_id, folder_map):
    parts = []; seen = set()
    while folder_id in folder_map and folder_id not in seen:
        seen.add(folder_id); folder = folder_map[folder_id]
        parts.insert(0, folder['name']); folder_id = folder.get('parent_id')
    return parts


def acquire_vision():
    from PIL import Image, ImageOps
    records = json.loads((EVIDENCE / 'tricvi-files.json').read_text(encoding='utf-8'))
    folder_map = {f['id']: f for f in json.loads((EVIDENCE / 'tricvi-folders.json').read_text(encoding='utf-8'))}
    cases = collections.defaultdict(dict)
    for record in records:
        parts = path_parts(record.get('folder_id'), folder_map)
        if len(parts) != 4 or not parts[1].startswith('C'): continue
        class_code = parts[1].split('_')[0]
        case = cases[(class_code, parts[2])]
        case.setdefault(parts[3], []).append(record)
    for case in cases.values():
        for items in case.values(): items.sort(key=lambda f: f['filename'])
    selected = []
    for key in sorted(cases):
        rgb = cases[key].get('RGB', [])
        if rgb: selected.append((key, rgb[0], 1))
    rarity = ['C5', 'C6', 'C4', 'C1', 'C2', 'C3', 'C0']
    for class_code in rarity:
        for key in sorted(cases):
            if len(selected) >= 96: break
            if key[0] != class_code: continue
            rgb = cases[key].get('RGB', [])
            if len(rgb)>1:
                # The protocol repeats captures of each view. Select a distant
                # acquisition rather than the adjacent near-duplicate capture.
                index=min(4,len(rgb)-1)
                selected.append((key, rgb[index], index+1))
        if len(selected)>=96: break
    target_pairs = []
    for class_code, count in [('C0',2),('C1',2),('C2',2),('C3',2),('C4',2),('C5',1),('C6',1)]:
        for key in [k for k in sorted(cases) if k[0]==class_code][:count]: target_pairs.append(key)
    pair_keys = set(target_pairs)
    labels = {'C0':'Sin signos venosos visibles','C1':'Telangiectasias y venas reticulares','C2':'Várices','C3':'Edema: contexto de origen','C4':'Cambios cutáneos','C5':'Úlcera cicatrizada: contexto de origen','C6':'Úlcera activa: contexto de origen'}
    (OUT/'vision').mkdir(parents=True,exist_ok=True)
    originals = WORK/'tricvi-originals'; originals.mkdir(exist_ok=True)

    def download(item):
        key, file, view = item; class_code, case_no = key
        rid = f'vision-{class_code.lower()}-{case_no}-v{view}'
        original = originals/(file['id']+'.jpg')
        if not original.exists(): original.write_bytes(fetch(file['content_details']['download_url'],2_000_000)[0])
        raw = original.read_bytes(); actual_hash=hashlib.sha256(raw).hexdigest()
        expected = file['content_details'].get('sha256_hash')
        if expected and actual_hash != expected: raise ValueError('Original checksum mismatch: '+file['filename'])
        im = ImageOps.exif_transpose(Image.open(original)).convert('RGB')
        width,height=im.size
        im.save(OUT/'vision'/(rid+'.webp'), 'WEBP', quality=94, method=5)
        thumb=im.copy();thumb.thumbnail((460,460));thumb.save(OUT/'vision'/(rid+'-thumb.webp'),'WEBP',quality=86,method=5)
        thermal_url=None; thermal_meta=None
        if key in pair_keys and view==1:
            thermal_files=cases[key].get('Thermal',[])+cases[key].get('Themal',[])
            thermal=next((f for f in thermal_files if f['filename']==file['filename']),None)
            if thermal:
                raw_t=fetch(thermal['content_details']['download_url'],2_000_000)[0]
                ht=hashlib.sha256(raw_t).hexdigest()
                if thermal['content_details'].get('sha256_hash') and ht!=thermal['content_details']['sha256_hash']: raise ValueError('Thermal checksum mismatch')
                tim=ImageOps.exif_transpose(Image.open(io.BytesIO(raw_t))).convert('RGB')
                tim.save(OUT/'vision'/(rid+'-thermal.webp'),'WEBP',quality=94,method=5)
                thermal_url='/media/vision/'+rid+'-thermal.webp'
                thermal_meta={'sourceFileId':thermal['id'],'originalFile':thermal['filename'],'originalChecksum':ht,'pairMethod':'same source case folder and filename','temperatureCalibration':None}
        return {'id':rid,'title':labels[class_code]+' · caso '+case_no,'ceap':class_code,'class':class_code,'category':labels[class_code],
            'sourceId':'tricvi-c-v2','sourceUrl':'https://data.mendeley.com/datasets/rf5m97cmm3/2','sourceVersion':'2',
            'sourceCaseId':class_code+'/'+case_no,'participantId':None,'side':None,'site':'Miembros inferiores','view':None,'viewIndex':view,
            'kind':'clinical','modality':'RGB','image':'/media/vision/'+rid+'.webp','thumbnail':'/media/vision/'+rid+'-thumb.webp','thermal':thermal_url,
            'media':{'image':'/media/vision/'+rid+'.webp','thumbnail':'/media/vision/'+rid+'-thumb.webp','thermal':thermal_url},
            'width':width,'height':height,'originalFile':file['filename'],'originalFileId':file['id'],'originalChecksum':actual_hash,
            'originalLabels':{'sourceFolderClass':class_code,'caseFolder':case_no},
            'clinicalContext':'Clase C conservada del depósito. La imagen aislada no completa etiología, anatomía o fisiopatología. Las vistas del mismo caso no representan pacientes distintos.',
            'caption':'Observa distribución, superficie y signos visibles. Contrasta con el contexto y las demás vistas del mismo caso.',
            'description':labels[class_code]+'. Fotografía clínica del conjunto TRICVI–C; clasificación de origen conservada.',
            'license':'CC BY 4.0','licenseUrl':'https://creativecommons.org/licenses/by/4.0/',
            'attribution':'Ruiz, J.; Gomez-Gil, P.; Renero, F. TRICVI–C v2, Mendeley Data (2026), doi:10.17632/rf5m97cmm3.2. CC BY 4.0.',
            'transformations':['EXIF orientation applied','RGB colour conversion','WebP delivery encoding; original dimensions preserved','thumbnail resized with aspect ratio preserved'],
            'thermalMetadata':thermal_meta,'review':{'technical':'download, checksum, decode and dimensions checked','clinical':'Source labels retained; no independent diagnosis'},
            'tags':[class_code,'Fotografía clínica',labels[class_code]]}

    results=[]
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        futures={pool.submit(download,item):item for item in selected}
        for i,future in enumerate(concurrent.futures.as_completed(futures),1):
            result=future.result();results.append(result)
            print(f'Vision {i}/{len(selected)} {result["id"]}',flush=True)
    results.sort(key=lambda r:r['id'])
    save_json(DATA/'vision.json',results)
    retained={pathlib.PurePosixPath(value).name for r in results for value in [r['image'],r['thumbnail'],r.get('thermal')] if value}
    for existing in (OUT/'vision').glob('vision-*.webp'):
        if existing.name not in retained: existing.unlink()
    summary={'records':len(results),'sourceCaseFolders':len({r['sourceCaseId'] for r in results}),'byClass':dict(collections.Counter(r['ceap'] for r in results)),
        'thermalPairs':sum(bool(r['thermal']) for r in results),'fileBytes':sum(p.stat().st_size for p in (OUT/'vision').glob('*')),'source':'TRICVI-C v2','verifiedOn':'2026-11-06'}
    save_json(WORK/'vision-summary.json',summary);print(json.dumps(summary,ensure_ascii=False),flush=True)


class RemoteZip(io.RawIOBase):
    def __init__(self,url,size): self.url,self.size,self.position,self.bytes=url,size,0,0
    def seekable(self): return True
    def readable(self): return True
    def tell(self): return self.position
    def seek(self,offset,whence=0):
        self.position=offset if whence==0 else self.position+offset if whence==1 else self.size+offset
        return self.position
    def read(self,n=-1):
        if n<0:n=self.size-self.position
        if n==0:return b''
        data=range_read(self.url,self.position,n);self.position+=len(data);self.bytes+=len(data);return data


def range_read(url,start,n):
    if n>40_000_000:raise ValueError('Individual remote range too large')
    data,headers,status=fetch(url,n,{'Range':f'bytes={start}-{start+n-1}'})
    cr=next((v for k,v in headers.items() if k.lower()=='content-range'),'')
    if status!=206 or not cr.startswith(f'bytes {start}-'):raise ValueError('Range not honoured; full download cancelled')
    return data


def dicom_to_public(path,info,record,rid):
    import numpy as np
    import pydicom
    from PIL import Image
    ds=pydicom.dcmread(path)
    # Provider declares de-identification. Do not release originals or export metadata.
    arr=ds.pixel_array
    if arr.ndim==2:arr=arr[None,...]
    colour=arr.ndim==4
    frames=int(arr.shape[0]);height=int(arr.shape[1]);width=int(arr.shape[2])
    if arr.dtype!=np.uint8:
        bits=int(getattr(ds,'BitsStored',8));arr=np.clip(arr,0,(1<<bits)-1).astype(np.float32)
        arr=np.rint(arr*255/((1<<bits)-1)).astype(np.uint8)
    if getattr(ds,'PhotometricInterpretation','')=='MONOCHROME1':arr=255-arr
    frame_time=float(getattr(ds,'FrameTime',0) or 0)
    vector=getattr(ds,'FrameTimeVector',None)
    fps=float(getattr(ds,'CineRate',0) or getattr(ds,'RecommendedDisplayFrameRate',0) or 0)
    timing_source='FrameTime' if frame_time else 'CineRate' if fps else None
    if not frame_time and vector:
        vv=[float(x) for x in vector];positive=[x for x in vv if x>0]
        frame_time=sum(positive)/len(positive) if positive else 0;timing_source='FrameTimeVector mean for playback'
    # FrameTime retains sub-millisecond timing; CineRate is often an integer
    # rounded by the scanner. Keep video timing and indexed timestamps aligned.
    if frame_time:fps=1000/frame_time
    timing_verified=bool(fps)
    if not fps:fps=25;timing_source='25 fps display convention; physical frame timing unavailable'
    if not frame_time and timing_verified:frame_time=1000/fps
    video=OUT/'dus'/(rid+'.mp4');poster=OUT/'dus'/(rid+'-poster.webp')
    pix='rgb24' if colour else 'gray'
    ffmpeg=shutil.which('ffmpeg')
    args=[ffmpeg,'-hide_banner','-loglevel','error','-y','-f','rawvideo','-pixel_format',pix,'-video_size',f'{width}x{height}',
        '-framerate',str(fps),'-i','pipe:0','-an','-vf','pad=ceil(iw/2)*2:ceil(ih/2)*2','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',str(video)]
    proc=subprocess.run(args,input=arr.tobytes(),capture_output=True)
    if proc.returncode:raise RuntimeError(proc.stderr.decode(errors='replace'))
    Image.fromarray(arr[frames//3]).save(poster,'WEBP',quality=94,method=5)
    frame_dir=OUT/'dus'/(rid+'-frames');frame_dir.mkdir(exist_ok=True)
    # Inspect every original frame through a compact strip representation. Native
    # dimensions are preserved in the video; exact stills remain full-sized too.
    frame_files=[]
    for i in range(frames):
        dest=frame_dir/f'{i:04d}.webp';Image.fromarray(arr[i]).save(dest,'WEBP',quality=92,method=4)
        frame_files.append('/media/dus/'+rid+'-frames/'+dest.name)
    regions=[]
    for region in getattr(ds,'SequenceOfUltrasoundRegions',[]):
        names=['RegionSpatialFormat','RegionDataType','RegionLocationMinX0','RegionLocationMinY0','RegionLocationMaxX1','RegionLocationMaxY1','PhysicalUnitsXDirection','PhysicalUnitsYDirection','PhysicalDeltaX','PhysicalDeltaY','ReferencePixelX0','ReferencePixelY0','ReferencePixelPhysicalValueX','ReferencePixelPhysicalValueY']
        regions.append({key:str(getattr(region,key)) for key in names if hasattr(region,key)})
    site=record['Anatomical Site'];side=record['Limb'];comp=int(float(record['Compressibility']));throm=int(float(record['Thrombosis']))
    comp_labels={0:'No compresible',1:'Compresibilidad parcial',2:'Compresible'}
    site_labels={'CFV':'Vena femoral común','GS':'Unión safenofemoral','FV':'Vena femoral','PV':'Vena poplítea'}
    return {'id':rid,'title':site_labels.get(site,site)+' · '+comp_labels[comp], 'site':site,'segment':site_labels.get(site,site),'side':side,'participantId':str(record['SubjectID']),
        'sourceCaseId':record['File Name'],'sourceId':'thrombus-training-v1','sourceUrl':'https://zenodo.org/records/17659415','sourceVersion':'v1.0','kind':'clinical','modality':'Compression B-mode',
        'compressibility':comp,'compressibilityLabel':comp_labels[comp],'thrombosis':throm,'label':comp_labels[comp],
        'originalLabels':{k:record[k] for k in ['SubjectID','Limb','Anatomical Site','Compressibility','Thrombosis']},
        'clinicalContext':'Etiquetas de compresión y trombosis del proveedor. Este cine no representa un protocolo completo de reflujo.',
        'caption':'Observa la deformación durante la maniobra. La respuesta se conserva como fue rotulada por el experto del conjunto original.',
        'posture':None,'maneuver':'Compresión con transductor','orientation':None,
        'video':'/media/dus/'+rid+'.mp4','poster':'/media/dus/'+rid+'-poster.webp','thumbnail':'/media/dus/'+rid+'-poster.webp',
        'media':{'video':'/media/dus/'+rid+'.mp4','poster':'/media/dus/'+rid+'-poster.webp'},'frameFiles':frame_files,
        'width':width,'height':height,'frameCount':frames,'frameTimeMs':frame_time if timing_verified else None,'fps':fps,'duration':frames/fps,'timingSource':timing_source,'timingVerified':timing_verified,
        'transferSyntax':str(ds.file_meta.TransferSyntaxUID),'calibrationRegions':regions,'calibration':None,
        'license':'CC BY 4.0','licenseUrl':'https://creativecommons.org/licenses/by/4.0/',
        'attribution':'Didaskalou, S.; Portokallidis, N.; Kaldoudi, E.; ThrombUS+ consortium. Compression Ultrasound Videos, Training Set v1.0. Zenodo, doi:10.5281/zenodo.17659415. CC BY 4.0.',
        'originalChecksum':hashlib.sha256(path.read_bytes()).hexdigest(),
        'transformations':['DICOM pixel decode using pydicom','MONOCHROME1 inversion only if required','8-bit scaling from BitsStored only if necessary','H.264 CRF18 YUV420 playback derivative; padding up to 1 px at right/bottom if needed','Each native frame exported as WebP for indexed inspection'],
        'review':{'technical':'DICOM decode, frame count, dimensions and playback derivative checked','clinical':'Original expert labels retained; no independent diagnosis'},
        'tags':[site,side,comp_labels[comp],'TVP etiquetada' if throm else 'Sin TVP según etiqueta']}


def acquire_dus(target=48):
    record=json.loads((EVIDENCE/'thrombus-training.txt').read_text(encoding='utf-8'));file=record['files'][0]
    url=file['links']['self'];remote=RemoteZip(url,file['size'])
    with zipfile.ZipFile(remote) as z:
        infos={n:i for n,i in [(i.filename,i) for i in z.infolist()] if not n.startswith('__MACOSX/')}
        rows=list(csv.DictReader(io.StringIO(z.read('train.csv').decode('utf-8-sig'))))
    save_json(WORK/'thrombus-rows.json',rows)
    # Equal segment coverage with varied subjects, oversampling labelled pathology
    # deliberately for teaching; this is not a prevalence sample.
    selected=[];used=set();subjects=collections.Counter()
    for site in ['CFV','GS','FV','PV']:
        group=[r for r in rows if r['Anatomical Site']==site]
        per=target//4
        # Roughly half complete compressions, one third non-compressions, and
        # available partial compressions. Labels remain the original labels.
        quotas=[(0,per//3),(1,max(1,per//6)),(2,per)]
        for label,quota in quotas:
            options=[r for r in group if int(float(r['Compressibility']))==label]
            options.sort(key=lambda r:(subjects[r['SubjectID']],r['SubjectID'],r['File Name']))
            added=0
            for r in options:
                if len([x for x in selected if x['Anatomical Site']==site])>=per or added>=quota:break
                if r['File Name'] in used or subjects[r['SubjectID']]>=2:continue
                selected.append(r);used.add(r['File Name']);subjects[r['SubjectID']]+=1;added+=1
    save_json(WORK/'thrombus-selection.json',selected)
    (OUT/'dus').mkdir(parents=True,exist_ok=True);originals=WORK/'thrombus-originals';originals.mkdir(exist_ok=True)
    result=[]
    def download(pair):
        index,row=pair;rid=f'dus-{row["Anatomical Site"].lower()}-{index+1:03d}'
        cached=WORK/(rid+'-record.json')
        if cached.exists():return json.loads(cached.read_text(encoding='utf-8'))
        name=row['File Name']; info=infos.get(name) or next((v for k,v in infos.items() if pathlib.PurePosixPath(k).name==name),None)
        if info is None:raise ValueError('DICOM member not found: '+name)
        path=originals/(rid+'.dcm')
        if not path.exists():
            header=range_read(url,info.header_offset,30)
            if header[:4]!=b'PK\x03\x04':raise ValueError('Unexpected local ZIP header')
            name_len,extra_len=struct.unpack_from('<HH',header,26)
            compressed=range_read(url,info.header_offset+30+name_len+extra_len,info.compress_size)
            raw=zlib.decompress(compressed,-15) if info.compress_type==8 else compressed
            if len(raw)!=info.file_size or binascii.crc32(raw)&0xffffffff!=info.CRC:raise ValueError('ZIP content CRC mismatch')
            path.write_bytes(raw)
        output=dicom_to_public(path,info,row,rid);save_json(cached,output)
        return output
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        futures={pool.submit(download,pair):pair for pair in enumerate(selected)}
        for i,f in enumerate(concurrent.futures.as_completed(futures),1):
            out=f.result();result.append(out);save_json(DATA/'dus.json',sorted(result,key=lambda r:r['id']))
            print(f'DUS {i}/{len(selected)} {out["id"]} frames={out["frameCount"]}',flush=True)
    result.sort(key=lambda r:r['id']);save_json(DATA/'dus.json',result)
    summary={'records':len(result),'subjects':len({r['participantId'] for r in result}),'bySite':dict(collections.Counter(r['site'] for r in result)),
        'byCompressibility':dict(collections.Counter(r['compressibilityLabel'] for r in result)),
        'totalFrames':sum(r['frameCount'] for r in result),'bytes':sum(p.stat().st_size for p in (OUT/'dus').rglob('*') if p.is_file()),'timingVerified':sum(r['timingVerified'] for r in result)}
    save_json(WORK/'dus-summary.json',summary);print(json.dumps(summary,ensure_ascii=False),flush=True)


if __name__=='__main__':
    args=argparse.ArgumentParser();args.add_argument('mode',choices=['vision','dus']);args.add_argument('--target',type=int,default=48);opt=args.parse_args()
    if opt.mode=='vision':acquire_vision()
    else:acquire_dus(opt.target)
