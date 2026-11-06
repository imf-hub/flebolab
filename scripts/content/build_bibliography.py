"""Exportaciones bibliográficas desde metadatos verificados, sin descargar PDFs clínicos."""
from pathlib import Path
import json,sys,re,argparse
ROOT=Path(__file__).resolve().parents[2]
METADATA=ROOT/'docs/content/bibliographic-metadata.json'
parser=argparse.ArgumentParser()
parser.add_argument('--citation-tools',default=str(Path.home()/'.codex/skills/citation-management/scripts'))
args=parser.parse_args()
sys.path.insert(0,args.citation_tools)
from extract_metadata import MetadataExtractor
extractor=MetadataExtractor()
metadata=json.loads(METADATA.read_text(encoding='utf-8'))
def authors(record):
    parts=[]
    for name in record['authors'].split(' and ')[:6]:
        family,_,given=name.partition(', ')
        parts.append(family+' '+''.join(re.findall(r'\b([A-ZÀ-Ý])',given)))
    return ', '.join(parts)+(', et al.' if len(record['authors'].split(' and '))>6 else '.')

science=[]
configs={
 '10.1002/cnm.2714':('keijsers2015','Modelo de investigación hemodinámica 1D','Texto completo contrastado en PMC4676919 en la investigación del proyecto; metadatos Crossref verificados.','Methods: 1D model y venous valves; resultados de calf muscle pump.','Referencia científica para bomba, gravedad, válvulas y relaciones presión-volumen.','No es una guía clínica ni el código implementado en FleboTwin; sus parámetros y validación no se transfieren a nuestra red0D.'),
 '10.1109/TBME.2026.3701594':('ferlito2026','Modelo de investigación hemodinámica 1D','Metadatos Crossref y resumen PubMed42258676; texto completo no cotejado en esta revisión.','Abstract: valves, perforators, muscle pump and external compression. Publicación electrónica anticipada.','Identifica mecanismos estudiados en investigación venosa mediante modelado unidimensional.','Se cita el alcance del resumen. No respalda valores clínicos, una reproducción exacta del modelo ni validación de la aplicación.'),
 '10.1016/j.bjae.2020.01.003':('dopplerphysics','Artículo docente de física del ultrasonido','Artículo de acceso abierto PMC7807840 consultado en la investigación; metadatos Crossref verificados.','pp.112–113: desplazamiento Doppler, ángulo, muestreo pulsado y aliasing.','Base física de las demostraciones sintéticas de proyección angular y límite de Nyquist.','Artículo de física de otra especialidad; no es fuente de criterios clínicos flebológicos ni de indicaciones terapéuticas.')
}
for record in metadata:
    if record['doi'] not in configs: continue
    id,kind,access,locator,scope,limitations=configs[record['doi']]
    journal=f"{record['journal']}. {record['year']}"
    if record['volume']: journal+=f";{record['volume']}"+(f"({record['issue']})" if record['issue'] else '')
    if record['pages']:journal+=':'+record['pages']
    science.append(dict(id=id,title=record['title'],authors=authors(record),year=int(record['year']),journal=journal+'.',doi=record['doi'],url=record['url'],organization='Investigación primaria / ingeniería biomédica' if id!='dopplerphysics' else 'Física del ultrasonido / BJA Education',kind=kind,access=access,locator=locator,scope=scope,limitations=limitations,rank=3))
science.append(dict(id='dicom',title='DICOM PS3.3: Information Object Definitions',authors='DICOM Standards Committee / NEMA.',year=2026,journal='Estándar web, edición 2026d; consulta 6 de noviembre de 2026.',doi=None,url='https://dicom.nema.org/medical/dicom/current/output/chtml/part03/sect_C.8.5.5.html',organization='DICOM Standards Committee / NEMA',kind='Estándar técnico de imagen médica',access='Texto normativo completo en el sitio oficial.',locator='C.8.5.5 US Region Calibration Module, tabla C.8-17; C.7.6.5 Cine Module, tabla C.7-13.',scope='Unidades y calibración por región, tiempo por cuadro y atributos del cine. Permite separar reloj de adquisición, reproducción y ejes espectrales.',limitations='No constituye una guía diagnóstica. Que existan atributos DICOM no demuestra que una serie concreta esté calibrada o que su metadato sea válido para otra región.',rank=3))
(ROOT/'src/data/clinical-science.json').write_text(json.dumps(science,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
references=[]
for filename in ['clinical-uip.json','clinical-vascular.json','clinical-science.json']:
    references.extend(json.loads((ROOT/'src/data'/filename).read_text(encoding='utf-8')))
out=ROOT/'public/references';out.mkdir(exist_ok=True)
entries=[];text=['FLEBO LAB IMF — Bibliografía médica y científica','Revisión: 6 de noviembre de 2026. Prioridad institucional no equivale a grado de evidencia.','']
for index,ref in enumerate(references,1):
    record=next((m for m in metadata if ref['doi'] and m['doi'].lower()==ref['doi'].lower()),None)
    if record:
        record=record.copy()
        record['title']=' '.join(re.sub(r'<[^>]+>','',record['title']).split())
        if not record['authors']: record['authors']='{'+ref['authors'].rstrip('.')+'}'
        # Publicación final AIUM: PubMed40955146 + registro institucional, no año online.
        if ref['id']=='aium2026': record.update(year='2026',volume='45',issue='1',pages='E1--E9')
        if ref['id']=='svs2022': record['pages']='231--261.e6'
        entries.append(extractor.metadata_to_bibtex(record,citation_key=ref['id']))
    else:
        # Registros sin DOI o aún no extraídos: mismos metadatos auditados, sin inventar campos.
        record=dict(entry_type='online' if ref['year'] is None else 'misc',title=ref['title'],authors='{'+ref['authors'].rstrip('.')+'}' if ref['id'] in ['asa','iac2026','dicom'] else ' and '.join(ref['authors'].rstrip('.').split(', ')),year=str(ref['year']) if ref['year'] else '',url=ref['url'],doi=ref['doi'] or '')
        entries.append(extractor.metadata_to_bibtex(record,citation_key=ref['id']))
    journal=ref['journal'] or 'Recurso institucional web; s.f.'
    text.append(f"{index}. {ref['authors']} {ref['title']}. {journal} DOI: {ref['doi'] or 'no consignado'}. {ref['url']}\n   Localizador: {ref['locator']}\n   Acceso: {ref['access']}\n")
(out/'flebolab.bib').write_text('\n\n'.join(entries)+'\n',encoding='utf-8')
(out/'flebolab-vancouver.txt').write_text('\n'.join(text),encoding='utf-8')
print(json.dumps({'references':len(references),'crossref_verified':len(metadata),'exports':['BibTeX','texto Vancouver']}))
