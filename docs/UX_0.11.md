# FLEBOLAB 0.11.0 — Twin en una pantalla y Vision educativo

6 de noviembre de 2026. Repositorio canónico: [imf-hub/flebolab](https://github.com/imf-hub/flebolab). Publicación: [GitHub Pages](https://imf-hub.github.io/flebolab/). Continúa la identidad blanca y roja IMF; el DNS de Hostinger queda para después.

## 1. Problemas observados antes del cambio

Capturas actuales de la versión 0.10.1, guardadas e inspeccionadas antes de editar:

1. `output/ux-0.11/01-twin-antes.jpg`: a 914 × 884, la gráfica comenzaba en y=986,59 y terminaba en y=1353,19. Se necesitaba bajar para contrastarla con el 3D. Los ajustes estaban ocultos y se superponían al modelo al abrirlos.
2. `output/ux-0.11/02-vision-antes.jpg`: entrada directa a una galería; los botones C0–C6 no explicaban su significado ni proponían una actividad de aprendizaje.

Las rutas de evidencia anteriores se resuelven desde la carpeta FLEBOLAB que contiene `app`. Las capturas son evidencia visual de esta iteración, no imágenes simuladas del producto.

Copias portables dentro del repositorio: [Twin antes](qa/ux-0.11/01-twin-antes.jpg), [Vision antes](qa/ux-0.11/02-vision-antes.jpg), [Twin después](qa/ux-0.11/03-twin-despues-local.jpg), [Vision después](qa/ux-0.11/04-vision-despues-local.jpg) y [doce perfiles comprobados](qa/ux-0.11/twin-perfiles-local.json).

## 2. Alcance implementado y orden

- [x] **Estructura:** separar controles, paradas del modelo, encuadre y guía CEAP del componente principal de cada laboratorio.
- [x] **Twin:** distribución de escritorio con experimentos, cuatro tarjetas de vista, 3D/circuito, curvas y ajustes visibles. A partir de 900 px de ancho el área principal ocupa la altura disponible bajo la cabecera medida. En pantallas menores los ajustes aparecen abiertos y se pueden contraer.
- [x] **Interacción:** velocidad 0,25×/0,5×/1×/2×; paradas calculadas en contracción, relajación e inversión de la rama profunda. La inversión se desactiva cuando esa solución no contiene flujo negativo.
- [x] **Animación:** flechas orientadas por el signo del flujo, trazadores desplazados por el flujo integrado y contracción radial más legible. Lectura contextual junto al 3D. La cámara ajusta su distancia al panel real y al modo, incluida comparación.
- [x] **A/B:** dos visores apilados, cámara y tiempo compartidos; curva A roja continua y B azul punteada. Selector B junto al botón para evitar que quede fuera del portátil. Las ecuaciones y el modelo 1.1 se conservan.
- [x] **Vision:** la entrada predeterminada es Aprender CEAP 2020. Dominios C/E/A/P; mapa C0–C6 con nombre completo, observación, contexto y dos ejemplos de carpetas distintas por clase.
- [x] **Actualización 2020:** subclases C4a/b/c, recurrencia C2r/C6r, básico/avanzado y calificadores s/a. Se explican sin reclasificar las fotografías generales del depósito.
- [x] **Práctica:** seis preguntas con explicación, corrección, puntuación y referencia. No se presentan como examen diagnóstico de las imágenes.
- [x] **Banco:** ampliación, anotación, etiquetas ocultables, RGB/térmica y comparación de dos/cuatro vistas. Los accesos de caso previos siguen abriendo su visor; los filtros ahora muestran el nombre de cada clase.
- [x] **DUS y marca:** conservar la distribución aprobada de DUS, fondo claro y originales IMF. Guía de uso, versión y créditos actualizados.

## 3. Contraste médico y bibliografía

Fuente primaria de la nueva unidad: Lurie F, Passman M, Meisner M, et al. *The 2020 update of the CEAP classification system and reporting standards*. J Vasc Surg Venous Lymphat Disord. 2020;8(3):342–352. [doi:10.1016/j.jvsv.2019.12.075](https://doi.org/10.1016/j.jvsv.2019.12.075). [Texto cotejado](https://www.angiolife.com.ua/media/pages/files/CEAP%202020.pdf), pp. 346–347 y tablas III–IV. Es el documento del grupo CEAP de AVF, fuente flebológica prioritaria para esta clasificación. El orden UIP/flebología → vascular → complementarias de la bibliografía global se mantiene.

Decisiones editoriales verificadas: C1 es disyuntivo (telangiectasias **o** venas reticulares); C4c no equivale a cualquier telangiectasia; recurrencia y síntomas requieren historia; el básico registra la clase más alta por miembro y el avanzado enumera las presentes. CEAP describe y no reemplaza VCSS. No evaluar un dominio no equivale a asignar su código «n».

Las fotos conservan CEAP y procedencia TRICVI–C v2. En particular, C4 no se subdivide automáticamente; C5/C6 no se diagnostican por una cicatriz/herida aislada. Las lecciones separan lo visible de lo que requiere historia, exploración o dúplex. No se recolorean ni retocan imágenes clínicas.

La musculatura y las valvas de Twin son representaciones ilustrativas. Las nuevas flechas y paradas dependen del cálculo, pero no constituyen una validación biomecánica o una simulación de paciente.

## 4. Comprobación de esta iteración

### Código y contenido

- 66 pruebas en cinco archivos: modelo, conservación, escenarios, física, referencias y siete pruebas nuevas de paradas/CEAP.
- Comprobación de catálogos: 72 cines, 72 participantes, 12.830 cuadros, 96 fotografías, 71 carpetas, 12 pares térmicos y 23 activos anatómicos/ilustrativos.
- Tipos y compilación de producción con `VITE_BASE_PATH=/flebolab/`.

### Recorridos de navegador local

1. **Twin 1366 × 768:** modelo, gráfica y ajustes juntos; selección valvular, paradas, anatomía cargada y circuito. Sin errores de consola en la revisión.
2. **Twin 914 × 884:** selector compacto de experimento. En TW10 la gráfica ocupó y=434–829 y los ajustes y=153–872, dentro de la pantalla. Área principal 793 px y altura de contenido 793 px, sin desplazamiento interno.
3. **Twin 1280 × 720:** los doce perfiles abrieron la vista prevista, con lecturas finitas y sin desbordamiento principal. Registro: `output/ux-0.11/twin-perfiles-local.json`.
4. **A/B 1280 × 720:** dos canvas de comparación, curva y selector B visibles; tras corregir la disposición, altura principal 629 px y contenido 629 px. Gráfica 294 px; selector B termina en y=659. La revisión detectó y corrigió el desbordamiento anterior.
5. **Control causal:** TW03 detenido cerca de 0,99 s: flujo profundo 2,264 u.r.; al llevar activación a cero y terminar el cálculo, 0,478 u.r. y fase Relajación. Restaurar recupera el perfil. Velocidad seleccionable y cambio a circuito comprobados.

   Al cambiar condiciones se ocultan las lecturas anteriores desde el primer render hasta que llega la nueva solución. El reinicio del reloj por cambio de perfil se completa antes de la siguiente interacción; la parada de contracción quedó verificada en 0,99 s y 2,264 u.r.
6. **Anatomía:** carga del GLB de referencia y controles de capas presentes; permanece explícitamente independiente de las curvas del modelo.
7. **Vision:** C4 → C4c muestra corona flebectásica y mantiene ejemplos generales C4. Respuesta errónea muestra explicación; corrección y siguiente actualizan pregunta/puntuación. Dominios E/A/P cambian su panel. Entrada al banco C4 muestra ocho fotografías.
8. **Medios:** apertura de C4/001; térmica 320 × 240 y RGB 640 × 480. Comparación de cuatro vistas crea cuatro visores. Volver a guía conserva la clase.
9. **Móvil 390 × 844:** sin desbordamiento horizontal global; mapa CEAP en cuatro columnas, dominios en dos y contenido apilado. Twin abre ajustes, permite contraerlos y muestra cuatro tarjetas legibles. Es una revisión en navegador con tamaño móvil, no prueba en teléfono físico.
10. **DUS:** revisión de regresión de entrada, filtros y cines; fondo blanco, `color-scheme: light` y logotipo original cargado. No se alteró su implementación clínica.

El despliegue de GitHub Actions y la revisión del enlace público forman el cierre de entrega; la evidencia de publicación se registra en la carpeta general del proyecto después del despliegue. Los resultados anteriores corresponden a la versión local comprobada.

## 5. Pendientes hacia 1.0

Revisión médica independiente del producto integrado; pruebas de uso con médicos y dispositivos físicos; accesibilidad y rendimiento extensivos; más diversidad y documentación de medios; cines de reflujo y calibración cuantitativa verificada. La clasificación del depósito no sustituye una adjudicación clínica por miembro. DNS del subdominio pendiente por decisión del proyecto. No se declara un gemelo digital individual validado.
