# FLEBOLAB · Instituto Mexicano de Flebología

Laboratorio web de educación médica: hemodinámica interactiva, cine ecográfico real y observación clínica. Versión 0.12.1, 6 de noviembre de 2026.

- Web de revisión: https://imf-hub.github.io/flebolab/
- Código y versiones: https://github.com/imf-hub/flebolab
- Aula visual y revisión vigente: [AUDITORIA_ANIMACIONES_0.12.md](docs/AUDITORIA_ANIMACIONES_0.12.md)
- Producción y mantenimiento: [GUIA_PRODUCCION_ANIMACIONES.md](docs/GUIA_PRODUCCION_ANIMACIONES.md)
- Plan y pendientes de voz: [PLAN_ANIMACIONES_0.12.md](docs/PLAN_ANIMACIONES_0.12.md)
- Mejora UX anterior: [UX_0.11.md](docs/UX_0.11.md)
- Plan anterior ejecutado: [PLAN_INTERACTIVO_0.10.md](docs/PLAN_INTERACTIVO_0.10.md)
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

Para previsualizar localmente un build destinado a Pages, usar también `VITE_BASE_PATH=/flebolab/` al ejecutar `npm run preview`; abrir `/flebolab/`. La comprobación HTTP puede repetirse con `node scripts/check-deployment.mjs URL_BASE/ RUTA_INFORME.json`.

- `src/pages/LaboratoryHome.tsx`: portada con modelo 3D vivo y tres accesos a laboratorios.
- `src/learning`: 31 explicaciones de cuatro tomas, cámara y reproducción coordinadas, búsqueda, texto, guiones descargables y acceso a la exploración libre. Once incluyen voz; veinte tienen reproducción visual sin voz.
- `src/labs/twin`: modelo 0D en Worker, perfiles y contratos de vista, escenas de flujo/válvula, anatomía independiente, circuito, comparación y curvas sincronizadas.
- `src/labs/dus`: biblioteca, cine indexado, A–B, anotación y diez fundamentos Doppler.
- `src/labs/vision`: recorrido CEAP 2020 (clases, dominios y preguntas), filtros, OpenSeadragon, RGB/térmica, observación sin etiquetas, comparación de dos/cuatro imágenes y anotación.
- `src/data`: catálogos con procedencia/licencias, referencias tipadas y contenido editorial.
- `src/shared`: controles, rutas de medios, anotaciones, persistencia y recuperación de errores.
- `src/studio.css`: diseño visual, estados, móvil y movimiento reducido.
- `public/media`: derivados para distribución; sin DICOM/RF originales ni cachés de descarga.
- `scripts`: preparación de medios, validación, generadores y avisos de licencias.
- `docs`: plan, arquitectura, evidencia y límites de revisión médica.

React 19, TypeScript 5.9, Vite 7, Three.js, React Three Fiber 9, Drei 10, postprocessing, Motion, Plotly.js básico y OpenSeadragon. El tema predeterminado es claro/blanco, con rojo institucional y los logotipos originales del IMF. Manrope e IBM Plex Mono se sirven localmente. Las versiones exactas están fijadas en package-lock.json. La app estática no necesita cuentas, servicios de pago, secretos ni base de datos remota. Favoritos, anotaciones y progreso residen en el navegador.

## Cobertura

| Recurso     | Alcance distribuido                                                                                                  |
| ----------- | -------------------------------------------------------------------------------------------------------------------- |
| Aula visual | 31 explicaciones, 124 tomas; 11 voces Rocío (10 min 15,55 s), 20 guías visuales sin voz; 31 guiones y vistas previas |
| Twin        | 12 perfiles, 4 vistas, 8 parámetros visibles, 3D + curvas en un escritorio, comparación A/B                          |
| Anatomía    | 12 estructuras del miembro inferior izquierdo de BodyParts3D                                                         |
| DUS         | 72 clips de 72 participantes, 4 sitios, 12.830 cuadros en 838 atlas                                                  |
| Vision      | CEAP 2020, 6 preguntas con explicación, 96 vistas, 71 carpetas de caso, 12 pares térmicos                            |
| Doppler     | 10 apartados; DP09 incorpora renderizado experimental Waterloo                                                       |
| Contenido   | 12 recorridos, 33 términos, 18 láminas, 6 animaciones, 10 imágenes Servier                                           |
| Evidencia   | 19 referencias: 8 flebología/UIP, 4 vasculares, 7 complementarias                                                    |

Los números describen el lote, no prevalencia ni cobertura clínica exhaustiva. Las etiquetas del proveedor no equivalen a diagnósticos revisados independientemente.

## Comprobación y mantenimiento

78 pruebas automatizadas de modelo, física, contratos de escenarios, consultas, rutas, superficies valvulares, tomas y sincronización. El catálogo se verifica antes del build, incluidos guiones, medios narrados y hashes. Los workflows de GitHub repiten tipos, contenido, pruebas y compilación; Pages publica únicamente después de que pasen.

La revisión 0.12 accionó las 124 tomas a 1280×720, comprobó reproducción narrada, saltos y variantes móviles emuladas a 390×844. La escena y curva de cada pieza utilizan el mismo resultado; las curvas de conexión perforante y colateral siguen sus propias ramas. Las capas anatómicas y su panel reflejan los controles. Véase el informe vigente para evidencia y límites.

La auditoría de navegador anterior registró las 12 vistas y contrastó 48 lecturas con el modelo a 1,00 s. También comprobó los controles Doppler, reproducción/intervalos/anotación de cine, filtros y comparación de fotografías, dimensiones térmicas, selección anatómica y vistas a 390 px. La inspección pública confirmó modelos, cine y referencias; 1.240 URLs respondieron HTTP 200 y el video acepta rangos HTTP 206. Esto no demuestra validación médica independiente ni sustituye pruebas en dispositivos físicos.

El generador `python scripts/content/build_educational.py` usa `src/data/educational-content.json`; no descarga datos. Los registros bibliográficos están en clinical-uip.json, clinical-vascular.json y clinical-science.json. Vancouver y BibTeX se distribuyen en public/references. Véase la revisión médica documental 0.9.1, conservada como antecedente editorial.

## Límites y licencias

Motor educativo propio en unidades relativas, versión imf-0d-relative-1.1. El flujo y el calibre ilustrativo proceden del cálculo; la geometría valvular y el mapa de cuatro compartimentos son esquemas, sin calibración individual ni validación biomecánica. No predice tratamientos.

El tiempo de los cines ThrombUS+ se verificó desde DICOM. Distancia y velocidad siguen bloqueadas sin calibración regional validada. Waterloo aporta un renderizado publicado, sin matrices RF ni una serie cuantitativa importada. La termografía conserva el archivo y sus valores incrustados, sin validación radiométrica del visor.

Medios y autorías mantienen sus licencias y transformaciones documentadas en catálogos y Créditos. Los avisos de bibliotecas están en docs/THIRD_PARTY_NOTICES.md. No se redistribuyen prompts completos de la biblioteca de pago ni figuras de guías enlazadas.

Para 1.0 faltan revisión médica independiente, pruebas con médicos y dispositivos físicos, accesibilidad/perfilado extensivos, medios de reflujo calibrados, más diversidad clínica y anatomía, y la posterior conexión DNS del subdominio en Hostinger.
