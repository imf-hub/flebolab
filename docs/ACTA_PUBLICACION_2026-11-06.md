# Entrega y publicación de FLEBO LAB IMF

Fecha: 6 de noviembre de 2026. Aplicación 0.9, modelo educativo 1.1. Estado: **publicada para revisión profesional**.

## Abrir y revisar

- [Web pública](https://flebolab-imf.ferver.chatgpt.site)
- [Código, recursos e historial en GitHub](https://github.com/imf-hub/flebolab)
- [FleboTwin](https://flebolab-imf.ferver.chatgpt.site/flebotwin) · [FleboDUS](https://flebolab-imf.ferver.chatgpt.site/flebodus) · [FleboVision](https://flebolab-imf.ferver.chatgpt.site/flebovision)
- [Método y fuentes](https://flebolab-imf.ferver.chatgpt.site/fuentes) · [Guía](https://flebolab-imf.ferver.chatgpt.site/guia) · [Alcance de versión](https://flebolab-imf.ferver.chatgpt.site/novedades)

La dirección es pública y no exige cuenta. El subdominio propio y el DNS de Hostinger quedan para la etapa posterior solicitada por Fernando. La versión temporal conserva exclusión de indexación.

## Qué se entregó

| Área | Entrega real |
|---|---|
| FleboTwin |12 escenarios, anatomía 3D, capas, selección/aislamiento, corte visual, válvula, circuito, trazadores, controles, comparación 3D y curvas sincronizadas. |
| Motor educativo |Modelo 0D propio en unidades relativas, Worker, estabilización adaptativa, conservación y verificación de dominio; versión imf-0d-relative-1.1. |
| Anatomía e ilustración |12 estructuras BodyParts3D,13 GLB validados y10 ilustraciones Servier con atribución. |
| FleboDUS |72 cines de 72 participantes,18 por cada sitio CFV/GS/FV/PV,12.830 cuadros en838 atlas, reproducción, intervalos, comparación, zoom, desplazamiento y anotaciones. |
| Doppler |10 apartados; nueve esquemas interactivos y un cine experimental Waterloo real. |
| FleboVision |96 fotografías de71 carpetas de caso,12 parejas térmicas, visor ampliable, comparación de2/4 imágenes, anotaciones y modo de observación sin etiquetas. |
| Aprendizaje |12 recorridos,32 conceptos,18 láminas y6 animaciones vectoriales propias. |
| Operación |Enlaces directos, favoritos y progreso locales, fuentes y créditos, exportación de anotaciones y generaciónCSV versionada. |
| Desarrollo |React/TypeScript/Vite, componentes por laboratorio, carga diferida, lockfile, pruebas, GitHubActions, documentación y avisos de 157 paquetes instalados. |

Se instalaron 13 guías especializadas de Three.js para apoyar anatomía, carga, interacción, animación, materiales, rendimiento y preparación de activos. Los originales de trabajo y cachés no se incluyen en la web.

## Verificación realizada

- 34 pruebas automáticas del motor aprobadas, con regresiones de estabilización y dominio.
- Auditoría numérica de 384 fronteras y1.000 combinaciones interiores: todas finitas, positivas y convergentes. Esto valida propiedades del código dentro de esa muestra; **no es validación clínica**.
- Comprobación de todo el catálogo, continuidad de índices y tiempos;72/72 cines cotejados con FrameTime DICOM.
- 13 GLB sin errores ni advertencias de Khronos;24 SVG revisados por integridad y renderizado.
- GitHubActions completo con éxito: [ejecución42184641815](https://github.com/imf-hub/flebolab/actions/runs/42184641815).
- Pruebas de navegador en los tres laboratorios, comparación, anotaciones, selección anatómica y visualización móvil emulada. Faltan dispositivos físicos y ensayos con usuarios.
- Acceso HTTP anónimo con agente de navegador:200 en portada, enlaces directos y medios comprobados. En el sitio publicado se observaron anatomía 3D, fotografía y cine reproduciéndose sin errores de ejecución en los recorridos revisados.

## Qué falta para 1.0

1. Revisión médica independiente del producto integrado, firma editorial y pruebas de uso con médicos.
2. Validación de calibración DICOM por región y espectros clínicos reales de reflujo reutilizables. Las medidas de distancia y velocidad permanecen bloqueadas.
3. Importar una serie cuantitativa Waterloo con ROI y tiempo físico válidos. DP09 utiliza un renderizado real; no una curva numérica experimental importada.
4. Completar secciones anatómicas con superficie de cierre revisada, cámaras predefinidas y mayor variabilidad anatómica/poblacional.
5. Probar accesibilidad asistiva, tacto/proyección físicos y memoria/rendimiento de sesiones largas.
6. Ampliar casos, maniobras y documentación de cobertura; la selección actual no representa prevalencia ni todas las patologías.
7. Para crecer en medios, migrar su distribución a almacenamiento de objetos/CDN con soporte Range. El alojamiento temporal entrega MP4 completos; los clips actuales se reproducen y los cuadros se inspeccionan por atlas independientes.
8. Completar exportación/importación global de colecciones personales y confirmar finalización de CSV en los navegadores de destino. La generación del archivo y sus metadatos ya se comprobaron; Edge dejó el CSV en estado temporal durante la prueba.
9. Conectar el subdominio en Hostinger, comprobarlo y decidir la apertura de indexación.

El modelo sigue siendo genérico y docente: pared lineal sin colapso, coeficientes relativos y entrada constante. No es un gemelo individual ni una herramienta de predicción terapéutica. La compresión de cuadros es una derivación para distribución y conserva pérdida de textura fina respecto al DICOM.

## Registro de publicación y recuperación

- URL: https://flebolab-imf.ferver.chatgpt.site
- Versión del alojamiento:1. Acceso:public.
- Proyecto:appgprj_6aed758a35d081918db433bcc02c6096.
- Versión:appgprj_6aed758a35d081918db433bcc02c6096~appgver_a2332c8a53f88191acb1713f08e735c0.
- Despliegue:appgdep_6aed8a167bc08191986dbe97a93cfee4; resultado:succeeded.
- Commit del alojamiento:f8988b0774e4c4b1411d8bfe2ed9356236deb0e4.
- Commit de aplicación en GitHub:d5c52d3342e0839300ca5bf8722e06299265952d.
- Paquete local:output/flebolab-0.9-public.tar.gz,260.802.762bytes;SHA256:D4E960883A07CFA16FC33864554A2651F2E691A94EB333ABC3785C6FBB2DEB89.
- Medios finales:262.210.655bytes. Atlas WebP Q52/método6 regenerados desde DICOM;348 hashes confirmaron que no cambiaron videos, fotografías, térmicas, miniaturas ni portadas.
- Captura: [web publicada](images/flebolab-publicado.png). Verificación HTTP: [resultado](VERIFICACION_PUBLICACION_HTTP.json).

Para una corrección se parte del commit o de la etiqueta de revisión conservada, se repiten comprobaciones y se publica una versión nueva. Para revertir, se vuelve a desplegar la versión guardada del alojamiento. No se modificaron el atlas anatómico ni otros proyectos.

## Trazabilidad de los 80 criterios del plan

Implementado describe una entrega técnica existente. Parcial conserva un límite concreto; no es un porcentaje de exactitud médica.

| ID | Estado | Entrega del plan | Evidencia o límite |
|---|---|---|---|
| P01 | Implementado | Cerrar mapa de rutas y funciones | src/main.tsx, App.tsx, shared/, README, lockfile y workflow. |
| P02 | Implementado | Diseñar portada y presentación de los tres laboratorios | src/main.tsx, App.tsx, shared/, README, lockfile y workflow. |
| P03 | Parcial | Diseñar escritorio, proyección y móvil | Escritorio y móvil390px comprobados en navegador; falta ensayo de proyector y dispositivos físicos. |
| P04 | Parcial | Crear sistema visual y estados | Estados comunes y recuperación global; falta auditoría exhaustiva de contraste/tacto/lector de pantalla. |
| P05 | Implementado | Definir contratos de caso, activo, escenario y recorrido | src/main.tsx, App.tsx, shared/, README, lockfile y workflow. |
| P06 | Implementado | Preparar matriz editorial de las metas de lanzamiento | src/main.tsx, App.tsx, shared/, README, lockfile y workflow. |
| P07 | Implementado | Crear el repositorio dedicado y el proyecto local al iniciar la construcción, sin modificar el atlas. | src/main.tsx, App.tsx, shared/, README, lockfile y workflow. |
| P08 | Implementado | Fijar el conjunto compatible de dependencias y lockfile | src/main.tsx, App.tsx, shared/, README, lockfile y workflow. |
| P09 | Implementado | Implementar rutas y entradas directas | src/main.tsx, App.tsx, shared/, README, lockfile y workflow. |
| P10 | Implementado | Implementar layouts, paneles y modo presentación | src/main.tsx, App.tsx, shared/, README, lockfile y workflow. |
| P11 | Parcial | Implementar controles comunes accesibles | Controles etiquetados y teclado en cines; falta prueba asistiva formal y gestos en dispositivos físicos. |
| P12 | Implementado | Separar estado de los laboratorios | src/main.tsx, App.tsx, shared/, README, lockfile y workflow. |
| P13 | Parcial | Implementar validación del catálogo y de los parámetros compartidos | Parámetros saneados, fallback de IDs y comprobación integral de catálogo en build; falta esquema de importación externa porque no hay cargas. |
| P14 | Implementado | Configurar CI de tipos, contenido, pruebas y build | Workflow de GitHub completado correctamente:34 pruebas, contenido, tipos y build. Commit de aplicación d5c52d3342e0839300ca5bf8722e06299265952d. |
| P15 | Implementado | Registrar fuentes, licencias y decisiones de uso del lote | src/data/, docs/CLINICAL_MEDIA*, scripts/assets y content/. |
| P16 | Implementado | Seleccionar la galería RGB conforme a las metas | src/data/, docs/CLINICAL_MEDIA*, scripts/assets y content/. |
| P17 | Implementado | Preparar parejas térmicas verificadas | src/data/, docs/CLINICAL_MEDIA*, scripts/assets y content/. |
| P18 | Implementado | Seleccionar los clips de compresión | src/data/, docs/CLINICAL_MEDIA*, scripts/assets y content/. |
| P19 | Implementado | Decodificar y preparar familias DICOM | src/data/, docs/CLINICAL_MEDIA*, scripts/assets y content/. |
| P20 | Parcial | Preparar los extractos experimentales de Waterloo | Cine y figura Waterloo reales importados. Faltan matricesRF, ROI y serie cuantitativa experimental. |
| P21 | Implementado | Inventariar las estructuras y los activos 3D | src/data/, docs/CLINICAL_MEDIA*, scripts/assets y content/. |
| P22 | Implementado | Preparar la geometría valvular propia y las piezas de corte que requieran elaboración | src/data/, docs/CLINICAL_MEDIA*, scripts/assets y content/. |
| P23 | Implementado | Optimizar modelos y medios | src/data/, docs/CLINICAL_MEDIA*, scripts/assets y content/. |
| P24 | Implementado | Generar manifiestos y relaciones de contenido | src/data/, docs/CLINICAL_MEDIA*, scripts/assets y content/. |
| P25 | Parcial | Construir el territorio y las cámaras de referencia | Territorio, cámara anterior restaurable y órbita implementados; falta colección completa de cámaras anatómicas predefinidas. |
| P26 | Implementado | Implementar capas y transparencias | src/labs/twin/, model.test.ts, página Fuentes. |
| P27 | Implementado | Implementar selección desde escena y lista | src/labs/twin/, model.test.ts, página Fuentes. |
| P28 | Implementado | Implementar aislamiento y vuelta al territorio | src/labs/twin/, model.test.ts, página Fuentes. |
| P29 | Parcial | Implementar el corte o sección correspondiente al activo | Corte visual de mallas implementado; falta sección anatómica con superficie de cierre revisada. |
| P30 | Implementado | Construir la vista ampliada de válvula | src/labs/twin/, model.test.ts, página Fuentes. |
| P31 | Implementado | Implementar trazadores y contornos | src/labs/twin/, model.test.ts, página Fuentes. |
| P32 | Parcial | Implementar comparación 3D A/B | Comparación3D y cámara compartida implementadas; falta ensayo extensivo de manipulación simultánea y rendimiento móvil. |
| P33 | Implementado | Documentar la formulación base y sus fronteras | src/labs/twin/, model.test.ts, página Fuentes. |
| P34 | Implementado | Preparar perfiles de parámetros con rangos y alcance | src/labs/twin/, model.test.ts, página Fuentes. |
| P35 | Implementado | Implementar el solver independiente de la interfaz | src/labs/twin/, model.test.ts, página Fuentes. |
| P36 | Parcial | Integrar Worker, cancelación y cambio de parámetros | Worker y rechazo de respuestas antiguas. No se interrumpe un paso ya en ejecución; el cálculo es breve y se descarta si quedó obsoleto. |
| P37 | Implementado | Comprobar equilibrio, conservación, válvulas y gravedad | src/labs/twin/, model.test.ts, página Fuentes. |
| P38 | Implementado | Comprobar paso temporal y sensibilidad | src/labs/twin/, model.test.ts, página Fuentes. |
| P39 | Implementado | Producir TW01-TW12 y sus explicaciones | src/labs/twin/, model.test.ts, página Fuentes. |
| P40 | Implementado | Integrar presión, flujo y volumen en Plotly | src/labs/twin/, model.test.ts, página Fuentes. |
| P41 | Implementado | Sincronizar escena, curvas, válvula y fases | src/labs/twin/, model.test.ts, página Fuentes. |
| P42 | Implementado | Implementar exportación de curvas y enlace de escenario | src/labs/twin/, model.test.ts, página Fuentes. |
| P43 | Implementado | Construir explorador por segmento, lado y etiquetas | src/labs/dus/, catálogoDUS y Waterloo. |
| P44 | Implementado | Implementar carga y representación de las familias de archivos seleccionadas | src/labs/dus/, catálogoDUS y Waterloo. |
| P45 | Implementado | Implementar cine y repetición de intervalos | src/labs/dus/, catálogoDUS y Waterloo. |
| P46 | Implementado | Implementar inspección por cuadros | src/labs/dus/, catálogoDUS y Waterloo. |
| P47 | Implementado | Implementar zoom, desplazamiento y anotación reversible | src/labs/dus/, catálogoDUS y Waterloo. |
| P48 | Parcial | Implementar calibración por región y unidad | Metadatos de calibración preservados y herramientas físicas bloqueadas. Falta validación espacial por región para habilitar medidas. |
| P49 | Implementado | Implementar comparación de cines | src/labs/dus/, catálogoDUS y Waterloo. |
| P50 | Implementado | Integrar mapa anatómico y contexto de adquisición | src/labs/dus/, catálogoDUS y Waterloo. |
| P51 | Parcial | Construir DP01-DP10 | DP01–DP10 navegables. DP09 usa cine experimental real, sin curva cuantitativa ni matrices importadas. |
| P52 | Implementado | Completar maniobras y lectura de reflujo | src/labs/dus/, catálogoDUS y Waterloo. |
| P53 | Implementado | Integrar los extractos de Waterloo | src/labs/dus/, catálogoDUS y Waterloo. |
| P54 | Implementado | Construir galería y filtros combinados | src/labs/vision/, Annotations y catálogoVision. |
| P55 | Implementado | Implementar el visor y sus límites de resolución | src/labs/vision/, Annotations y catálogoVision. |
| P56 | Implementado | Implementar comparación de dos y cuatro vistas según pantalla | src/labs/vision/, Annotations y catálogoVision. |
| P57 | Implementado | Implementar anotaciones y ocultación de contexto | src/labs/vision/, Annotations y catálogoVision. |
| P58 | Implementado | Integrar clasificación y signos | src/labs/vision/, Annotations y catálogoVision. |
| P59 | Implementado | Integrar parejas térmicas y escalas válidas cuando correspondan | src/labs/vision/, Annotations y catálogoVision. |
| P60 | Parcial | Implementar favoritos y fichas de vista | Favoritos y fichas locales operativos; anotaciones exportables. Falta exportación/importación global de colecciones personales. |
| P61 | Implementado | Producir las 18 láminas y seis animaciones previstas | educational.ts, pages/Library.tsx, public/media/plates y animations. |
| P62 | Implementado | Construir RC01-RC12 sobre recursos existentes | educational.ts, pages/Library.tsx, public/media/plates y animations. |
| P63 | Implementado | Integrar navegación temática entre laboratorios | educational.ts, pages/Library.tsx, public/media/plates y animations. |
| P64 | Parcial | Completar glosario y equivalencias | 32 términos bilingües con fuentes y revisión editorial; pendiente validación médica independiente de terminología integrada. |
| P65 | Implementado | Completar guía, fuentes, créditos, modelo y novedades | educational.ts, pages/Library.tsx, public/media/plates y animations. |
| P66 | Implementado | Implementar búsqueda, favoritos y enlaces compartidos | educational.ts, pages/Library.tsx, public/media/plates y animations. |
| P67 | Parcial | Revisar los recorridos de escritorio y proyección | Revisión funcional de los tres laboratorios en Edge de escritorio; falta prueba en proyección física. |
| P68 | Parcial | Revisar tableta, móvil y teclado | Portada y Twin revisados a 390 px sin desbordamiento, menú y controles operativos; falta prueba física de tableta/tacto y accesibilidad completa. |
| P69 | Parcial | Medir portada, escenas, cines y comparación | Compilación por bloques y medios bajo demanda; falta medición de campo en redes/dispositivos representativos. |
| P70 | Parcial | Verificar liberación de memoria y cancelación | Worker, RAF, visores y geometrías se liberan al desmontar; falta ensayo de memoria de larga duración con perfilador. |
| P71 | Parcial | Probar errores, enlaces antiguos y recursos no disponibles | Fallback de rutas/IDs, estado de carga, error de video y recuperación global; faltan pruebas extensivas de fallos de red/almacenamiento. |
| P72 | Parcial | Comprobar exportaciones y atribuciones | AnotacionesJSON descargadas y verificadas. CSV generado y su contenido/versionado comprobados; el navegador dejó la descargaCSV local en estado temporal y su finalización no quedó validada. |
| P73 | Parcial | Comprobar catálogo y revisión médica de las selecciones | Lote técnicamente verificado, etiquetas originales conservadas y revisión editorial documentada; falta revisión médica independiente del producto integrado. |
| P74 | Implementado | Preparar paquete y acta breve de versión candidata | Paquete medido, código e inventario congelados, acta de publicación y captura conservadas. |
| P75 | Implementado | Publicar el candidato en una dirección temporal del alojamiento elegido | Versión1 del alojamiento publicada y comprobada en https://flebolab-imf.ferver.chatgpt.site. |
| P76 | Parcial | Comprobar rutas, medios, rangos, CORS y HTTPS de prueba | HTTPS, acceso público sin cuenta, rutas y medios comprobados. Los MP4 responden200 al solicitar Range, entregando el archivo completo; no se confirmó206. Reproducción y cuadros funcionan. |
| P77 | Pendiente | Asociar el subdominio real y completar DNS/TLS cuando el candidato esté listo | Diferido expresamente por el usuario: conexión de subdominio/DNS en Hostinger después de revisión. |
| P78 | Pendiente | Revisar el recorrido final bajo el dominio definitivo y habilitar indexación | Diferido hasta dominio definitivo y cierre editorial. La versión temporal conserva noindex y robots de exclusión. |
| P79 | Implementado | Conservar versión de recuperación y procedimiento de corrección | Fuente y artefacto de publicación conservados; historial GitHub y versión1 del alojamiento permiten recuperar el candidato. |
| P80 | Implementado | Registrar el lanzamiento y la cobertura real publicada | Registro de FLEBO LAB0.9 y modelo1.1, cobertura real y pendientes de1.0 documentados en esta acta. |
