# Registro de contraste editorial

Fecha de contraste: 6 de noviembre de 2026. Este registro documenta las decisiones de contenido y la procedencia. No sustituye una revisión científica independiente del producto.

## Fuentes y uso específico

| Fuente primaria o institucional | Contenido que respalda | Condición de uso en esta entrega |
| --- | --- | --- |
| [Lurie et al., actualización CEAP 2020](https://pubmed.ncbi.nlm.nih.gov/32113854/), DOI 10.1016/j.jvsv.2019.12.075 | Estructura descriptiva por miembro, C4c y recurrencia | Texto editorial propio; no se importan figuras. Las guías no calculan CEAP desde una foto. |
| [SVS/AVF/AVLS, parte I](https://doi.org/10.1016/j.jvsv.2022.09.004) | Evaluación dúplex y criterios de flujo inverso por territorio | Referencia clínica. Los umbrales se contrastaron además con la guía ASA accesible. |
| [ESVS 2022](https://esvs.org/wp-content/uploads/2023/03/ESVS-2022-CVD-Guidelines.pdf) | Mecanismos y evaluación de enfermedad venosa crónica | Marco clínico; no se trasladan recomendaciones de tratamiento a una fotografía. |
| [ASA, sección E: exploración e interpretación](https://www.sonographers.org/publicassets/f1c705f1-b557-f011-913e-0050568796d8/Section-E---Performing-and-interpreting-venous-insufficiency-ultrasound-examination.pdf) | Postura, maniobras, segmentos y duración espectral; sección E actualizada 17 de julio de 2025 | Criterios estrictos >1 s en femoral común, femoral y poplítea; >0,5 s en territorios indicados por la guía. No se mide duración con un color aislado. |
| [ASA, sección G: consideraciones técnicas](https://www.sonographers.org/publicassets/fbc705f1-b557-f011-913e-0050568796d8/Section-G---Technical-considerations.pdf) | Parámetros de adquisición y presentación | Se distingue calibración, cine y espectro. |
| [DICOM PS3.3, C.8.5.5](https://dicom.nema.org/medical/dicom/current/output/chtml/part03/sect_C.8.5.5.html) | Calibración de regiones ultrasónicas | Cada región mantiene sus unidades y deltas; FPS del cine no sustituye la escala horizontal de un espectro. |
| [Keijsers et al., modelo de bomba muscular](https://pmc.ncbi.nlm.nih.gov/articles/PMC4676919/), DOI 10.1002/cnm.2714 | Bomba, gravedad, válvulas y respuesta de pared | Referencia conceptual del modelo educativo. No se afirma equivalencia de validación del modelo propio con el artículo. |
| [Ferlito et al., 2026](https://pubmed.ncbi.nlm.nih.gov/42258676/), DOI 10.1109/TBME.2026.3701594 | Integración de bomba, válvulas, perforantes y compresión | Metadatos y resumen contrastados en PubMed; el texto completo IEEE no estuvo accesible con el lector web. No se afirma haber reutilizado código. |
| [Magee, 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC7807840/), DOI 10.1016/j.bjae.2020.01.003 | Ecuación Doppler ideal y muestreo pulsado | Gráficos sintéticos originales con supuestos explícitos. |
| [TRICVI–C v2](https://data.mendeley.com/datasets/rf5m97cmm3/2) | RGB, termografía y etiquetas clínicas aportadas por los autores | CC BY 4.0; identidad de caso y vistas se preservan. Las afirmaciones sobre sujetos concretos dependen del catálogo importado, no de este módulo. |
| [ThrombUS+ training](https://zenodo.org/records/17659415) | Cines de compresión, etiquetas y sitios CFV/GS/FV/PV | Referencia de adquisición; no constituye protocolo completo de reflujo ni banco representativo de prevalencias. |
| [UW-FemVein RF](https://github.com/open-h/Open-H-RF/blob/main/datasets/waterloo-femoralvein/README.md) | Femoral longitudinal bajo contracción e inclinación; campos de velocidad | CC BY 4.0 según README conservado en `investigacion/2026-11-05/evidencias/femoral-readme.txt`. DP09 requiere el extracto experimental importado. |
| [BodyParts3D, licencia original vigente](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html) | Anatomía de contexto y atribución | Página de licencia actualizada 27 de febrero de 2025: CC BY 4.0. La geometría no se convierte en modelo funcional por sí sola. |
| [Servier Medical Art, condiciones](https://smart.servier.com/using-smart-images-what-you-can-do/) | Ilustración complementaria | CC BY 4.0 con atribución; las 18 láminas de esta entrega son originales y no contienen imágenes Servier. |
| [NIH BioArt, condiciones](https://bioart.niaid.nih.gov/terms) | Ilustración complementaria | Revisar crédito de la entrada concreta; ninguna figura de NIH se importó en esta entrega. |
| [svZeroDSolver](https://github.com/SimVascular/svZeroDSolver) | Redes de parámetros concentrados y bloques de cálculo | BSD-3-Clause identificada en el repositorio; se cita como referencia, sin incluir su código en los diagramas. |

## Decisiones que debe conservar la interfaz

1. Mostrar la naturaleza de cada pieza: ilustración, experimento o adquisición clínica real.
2. Conservar el rótulo de origen separado de las observaciones docentes. No completar E/A/P de CEAP desde la apariencia.
3. No enlazar como un mismo paciente datos de bancos diferentes.
4. Conservar segmento, lado, maniobra y unidades cuando estén disponibles; informar cuando falten.
5. El control de paleta, ángulo o escala de una demostración no modifica retrospectivamente los datos de un cine real.
6. Mantener el carácter genérico del circuito y sus conexiones. Una colateral solo participa si está implementada en la red.

## Verificación realizada

- `python scripts/content/check_educational.py`: sin referencias huérfanas, destinos desconocidos, IDs duplicados, controles fuera de rango ni SVG mal formados.
- `node scripts/content/check_layout.cjs`: los 24 SVG se renderizaron en Chrome; no se detectó texto fuera del lienzo y los elementos animados se ocultaron en la prueba de documentos SVG con preferencia de movimiento reducido.
- Se inspeccionó la hoja de contacto `verification/contact-sheet.png`. La prueba de movimiento reducido corresponde al SVG abierto como documento; la integración final debe comprobar también el comportamiento del visor que lo incorpore.

Pendiente de la versión pública: revisión médica independiente de los casos importados, curvas implementadas y mensajes de la interfaz final.
