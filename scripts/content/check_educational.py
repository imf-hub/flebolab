"""Verificación de integridad editorial; no es validación clínica."""
from pathlib import Path
import json
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[2]
content = (ROOT / 'src/data/educational.ts').read_text(encoding='utf-8')
data = {name: json.loads(value) for name, value in re.findall(r'export const (\w+): [^=]+ = (\[.*?\]);', content, re.S)}
source_ids = {x['id'] for x in data['sources']}
target_ids = {f'TW{i:02}' for i in range(1, 13)} | {x['id'] for x in data['dopplerLessons']} | {f'C{i}' for i in range(7)}
errors = []
for name, records in data.items():
    ids = [x['id'] for x in records]
    if len(ids) != len(set(ids)):
        errors.append(f'{name}: IDs repetidos')
    for record in records:
        refs = record.get('sourceIds', record.get('sources', []))
        if not set(refs) <= source_ids:
            errors.append(f'{record["id"]}: fuente desconocida')
for p in data['pathways']:
    for step in p['steps']:
        if step.get('target') and step['target'] not in target_ids:
            errors.append(f'{p["id"]}: destino desconocido {step["target"]}')
for lesson in data['dopplerLessons']:
    for c in lesson['controls']:
        if not c['min'] <= c['defaultValue'] <= c['max'] or c['step'] <= 0:
            errors.append(f'{lesson["id"]}: control fuera de rango')
for item in data['plates'] + data['animations']:
    file = ROOT / 'public' / item['path'].lstrip('/')
    try:
        svg = ET.parse(file).getroot()
        for tag in ['title', 'desc']:
            if svg.find(f'{{http://www.w3.org/2000/svg}}{tag}') is None:
                errors.append(f'{item["id"]}: falta {tag}')
    except (OSError, ET.ParseError) as error:
        errors.append(f'{item["id"]}: {error}')
out = ROOT / 'docs/content/verification'
out.mkdir(exist_ok=True)
report = {'review': 'Integridad editorial y XML; no validación clínica', 'counts': {name: len(values) for name, values in data.items()}, 'errors': errors}
(out / 'integrity.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
html = '''<!doctype html><html lang="es"><meta charset="utf-8"><title>Medios originales FLEBO LAB</title><style>body{font-family:Arial;background:#edf3f7;margin:20px}main{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}figure{margin:0;background:#fff}img{display:block;width:100%;height:auto}figcaption{padding:8px;font-size:13px}</style><h1>Revisión de medios originales</h1><main>'''
for item in data['plates'] + data['animations']:
    html += f'<figure><img src="../../../public{item["path"]}" alt="{item["title"]}"><figcaption>{item["id"]} · {item["title"]}</figcaption></figure>'
html += '</main></html>'
(out / 'contact-sheet.html').write_text(html, encoding='utf-8')
print(json.dumps(report, ensure_ascii=False, indent=2))
raise SystemExit(bool(errors))
