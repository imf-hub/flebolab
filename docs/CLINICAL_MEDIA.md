# Medios clínicos abiertos de FLEBOLAB

Selección de entrega preparada el 6 de noviembre de 2026. Los manifiestos públicos son `src/data/vision.json` y `src/data/dus.json`. Conservan las etiquetas de los depósitos; no contienen diagnósticos nuevos ni una validación clínica independiente de FLEBOLAB.

## FleboVision — TRICVI–C v2

- Fuente: [Mendeley Data, doi:10.17632/rf5m97cmm3.2](https://data.mendeley.com/datasets/rf5m97cmm3/2).
- Autores: Julian Ruiz, Pilar Gomez-Gil y Francisco Renero.
- Licencia: [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/).
- Selección: 96 fotografías RGB, 71 carpetas de caso del depósito y 12 parejas RGB/térmica. Las carpetas no se presentan como 71 pacientes únicos: el depósito no proporciona en los archivos utilizados una clave suficiente para demostrarlo.
- Clases de origen: C0: 21 imágenes; C1: 8; C2: 33; C3: 16; C4: 8; C5: 4; C6: 6. Este muestreo docente no representa prevalencias.
- Se aplica orientación EXIF, conversión RGB y codificación WebP con dimensiones originales. Las miniaturas conservan la proporción. La comparación térmica se empareja mediante carpeta de caso y nombre de archivo coincidente; no equivale a un registro geométrico ni habilita medición de temperatura.
- La clase C se conserva desde la carpeta del depósito. No completa por sí sola la clasificación CEAP, ni confirma los componentes etiológico, anatómico o fisiopatológico.
- `participantId`, lateralidad y vista permanecen `null` cuando no están verificadas. `viewIndex` identifica la captura seleccionada dentro de la serie de archivos, no una orientación anatómica inferida.

## FleboDUS — ThrombUS+ Training v1.0

- Fuente: [Zenodo, doi:10.5281/zenodo.17659415](https://zenodo.org/records/17659415).
- Creadores del depósito: Stylianos Didaskalou, Nikos Portokallidis y Eleni Kaldoudi.
- Licencia: [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/).
- Selección: 72 cines de compresión, 72 sujetos codificados distintos y 18 cines por sitio de origen: CFV, GS, FV y PV. La lateralidad procede del CSV.
- Etiquetas del experto del depósito: compresibilidad ausente (0): 24; parcial (1): 12; completa (2): 36. La etiqueta de trombosis es independiente y también se conserva. Ninguna se recalcula a partir de los píxeles.
- La selección deliberadamente incluye una proporción elevada de hallazgos etiquetados para enseñanza. No es una muestra epidemiológica ni una evaluación del rendimiento de un algoritmo.
- Se descargaron únicamente miembros seleccionados del ZIP por solicitudes HTTP de rango; se verifica tamaño y CRC del miembro. No se descarga el archivo completo de aproximadamente 9.7 GB.
- Los DICOM originales quedan fuera de `public`, en el espacio local de medios ignorado por Git. El sitio distribuye derivados H.264 y WebP, sin metadatos DICOM de identidad.
- Los 12,830 cuadros se indexan con atlas WebP 4×4. Se conservan las dimensiones de cada cuadro y su orden; el contenido de píxel tiene compresión con pérdida. Los vídeos se optimizan a H.264, YUV420, CRF25. El manifiesto registra las transformaciones.
- Los tiempos proceden de `FrameTime` del DICOM y se verifican contra el vídeo derivado. Se prioriza este valor preciso sobre `CineRate`, que algunos equipos redondean a un entero. `sourceCineRate` conserva el valor original cuando existe. `calibration` permanece `null`: los campos de región originales disponibles no constituyen una calibración validada del visor. No se habilitan distancias clínicas ni velocidades Doppler a partir de estos derivados.
- Estos son cines de compresión en modo B. No se presentan como un protocolo completo de reflujo, estudio Doppler espectral o demostración de todos los diagnósticos venosos.

## Índices de cuadros

Cada cine entrega `indexedFrames: true`, `frameFiles: []` y `frameAtlases`:

```json
{
  "src": "/media/dus/dus-cfv-001-atlas/000.webp",
  "startFrame": 0,
  "count": 16,
  "columns": 4,
  "rows": 4,
  "frameWidth": 660,
  "frameHeight": 570
}
```

Los índices son base cero. Para un cuadro `n`, seleccionar el atlas donde `startFrame <= n < startFrame + count`. La posición de celda es `t = n - startFrame`, columna `t % columns` y fila `floor(t / columns)`. El último atlas puede contener menos de 16 cuadros válidos. Cargar solamente el atlas solicitado; no precargar toda la serie al abrir el laboratorio.

## Reproducción y revisión

Los scripts de adquisición usan los inventarios originales de `investigacion/2026-11-05/evidencias`. Las dependencias Python auxiliares se instalan en el espacio local de medios, sin agregarlas al paquete web. Se requiere Python con Pillow, NumPy, pydicom y decodificador JPEG, además de FFmpeg/FFprobe en PATH.

```text
python -m pip install --target media-workspace/clinical/python-deps -r sites/flebolab/scripts/requirements-clinical-media.txt
python sites/flebolab/scripts/acquire-clinical-media.py vision
python sites/flebolab/scripts/acquire-clinical-media.py dus --target 72
python sites/flebolab/scripts/optimize-clinical-delivery.py 72
python sites/flebolab/scripts/align-clinical-cine-timing.py
python sites/flebolab/scripts/verify-clinical-media.py
```

La adquisición es reanudable mediante archivos intermedios locales. El optimizador construye atlas, actualiza el manifiesto y elimina únicamente las carpetas de cuadros temporales generadas para los cines seleccionados. La verificación comprueba rutas, dimensiones, hashes de originales, cobertura de índices, recuento y duración de vídeo, y campos de identidad DICOM vacíos. Produce hojas de contacto para inspección visual y un informe en `media-workspace/clinical/clinical-media-verification.json`.

La revisión técnica de disponibilidad, decodificación, atribución y presentación se distingue de la revisión médica independiente pendiente: correspondencia detallada de rótulos, selección docente, interpretación clínica y aprobación editorial institucional. El origen conserva la responsabilidad de sus rótulos; las atribuciones no implican que los autores avalen FLEBOLAB.
