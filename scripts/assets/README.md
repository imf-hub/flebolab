# Anatomía e ilustraciones abiertas de FLEBOLAB

Preparado el 6 de noviembre de 2026. Los archivos publicados proceden de las fuentes originales; no son imágenes generadas con IA. Cada activo está identificado en `src/data/assets.json`, con su fuente, autor, licencia, naturaleza y SHA-256.

## Anatomía de referencia

- Archivo público principal: `/media/anatomy/left-leg-reference.glb`.
- BodyParts3D, versión 4.0, subconjunto de doce estructuras izquierdas del modelo de referencia de un varón adulto.
- Fuente oficial: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html
- ZIP original: https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/isa_BP3D_4.0_obj_99.zip
- Correspondencia de conceptos y representaciones: https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/isa_parts_list_e.txt
- Correspondencia de conceptos y mallas elementales: https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/isa_element_parts.txt
- Licencia vigente del propietario: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html
- README oficial con cambio de licencia de febrero de 2025: https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/README_e.html

El propietario actualizó la licencia a **CC BY 4.0** el 25 de febrero de 2025, según el README y la página oficial consultados. Los OBJ del ZIP, creados previamente, conservan un comentario histórico que menciona CC BY-SA 2.1 Japón. Para esta distribución se documenta la licencia vigente del propietario y se conservan los originales íntegros en la caché local. La geometría no recibió una nueva simplificación ni suavizado; procede de la descarga oficial reducida. Se calcularon normales y se convirtió OBJ a glTF 2.0.

Atribución requerida: **BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International.** Indicar también la selección de estructuras y conversión de formato.

### Estructuras y selección de nodos

En Three.js, cada nodo tiene los metadatos glTF `extras`, accesibles en `object.userData`: `bodypartsId`, `fmaId`, `structure`, `tissue`. Los nombres de los nodos son estables.

| Nodo | Concepto FMA | Malla original | Tejido |
|---|---|---|---|
| `BP9042_left_femur` | FMA24475 | FJ3259 | bone |
| `BP9202_left_tibia` | FMA24478 | FJ3282 | bone |
| `BP8251_left_fibula` | FMA24481 | FJ3260 | bone |
| `BP8819_left_soleus` | FMA22559 | FJ1437M | muscle |
| `BP9217_medial_head_of_left_gastrocnemius` | FMA45958 | FJ1397M | muscle |
| `BP7939_lateral_head_of_left_gastrocnemius` | FMA45961 | FJ1394M | muscle |
| `BP5880_left_femoral_vein` | FMA21189 | FJ2102 | vein |
| `BP5871_left_great_saphenous_vein` | FMA21380 | FJ2103 | vein |
| `BP5862_left_popliteal_vein` | FMA44329 | FJ2117 | vein |
| `BP5853_left_small_saphenous_vein` | FMA44335 | FJ2121 | vein |
| `BP5874_left_deep_femoral_vein` | FMA51043 | FJ2099 | vein |
| `BP5847_left_posterior_tibial_vein` | FMA44339 | FJ2118 | vein |

Cada malla se entrega también por separado como `/media/anatomy/BPxxxx.glb`. Los doce componentes conservan sus coordenadas relativas. El conjunto no incluye piel, pie, todas las venas ni variantes anatómicas. No incorpora parámetros hemodinámicos, calibres clínicamente medidos, válvulas individualizadas ni datos de pacientes. Las seis venas son las estructuras identificadas por el catálogo oficial; evitar asignar nombres a ramas no verificadas.

### Carga y coordenadas

glTF 2.0 estándar, sin compresión Draco, Meshopt ni texturas. `GLTFLoader` directo; no requiere decodificadores. Hay doce mallas, 52,051 vértices y 101,122 triángulos. El conjunto pesa **2,473,688 bytes**. Los componentes individuales más el conjunto pesan 4,950,624 bytes. El servidor puede aplicar Brotli o gzip sin modificar el activo.

