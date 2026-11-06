# Arquitectura y operación

## Decisiones

1. Aplicación estática React/TypeScript con rutas hash, sin acoplar contenido a un proveedor de backend. El repositorio y el directorio `dist` son portables a cualquier alojamiento con HTTPS, sin fallback de SPA.
2. Catálogo versionado: la fuente, licencia y relación de caso se conservan junto a cada recurso. No se emplea una base de datos remota para estos contenidos de lectura.
3. Los tres laboratorios se cargan por ruta. Three.js/React Three Fiber, Plotly y OpenSeadragon se cargan bajo demanda. La portada carga su escena procedural 3D; no descarga los GLB anatómicos ni el banco de cines/atlas. El cine de portada solo se solicita al activar su tarjeta.
4. Los72 cines tienen MP4, portada y atlas4×4. El cuadro detenido usa el índice original, no una captura aproximada del decodificador de video. Cada atlas se solicita al necesitarlo; el banco completo de aproximadamente300MB no se descarga al entrar.
5. FleboTwin ejecuta un solver educativo en Worker. Cada petición lleva un ID; una respuesta anterior no puede sustituir el último resultado. La escena, valva, métricas y cursor consumen una solución común y un reloj compartido. La comparación 3D comparte cámara y tiempo; los parámetros de B proceden del perfil elegido y usan el período de A.
6. OpenSeadragon conserva la proporción del medio y transforma una capaSVG anclada a coordenadas de imagen. Las anotaciones se guardan como coordenadas normalizadas, nunca modifican el original. En cine, marcas y cuadros comparten la transformación de ampliación y desplazamiento.
7. Persistencia local por recurso y laboratorio. Sin datos identificables, cargas de pacientes, cuentas ni claves de servicio. Las exportaciones las solicita el visitante.
8. Cada recurso declara su naturaleza: clínico, experimental, anatomía de referencia o ilustración. Sin interpolación generativa de lesiones o cuadros de ultrasonido.

## Estado y contratos

`vision.json`: identificador estable, clase de depósito, carpeta, vista, dimensiones, RGB/térmica, procedencia, transformaciones y revisión. `participantId:null` se conserva cuando no está documentado.

`dus.json`: participante de depósito, lado, sitio, compresibilidad y trombosis originales, MP4, atlas e índices, dimensiones,FrameTime, calibración de origen, fuente y atribución. `calibration:null` bloquea medidas físicas aunque existan valores brutos en una secuenciaDICOM aún no validada.

`assets.json`: identificadores anatómicosBodyParts/FMA, tejidos, rutasGLB/PNG, coordenadas, hashes y licencia.

`waterloo.json`: tipoexperimental, matriz cuantitativa no importada, tiempos de reproducción y limitaciones de calibración explícitos.

`educational.ts`: fuentes, términos, leccionesDoppler, guías, recorridos y láminas con referencias tipadas.

`model.ts`: parámetros saneados dentro de rangos explícitos, solución temporal con versión, error de balance y métricas relativas. La exportaciónCSV incluye versión y parámetros.

## Calidad y liberación

La comprobación de contenido precede a pruebas y build. El archivo lock conserva la resolución exacta. Los reportes de preparación y revisión se guardan con la versión. La validación de código no sustituye la revisión médica.

Se conserva el código por commit y se publica mediante GitHub Actions y GitHub Pages. El workflow de Pages compila con base /flebolab/. HashRouter conserva enlaces directos; assetUrl y los envoltorios de catálogo adaptan rutas de medios y descargas. Para corregir un fallo: reproducir sobre el commit afectado, corregir, ejecutar las mismas comprobaciones, publicar una versión nueva. Para una regresión crítica: volver a desplegar la versión previa conservada por el alojamiento. Nunca reconstruir una versión antigua con dependencias nuevas sin identificarla como una revisión distinta.

La conexión de DNS queda diferida. En el dominio definitivo se deberán comprobar enlaces directos, rangos de video, caché,HTTPS y política de indexación. No se necesitan cambios de código para los enlaces relativos internos.

## Recursos instalados para el desarrollo

Trece guías especializadas de Three.js de `CloudAI-X/threejs-skills`: fundamentos, geometría, materiales, iluminación, texturas, animación, carga, shaders, postprocesado, interacción, rendimiento, React Three Fiber y preparación de activos. Se consultaron como apoyo; no forman parte del código que ejecuta el visitante ni validan la exactitud médica de los activos.


El modelo1.1 aplica estabilización periódica adaptativa, mínimo12ciclos y tres cierres consecutivos con residuo relativo por compartimento≤1e-5 (máximo1.800s de modelo). Conserva los cuatro volúmenes positivos en el dominio auditado y limita presión exterior a1,5unidades relativas. La entrada constante implica retorno medio0,7 en régimen; la comparación estudia presión, forma y flujo inverso. Véasecontent/MODEL_DOMAIN_AUDIT.md.

## Revisión interactiva 0.10

Ver [plan](PLAN_INTERACTIVO_0.10.md) y [auditoría](AUDITORIA_INTERACTIVA_0.10.md). Motion añade transiciones breves con movimiento reducido y las fuentes se sirven localmente. La versión 0.10.1 usa tema claro fijo, paleta roja institucional y colores de gráficos/escenas adecuados a fondos claros. Los trazadores usan luz y materiales sin bloom. El estado URL es autoritativo en Twin; los otros laboratorios aceptan enlaces de caso/lección sin conservar una selección anterior.
