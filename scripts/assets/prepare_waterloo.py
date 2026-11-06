"""Fetch only the published UW-FemVeinRF preview, never RF/HDF5 data.

The original GIF and source README are retained locally as provenance.
Web deliverables are a visually equivalent H.264 transcode and PNG figures.
"""
from pathlib import Path
import hashlib
import json
import subprocess
import urllib.request
from PIL import Image

APP=Path(__file__).resolve().parents[2]
CACHE=Path(__file__).resolve().parent/'.cache/waterloo'
PUBLIC=APP/'public/media/waterloo'
CACHE.mkdir(parents=True,exist_ok=True)
PUBLIC.mkdir(parents=True,exist_ok=True)
COMMIT='5eae31257f55391129c5aadb178659948448da5d'
BASE=f'https://raw.githubusercontent.com/open-h/Open-H-RF/{COMMIT}/datasets/waterloo-femoralvein/'
SOURCE=f'https://github.com/open-h/Open-H-RF/blob/{COMMIT}/datasets/waterloo-femoralvein/README.md'

def get(name,limit):
    dest=CACHE/Path(name).name
    if dest.exists():return dest
    req=urllib.request.Request(BASE+name,headers={'User-Agent':'FLEBOLAB-public-assets/1.0'})
    with urllib.request.urlopen(req,timeout=60) as response:
        data=response.read(limit+1)
    if len(data)>limit:raise ValueError('Asset exceeds bounded maximum: '+name)
    dest.write_bytes(data)
    return dest

readme=get('README.md',50_000)
reconstruct=get('reconstruct.py',50_000)
pipeline=get('pipeline.yaml',10_000)
gif=get('assets/Acq0.gif',16_000_000)
figure=get('assets/reconstruct_output.png',1_000_000)
with Image.open(gif) as image:
    sizes=(image.width,image.height)
    frames=image.n_frames
    durations=[]
    for i in range(frames):
        image.seek(i)
        durations.append(image.info.get('duration',0))
    image.seek(min(54,frames-1))
    image.convert('RGB').save(PUBLIC/'uw-femvein-acq0-poster.png')
print(json.dumps({'dimensions':sizes,'frames':frames,'totalDurationMs':sum(durations),'durationsMs':sorted(set(durations)),
    'gifBytes':gif.stat().st_size,'gifSha256':hashlib.sha256(gif.read_bytes()).hexdigest()},indent=2),flush=True)
output=PUBLIC/'uw-femvein-acq0.mp4'
subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(gif),'-an','-c:v','libx264','-crf','20',
    '-preset','slow','-pix_fmt','yuv420p','-vf','pad=ceil(iw/2)*2:ceil(ih/2)*2',
    '-movflags','+faststart',str(output)],check=True)
(PUBLIC/'uw-femvein-reconstruction.png').write_bytes(figure.read_bytes())
probe=subprocess.check_output(['ffprobe','-v','error','-select_streams','v:0','-show_entries',
    'stream=codec_name,width,height,nb_frames,r_frame_rate,duration','-of','json',str(output)],text=True)
(CACHE/'probe.json').write_text(probe,encoding='utf-8')
(CACHE/'gif-metadata.json').write_text(json.dumps({'width':sizes[0],'height':sizes[1],'frames':frames,
    'frameDurationsMs':durations,'durationMs':sum(durations),'sourceSha256':hashlib.sha256(gif.read_bytes()).hexdigest()},indent=2),encoding='utf-8')
print(probe,flush=True)
print('MP4 bytes',output.stat().st_size,flush=True)

license_path=PUBLIC/'LICENSE-CC-BY-4.0.txt'
if not license_path.exists():
    req=urllib.request.Request('https://creativecommons.org/licenses/by/4.0/legalcode.txt',headers={'User-Agent':'FLEBOLAB-public-assets/1.0'})
    with urllib.request.urlopen(req,timeout=40) as response:license_data=response.read(50_000)
    if len(license_data)>49_000:raise ValueError('Unexpected license response size')
    license_path.write_bytes(license_data)

author='Hassan Nahas, Jeremy N. Cohen, Eudoxia Zafiris, Skye H. T. Ling, Alfred C. H. Yu y Jason S. Au; VORTEX / LITMUS, University of Waterloo'
attribution='UW-FemVeinRF, VORTEX / LITMUS, University of Waterloo, publicado en Open-H-RF. Nahas, Cohen, Zafiris, Ling, Yu y Au (2026). CC BY 4.0. FLEBOLAB: transcodificación del GIF original a MP4 y selección de un cuadro como portada; figura PNG sin modificaciones.'
assets=[]
for ident,name,title,kind,original,changes in [
    ('waterloo-acq0-cine','uw-femvein-acq0.mp4','Vena femoral: cine experimental y flujo vectorial','video/mp4','assets/Acq0.gif',[
        'GIF → H.264/MP4, CRF 20, yuv420p, sin audio, sin recorte ni cambio de velocidad; compresión con pérdidas.',
        'Se añadió una columna de relleno a la derecha para obtener ancho par (761 → 762 px).']),
    ('waterloo-acq0-poster','uw-femvein-acq0-poster.png','Cuadro 54 del cine experimental','image/png','assets/Acq0.gif',[
        'Selección del cuadro de índice 54 (contando desde cero), conversión RGB y guardado PNG; sin anotaciones nuevas.']),
    ('waterloo-reconstruction','uw-femvein-reconstruction.png','Reconstrucción y vectores de velocidad publicados','image/png','assets/reconstruct_output.png',[]),
]:
    p=PUBLIC/name
    if kind=='image/png':
        with Image.open(p) as im:dimensions={'width':im.width,'height':im.height}
    else:dimensions={'width':762,'height':1002}
    assets.append({'id':ident,'title':title,'path':'/media/waterloo/'+name,'type':kind,
        'nature':'experimental-human-ultrasound-rendering','sourceUrl':BASE+original,
        'sourcePageUrl':SOURCE,'author':author,'license':'CC BY 4.0',
        'licenseUrl':'https://creativecommons.org/licenses/by/4.0/','attribution':attribution,
        'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),
        'dimensions':dimensions,'modifications':changes})

