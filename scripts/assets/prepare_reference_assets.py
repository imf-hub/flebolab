"""Fetch a bounded selection of original BodyParts3D and Servier assets.

No remote code is executed. OBJ geometry is converted to GLB with Python's
standard library. Sources retain their individual IDs, checksums and credits.
"""
from pathlib import Path
import io
import json
import math
import re
import struct
import sys
import hashlib
import urllib.request
import zipfile

sys.stdout.reconfigure(encoding="utf-8")
APP = Path(__file__).resolve().parents[2]
CACHE = Path(__file__).resolve().parent / ".cache"
ANATOMY = APP / "public/media/anatomy"
ILLUSTRATIONS = APP / "public/media/illustrations"
for folder in [CACHE, ANATOMY, ILLUSTRATIONS, APP / "src/data"]:
    folder.mkdir(parents=True, exist_ok=True)
AGENT = "FLEBOLAB-public-assets/1.0"
BASE = "https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/"
ZIP_URL = BASE + "isa_BP3D_4.0_obj_99.zip"


def get(url, maximum=3_000_000, headers=None):
    q = urllib.request.Request(url, headers={"User-Agent": AGENT, **(headers or {})})
    with urllib.request.urlopen(q, timeout=40) as response:
        data = response.read(maximum + 1)
        if len(data) > maximum:
            raise ValueError("Response exceeds bounded asset limit")
        return data, dict(response.headers), response.status


class RemoteZIP(io.RawIOBase):
    def __init__(self, url, size):
        self.url, self.size, self.position, self.transferred = url, size, 0, 0
    def seekable(self): return True
    def readable(self): return True
    def tell(self): return self.position
    def seek(self, offset, whence=0):
        self.position = offset if whence == 0 else self.position + offset if whence == 1 else self.size + offset
        return self.position
    def read(self, n=-1):
        if n < 0: n = self.size-self.position
        if n == 0: return b""
        if n > 8_000_000 or self.transferred+n > 30_000_000:
            raise ValueError("Selective anatomy download exceeds limit")
        start = self.position
        data, headers, status = get(self.url, n, {"Range": f"bytes={start}-{start+n-1}"})
        cr = next((v for k,v in headers.items() if k.lower()=="content-range"), "")
        if status != 206 or not cr.startswith(f"bytes {start}-"):
            raise ValueError("Range response not confirmed")
        self.position += len(data); self.transferred += len(data)
        return data


def obj_mesh(data):
    vertices=[]; faces=[]
    for line in data.decode("utf-8-sig").splitlines():
        fields=line.split()
        if not fields: continue
        if fields[0]=="v":
            x,y,z=map(float,fields[1:4])
            # BodyParts3D coordinates: millimetres, Z superior. glTF: metres, Y up.
            vertices.append([x/1000,z/1000,-y/1000])
        elif fields[0]=="f":
            indices=[int(v.split('/')[0])-1 for v in fields[1:]]
            for i in range(1,len(indices)-1):faces.append([indices[0],indices[i],indices[i+1]])
    normals=[[0.,0.,0.] for v in vertices]
    for a,b,c in faces:
        va,vb,vc=vertices[a],vertices[b],vertices[c]
        u=[vb[i]-va[i] for i in range(3)];v=[vc[i]-va[i] for i in range(3)]
        n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]]
        for idx in [a,b,c]:
            for i in range(3):normals[idx][i]+=n[i]
    for normal in normals:
        length=math.sqrt(sum(v*v for v in normal)) or 1
        for i in range(3):normal[i]/=length
    return vertices,normals,faces


