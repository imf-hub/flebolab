# FLEBOLAB · Instituto Mexicano de Flebología

Laboratorio web de educación médica: hemodinámica interactiva, cine ecográfico real y observación clínica. Versión 0.10.1, 6 de noviembre de 2026.

- Web de revisión: https://imf-hub.github.io/flebolab/
- Código y versiones: https://github.com/imf-hub/flebolab
- Plan ejecutado: [PLAN_INTERACTIVO_0.10.md](docs/PLAN_INTERACTIVO_0.10.md)
- Identidad visual: [IDENTIDAD_VISUAL_IMF.md](docs/IDENTIDAD_VISUAL_IMF.md)
- Pruebas y límites: [AUDITORIA_INTERACTIVA_0.10.md](docs/AUDITORIA_INTERACTIVA_0.10.md)

## Ejecutar

Requiere Node.js 24 y npm. Esta carpeta es la raíz del repositorio.

```sh
npm ci
npm run dev
npm run check:content
npm test
npm run build
```

`npm run build` produce `dist/`. Para GitHub Pages, definir `VITE_BASE_PATH=/flebolab/`. El workflow `pages.yml` lo hace automáticamente en cada push a main. HashRouter conserva entradas directas como `/#/flebotwin?scenario=TW06` sin depender de redirecciones del servidor. Todos los catálogos y descargas respetan el subdirectorio de publicación.

## Estructura

- `src/pages/LaboratoryHome.tsx`: portada con modelo 3D vivo y tres accesos a laboratorios.
- `src/labs/twin`: modelo 0D en Worker, perfiles y contratos de vista, escenas de flujo/válvula, anatomía independiente, circuito, comparación y curvas sincronizadas.
- `src/labs/dus`: biblioteca, cine indexado, A–B, anotación y diez fundamentos Doppler.
- `src/labs/vision`: filtros, OpenSeadragon, RGB/térmica, observación sin etiquetas, comparación de dos/cuatro imágenes y anotación.
- `src/data`: catálogos con procedencia/licencias, referencias tipadas y contenido editorial.
- `src/shared`: controles, rutas de medios, anotaciones, persistencia y recuperación de errores.
- `src/studio.css`: diseño visual, estados, móvil y movimiento reducido.
- `public/media`: derivados para distribución; sin DICOM/RF originales ni cachés de descarga.
- `scripts`: preparación de medios, validación, generadores y avisos de licencias.
- `docs`: plan, arquitectura, evidencia y límites de revisión médica.

React 19, TypeScript 5.9, Vite 7, Three.js, React Three Fiber 9, Drei 10, postprocessing, Motion, Plotly.js básico y OpenSeadragon. El tema predeterminado es claro/blanco, con rojo institucional y los logotipos originales del IMF. Manrope e IBM Plex Mono se sirven localmente. Las versiones exactas están fijadas en package-lock.json. La app estática no necesita cuentas, servicios de pago, secretos ni base de datos remota. Favoritos, anotaciones y progreso residen en el navegador.

## Cobertura

| Recurso | Alcance distribuido |
|---|---|
| Twin | 12 perfiles, 4 vistas, 8 parámetros, comparación A/B |
| Anatomía | 12 estructuras del miembro inferior izquierdo de BodyParts3D |
| DUS | 72 clips de 72 participantes, 4 sitios, 12.830 cuadros en 838 atlas |
| Vision | 96 vistas, 71 carpetas de caso, 12 pares térmicos |
| Doppler | 10 apartados; DP09 incorpora renderizado experimental Waterloo |
| Contenido | 12 recorridos, 33 términos, 18 láminas, 6 animaciones, 10 imágenes Servier |
| Evidencia | 19 referencias: 8 flebología/UIP, 4 vasculares, 7 complementarias |

Los números describen el lote, no prevalencia ni cobertura clínica exhaustiva. Las etiquetas del proveedor no equivalen a diagnósticos revisados independientemente.

## Comprobación y mantenimiento

59 pruebas automatizadas de modelo, física, contratos de escenarios, consultas, rutas y superficies valvulares. El catálogo se verifica antes del build. Los workflows de GitHub repiten tipos, contenido, pruebas y compilación; Pages publica únicamente después de que pasen.

La auditoría de navegador registró las 12 vistas y contrastó 48 lecturas con el modelo a 1,00 s. También comprobó los controles Doppler, reproducción/intervalos/anotación de cine, filtros y comparación de fotografías, dimensiones térmicas, selección anatómica y vistas a 390 px. La inspección pública confirmó modelos, cine y referencias; 1.240 URLs respondieron HTTP 200 y el video acepta rangos HTTP 206. Esto no demuestra validación médica independiente ni sustituye pruebas en dispositivos físicos.

El generador `python scripts/content/build_educational.py` usa `src/data/educational-content.json`; no descarga datos. Los registros bibliográficos están en clinical-uip.json, clinical-vascular.json y clinical-science.json. Vancouver y BibTeX se distribuyen en public/references. Véase la revisión médica documental 0.9.1, conservada como antecedente editorial.

## Límites y licencias

Motor educativo propio en unidades relativas, versión imf-0d-relative-1.1. El flujo y el calibre ilustrativo proceden del cálculo; la geometría valvular y el mapa de cuatro compartimentos son esquemas, sin calibración individual ni validación biomecánica. No predice tratamientos.

El tiempo de los cines ThrombUS+ se verificó desde DICOM. Distancia y velocidad siguen bloqueadas sin calibración regional validada. Waterloo aporta un renderizado publicado, sin matrices RF ni una serie cuantitativa importada. La termografía conserva el archivo y sus valores incrustados, sin validación radiométrica del visor.

Medios y autorías mantienen sus licencias y transformaciones documentadas en catálogos y Créditos. Los avisos de bibliotecas están en docs/THIRD_PARTY_NOTICES.md. No se redistribuyen prompts completos de la biblioteca de pago ni figuras de guías enlazadas.

Para 1.0 faltan revisión médica independiente, pruebas con médicos y dispositivos físicos, accesibilidad/perfilado extensivos, medios de reflujo calibrados, más diversidad clínica y anatomía, y la posterior conexión DNS del subdominio en Hostinger.
