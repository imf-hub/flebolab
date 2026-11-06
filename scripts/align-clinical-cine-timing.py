"""Encode playback directly from the source DICOM with precise FrameTime.

Scanner CineRate may be rounded. The frame index and FrameTime are retained
without assigning a physical calibration. Run after atlas optimization.
"""
from pathlib import Path
import concurrent.futures, json, shutil, subprocess, sys
APP=Path(__file__).resolve().parents[1]
WORK=APP.parents[1]/'media-workspace'/'clinical'
sys.path.insert(0,str(WORK/'python-deps'))
import numpy as np
import pydicom
PUB=APP/'public'
sys.stdout.reconfigure(encoding='utf-8')

def encode(r):
    ds=pydicom.dcmread(WORK/'thrombus-originals'/(r['id']+'.dcm'))
    frame_time=float(getattr(ds,'FrameTime',0) or 0)
    if frame_time<=0:raise ValueError('Precise FrameTime missing; manual timing review required')
    arr=ds.pixel_array
    if arr.ndim==2:arr=arr[None,...]
    if arr.dtype!=np.uint8:
        bits=int(getattr(ds,'BitsStored',8));arr=np.clip(arr,0,(1<<bits)-1).astype(np.float32)
        arr=np.rint(arr*255/((1<<bits)-1)).astype(np.uint8)
    if getattr(ds,'PhotometricInterpretation','')=='MONOCHROME1':arr=255-arr
    fps=1000/frame_time
    temp=WORK/(r['id']+'-timing-aligned.mp4')
    args=[shutil.which('ffmpeg'),'-hide_banner','-loglevel','error','-y','-f','rawvideo','-pixel_format','rgb24' if arr.ndim==4 else 'gray',
        '-video_size',f'{r["width"]}x{r["height"]}','-framerate',str(fps),'-i','pipe:0','-an','-vf','pad=ceil(iw/2)*2:ceil(ih/2)*2',
        '-c:v','libx264','-preset','fast','-crf','25','-threads','2','-pix_fmt','yuv420p','-movflags','+faststart',str(temp)]
    p=subprocess.run(args,input=arr.tobytes(),capture_output=True)
    if p.returncode:raise RuntimeError(p.stderr.decode(errors='replace'))
    temp.replace(PUB/r['video'].lstrip('/'))
    r.update(fps=fps,frameTimeMs=frame_time,duration=r['frameCount']/fps,timingSource='FrameTime',timingVerified=True)
    r['sourceCineRate']=float(getattr(ds,'CineRate',0) or 0) or None
    r['transformations']=[x for x in r['transformations'] if not ('H.264' in x)]
    r['transformations'].append('H.264 CRF25 YUV420 playback encoded directly from source DICOM at precise FrameTime; padding up to 1 px right/bottom if needed')
    (WORK/'delivery-records'/(r['id']+'.json')).write_text(json.dumps(r,ensure_ascii=False,indent=2),encoding='utf-8')
    # Keep acquisition checkpoints consistent for deterministic, resumable runs.
    checkpoint=WORK/(r['id']+'-record.json')
    original=json.loads(checkpoint.read_text(encoding='utf-8'))
    original.update({key:r[key] for key in ['fps','frameTimeMs','duration','timingSource','timingVerified','sourceCineRate']})
    checkpoint.write_text(json.dumps(original,ensure_ascii=False,indent=2),encoding='utf-8')
    print('Precise timing '+r['id'],flush=True)
    return r

if __name__=='__main__':
    records=json.loads((APP/'src'/'data'/'dus.json').read_text(encoding='utf-8'))
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:results=list(pool.map(encode,records))
    (APP/'src'/'data'/'dus.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
    files=[p for p in (PUB/'media'/'dus').rglob('*') if p.is_file()]
    summary={'records':len(results),'subjects':len({r['participantId'] for r in results}),'frames':sum(r['frameCount'] for r in results),
        'atlasFiles':sum(len(r['frameAtlases']) for r in results),'bytes':sum(p.stat().st_size for p in files),'fileCount':len(files),
        'largestFileBytes':max(p.stat().st_size for p in files),'preciseFrameTime':True}
    (WORK/'dus-delivery-summary.json').write_text(json.dumps(summary,indent=2),encoding='utf-8')
    print(json.dumps(summary),flush=True)
