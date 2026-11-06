# Producción y mantenimiento del aula visual

Método adaptado de Flebo Animaciones, sin modificar sus originales. FLEBOLAB conserva React 19, Three.js r186, React Three Fiber 9, TypeScript y Vite. No carga una segunda copia r128 ni depende de un compilador en el navegador.

## De un concepto a una pieza

1. Formular un objetivo observable y una pregunta médica concreta. Elegir la fuente más próxima: UIP y sociedades flebológicas, después sociedades vasculares, después fuentes complementarias. Conservar DOI, localizador, contexto y limitaciones. Una guía no valida automáticamente nuestro programa.
2. Escribir cuatro tomas: orientación, cambio, consecuencia y comprobación. Cada toma declara escenario, vista, fase, cámara y texto. Un cambio debe poder observarse en la escena o en la señal. No sustituir un mecanismo por partículas decorativas.
3. Editar `scripts/build-guided-lessons.py`; generar el catálogo y los 31 paquetes de guion con `python scripts/build-guided-lessons.py`. No editar por separado los JSON generados. Cambiar el texto de una voz existente requiere regenerar y realinear su narración; cambiar una fase visual no modifica el audio.
4. Reutilizar la física correspondiente. Twin calcula una solución estable por escenario. Su escena, transporte, lecturas y gráfica consultan esa solución. Los esquemas Doppler usan la misma convención de proyección y plegamiento que el laboratorio. Anatomía, cine y fotografía conservan su naturaleza independiente.
5. Construir geometrías una vez. Usar grupos jerárquicos, instancias y morph targets; actualizar matrices o atributos sin recrear mallas en cada fotograma. Conservar las inserciones valvulares. Liberar geometrías, materiales, observadores y audio al abandonar una pieza.
6. Comprobar la correspondencia semántica antes de grabar. Por ejemplo, la toma de inversión TW06 debe permanecer en flujo negativo y la de coaptación TW05 en el intervalo sin flujo inverso. La gráfica de una perforante debe mostrar su propio flujo. Estas condiciones tienen pruebas y comprobación visible.

## Voz y tiempos

Se utilizó HeyGen con Rocío — Calm & Trustworthy, `84854979e66846989bc6c5855f53268f`, español, SSML y pausas de 0,9 s. Se verificó su disponibilidad. Se omitieron engine y speed para conservar el valor guardado; las respuestas aceptadas informaron orca. La reproducción permanece en 1×.

Cada solicitud contiene una narración continua. Conservar el SSML enviado y la respuesta original en `artifacts/narration`; esa carpeta no se publica. Tras obtener una respuesta, `python scripts/ingest-narration.py ID` descarga el original y verifica duración, transcripción y marcas. Consultar el script para sus argumentos si se usa otra ruta de respuesta. No volver a sintetizar como parte de una compilación.

Los originales quedan en el archivo privado local. La distribución usa MP3 mono a 96 kbps sin cambio de velocidad ni tono, WebVTT y JSON editable. Cada nombre contiene SHA-256. La procedencia y las marcas por palabra aceptadas quedan en `docs/narration/ID.json`. El catálogo `src/data/narration.json` identifica solo voces realmente disponibles.

El tiempo editorial de una pieza narrada procede de `audio.currentTime`. El bucle consulta ese reloj para cámara, mecanismo y subtítulo. Las tomas usan segundos absolutos y sus intervalos no tienen huecos. Pausa, cambio de página y ocultación detienen la reproducción. El salto temporal reconstruye el estado; un salto voluntario encuadra inmediatamente su toma. El giro manual suspende la cámara guiada hasta recuperarla.

Cuando no existe un audio aceptado, la pieza se identifica como **guía visual sin voz**. Usa un reloj visual monotónico y tiempos de lectura estimados, nunca marcas de voz inventadas. Conserva los cuatro cambios, textos, pausa, salto, reinicio y fuentes. No utiliza voces alternativas del navegador.

Un fallo o tiempo de espera de síntesis no permite asumir si el proveedor consumió cuota. No se hacen retomas automáticas ni se cambia de motor; registrar el incidente y obtener confirmación antes de una nueva generación, conforme a la herramienta de voz.

## Tres tipos de contenido

Desde 0.12.1, la reproducción inicial espera la disponibilidad del recurso visual: escena y curva de Twin, geometría anatómica, fotografías o primer cuadro decodificado. Los medios muestran carga/error. El video solicita un cuadro pausado también a tiempo cero; una imagen de portada no equivale a un cuadro decodificado. El cine anticipa el siguiente atlas para reducir pausas de red, conservando sus cuadros originales.

| Material | Qué se anima | Qué no se infiere |
|---|---|---|
| Twin | Flujos, trazadores, volumen relativo, activación y valvas ilustrativas | mmHg, dosis de compresión, respuesta de un paciente o biomecánica de tejido |
| Doppler sintético | Proyección, mapa, línea base, escala, muestreo, intervalos y modulación | Una adquisición clínica, calibración instrumental o diagnóstico |
| BodyParts3D | Cámara, capas y selección de 12 estructuras originales | Variantes completas o deformación del modelo funcional |
| ThrombUS+ | Cuadros originales con su índice y tiempo de adquisición | Cuadros interpolados, distancias sin calibrar o revisión diagnóstica independiente |
| Waterloo | Posición del renderizado publicado | Matrices RF o velocidades numéricas que no se importaron |
| TRICVI–C | Foco y comparación de ejemplos con etiqueta de origen | Reclasificación automática por miembro o atribución causal desde píxeles |

La guía de compresión recorre el cine a ritmo docente. Su reloj de reproducción y el tiempo original de adquisición se muestran por separado. No se recolorean ni deforman los medios clínicos. Los ejemplos C4 mantienen la etiqueta general aunque se expliquen C4a/b/c.

## Entrega, calidad y ampliación

- Ejecutar `npm run check:content`, `npm test` y el build con `VITE_BASE_PATH=/flebolab/`. El control de contenido también verifica paquetes, hashes, SSML y recursos del aula.
- Revisar en navegador cada toma y su consecuencia; comprobar reproducción completa, vuelta atrás, rango temporal, fuentes y descargas. Revisar escritorio con 3D y curva juntos, pantalla intermedia y móvil. Documentar qué fue emulado y qué se probó en un dispositivo físico.
- Revisar pronunciación, ritmo y sincronía mediante escucha completa y revisión médica independiente antes de declarar aprobación clínica. Las pruebas numéricas y de interfaz no demuestran esas revisiones.
- Las vistas previas del catálogo son capturas de la presentación, no nuevas imágenes clínicas. Se generan desde capturas completas comprobadas con `scripts/build-lesson-previews.py` y conservan su hash.
- Si se solicita MP4, implementar una composición determinista `sample(t, parámetros, semilla)` con cámara, geometría, partículas y rótulos reconstruibles por fotograma, componer con FFmpeg y comprobar con FFprobe. Esta versión entrega reproducción web interactiva; no incorpora un exportador MP4.

Las bibliotecas ya instaladas cubren estas funciones. Añadir una dependencia exige una necesidad concreta, compatibilidad, licencia y mejora comprobable; no una acumulación de efectos.
