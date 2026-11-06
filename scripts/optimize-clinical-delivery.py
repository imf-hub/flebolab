"""Pack native ultrasound frames into lazy-loaded 4x4 WebP atlases.

The original pixel dimensions and frame timing remain available. Atlas creation
does not invent calibration or alter the provider's clinical labels.
"""
from pathlib import Path
from PIL import Image
import concurrent.futures, json, shutil, subprocess, sys, time

APP=Path(__file__).resolve().parents[1]
WORK=APP.parents[1]/'media-workspace'/'clinical'
PUB=APP/'public'
CACHE=WORK/'delivery-records';CACHE.mkdir(parents=True,exist_ok=True)
sys.stdout.reconfigure(encoding='utf-8')

def optimize(source):
    r=json.loads(source.read_text(encoding='utf-8'));rid=r['id'];checkpoint=CACHE/(rid+'.json')
    if checkpoint.exists():return json.loads(checkpoint.read_text(encoding='utf-8'))
    atlas_files=[];w,h=r['width'],r['height'];folder=PUB/'media'/'dus'/(rid+'-atlas');folder.mkdir(exist_ok=True)
    for start in range(0,len(r['frameFiles']),16):
        frame_urls=r['frameFiles'][start:start+16]
        atlas=Image.new('RGB',(w*4,h*4),(0,0,0))
        for local,url in enumerate(frame_urls):
            with Image.open(PUB/url.lstrip('/')) as im:atlas.paste(im.convert('RGB'),(local%4*w,local//4*h))
        dest=folder/f'{start//16:03d}.webp';atlas.save(dest,'WEBP',quality=68,method=4)
        atlas_files.append({'src':'/media/dus/'+rid+'-atlas/'+dest.name,'startFrame':start,'count':len(frame_urls),'columns':4,'rows':4,'frameWidth':w,'frameHeight':h})
    video=PUB/r['video'].lstrip('/');temp=WORK/(rid+'-optimized.mp4')
    args=[shutil.which('ffmpeg'),'-hide_banner','-loglevel','error','-y','-i',str(video),'-an','-c:v','libx264','-preset','fast','-crf','25','-threads','2','-pix_fmt','yuv420p','-movflags','+faststart',str(temp)]
    p=subprocess.run(args,capture_output=True)
    if p.returncode:raise RuntimeError(p.stderr.decode(errors='replace'))
    temp.replace(video)
    r['frameAtlases']=atlas_files;r['frameFiles']=[];r['indexedFrames']=True
    r['transformations'].append('Native-dimension frames packed 4x4 into WebP quality68 atlases for lazy indexed inspection; original frame index preserved')
    r['transformations'].append('H.264 playback derivative optimized to CRF25; atlas stills preserve native dimensions separately')
    checkpoint.write_text(json.dumps(r,ensure_ascii=False,indent=2),encoding='utf-8')
    return r

if __name__=='__main__':
    target=int(sys.argv[1]) if len(sys.argv)>1 else 72
    done={};deadline=time.time()+2400
    while len(done)<target and time.time()<deadline:
        ready=[p for p in WORK.glob('dus-*-record.json') if p.stem.replace('-record','') not in done]
        if not ready:time.sleep(3);continue
        with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
            for r in pool.map(optimize,ready):
                done[r['id']]=r;print(f'Atlas {len(done)}/{target} {r["id"]}',flush=True)
    if len(done)!=target:raise RuntimeError('Acquisition did not complete before bounded wait')
    results=sorted(done.values(),key=lambda r:r['id'])
    (APP/'src'/'data'/'dus.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
    # Delete only exact generated frame paths after atomically writing the new
    # manifest. Each directory is checked to be within our owned media folder.
    dus_root=(PUB/'media'/'dus').resolve()
    for r in results:
        folder=(dus_root/(r['id']+'-frames')).resolve()
        if folder.parent!=dus_root:raise ValueError('Unexpected frame directory')
        if folder.exists():shutil.rmtree(folder)
    media=[p for p in dus_root.rglob('*') if p.is_file()]
    summary={'records':len(results),'subjects':len({r['participantId'] for r in results}),'frames':sum(r['frameCount'] for r in results),'atlasFiles':sum(len(r['frameAtlases']) for r in results),'bytes':sum(p.stat().st_size for p in media),'fileCount':len(media)}
    (WORK/'dus-delivery-summary.json').write_text(json.dumps(summary,indent=2),encoding='utf-8')
    print(json.dumps(summary),flush=True)
