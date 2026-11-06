"""Crop verified full-viewport UI captures into catalogue previews; no filters or clinical-image changes."""
import json,hashlib
from pathlib import Path
from PIL import Image
root=Path(__file__).resolve().parents[1]
captures=root/'artifacts/qa-0.12'
target=root/'public/media/lesson-previews'
target.mkdir(parents=True,exist_ok=True)
manifest={}
previous_file=root/'src/data/lesson-previews.json'
previous=json.loads(previous_file.read_text(encoding='utf-8')) if previous_file.exists() else {}
for row in json.loads((captures/'preview-rects.json').read_text(encoding='utf-8')):
    id=row['id'];rect=row['rect'];source=captures/(id+'-viewport.jpg')
    image=Image.open(source)
    assert image.size==(1280,720),(id,image.size)
    box=tuple(round(v) for v in (rect['x'],rect['y'],rect['x']+rect['width'],rect['y']+rect['height']))
    assert box[0]>=0 and box[1]>=0 and box[2]<=1280 and box[3]<=720
    crop=image.crop(box)
    filename=id+'.png'
    # The temporary PNG is a catalogue UI derivative, never a replacement for source medical media.
    crop.save(target/filename,optimize=True)
    digest=hashlib.sha256((target/filename).read_bytes()).hexdigest()
    named=id+'-'+digest[:12]+'.png'
    (target/filename).replace(target/named)
    old=previous.get(id,{}).get('path')
    if old:
        old_path=root/'public'/old.lstrip('/')
        if old_path.name!=named and old_path.exists():
            assert old_path.resolve().parent==target.resolve()
            old_path.unlink()
    manifest[id]={'path':'/media/lesson-previews/'+named,'sha256':digest,'width':crop.width,'height':crop.height,'nature':'Captura de la presentación web; medios originales disponibles en el laboratorio.'}
(root/'src/data/lesson-previews.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'previews':len(manifest),'bytes':sum((root/'public'/v['path'].lstrip('/')).stat().st_size for v in manifest.values())}))
