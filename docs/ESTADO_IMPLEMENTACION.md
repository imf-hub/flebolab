> Actualización 0.10, 6 noviembre 2026: el plan y la auditoría vigentes están en [PLAN_INTERACTIVO_0.10.md](PLAN_INTERACTIVO_0.10.md) y [AUDITORIA_INTERACTIVA_0.10.md](AUDITORIA_INTERACTIVA_0.10.md). El alojamiento vigente es GitHub Pages. El detalle siguiente se conserva como trazabilidad de 0.9 y no describe por sí solo la versión actual.

# Estado de implementación — FLEBO LAB 0.9

Fecha: 6 de noviembre de 2026. Referencia: plan maestro v3. Esta acta distingue implementación técnica, pruebas observadas y validación médica. No expresa un porcentaje de exactitud clínica.

## Resultado construido

Tres laboratorios funcionales:12 escenariosTwin con modelo 0D y Worker, anatomía de 12 estructuras, comparación 3D y curvas;72 cines de 72 participantes con 12.830 cuadros indexados;96 fotografías de 71 carpetas y 12 parejas térmicas;12 recorridos,32 términos,18 láminas,6 animaciones y 10 ilustracionesServier. Un cine y una figura Waterloo reales complementan DP09.

La aplicación es React/TypeScript/Vite, estática y portable. Los medios completos no se descargan al entrar. Los favoritos, anotaciones y progreso son locales. No hay cuentas, datos de pacientes cargados por visitantes ni diagnóstico automático.

## Comprobaciones terminadas

- 34 pruebas del motor: conservación, válvula, repetibilidad, gravedad, resistencia y convergencia en los12 escenarios.
- Comprobación de todo el catálogo: IDs únicos, rutas existentes, cobertura real,12.830 índices continuos y tiempos coherentes.
- 72/72 MP4 verificados frente aFrameTime DICOM;13 GLB validados por Khronos sin errores ni advertencias.
- Revisión editorial y renderizado de24 SVG; fuentes y atribuciones cotejadas.
- Compilación de producción y auditoría de dependencias: cero vulnerabilidades reportadas en la revisión del6nov.
- Pruebas de navegador y exportación documentadas en VERIFICACION_WEB.md.

## Trazabilidad con el plan

Implementado indica que existe la función o entrega; no implica validación clínica independiente. Parcial indica un límite concreto que se conserva para la versión 1.0.

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
| P14 | Parcial | Configurar CI de tipos, contenido, pruebas y build | Workflow creado y guardado en GitHub; se confirmará ejecución remota al cerrar publicación. |
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
| P25 | Implementado | Construir el territorio y las cámaras de referencia | src/labs/twin/, model.test.ts, página Fuentes. |
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
| P72 | Implementado | Comprobar exportaciones y atribuciones | docs/VERIFICACION_WEB.md, build, GitHub y publicación. |
| P73 | Parcial | Comprobar catálogo y revisión médica de las selecciones | Lote técnicamente verificado, etiquetas originales conservadas y revisión editorial documentada; falta revisión médica independiente del producto integrado. |
| P74 | Implementado | Preparar paquete y acta breve de versión candidata | docs/VERIFICACION_WEB.md, build, GitHub y publicación. |
| P75 | Parcial | Publicar el candidato en una dirección temporal del alojamiento elegido | Paquete preparado para publicación temporal; confirmar URL y versión al completar despliegue. |
| P76 | Parcial | Comprobar rutas, medios, rangos, CORS y HTTPS de prueba | Se comprobarán HTTPS, rutas y medios sobre la dirección publicada; pendiente del despliegue. |
| P77 | Pendiente | Asociar el subdominio real y completar DNS/TLS cuando el candidato esté listo | Diferido expresamente por el usuario: conexión de subdominio/DNS en Hostinger después de revisión. |
| P78 | Pendiente | Revisar el recorrido final bajo el dominio definitivo y habilitar indexación | Diferido hasta dominio definitivo y cierre editorial. La versión temporal conserva noindex y robots de exclusión. |
| P79 | Parcial | Conservar versión de recuperación y procedimiento de corrección | Código versionado y procedimiento de recuperación documentado; la primera publicación será el primer punto de recuperación. |
| P80 | Parcial | Registrar el lanzamiento y la cobertura real publicada | Inventario y alcance de 0.9 documentados; acta final se añadirá tras publicación. |

## Pendientes principales de 1.0

1. Revisión médica independiente del producto integrado y acta de aprobación editorial.
2. Pruebas con médicos, proyección y dispositivos físicos, accesibilidad asistiva y memoria de larga duración.
3. Validación de calibración DICOM por región y adquisición de espectros reales de reflujo reutilizables con tiempo/calibración comprobados.
4. Importación cuantitativa Waterloo con ROI, unidades y tiempo físico verificables.
5. Secciones anatómicas con cierre y revisión de superficies, mayor cobertura anatómica y diversidad de casos/maniobras.
6. Conexión del subdominio en Hostinger y comprobación final de indexación, exclusivamente después de revisar el candidato.

El modelo calibrado de paciente y la validación de predicción clínica no se dan por completados ni se sugieren como prestaciones de esta versión docente.


## Cierre posterior a publicación

La versión1 se publicó en https://flebolab-imf.ferver.chatgpt.site. El acta inicial está en [Acta de publicación](ACTA_PUBLICACION_2026-11-06.md). La revisión documental0.9.1 amplía y corrige la base médica; consultar [revisión integrada](content/REVISION_INTEGRADA_0.9.1.md). La tabla anterior describe la preparación del candidato y no constituye aprobación médica independiente.
