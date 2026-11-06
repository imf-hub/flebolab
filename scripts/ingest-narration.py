"""Download an already-generated narration, validate its transcript and build absolute cues."""
import argparse, hashlib, json, re, subprocess, unicodedata, urllib.request
from pathlib import Path

root=Path(__file__).resolve().parents[1]
def norm(text):
    return ''.join(c for c in unicodedata.normalize('NFKD',text).lower() if c.isalnum() and not unicodedata.combining(c))
def stamp(t):
    ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02}.{ms%1000:03}'
def ingest(id):
    result=json.loads((root/f'artifacts/narration/{id}-response.json').read_text(encoding='utf-8'))
    if result.get('isError'):raise RuntimeError('Provider returned an error; do not regenerate automatically.')
    data=result.get('structuredContent') or json.loads(next(c['text'] for c in result['content'] if c['type']=='text'))
    if 'audio_url' not in data:raise ValueError('No audio URL in the known generation result')
    lesson=next(l for l in json.loads((root/'src/data/guided-lessons.json').read_text(encoding='utf-8')) if l['id']==id)
    job=next(j for j in json.loads((root/'artifacts/narration/requests.json').read_text(encoding='utf-8')) if j['id']==id)
    words=[w for w in data['word_timestamps'] if norm(w['word']) and not w['word'].startswith('<')]
    expected=norm(''.join(s['spoken'] for s in lesson['stages']))
    actual=norm(''.join(w['word'] for w in words))
    if actual!=expected:raise ValueError(f'{id}: spoken transcript does not match the authored text')
    cursor=0;stages=[];captions=[]
    for index,s in enumerate(lesson['stages']):
        first=cursor;target=norm(s['spoken']);found=''
        while cursor<len(words) and found!=target:
            found+=norm(words[cursor]['word']);cursor+=1
            if not target.startswith(found):raise ValueError(f'{id}: stage {index} word boundary mismatch')
        assert found==target
        start=0 if index==0 else words[first]['start']
        stages.append(dict(index=index,start=round(start,3),speechEnd=words[cursor-1]['end']))
        chunk=[]
        for w in words[first:cursor]:
            chunk.append(w)
            if re.search(r'[.!?…]$',w['word']) or len(chunk)>=19:
                captions.append(dict(start=chunk[0]['start'],end=chunk[-1]['end'],text=' '.join(w['word'] for w in chunk)));chunk=[]
        if chunk:captions.append(dict(start=chunk[0]['start'],end=chunk[-1]['end'],text=' '.join(w['word'] for w in chunk)))
    assert cursor==len(words)
    folder=root/'public/media/narration';folder.mkdir(parents=True,exist_ok=True)
    temp=root/f'artifacts/narration/{id}.mp3'
    if not temp.exists():urllib.request.urlretrieve(data['audio_url'],temp)
    original_hash=hashlib.sha256(temp.read_bytes()).hexdigest()
    web=root/f'artifacts/narration/{id}-web.mp3'
    subprocess.run(['ffmpeg','-v','error','-y','-i',str(temp),'-vn','-ac','1','-codec:a','libmp3lame','-b:a','96k',str(web)],check=True)
    payload=web.read_bytes();sha=hashlib.sha256(payload).hexdigest();name=f'{id.lower()}-{sha[:12]}'
    audio=folder/f'{name}.mp3';audio.write_bytes(payload)
    info=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(audio)],text=True))
    duration=float(info['format']['duration']);assert abs(duration-float(data['duration']))<.15
    assert any(s['codec_type']=='audio' for s in info['streams']) and words[-1]['end']<=duration
    for i,s in enumerate(stages):s['end']=stages[i+1]['start'] if i+1<len(stages) else duration
    for i,c in enumerate(captions):c['end']=min(captions[i+1]['start'] if i+1<len(captions) else duration,max(c['end']+.15,c['start']+.3))
    (folder/f'{name}.vtt').write_text('WEBVTT\n\n'+'\n\n'.join(f'{i+1}\n{stamp(c["start"])} --> {stamp(c["end"])}\n{c["text"]}' for i,c in enumerate(captions))+'\n',encoding='utf-8')
    entry=dict(audio=f'/media/narration/{name}.mp3',vtt=f'/media/narration/{name}.vtt',duration=duration,sha256=sha,originalSha256=original_hash,webPreparation='MP3 mono 96 kbps; no speed or pitch processing',stages=stages,captions=captions,voiceId=job['voiceId'],voiceName='Rocío - Calm & Trustworthy',engine=data.get('engine','not_reported'),language='es',playbackRate=1,transcriptVerified=True)
    (folder/f'{name}.json').write_text(json.dumps(dict(id=id,**entry,script=[dict(title=s['title'],text=s['spoken']) for s in lesson['stages']]),ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    catalog=root/'src/data/narration.json';manifest=json.loads(catalog.read_text(encoding='utf-8')) if catalog.exists() else {};manifest[id]=dict(**entry,package=f'/media/narration/{name}.json');catalog.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    archive=root/'docs/narration';archive.mkdir(parents=True,exist_ok=True)
    (archive/f'{id}.json').write_text(json.dumps(dict(id=id,request=job,requestId=data.get('request_id'),voice=entry['voiceName'],engine=entry['engine'],duration=duration,sha256=sha,word_timestamps=data['word_timestamps'],review='Exact normalized transcript and provider timestamps checked; independent auditory and medical approval are separate.'),ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(dict(id=id,duration=round(duration,3),bytes=len(payload),words=len(words),stages=len(stages),captions=len(captions),engine=entry['engine'],verified=True)))
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('ids',nargs='+');a=p.parse_args()
    for id in a.ids:ingest(id)
