"""Revisión editorial reproducible. Los datos clínicos originales conservan sus etiquetas."""
from pathlib import Path
import json
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / 'src/data'
def save(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
content = json.loads((DATA/'educational-content.json').read_text(encoding='utf-8'))
def addrefs(items, field, refs):
    for item in items:
        item[field] = list(dict.fromkeys(refs + item[field]))
for term in content['glossary']:
    number=int(term['id'][1:])
    refs=['uipnomenclature','uipduplex2'] if 9<=number<=15 else ['uipduplex1'] if number in [6,16,17,18,19,25,26,27] else []
    term['sourceIds']=list(dict.fromkeys(refs+term['sourceIds']))
for lesson in content['dopplerLessons']:
    if lesson['id'] in ['DP01','DP02','DP05','DP07','DP08','DP10']:
        lesson['sourceIds']=list(dict.fromkeys(['uipduplex1']+lesson['sourceIds']))
for pathway in content['pathways']:
    refs=['uipduplex1'] if pathway['id'] in ['RC05','RC06','RC07','RC08'] else []
    pathway['sourceIds']=list(dict.fromkeys(refs+pathway['sourceIds']))
for term in content['glossary']:
    if term['id']=='G09': term['definition']=term['definition'].replace('planos fasciales','la fascia muscular')
    if term['id'] in ['G09','G10','G11','G12']:
        term['sourceIds']=list(dict.fromkeys(['uipnomenclature', 'uipduplex2']+term['sourceIds']))
for lesson in content['dopplerLessons']:
    if lesson['id']=='DP10':
        lesson['intro']='La duración del flujo inverso se interpreta por segmento, postura y maniobra. El esquema adopta los criterios segmentarios de SVS/AVF/AVLS; no diagnostica un caso.'
        lesson['keyPoints']=[
          'SVS/AVF/AVLS: >0,5 s en troncos superficiales, venas tibiales, femoral profunda y perforantes; >1 s en femoral común, femoral y poplítea. Son criterios de implementación, no una escala de gravedad.',
          'La guía define una perforante patológica en C2 por flujo hacia afuera >0,5 s y diámetro >3,5 mm. Dirección, duración y diámetro son criterios diferentes; no se deducen de esta curva.',
          'ESVS describe variación entre >0,35 y >0,5 s para perforantes. Debe registrarse qué protocolo se aplicó. El valor exacto del umbral no cumple una condición estrictamente mayor.',
          'Documenta lado, segmento, posición y maniobra. La evaluación se realiza de pie cuando es posible, con alternativas si no se tolera; color aislado no sustituye la documentación espectral.'
        ]
        lesson['sourceIds']=list(dict.fromkeys(['uipduplex1','uipduplex2','svs2022','svs2023','esvs2022','asa']))
for guide in content['observationGuides']:
    if guide['id']=='C1': guide['title']=guide['title'].replace(' y ', ' o ')
    if guide['id']=='C3': guide['sources']=list(dict.fromkeys(guide['sources']))
    if guide['id']=='C4':
        guide['contextNeeded'].append('CEAP 2020 distingue C4a (pigmentación o eccema), C4b (lipodermatoesclerosis o atrofia blanca) y C4c (corona flebectásica). La etiqueta C4 del depósito no permite asignar retrospectivamente una subclase.') if not any('C4a' in x for x in guide['contextNeeded']) else None
for source in content['sources']:
    if source['id']=='esvs2022': source['url']='https://doi.org/10.1016/j.ejvs.2021.12.024'
    if source['id']=='asa': source['url']='https://www.sonographers.org/resources/clinical-resources/cvi-guideline'
save(DATA/'educational-content.json', content)

photos=json.loads((DATA/'vision.json').read_text(encoding='utf-8'))
for photo in photos:
    if photo['ceap']=='C1': photo['category']=photo['category'].replace(' y ', ' o ')
    if photo.get('thermal'):
        with Image.open(ROOT/'public'/photo['thermal'].lstrip('/')) as image:
            photo['thermalWidth'],photo['thermalHeight']=image.size
    else: photo['thermalWidth']=photo['thermalHeight']=None
save(DATA/'vision.json', photos)
clips=json.loads((DATA/'dus.json').read_text(encoding='utf-8'))
for clip in clips:
    if clip['site']=='GS':
        clip['segment']='Región safenofemoral / sitio safeno proximal (GS)'
save(DATA/'dus.json', clips)

# El generador consume el contenido canónico antes de crear los SVG y TypeScript.
generator=ROOT/'scripts/content/build_educational.py'
code=generator.read_text(encoding='utf-8')
if '# Contenido canónico revisado' not in code:
    code=code.replace('plate_specs=[]', '''# Contenido canónico revisado; no perder correcciones al regenerar.
canonical=json.loads((DATA/'educational-content.json').read_text(encoding='utf-8'))
for name in ['sources','glossary','dopplerLessons','pathways','observationGuides']:
    globals()[name]=canonical[name]
for filename in ['clinical-uip.json','clinical-vascular.json']:
    p=DATA/filename
    if p.exists():
        for ref in json.loads(p.read_text(encoding='utf-8')):
            existing=next((s for s in sources if s['id']==ref['id']),None)
            if existing:
                existing['url']=ref['url']
            else:
                sources.append(dict(id=ref['id'],title=ref['title'],url=ref['url'],type=ref['kind'],summary=ref['scope'],credit=ref['organization'],license='Referencia bibliográfica; no se reproducen figuras'))
plate_specs=[]''')
    code=code.replace('def valve(x,y,scale=1,reverse=False):','def valve(x,y,scale=1,reverse=False,gap=0):')
    code=code.replace('{x},{y-18*delta*scale}', '{x-gap},{y-18*delta*scale}',1)
    # El segundo borde se abre hacia el lado contrario.
    pos=code.index('def valve(');end=code.index('def spectrum(',pos)
    part=code[pos:end].replace('{x},{y-18*delta*scale}', '{x+gap},{y-18*delta*scale}')
    code=code[:pos]+part+code[end:]
    code=code.replace('vessel(275,255,85,325)+valve(317,400)+arrow(317,350,317,285)', 'vessel(275,255,85,325)+valve(317,400)+arrow(317,285,317,350)')
    code=code.replace('text(215,630,"Competencia",27)', 'text(185,630,"Cierre competente",27)')
    code=code.replace('valve(837,400,.7)', 'valve(837,400,gap=15)')
    code=code.replace('vessel(320,235,100,400)+valve(370,450)', 'vessel(320,235,100,400)+valve(370,450,gap=20)')
    code=code.replace('text(650,345,"Observa la dirección",30)', 'text(650,345,"Válvula abierta: flujo hacia proximal",25)')
    # Nunca dibujar una curva alias arbitraria: muestreo uniforme y envolvimiento exacto.
    insertion='''def alias_diagram():
    out=line(160,410,1010,410,'#7a91a4',2)
    for value in [-500,500]:
        yy=410-value*.22
        out+=line(160,yy,1010,yy,'#7a91a4',2,'stroke-dasharray="8 6"')+text(1025,yy+6,str(value)+' Hz',17)
    curves=[[],[]]
    for i in range(401):
        t=i/400; original=700*math.sin(2*math.pi*t)
        wrapped=(original+500)%1000-500
        for j,value in enumerate([original,wrapped]): curves[j].append((160+t*850,410-value*.22))
    for j,points in enumerate(curves):
        d='';previous=None
        for x,y in points:
            d+=('M' if previous is None or (j==1 and abs(y-previous)>180) else ' L')+f'{x:.2f},{y:.2f}'
            previous=y
        out+=path(d,['#2c769a','#c42946'][j],4)
    return out+text(180,620,'Azul: original ±700 Hz · Rojo: señal envuelta · PRF 1000 Hz',23)+text(600,665,'Esquema de muestreo · no demuestra reflujo',25,anchor='middle')

'''
    code=code.replace('plate_specs=[]',insertion+'plate_specs=[]')
    start=code.index('plate_specs.append(("PL15"');end=code.index('\n',start)
    code=code[:start]+'''plate_specs.append(("PL15","Aliasing y señal original","f aparente = ((f + PRF/2) módulo PRF) − PRF/2",alias_diagram(),["dopplerphysics"]))'''+code[end:]
    code=code.replace('for id,title,subtitle,body,refs in plate_specs:', '''for id,title,subtitle,body,refs in plate_specs:
    refs=list(dict.fromkeys((['uipduplex1','uipduplex2'] if id in ['PL02','PL09','PL10','PL11','PL13','PL16'] else ['uipnomenclature'] if id=='PL02' else [])+refs))''')
    code=code.replace('Referencia: "+sourcelabel+" · FLEBO LAB IMF, 2026', 'Referencia: "+sourcelabel+" · Bibliografía: flebolab-imf.ferver.chatgpt.site/bibliografia')
    generator.write_text(code,encoding='utf-8')
print('Contenido, etiquetas de modalidad y generador revisados.')