def write_glb(path, meshes):
    tree={"asset":{"version":"2.0","generator":"FLEBOLAB bounded OBJ converter","copyright":"BodyParts3D, The Database Center for Life Science, CC BY 4.0"},"scene":0,"scenes":[{"nodes":[]}],"nodes":[],"meshes":[],"materials":[],"buffers":[{"byteLength":0}],"bufferViews":[],"accessors":[]}
    binary=bytearray()
    colors={"bone":[.83,.79,.69,1],"muscle":[.68,.29,.3,.65],"vein":[.18,.38,.72,1]}
    def add_buffer(payload,target):
        while len(binary)%4:binary.append(0)
        offset=len(binary);binary.extend(payload)
        tree['bufferViews'].append({"buffer":0,"byteOffset":offset,"byteLength":len(payload),"target":target})
        return len(tree['bufferViews'])-1
    def accessor(payload,count,typ,component,target,bounds=None):
        view=add_buffer(payload,target)
        obj={"bufferView":view,"componentType":component,"count":count,"type":typ}
        if bounds:obj.update(min=bounds[0],max=bounds[1])
        tree['accessors'].append(obj);return len(tree['accessors'])-1
    for m in meshes:
        vertices,normals,faces=m['geometry']
        lo=[min(v[i] for v in vertices) for i in range(3)];hi=[max(v[i] for v in vertices) for i in range(3)]
        pos=accessor(struct.pack('<'+'f'*len(vertices)*3,*[v for row in vertices for v in row]),len(vertices),'VEC3',5126,34962,[lo,hi])
        normal=accessor(struct.pack('<'+'f'*len(normals)*3,*[v for row in normals for v in row]),len(normals),'VEC3',5126,34962)
        indices=accessor(struct.pack('<'+'I'*len(faces)*3,*[v for row in faces for v in row]),len(faces)*3,'SCALAR',5125,34963)
        tree['materials'].append({"name":m['kind'],"doubleSided":True,"pbrMetallicRoughness":{"baseColorFactor":colors[m['kind']],"metallicFactor":0,"roughnessFactor":.75},**({"alphaMode":"BLEND"} if m['kind']=='muscle' else {})})
        tree['meshes'].append({"name":m['bp'],"primitives":[{"attributes":{"POSITION":pos,"NORMAL":normal},"indices":indices,"material":len(tree['materials'])-1}]})
        tree['nodes'].append({"name":m['bp']+"_"+m['english'].replace(' ','_'),"mesh":len(tree['meshes'])-1,"extras":{"bodypartsId":m['bp'],"fmaId":m['fma'],"structure":m['english'],"tissue":m['kind']}})
        tree['scenes'][0]['nodes'].append(len(tree['nodes'])-1)
    tree['buffers'][0]['byteLength']=len(binary)
    text=json.dumps(tree,separators=(',',':'),ensure_ascii=True).encode()
    text+=b' '*((-len(text))%4);binary+=b'\x00'*((-len(binary))%4)
    glb=struct.pack('<4sII',b'glTF',2,12+8+len(text)+8+len(binary))+struct.pack('<I4s',len(text),b'JSON')+text+struct.pack('<I4s',len(binary),b'BIN\x00')+binary
    path.write_bytes(glb)
    return {"bounds":{"min":[min(v[i] for m in meshes for v in m['geometry'][0]) for i in range(3)],"max":[max(v[i] for m in meshes for v in m['geometry'][0]) for i in range(3)]},"vertices":sum(len(m['geometry'][0]) for m in meshes),"triangles":sum(len(m['geometry'][2]) for m in meshes),"bytes":len(glb)}


STRUCTURES=[
    ("BP9042","FMA24475","left femur","Fémur izquierdo","bone"),
    ("BP9202","FMA24478","left tibia","Tibia izquierda","bone"),
    ("BP8251","FMA24481","left fibula","Fíbula izquierda","bone"),
    ("BP8819","FMA22559","left soleus","Sóleo izquierdo","muscle"),
    ("BP9217","FMA45958","medial head of left gastrocnemius","Cabeza medial del gastrocnemio izquierdo","muscle"),
    ("BP7939","FMA45961","lateral head of left gastrocnemius","Cabeza lateral del gastrocnemio izquierdo","muscle"),
    ("BP5880","FMA21189","left femoral vein","Vena femoral izquierda","vein"),
    ("BP5871","FMA21380","left great saphenous vein","Vena safena magna izquierda","vein"),
    ("BP5862","FMA44329","left popliteal vein","Vena poplítea izquierda","vein"),
    ("BP5853","FMA44335","left small saphenous vein","Vena safena menor izquierda","vein"),
    ("BP5874","FMA51043","left deep femoral vein","Vena femoral profunda izquierda","vein"),
    ("BP5847","FMA44339","left posterior tibial vein","Vena tibial posterior izquierda","vein"),
]