manifest={
    'available':True,'id':'uw-femveinrf-acq0-preview','title':'UW-FemVeinRF: vista experimental de vena femoral',
    'sourceUrl':SOURCE,'sourceLabel':'UW-FemVeinRF · University of Waterloo · Open-H-RF',
    'sourceCommit':COMMIT,'accessedAt':'2026-11-06','license':'CC BY 4.0',
    'licenseEvidence':'La ficha oficial fija license: cc-by-4.0 y declara CC BY 4.0 en License / Terms of Use. La licencia del código de reconstrucción es independiente (Apache-2.0).',
    'licenseUrl':'https://creativecommons.org/licenses/by/4.0/',
    'localLicensePath':'/media/waterloo/LICENSE-CC-BY-4.0.txt','author':author,'attribution':attribution,
    'nature':'experimental-human-ultrasound-rendering','quantitativeDataAvailable':False,
    'videoPath':'/media/waterloo/uw-femvein-acq0.mp4','posterPath':'/media/waterloo/uw-femvein-acq0-poster.png',
    'figurePath':'/media/waterloo/uw-femvein-reconstruction.png',
    'caption':'Cine publicado de una adquisición in vivo de vena femoral. Incluye B-mode y una superposición de vectores de flujo estimados por los autores. El tiempo indicado corresponde a la reproducción del recurso.',
    'anatomy':'Vena femoral, vista longitudinal, según ficha del dataset.',
    'protocol':'El conjunto describe contracción isométrica de flexión plantar con carga de 8 kg e inclinación cefálica de 40°. No se importaron metadatos individuales de Acq0.',
    'dataset':{'acquisitions':15,'participants':15,'storedBytes':941958804227,
        'rfFilesDownloaded':0,'rawDataImported':False,'dataUrl':'https://huggingface.co/datasets/nvidia/Open-H-RF/tree/main/waterloo-femoralvein'},
    'calibration':{
        'physicalMeasurementSupported':False,
        'display':{'frames':frames,'durationSeconds':sum(durations)/1000,'fps':10,'posterFrameIndex':54,
            'vectorOverlayObservedFromFrameIndex':48,'sourceWidth':sizes[0],'sourceHeight':sizes[1]},
        'acquisitionFrameRateHz':None,
        'temporalNote':'61 cuadros GIF, cada uno con demora codificada de 100 ms. No equivalen a cuadros RF consecutivos ni prueban una duración física de 6.1 s.',
        'spatial':{'videoHasEmbeddedAxes':False,'figureHasEmbeddedAxes':True,'figureAxisUnit':'mm',
            'sourceReconstructionGrid':{'xRangeMm':[-19,19],'zRangeMm':[10,60],'xPoints':381,'zPoints':501},
            'note':'El grid procede del script oficial; no se aplica automáticamente al video renderizado ni habilita un calibrador clínico.'},
        'velocity':{'sourceArrayUnit':'m/s','arraysImported':False,'rasterVelocityMeasurementSupported':False,
            'sourceScriptVmaxMPerS':1,'sourceScriptPowerThresholdDb':58,
            'note':'Los valores describen el script de referencia; el GIF no ofrece una leyenda cuantitativa que permita verificar su escala de color. No se recuperaron velocidades del raster ni se generó una curva experimental.'},
    },
    'limitations':[
        'Vista renderizada pública, no un archivo DICOM ni las matrices RF/vectoriales originales.',
        'Los vectores son estimaciones procesadas de los autores, no trayectorias individuales observadas de eritrocitos.',
        'La ficha advierte ruido Doppler, vistas subóptimas y sensibilidad del dealiasing al ruido con baja potencia.',
        'Un cine de una adquisición no constituye una colección de patologías ni valida diagnóstico o decisiones clínicas.',
        'No usar la reproducción para medir reflujo, diámetro, velocidad, caudal ni tiempos fisiológicos.',
    ],
    'ethicsSourceStatement':'El README declara aprobación ORE #46018 de University of Waterloo y consentimiento escrito y verbal para compartir datos públicamente; se conserva esta declaración de los autores, sin una auditoría independiente por FLEBOLAB.',
    'originalPreview':{'sourceUrl':BASE+'assets/Acq0.gif','bytes':gif.stat().st_size,
        'sha256':hashlib.sha256(gif.read_bytes()).hexdigest(),'gitBlobSha':'c40d7c1ef9541e11d5f3008eb242732a447736e2',
        'localCacheOnly':True},
    'assets':assets,
    'references':[{'title':'UW-FemVeinRF dataset card','url':SOURCE},
        {'title':'Official reference reconstruction script','url':f'https://github.com/open-h/Open-H-RF/blob/{COMMIT}/datasets/waterloo-femoralvein/reconstruct.py'},
        {'title':'The influence of aging on graded peripheral venous return and complex blood flow features through human veins','doi':'10.1007/s11357-026-02378-6','url':'https://doi.org/10.1007/s11357-026-02378-6'}],
}
(APP/'src/data/waterloo.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
(PUBLIC/'ATTRIBUTION.txt').write_text(attribution+'\nFuente: '+SOURCE+'\nLicencia: https://creativecommons.org/licenses/by/4.0/\n',encoding='utf-8')
print('Manifest:',APP/'src/data/waterloo.json',flush=True)