Los OBJ originales declaran límites en milímetros. La conversión es `[x/1000, z/1000, -y/1000]`: metros y eje Y superior. X positivo corresponde al lado izquierdo del sujeto y Z positivo a anterior. Las relaciones tibia/gastrocnemio permiten verificar la orientación. Para una vista anterior, situar la cámara hacia Z positivo.

- Mínimo: `[0.0134205, -0.0456661, 0.00580911]`.
- Máximo: `[0.150237, 0.834239, 0.154814]`.
- Centro: `[0.08182875, 0.39428645, 0.080311555]`.
- Altura: `0.8799051` metros.
- Factor para altura de seis unidades: `6.818917176409137`.
- Posición del `gltf.scene` tras esa escala, para centro en el origen: `[-0.5579834688990891, -2.6886066463303826, -0.5476378418536271]`.

También se puede calcular `Box3` en la carga y centrar por límites. No trasladar cada malla por separado, porque se perdería su relación anatómica. Los materiales de músculo se entregan translúcidos; conviene hacer visible esa capa mediante un control en la interfaz.

## Ilustraciones de Servier

Diez PNG originales, 687,929 bytes en total, descargados de los archivos referidos por cada página oficial. Fuentes individuales y dimensiones en el manifest. Se conservaron los archivos originales sin reescalado ni modificación. Su transparencia debe mostrarse sobre un fondo claro apropiado.

1. Sistema venoso profundo.
2. Bomba del pie.
3. Edema, título de la colección original.
4. Formación de edema.
5. Capas de la pared vascular.
6. Vena en sección longitudinal con valvas.
7. Retorno venoso con bomba muscular.
8. Circulación venosa de la pierna.
9. Enfermedad venosa, ilustración docente.
10. Trombosis venosa, ilustración docente.

Son ilustraciones; no son casos clínicos ni medios diagnósticos. Algunas tienen resolución moderada: la vena con válvulas original mide 106 × 397 píxeles, por lo que no debe ampliarse a pantalla completa como si fuera un modelo de alta resolución. La identificación de vasos y mecanismos debe revisarse al escribir los pies editoriales.

Condiciones de uso del propietario: https://smart.servier.com/using-smart-images-what-you-can-do/

Atribución visible recomendada: **Imágenes: Servier Medical Art, CC BY 4.0**, con enlaces a https://smart.servier.com/ y https://creativecommons.org/licenses/by/4.0/. Las modificaciones posteriores deben declararse.

## Reproducción y comprobación

`prepare_reference_assets.py` utiliza Python estándar y Pillow para leer dimensiones. El ZIP remoto se lee mediante peticiones HTTP Range; solo se transfirieron 2,101,940 bytes para obtener los doce OBJ y su índice, en lugar de descargar los 143 MB completos. La caché guarda los OBJ originales y las tablas oficiales, pero no se publica.

```powershell
python .\scripts\assets\prepare_reference_assets.py
```

Para actualizar únicamente los metadatos sin red:

```powershell
python .\scripts\assets\prepare_reference_assets.py --metadata-only
```

Se aplicó el validador oficial Khronos `gltf-validator@2.0.0-dev.3.10` a los trece GLB. Resultado: **cero errores, cero advertencias y cero mensajes informativos**. Reporte completo: `validation-report.json`. Los SHA-256 de todos los activos se comprobaron contra el manifest. Se inspeccionó una hoja de contacto con las diez ilustraciones.

El validador se instaló aisladamente; no modifica el stack de la aplicación:

```powershell
npm install --prefix .\scripts\assets\.tools --no-save --package-lock=false gltf-validator@2.0.0-dev.3.10
node .\scripts\assets\validate_reference_assets.cjs
```

Las carpetas `.cache` y `.tools` están excluidas mediante el `.gitignore` de esta carpeta. Incluir en Git los GLB, PNG, atribuciones, manifest, scripts y reporte. Esta validación verifica integridad técnica y procedencia; la revisión editorial médica del producto sigue siendo independiente.