SERVIER=[
    ("deep-venous-system","leg-venous-circulation","Sistema venoso profundo","Ilustración de referencia del sistema venoso de la extremidad inferior."),
    ("foot-pump","foot-pump","Bomba del pie","Esquema de la bomba venosa del pie; material ilustrativo."),
    ("edema","oedema","Edema","Esquema de edema; no representa un caso clínico ni determina su etiología."),
    ("edema-formation","edema-formation","Formación de edema","Esquema explicativo de intercambio y acumulación de líquido."),
    ("vascular-wall","vascular-tunics-cross-sectional","Capas de la pared vascular","Representación de las túnicas de un vaso; contexto estructural."),
    ("venous-valve","vein-cross-sagittal","Vena en sección longitudinal","Esquema de vaso venoso y valvas; no corresponde a una simulación física."),
    ("venous-return","venous-return","Retorno venoso","Ilustración de retorno venoso para explicación de mecanismos."),
    ("superficial-venous-system","venous-circulation-leg-ov","Circulación venosa de la pierna","Esquema de circulación de la pierna, con la vista indicada por el original. El nombre del archivo local no determina la identificación de cada vaso."),
    ("venous-disease","venous-disease","Enfermedad venosa","Ilustración didáctica de cambios venosos, diferenciada de las fotografías clínicas."),
    ("venous-thrombosis","venous-thrombosis","Trombosis venosa","Ilustración de trombosis; no equivale a una imagen diagnóstica."),
]


def main():
    manifest=[]; meshes=[]
    element_cache=CACHE/'isa-element-parts.txt'
    if not element_cache.exists():
        data,_,_=get(BASE+'isa_element_parts.txt',2_000_000)
        element_cache.write_bytes(data)
    element_map={}
    for line in element_cache.read_text(encoding='utf-8-sig').splitlines():
        fields=line.split('\t')
        if len(fields)>=3:element_map.setdefault(fields[0],[]).append(fields[2])
    req=urllib.request.Request(ZIP_URL,method='HEAD',headers={'User-Agent':AGENT})
    with urllib.request.urlopen(req,timeout=30) as response:size=int(response.headers['Content-Length'])
    remote=RemoteZIP(ZIP_URL,size)
    with zipfile.ZipFile(remote) as archive:
        names=archive.namelist()
        (CACHE/'bodyparts-zip-index.json').write_text(json.dumps(names,indent=2),encoding='utf-8')
        for bp,fma,en,title,kind in STRUCTURES:
            file_ids=element_map.get(fma,[])
            candidates=[n for n in names if Path(n).stem in file_ids and n.endswith('.obj')]
            if not candidates:
                print('MODEL NOT FOUND',bp,flush=True);continue
            if len(candidates)!=1:raise ValueError('Selected single structure unexpectedly has multiple elementary meshes: '+bp)
            cache=CACHE/(bp+'.obj')
            data=cache.read_bytes() if cache.exists() else archive.read(candidates[0])
            cache.write_bytes(data)
            geometry=obj_mesh(data)
            m=dict(bp=bp,fma=fma,english=en,kind=kind,geometry=geometry)
            meshes.append(m)
            metric=write_glb(ANATOMY/(bp+'.glb'),[m])
            manifest.append({"id":"bodyparts-"+bp.lower(),"title":title,"path":"/media/anatomy/"+bp+".glb","type":"model/gltf-binary","structures":[title],"sourceUrl":ZIP_URL,"sourceCatalogUrl":BASE+'isa_parts_list_e.txt',"sourceIdentifier":bp,"fmaId":fma,"author":"The Database Center for Life Science","license":"CC BY 4.0","licenseUrl":"https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html","attribution":"BodyParts3D, © The Database Center for Life Science, licensed under CC Attribution 4.0 International. OBJ converted to glTF; axes changed to Y-up and millimetres converted to metres.","nature":"anatomical-reference","tissue":kind,"notes":"Modelo anatómico de referencia. No contiene por sí solo un modelo hemodinámico ni parámetros individuales.","sourceSha256":hashlib.sha256(data).hexdigest(),"sha256":hashlib.sha256((ANATOMY/(bp+'.glb')).read_bytes()).hexdigest(),"coordinateSystem":"Y-up, metres; [x,z,-y] from original millimetres","metrics":metric})
            print('MODEL',bp,metric,flush=True)
    if meshes:
        metric=write_glb(ANATOMY/'left-leg-reference.glb',meshes)
        manifest.append({"id":"bodyparts-left-leg-reference","title":"Pierna izquierda: referencia anatómica","path":"/media/anatomy/left-leg-reference.glb","type":"model/gltf-binary","structures":[x[3] for x in STRUCTURES if x[0] in {m['bp'] for m in meshes}],"sourceUrl":ZIP_URL,"author":"The Database Center for Life Science","license":"CC BY 4.0","licenseUrl":"https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html","attribution":"BodyParts3D, © The Database Center for Life Science, CC BY 4.0. Selected structures converted to glTF and assembled without altering relative coordinates.","nature":"anatomical-reference","notes":"Subconjunto de 12 estructuras del modelo de referencia BodyParts3D; no una anatomía exhaustiva ni un paciente. Nodes preserve tissue/bodypartsId extras for filtering.","coordinateSystem":"Y-up, metres; [x,z,-y] from original millimetres","metrics":metric})
    print('RANGE BYTES',remote.transferred,flush=True)
    for ident,slug,title,notes in SERVIER:
        page='https://smart.servier.com/smart_image/'+slug+'/'
        data,_,_=get(page,2_000_000)
        text=data.decode('utf-8')
        match=re.search(r'<meta\s+property="og:image"\s+content="([^"]+)"',text)
        if not match:print('ILLUSTRATION NOT FOUND',slug,flush=True);continue
        source=match.group(1).replace('&amp;','&')
        original,_,_=get(source,6_000_000)
        ext=Path(source.split('?')[0]).suffix.lower()
        filename=ident+ext;(ILLUSTRATIONS/filename).write_bytes(original)
        from PIL import Image
        with Image.open(io.BytesIO(original)) as im:dimensions={"width":im.width,"height":im.height}
        manifest.append({"id":"servier-"+ident,"title":title,"path":"/media/illustrations/"+filename,"type":"image/png" if ext=='.png' else 'image/jpeg',"structures":[],"sourceUrl":page,"downloadUrl":source,"author":"Servier Medical Art","license":"CC BY 4.0","licenseUrl":"https://creativecommons.org/licenses/by/4.0/","attribution":"Image provided by Servier Medical Art (https://smart.servier.com/), licensed under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/).","nature":"illustration","notes":notes,"sha256":hashlib.sha256(original).hexdigest(),"dimensions":dimensions,"bytes":len(original),"transformations":[]})
        print('ILLUSTRATION',ident,len(original),dimensions,flush=True)
    finalize_manifest(manifest, element_map)
    (ANATOMY/'ATTRIBUTION.txt').write_text('BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International.\nOriginal: '+ZIP_URL+'\nLicense: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html\nAdaptation: selected OBJ structures converted into glTF 2.0, axis rotation to Y-up and mm-to-metre scaling. Relative coordinates preserved.\n',encoding='utf-8')
    (ILLUSTRATIONS/'ATTRIBUTION.txt').write_text('Images provided by Servier Medical Art (https://smart.servier.com/), licensed under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Original raster files retained without changes. Individual source and download URLs are recorded in src/data/assets.json.\n',encoding='utf-8')
    print('ASSETS',len(manifest),flush=True)

