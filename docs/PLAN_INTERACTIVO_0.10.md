> Dirección visual vigente 0.10.1: tema claro/blanco por defecto, rojo IMF, logotipo horizontal y sello originales. Se conserva la distribución interactiva aprobada. Véase [identidad visual](IDENTIDAD_VISUAL_IMF.md).

# Plan ejecutado — FLEBOLAB interactivo 0.10

Fecha: 6 de noviembre de 2026. Corrección de dirección: repositorio y publicación en GitHub Pages. El subdominio de Hostinger se conectará después de la revisión. La carpeta canónica es `FLEBOLAB/app`; el checkout anterior de Sites se conserva como antecedente local y no es el origen de esta publicación.

## Resultado de producto

Una web de laboratorio en la que el objeto, el cine y la fotografía ocupan el centro. La portada ya permite cambiar mecanismo; el contenido extenso se consulta cuando hace falta. Tres laboratorios conservan la biblioteca médica y sus referencias, con controles que modifican aquello que anuncian.

## Fases y entregas

| Fase | Entrega | Estado |
|---|---|---|
| 1 · Base | Checkout GitHub independiente, Node 24, lockfile, estructura por laboratorios y catálogos | Ejecutada |
| 2 · Dirección visual | Referencias de MotionSites consultadas con la sesión de la biblioteca del usuario; composición clara sobre blanco, rojo institucional, objeto central, instrumentos y movimiento breve | Ejecutada |
| 3 · Portada | 3D real, selector válvulas/bomba/gravedad, cálculo y acceso directo al perfil elegido | Ejecutada |
| 4 · Twin | Contrato de vista para cada perfil, válvula semilunar dentro de su pared, red con seis flujos, cuatro compartimentos, circuito y comparación | Ejecutada |
| 5 · Medios | Se conserva lote verificado de 72 cines/96 fotos/12 parejas térmicas; controles, anotaciones y rutas corregidos | Ejecutada |
| 6 · Evidencia | Bibliografía UIP/flebología primero; seis controversias; distinción entre esquema y adquisición, origen y calibración | Conservada y revisada en integración |
| 7 · Calidad | 59 pruebas, catálogo íntegro, producción con base /flebolab/, pruebas de navegador y móvil | Ejecutada; evidencia en auditoría |
| 8 · Publicación | Actions construye y publica Pages desde main; revisión de rutas y medios públicos | Publicación y verificación remota correctas; 1.240 URLs disponibles; acta en auditoría |
| 9 · Consolidación 1.0 | Revisión médica externa, dispositivos, accesibilidad, perfilado, más datos calibrados y DNS | Pendiente documentado |

## Stack y decisiones

React/TypeScript/Vite; HashRouter para entradas directas en Pages; R3F/Drei/Three.js para WebGL; postprocessing para luz puntual legible; Motion para transiciones de estado, respetando movimiento reducido; Plotly básico cargado al abrir curvas; OpenSeadragon para fotografías. La anatomía se carga al entrar en su vista. Cine y atlas se solicitan según uso. No se añade Cornerstone3D mientras no se ofrezca un visor DICOM general: los recursos publicados son derivados con metadatos verificados.

El solver permanece separado de React, se ejecuta en Worker, rechaza respuestas antiguas y conserva su versión científica 1.1. La revisión añade canales de salida y volumen de los compartimentos, sin cambiar sus ecuaciones. Escena, métricas y gráficas usan la misma solución. Los marcadores integran el flujo de cada rama; signo negativo invierte el avance, cero lo detiene. Volumen se representa con radio proporcional a su raíz cuadrada a longitud fija. Las valvas son una representación conceptual y no una simulación mecánica validada.

Los presets se eligen en escenarioConfig; cada tarjeta abre flujo o válvula según su objetivo. Anatomía muestra el recurso BodyParts3D de forma independiente y lo explica. Circuito expone los mismos cuatro compartimentos. El período de B se iguala al de A en comparación para compartir reloj; no se afirma que dos adquisiciones clínicas estén sincronizadas fisiológicamente.

## Referencias de diseño y recursos de desarrollo

Se revisaron en `os.imperioagentico.com` las referencias Quantum Human, Bio-Digital y Bionova. Se adoptaron composición, capas, llamadas técnicas y secuencias de entrada. Se construyen interfaces y visuales propios; no se incorporan marca, cifras de marketing, videos de chips ni botones deliberadamente inactivos de sus prompts.

- https://motionsites.ai/?prompt=quantum-human
- https://motionsites.ai/?prompt=bio-digital
- https://motionsites.ai/?prompt=bionova-hero

Se consultaron las guías instaladas de Three.js y la guía oficial de Motion instalada desde motiondivision/ai-kit. Son apoyo técnico, no acreditación médica. La biblioteca mostraba acceso Agency; los prompts completos no forman parte del repositorio público. Medios clínicos y anatómicos conservan licencia por recurso. Ninguna dependencia premium de Motion es necesaria para ejecutar la aplicación.

## Criterios de aceptación aplicados

La tarjeta y la vista deben corresponder. Los ajustes deben cambiar parámetros calculados y escena/curvas. El cine debe detenerse en el cuadro indexado y conservar el tiempo de origen. Una fotografía debe mantener proporción, dimensiones y procedencia. Ninguna herramienta debe ofrecer medidas físicas sin validación de calibración. El móvil debe conservar navegación y controles sin desbordamiento global. Fuentes, créditos, descargas y enlaces de caso deben funcionar bajo el subdirectorio de Pages.

## Lo necesario para 1.0

Revisión clínica independiente del producto integrado con acta; pruebas con médicos, tacto, proyección y lectores de pantalla; perfil de rendimiento y memoria en dispositivos reales; espectros clínicos de reflujo reutilizables y calibrados; validación espacial DICOM; importación cuantitativa Waterloo con ROI/unidades/tiempo; mayor cobertura anatómica y superficies de corte cerradas; mayor diversidad de casos y situaciones. El modelo de paciente y cualquier predicción clínica requerirían investigación y validación separadas.
