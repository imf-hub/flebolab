# Verificación de la aplicación

6 de noviembre de2026. Navegador MicrosoftEdge sobre Windows, aplicación local de Vite en127.0.0.1:5173. Estas comprobaciones son técnicas; no son una revisión médica independiente.

## Observado

| Área | Resultado observado |
|---|---|
| Portada | Renderizado completo, identidad propia IMF, navegación a los tres laboratorios y recorridos. |
| FleboTwin | GLB real visible, capas, selector de12escenarios, cambioTW01→TW06, red de flujo, reproducción y curva temporal con cambio de valores. |
| Comparación Twin | Segunda curva con leyendasA/B y selección de perfil. Comparación3D y cámara compartida implementadas; falta ensayo prolongado. |
| Parámetros | Controles visibles y valores correspondientes al perfil seleccionado; configuración en URL. |
| FleboVision |96fotografías/71carpetas mostradas, visorOpenSeadragon con imagen real y ampliación, comparación de cuatro celdas sin errores de ejecución. |
| Anotaciones | Punto agregado al centro de imagen y eliminación reversible comprobados. ExportaciónJSON verificada en el archivo descargado: recurso correcto y coordenadas[0.5,0.5]. |
| FleboDUS | Apertura directa deDUS-CFV-001, reproducciónMP4 y avance alcuadro2/213 medianteatlas000 conposición33.3333%/0%. |
| Comparación DUS |Dos reproductores visibles; botones de coordinación de reproducción y alineación inicial separados de sincronía fisiológica. |
| Doppler |DP01 concontroles,coseno yfrecuencia;DP09 abreMP4Waterloo real y conserva sus límites de calibración. |
| Móvil |Portada, menú yTwin a390px de ancho;documento sin desbordamiento horizontal, escenario y canvas adaptados. Es emulación de viewport, no prueba en teléfono físico. |
| Consola |Sin errores durante los recorridos iniciales por laboratorios. Se corrigió un aviso de raízReact duplicada durante edición en caliente del archivo principal. La comprobación final se repetirá sobre el build publicado. |

## Automatizado

`npm test`:31/31pruebas. Conservación de volumen en12perfiles, valores finitos, válvula ideal, repetibilidad, respuesta a gravedad/resistencia y convergencia a pasos0,01/0,005s en12escenarios.

`npm run check:content`:todo el catálogo válido,72cines,72participantes,12.830cuadros,96fotografías,71carpetas,12parejas térmicas,23activos anatómicos/ilustrativos,18láminas y6animaciones.

`npm run build`:TypeScript yVite completados. Se separan los módulos pesados de visualización de la portada. Cero vulnerabilidades reportadas por la auditoría consultada.

La evidencia de medios incluye hashes, inspección de metadatos, dimensiones, tiempos y decodificación de todo el lote; consultarCLINICAL_MEDIA_VERIFICATION.json. LosSVG tienen una comprobación editorial y de texto fuera del lienzo encontent/verification/.

## Límites de esta verificación

Faltan pruebas con médicos, lectores de pantalla y dispositivos físicos, perfiles de memoria prolongados y mediciones de campo de rendimiento. La comprobación de metadatosDICOM no equivale a validación de una herramienta de medición clínica. La versión temporal queda fuera de indexación mientras se revisa y se decide el dominio definitivo.

## Comprobación final del build

El build de producción se comprobó en un servidor propio en el puerto4187: selección y aislamiento de la vena safena magna, comparación3D con dos lienzos y ausencia de errores de ejecución en ese recorrido. Doce recorridos y marcado de progreso comprobados. La exportación de anotacionesJSON se descargó y verificó; laCSV se generó, pero su finalización local quedó en un archivo temporal del navegador y se comprobará sobre HTTPS.

La portada referencia337.225bytes de JS/CSS antes de compresión, sin el módulo3D/Plotly/OpenSeadragon ni medios clínicos. Hay1.240archivos de medios y307.579.295bytes en el paquete completo, solicitados de forma diferida. GitHubActions completó correctamente el workflow del commit1e4a371c4c51b52b6c23c05d8dd59f65765cb604.