def finalize_manifest(manifest, element_map):
    """Apply provenance fields to both freshly fetched and existing asset lists."""
    for item in manifest:
        if item['id'].startswith('bodyparts-'):
            item['sourceLabel']='BodyParts3D · DBCLS · versión 4.0'
            item['datasetVersion']='4.0'
            item['referencePopulation']='Modelo de referencia de un varón adulto; anatomía no exhaustiva, sin variabilidad individual.'
            item['attribution']='BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International. Adaptación FLEBOLAB: selección de estructuras, conversión OBJ → glTF 2.0, rotación a Y-up y escala de milímetros a metros. Coordenadas relativas conservadas.'
            item['sourceMappingUrl']=BASE+'isa_element_parts.txt'
            if item.get('fmaId'):item['elementFileIds']=element_map[item['fmaId']]
            item['sha256']=hashlib.sha256((APP/'public'/item['path'].lstrip('/')).read_bytes()).hexdigest()
        else:
            item['sourceLabel']='Servier Medical Art · CC BY 4.0'
            if item['id']=='servier-superficial-venous-system':
                item['title']='Circulación venosa de la pierna'
                item['notes']='Esquema de circulación de la pierna, con la vista indicada por el original. El nombre del archivo local no determina la identificación de cada vaso.'
    (APP/'src/data/assets.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')

if __name__=='__main__':
    if '--metadata-only' in sys.argv:
        element_map={}
        for line in (CACHE/'isa-element-parts.txt').read_text(encoding='utf-8-sig').splitlines():
            fields=line.split('\t')
            if len(fields)>=3:element_map.setdefault(fields[0],[]).append(fields[2])
        finalize_manifest(json.loads((APP/'src/data/assets.json').read_text(encoding='utf-8')),element_map)
    else:main()
