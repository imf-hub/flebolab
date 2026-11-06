# FLEBO LAB IMF — Revisión médica documental y mejoras 0.9.1

Fecha de corte: 6 de noviembre de 2026. Responsable de la integración editorial y técnica: desarrollo de FLEBO LAB IMF. Este documento no atribuye la revisión ni la aprobación clínica del producto a las sociedades citadas.

## Criterio de fuentes

1. UIP y sociedades de flebología: consensos dúplex UIP I y II, nomenclatura, CEAP del American Venous Forum, posición ASV respaldada por AVLS/AVF/UIP, informe UIP sobre miembro aumentado de volumen y guía de preparación ecográfica de la Korean Society for Phlebology.
2. Angiología y sociedades vasculares: guías conjuntas SVS/AVF/AVLS y guías ESVS de enfermedad venosa crónica y trombosis.
3. Otras especialidades, normas e investigación: ASA, AIUM, IAC, DICOM y artículos primarios de física y modelado hemodinámico.

El orden institucional organiza la lectura; no equivale a grado de evidencia ni obliga a mantener un criterio histórico frente a una actualización pertinente. Se distingue autoría, respaldo y distribución. Ninguna sociedad se presenta como avalista de la aplicación.

## Investigación y trazabilidad

- 19 fichas médicas y científicas, con autoría, año, publicación, DOI cuando existe, naturaleza del documento, acceso real, localizadores y límites.
- Los 15 documentos con DOI se contrastaron mediante metadatos de Crossref. Búsqueda complementaria en PubMed y OpenAlex; registros y validación en `investigacion/2026-11-06/revision-medica`.
- Se declara explícitamente cuándo solo se pudo verificar ficha/resumen. El consenso hemodinámico UIP2016 no se presenta como texto íntegramente revisado ni como calibración del simulador.
- El índice institucional UIP contenía un DOI erróneo para dúplex parte I. Se utiliza el identificador correcto: **10.1016/j.ejvs.2005.07.019**, comprobado por título y autores.
- No se copian PDFs ni figuras de guías al paquete público. Se enlazan los documentos primarios y las copias leídas con sus condiciones originales.
- Bibliografía descargable en texto Vancouver y BibTeX/BibLaTeX. ASA se conserva sin año confirmado; no se inventa una fecha. AIUM distingue revisión2024 de publicación2026. Las dos advertencias de metadatos restantes corresponden a paginación no informada en Crossref y a un artículo de publicación anticipada sin volumen consignado.

## Correcciones implementadas

| Área | Cambio |
| --- | --- |
| Bibliografía | Sección `/bibliografia`, visible en navegación principal, con búsqueda, grupos de prioridad, fichas, enlaces internos y descargas. |
| Lectura crítica | Seis temas: umbrales segmentarios, perforantes, CEAP y fotografía, nomenclatura ASV, límites térmicos y diferencia entre coherencia numérica y validación fisiológica. |
| DP10 | Segmentos enumerados para >0,5s y >1s; perforante patológica contextual en C2; discrepancia >0,35/>0,5s; postura, provocación y carácter estrictamente mayor. |
| Categorías de evidencia | La recomendación general de usar dúplex conserva su grado. Las definiciones y buenas prácticas no heredan ese grado automáticamente. |
| Anatomía | Fascia muscular para perforantes; ASV actual y AASV/AAGSV históricos; GS descrito como región/sitio proximal, sin prometer el ostium exacto en cada cine. |
| CEAP | C1 expresado con “o”; explicación de C4a/b/c; conservación de las etiquetas del banco y ausencia de reclasificación desde fotografías. |
| FleboVision | Dimensiones térmicas reales320×240 frente a RGB640×480; texto correcto sobre los valores°C incrustados y ausencia de calibración radiométrica validada por el visor. |
| DP01/05 | Eje como proyección v·cosθ; frecuencia y velocidad del sonido explícitas en la ecuación ideal. |
| DP06/PL15 | Envolvimiento calculado módulo PRF y límites de Nyquist; curvas original/aparente matemáticamente relacionadas. |
| DP09 | Se identifica el cine experimental renderizado y la ausencia de matrices y metadatos individuales de Acq0. No se le atribuyen mediciones temporales o de velocidad del visor. |
| Valvas | PL05 diferencia coaptación competente y hueco de fuga; AN01 muestra abertura compatible con tránsito; valvas3D con punto de cierre coherente. |
| Transporte3D | Marcadores ligados a integral, magnitud y signo del flujo de su rama; sin movimiento por flujo cero. Se retira una conexión extra sin ecuación y se representa la colateral con su flujo calculado. |
| Otros SVG | Fascia, orientación angular, referencias proximal/distal, fases conceptuales de bomba y distinción sección/volumen; objetos clínicos CEAP completos y referencia visible a bibliografía en descargas. |
| Recorridos | RC05 no se presenta como protocolo diagnóstico completo de TVP; RC06 no garantiza ostium GS; RC12 compara modalidades cualitativamente, sin matriz térmica o corregistro validados. |

## Verificaciones

- 40 pruebas: las34 comprobaciones previas del motor y seis pruebas de referencias, etiquetas, dimensiones, proyección, aliasing y transporte.
- Comprobación de referencias resolubles para33 términos,10 lecciones,12 recorridos,7 guías y24 medios originales. La literatura conceptual de FleboTwin acompaña al modelo con su alcance explícito.
- Integridad conservada:72 cines/72 participantes,12.830 cuadros indexados,96 fotografías/71 carpetas de caso y12 parejas térmicas.
- Bibliografía:19 entradas válidas, cero errores y cero duplicados; dos advertencias bibliográficas transparentes descritas arriba.
- Compilación TypeScript y construcción de producción. Revisión visual de bibliografía, criterios Doppler y medios corregidos, además de comprobación del sitio publicado.

La documentación detallada de las tres revisiones se encuentra en `sites/flebolab/docs/content/`:

- `REVISION_UIP_FLEBOLOGIA_2026-11-06.md`
- `REVISION_VASCULAR_Y_CONTROVERSIAS_2026-11-06.md`
- `AUDITORIA_AFIRMACIONES_Y_MEDIA_2026-11-06.md`

Esas matrices describen los hallazgos del corte anterior a la integración. La tabla de este informe registra las correcciones efectivamente integradas en0.9.1.

## Límites que siguen abiertos

1. Firma de revisión y aprobación por un comité médico independiente sobre la aplicación integrada y los casos seleccionados; esta auditoría documental no la sustituye.
2. Calibración espacial/ecográfica por región, espectros clínicos de reflujo y señal Waterloo cuantitativa antes de habilitar mediciones físicas.
3. Validación fisiológica de un modelo específico si en el futuro se pretende cuantificar función individual; el modelo actual conserva unidades relativas y finalidad educativa.
4. Pruebas docentes con médicos y dispositivos físicos representativos; ampliar diversidad del banco y situaciones clínicas documentadas.
5. Cotejo íntegro pendiente de documentos cuyo acceso quedó limitado a resumen, y vigilancia editorial de actualizaciones. La búsqueda es focalizada, no una revisión sistemática exhaustiva.

## Entrega pública

Sitio: https://flebolab-imf.ferver.chatgpt.site

Bibliografía: https://flebolab-imf.ferver.chatgpt.site/bibliografia

Repositorio: https://github.com/imf-hub/flebolab

La integración de0.9.1 se publica después de los controles locales y queda identificada por los commits registrados en el acta de publicación. DNS Hostinger continúa reservado para la fase posterior autorizada por el usuario.
