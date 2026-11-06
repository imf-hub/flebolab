# Revisión vascular, sonográfica y controversias

Fecha: 6 de noviembre de 2026. Alcance: las diez lecciones DP01–DP10 y las siete guías C0–C6 de `src/data/educational.ts`; se señalan además tres recorridos relacionados. Esta auditoría documental propone correcciones; no modifica la aplicación ni interpreta nuevamente los casos. El archivo leído tenía SHA-256 `61BDC054D5CDE6426426D8FD6541D51879AB1FED9B6A5A93939E54FCE06290F5`. Los números de línea pertenecen a esa versión.

## Dictamen y prioridad de fuentes

El contenido es generalmente prudente: separa ilustraciones, datos experimentales y adquisiciones clínicas; no calcula CEAP ni diagnósticos desde fotografías. Las principales mejoras son precisar los grupos de segmentos en DP10, explicar tres usos distintos de «compresión», acotar la única previsualización Waterloo y registrar mejor las limitaciones de las parejas térmicas.

La prioridad editorial solicitada es: **1) UIP y sociedades de flebología; 2) sociedades vasculares/angiología; 3) sonografía, estándares técnicos y otras especialidades.** Esta prioridad institucional no equivale a certeza de evidencia. Un documento de consenso puede ser muy pertinente sin tener evidencia alta; una norma DICOM define codificación, no eficacia clínica. La guía SVS/AVF/AVLS parte I cuenta además con aval de UIP, hecho que debe mencionarse sin convertirlo en aval de la aplicación. [Índice oficial UIP](https://www.uip-phlebology.org/committees/consensus-guidelines), [parte I](https://doi.org/10.1016/j.jvsv.2022.09.004).

Se entregan los siete registros secundarios solicitados en `src/data/clinical-vascular.json`. `year` corresponde al volumen bibliográfico: SVS «2022» se publicó en volumen de 2023; SVS «2023» en volumen de 2024. ASA queda con año `null`: no fue posible confirmar en el texto visible la fecha editorial que el contenido actual presenta como 2025.

## Hallazgos que requieren precisión

### T1. Duración de flujo inverso: conservar segmentos y contexto

La separación que debe mostrar DP10 procede de las definiciones operativas de SVS/AVF/AVLS, reproducidas en la parte II, 1.3.1–1.3.3, PDF páginas2 y10:

| Territorio identificado | Criterio temporal de esa fuente |
| --- | --- |
| Troncos superficiales: safena magna, menor y accesorios nombrados por la guía | >0.5s |
| Tibiales y femoral profunda/profunda femoris | >0.5s |
| Femoral común, femoral y poplítea | >1s |
| Perforantes | >0.5s de flujo hacia fuera; no confundir con la definición contextual de perforante patológica enC2, que añade diámetro>3.5mm |

Son desigualdades estrictas. **«Profundo» no es sinónimo de «umbral de1s»**: femoral profunda y tibiales pertenecen al primer grupo temporal. No trasladar el umbral a una curva sintética como decisión clínica. [SVS/AVF/AVLS, texto primario completo alojado por sociedad suiza de flebología](https://www.phlebology.ch/upload/pdf/dokumente/AVLS%20guidelines%2020230.pdf).

El consenso UIP de 2006 usa un corte general y reconoce que no existía un límite único acordado para todos los segmentos: no atribuirle retrospectivamente la tabla segmentaria moderna. ESVS 2022, sección2.3.1, impresa198/PDF16, reconoce la variación0.35/0.5s en perforantes. La duración está influida por la maniobra y no constituye por sí sola una escala de gravedad ni una indicación de intervención. [UIP, pp85–86 y90](https://www.strteknikk.no/venopulse/Coleridge_Smith%2006%20Duplex%20Consensus%20I.pdf), [ESVS 2022](https://findresearcher.sdu.dk/ws/files/206201181/1_s2.0_S1078588421009795_main.pdf).

### T2. Postura y tres significados de compresión

| Término | Qué documentar en el material docente |
| --- | --- |
| Compresión del transductor | Prueba de deformación/coaptación en el segmento observado; imagen transversal antes y durante la maniobra. |
| Compresión distal y liberación/aumentación | Provocación de flujo y posible reflujo, acompañada de espectro y localización. No es la misma presión local ejercida sobre el vaso que se está observando. |
| Compresión terapéutica | Medias, vendajes u otros sistemas y su contexto terapéutico; no se aprende su indicación o dosis observando un clip de compresibilidad. |

Para reflujo, las fuentes priorizan bipedestación cuando es posible; admiten alternativas cuando no es factible o seguro. La maniobra depende del sitio: Valsalva o aumentación en femoral común/unión safenofemoral; provocación distal en segmentos más distales. La condición de un clip no debe rellenarse si falta. [UIP, pp85–86](https://www.strteknikk.no/venopulse/Coleridge_Smith%2006%20Duplex%20Consensus%20I.pdf), [SVS1.4.1–1.4.5](https://www.phlebology.ch/upload/pdf/dokumente/AVLS%20guidelines%2020230.pdf), [ASA secciónG, G2–G3, PDF2–3](https://www.sonographers.org/publicassets/fbc705f1-b557-f011-913e-0050568796d8/Section-G---Technical-considerations.pdf).

### T3. Alcance de TVP y de las etiquetas

Las recomendaciones1–3 de ESVS 2021, impresa18/PDF10, sitúan la ecografía en una vía diagnóstica que considera probabilidad previa; todas son claseI/nivelC. La sección2.2.1.3 distingue estudios limitados y de toda la pierna. Por tanto, un segmento compresible del catálogo no excluye TVP en territorios no mostrados; la etiqueta del proveedor tampoco es un diagnóstico emitido por FLEBOLAB. Esta última conclusión es una aplicación editorial al alcance de nuestros datos. [ESVS 2021, artículo íntegro74p, reproducción pública](https://www.veinhealth.com.au/wp-content/uploads/2025/02/Venous-thrombosis-guidelines-2021-1.pdf).

AIUM eIAC detallan la extensión/documentación de una exploración clínica. Sus requisitos no convierten cuatro sitios seleccionados de ThrombUS+ en un estudio completo. Una fotografía aporta apariencia superficial, sin demostrar permeabilidad ni competencia. [AIUM, revisión 2024 publicada 2026](https://www.aium.org/resources/practice-parameters/peripheral-venous), [IAC 2026, 4.7.1B–4.7.2B](https://intersocietal.org/wp-content/uploads/2026/08/IACVascularTestingStandardsAug2026.pdf).

## Auditoría de todas las lecciones Doppler

«Conservar» significa coherencia documental del texto, no validación del simulador ni de una adquisición individual. Las propuestas son instrucciones editoriales propias para esta aplicación.

| Lección / líneas | Resultado y corrección concreta | Localizador de contraste |
| --- | --- | --- |
| DP01 /524–558 | Conservar. Definir junto a la ecuación las magnitudes, sus unidades y que `c` es velocidad de propagación asumida; la dirección respecto al haz se traduce después a anatomía. | Física de Magee, pp112–113; UIP pp85–86. |
| DP02 /561–593 | Conservar. Mantener siempre la leyenda; la paleta no identifica arteria/vena. Atribuir también a UIP la convención histórica, sin hacerla universal. | UIP p85; ASA secciónF, PDF4–5. |
| DP03 /596–628 | Conservar con matiz: añadir «la línea base redistribuye la ventana de presentación; no aumenta por sí sola la banda de muestreo». | Magee, pp112–113; ASA F, PDF5. |
| DP04 /631–663 | Conservar. Aclarar que la calibración pertenece a la región y transformación geométrica concretas; conocer el tamaño del vídeo no basta. | DICOM C.8.5.5, tablaC.8-17 y atributos de unidades/deltas. |
| DP05 /666–709 | Añadir que el recorrido hasta89° es una demostración del coseno, no un rango recomendado de adquisición. Distinguir ángulo favorable de insonación de corrección angular para calcular velocidad. No exigir corrección angular para cronometrar reflujo. | UIP p86; ASA E4, PDF5. |
| DP06 /712–746 | Conservar. Rotular claramente Hz: PRF/2 es límite de frecuencia Doppler en el esquema ideal; no una velocidad universal sin frecuencia transmitida/ángulo. | Magee, pp112–113. |
| DP07 /749–781 | Añadir dos relojes: tiempo entre cuadros del cine y eje temporal de la región espectral. `FrameTime` no calibra automáticamente el ancho de un trazado impreso dentro del cuadro. | DICOM C.7.6.5 yC.8.5.5. |
| DP08 /784–817 | Conservar la presentación sintética. Reforzar que una pérdida de fasicidad es una observación que motiva contexto, no una identificación inequívoca de causa proximal. | IAC 2026 4.7.1.2B; ASA E, PDF4. |
| DP09 /820–853 | **Corregir el alcance del recurso real:** hay una previsualización renderizada Acq0, sin metadatos individuales importados ni matrices cuantitativas. Pedir «consulta los datos disponibles» en vez de presuponer participante/condición individual conocidos. Distinguir tiempo GIF/MP4 de tiempo fisiológico y vectores estimados de datos numéricos. | `src/data/waterloo.json`: `quantitativeDataAvailable:false`, `acquisitionFrameRateHz:null`, `arraysImported:false`; README fijado al commit de la ficha. |
| DP10 /856–888 | **Sustituir «otros segmentos» por referencia explícita aT1**. El control llamado `deep` no debe sugerir que todas las venas profundas comparten umbral. Añadir postura, provocación, espectro y criterio usado; no graduar gravedad por duración. | SVS1.3.x/1.4.x; ESVS2.3.1; ASA E5. |

Para DP09 se cotejó el manifiesto local con el recurso de origen fijado por el proyecto; la verificación individual del protocolo Acq0 sigue ausente en esa selección. El enlace raw no respondió en este lector, por lo que esta auditoría no afirma haber revalidado toda la cadena de datos RF. [Repositorio de origen fijado](https://github.com/open-h/Open-H-RF/blob/5eae31257f55391129c5aadb178659948448da5d/datasets/waterloo-femoralvein/README.md).

## Auditoría de todas las guías de observación

CEAP es una clasificación descriptiva por miembro, no un clasificador de fotografías ni una puntuación automática de resultados. Conservar la diferencia entre rótulo de origen y observación. Una carpeta que muestra ambos miembros no documenta necesariamente la clase de ambos. No añadir lateralidad, síntomas, recurrencia niE/A/P ausentes. [CEAP 2020, pp343 y346–347, tablaIII](https://www.angiolife.com.ua/media/pages/files/CEAP%202020.pdf).

| Guía / líneas | Dictamen y precisión propuesta |
| --- | --- |
| C0 /1308–1319 | Conservar: ya aclara que una fotografía no sustituye síntomas ni palpación. Mantener «según origen» para no afirmar que el visor comprobó ausencia de signos palpables. |
| C1 /1322–1331 | Conservar la prohibición de inferir síntomas, diámetro o reflujo desde píxeles. No reclasificar un patrón maleolar como subclase específica sin documentación. |
| C2 /1334–1343 | Conservar. La prominencia aparente no verifica calibre físico; recurrencia necesita historia. |
| C3 /1346–1357 | Conservar: la fotografía sola no confirma edema ni etiología. Describir contorno aparente, sin convertirlo en un resultado diagnóstico. |
| C4 /1360–1371 | Conservar la limitación de subclase. Si se explican C4a/b/c, enlazar la tabla de clasificación; no reasignarlas a los archivos genéricosC4. |
| C5 /1374–1385 | Conservar: se necesita historia de úlcera previa y atribución venosa, no solo una cicatriz. |
| C6 /1388–1399 | Conservar: una imagen no establece por sí sola etiología ni toda la evaluación de una herida. No añadir recurrencia desde apariencia. |

No se encontraron afirmaciones diagnósticas nuevas que deban eliminarse en estas siete guías. Las precisiones globales anteriores reducen una posible lectura excesiva de sus títulos.

## Recorridos relacionados y termografía

- **RC05,1066–1067:** ampliar su límite final: además de no ser protocolo completo de reflujo, el clip no es una exploración diagnóstica completa de TVP. Nombrar compresión del transductor para evitar confusión terapéutica; remitir aT2–T3.
- **RC06,1085–1086:** cambiar «GS como sitio de unión» por «sitioGS descrito por el proveedor, cerca de la relación safena magna–femoral común». La etiqueta de sitio no garantiza que todos los cuadros muestren exactamente la unión.
- **RC12,1276–1298:** no prometer una matriz térmica operativa en el visor. Las parejas importadas se relacionan por carpeta y nombre de archivo, con calibración térmica `null`: no se verificó registro geométrico, sincronía ni temperatura por píxel. Expresar comparación cualitativa y conservar escala/paleta original. Una zona más cálida no recibe automáticamente etiología, claseCEAP o diagnóstico deTVP/reflujo. Es una limitación de esta selección y su validación, no una conclusión universal sobre toda termografía médica. [TRICVI–C v2, depósito original](https://data.mendeley.com/datasets/rf5m97cmm3/2).

## Cómo representar la fuerza del respaldo

| Fuente / afirmación | Cómo registrarla |
| --- | --- |
| UIP 2006 | Consenso experto metodológico; no etiquetar cada frase como GRADE1A. |
| SVS parteII1.2.1 | Recomendación1/fuerte y calidadB/moderada. |
| SVS1.3.x y1.4.x | Definiciones operativas y buenas prácticas respectivamente, sin convertirlas en el grado de1.2.1. |
| ESVS 2022 recomendación3 | ClaseI, nivelB. El sistema separa clase de recomendación y nivel de evidencia. |
| ASA E5 / G2–G3 | Categorías propias: evidencia moderada, fuerza fuerte y consenso alto; conservar los nombres originales de sus columnas. |
| AIUM / IAC / DICOM | Parámetro de práctica / acreditación / codificación técnica. No asignarles grados terapéuticos inventados. |

## Actualización 2024–2026 y acceso

Se localizaron ASA en su versión pública vigente, AIUM revisión 2024 publicada en 2026, IAC de3agosto 2026 y SCAI 2025. La guía SCAI se centra en preguntas terapéuticas con GRADE y revisión técnica; su año más reciente no autoriza sustituir automáticamente los criterios docentes deT1. [SCAI, anuncio oficial](https://www.scai.org/media-center/news-and-articles/scai-clinical-document-provides-clinical-practice-guidelines), [texto primario15p](https://www.angiolife.com.ua/media/pages/files/2026/2025-SCAI-Clinical-Practice-Guidelines-for-the-Man.pdf).

ESVS 2022 anunció intención de revisión en 2026. En la búsqueda dirigida y catálogo oficial consultados no se verificó una edición integral sustitutiva que justificara modificar aquí los umbrales. Esto describe el resultado de la búsqueda, sin afirmar ausencia global de publicaciones nuevas. [Catálogo ESVS](https://esvs.org/guidelines/), [catálogo SVS](https://vascular.org/vascular-specialists/practice-and-quality/clinical-guidelines/clinical-guidelines-and-reporting).

Los enlaces antiguos ESVS de la aplicación redirigieron a login. Se ofrecen DOI estables y copias completas identificadas. El índice UIP enlaza «PartI» a `10.1016/j.ejvs.2005.05.007`, que no corresponde al consenso; utilizar `10.1016/j.ejvs.2005.07.019`, cotejado con PMID16226898. Alojar un PDF en otro dominio no cambia su autoría, pero debe declararse como reproducción, no como portal oficial. No se importan figuras de estas publicaciones.

## Bibliografía y localización verificables

1. **UIP / consenso primario.** Coleridge-Smith P, Labropoulos N, Partsch H, Myers K, Nicolaides A, Cavezzi A. Duplex ultrasound investigation of the veins in chronic venous disease of the lower limbs—UIP consensus document. Part I. Basic principles. *Eur J Vasc Endovasc Surg.*2006;31(1):83–92. DOI:[10.1016/j.ejvs.2005.07.019](https://doi.org/10.1016/j.ejvs.2005.07.019). PMID:[16226898](https://pubmed.ncbi.nlm.nih.gov/16226898/). [Artículo íntegro10p, espejo no oficial](https://www.strteknikk.no/venopulse/Coleridge_Smith%2006%20Duplex%20Consensus%20I.pdf). Localización: impresas85–86 y90, PDF3–4 y8.
2. **Clasificación AVF.** Lurie F, Passman M, Meisner M, Dalsing M, Masuda E, Welch H, et al. The 2020 update of the CEAP classification system and reporting standards. *J Vasc Surg Venous Lymphat Disord.*2020;8(3):342–352. DOI:[10.1016/j.jvsv.2019.12.075](https://doi.org/10.1016/j.jvsv.2019.12.075). PMID:[32113854](https://pubmed.ncbi.nlm.nih.gov/32113854/). [Artículo íntegro11p, reproducción no institucional](https://www.angiolife.com.ua/media/pages/files/CEAP%202020.pdf). Localización: impresas343,346–347; tablaIII.
3. **SVS 2022/parteI.** Gloviczki P, Lawrence PF, Wasan SM, Meissner MH, Almeida J, Brown KR, et al. The 2022 Society for Vascular Surgery, American Venous Forum, and American Vein and Lymphatic Society clinical practice guidelines for the management of varicose veins of the lower extremities. PartI. Duplex scanning and treatment of superficial truncal reflux. *J Vasc Surg Venous Lymphat Disord.*2023;11(2):231–261.e6. DOI:[10.1016/j.jvsv.2022.09.004](https://doi.org/10.1016/j.jvsv.2022.09.004). [PDF de sociedad vascular francesa, apertura con timeout](https://www.portailvasculaire.fr/sites/default/files/docs/2022_svs_avf_avls_reflux_tronculaire_diagnostic_traitement_part1_jvsvld.pdf). Criterios cotejados además en la reproducción íntegra de parteII.
4. **SVS 2023/parteII.** Gloviczki P, Lawrence PF, Wasan SM, Meissner MH, Almeida J, Brown KR, et al. The 2023 Society for Vascular Surgery, American Venous Forum, and American Vein and Lymphatic Society clinical practice guidelines for the management of varicose veins of the lower extremities. PartII. *J Vasc Surg Venous Lymphat Disord.*2024;12(1):101670. DOI:[10.1016/j.jvsv.2023.08.011](https://doi.org/10.1016/j.jvsv.2023.08.011). PMID:[37652254](https://pubmed.ncbi.nlm.nih.gov/37652254/). [PDF íntegro67p alojado por sociedad de flebología](https://www.phlebology.ch/upload/pdf/dokumente/AVLS%20guidelines%2020230.pdf). Localización: PDF2 y10, apartados1.1–1.4.
5. **ESVS 2022.** De Maeseneer MG, Kakkos SK, Aherne T, Baekgaard N, Black S, Blomgren L, et al. European Society for Vascular Surgery 2022 Clinical Practice Guidelines on the Management of Chronic Venous Disease of the Lower Limbs. *Eur J Vasc Endovasc Surg.*2022;63(2):184–267. DOI:[10.1016/j.ejvs.2021.12.024](https://doi.org/10.1016/j.ejvs.2021.12.024). [Versión publicada íntegra, depósito institucional SDU](https://findresearcher.sdu.dk/ws/files/206201181/1_s2.0_S1078588421009795_main.pdf). Localización: impresas190,192,198–199; PDF9,10,16–17.
6. **ESVS trombosis.** Kakkos SK, Gohel M, Baekgaard N, Bauersachs R, Bellmunt-Montoya S, Black SA, et al. European Society for Vascular Surgery 2021 Clinical Practice Guidelines on the Management of Venous Thrombosis. *Eur J Vasc Endovasc Surg.*2021;61(1):9–82. DOI:[10.1016/j.ejvs.2020.09.023](https://doi.org/10.1016/j.ejvs.2020.09.023). PMID:[33334670](https://pubmed.ncbi.nlm.nih.gov/33334670/). [Texto íntegro74p, reproducción clínica no institucional](https://www.veinhealth.com.au/wp-content/uploads/2025/02/Venous-thrombosis-guidelines-2021-1.pdf). Localización: impresas16–18, PDF8–10; sección2.2.1 y recomendaciones1–3.
7. **ASA.** Australasian Sonographers Association. *Duplex ultrasound examination of the lower limb for chronic venous disease: evidence-based guideline for sonographers.* Recurso web, s.f.; consultado6noviembre 2026. [Portal oficial](https://www.sonographers.org/resources/clinical-resources/cvi-guideline). Secciones completas:[E21p](https://www.sonographers.org/publicassets/f1c705f1-b557-f011-913e-0050568796d8/Section-E---Performing-and-interpreting-venous-insufficiency-ultrasound-examination.pdf), [F11p](https://www.sonographers.org/publicassets/f6c705f1-b557-f011-913e-0050568796d8/Section-F---General-considerations.pdf), [G4p](https://www.sonographers.org/publicassets/fbc705f1-b557-f011-913e-0050568796d8/Section-G---Technical-considerations.pdf). E3–E5, F instrumentación, G2–G3.
8. **AIUM vigente.** American Institute of Ultrasound in Medicine. AIUM Practice Parameter for the Performance of a Peripheral Venous Ultrasound Examination,2024 Revision. *J Ultrasound Med.*2026;45(1):E1–E9. DOI:[10.1002/jum.70049](https://doi.org/10.1002/jum.70049). PMID:[40955146](https://pubmed.ncbi.nlm.nih.gov/40955146/). [Registro oficial](https://www.aium.org/resources/practice-parameters/peripheral-venous). Publicación online16septiembre 2025; texto editorial indexado consultado; apertura automatizada del editor403. Localizadores: Specification of the Examination, Lower Extremity, Technique/Recording/Interpretation.
9. **IAC vigente.** Intersocietal Accreditation Commission. *IAC Standards and Guidelines for Vascular Testing Accreditation.* Publicado3agosto 2026. [PDF oficial íntegro65p](https://intersocietal.org/wp-content/uploads/2026/08/IACVascularTestingStandardsAug2026.pdf), [página oficial de versiones](https://intersocietal.org/programs/vascular-testing/standards/). Secciones3.8A y4.7.1B–4.7.2B. No DOI.
10. **DICOM.** DICOM Standards Committee/NEMA. *PS3.3 Information Object Definitions*, edición visible 2026d. [C.7.6.5 Cine Module](https://dicom.nema.org/medical/dicom/current/output/chtml/part03/sect_C.7.6.5.html), tablaC.7-13; [C.8.5.5 US Region Calibration Module](https://dicom.nema.org/medical/dicom/current/output/chtml/part03/sect_C.8.5.5.html), tablaC.8-17. Texto normativo completo oficial; consulta6noviembre 2026.
11. **Física complementaria.** Magee P. Essential notes on the physics of Doppler ultrasound. *BJA Educ.*2020;20(4):112–113. DOI:[10.1016/j.bjae.2020.01.003](https://doi.org/10.1016/j.bjae.2020.01.003). PMID:[33456938](https://pubmed.ncbi.nlm.nih.gov/33456938/), [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC7807840/). Artículo docente de física; no guía clínica flebológica ni fuente de umbrales por territorio.
12. **SCAI 2025, complemento terapéutico.** Attaran RR, Edwards ML, Arena FJ, Bunte MC, Carr JG, Castro-Dominguez Y, et al.2025 SCAI Clinical Practice Guidelines for the Management of Chronic Venous Disease. *J Soc Cardiovasc Angiogr Interv.*2025;4(8):103729. DOI:[10.1016/j.jscai.2025.103729](https://doi.org/10.1016/j.jscai.2025.103729). [Anuncio institucional](https://www.scai.org/media-center/news-and-articles/scai-clinical-document-provides-clinical-practice-guidelines), [texto primario completo15p, reproducción](https://www.angiolife.com.ua/media/pages/files/2026/2025-SCAI-Clinical-Practice-Guidelines-for-the-Man.pdf). Métodos GRADE, recomendaciones y discusión; no sustituye por prioridad institucional las fuentes UIP/flebología.
13. **Datos térmicos/fotográficos.** Ruiz J, Gomez-Gil P, Renero F. Thermal and RGB Images of Chronic Venous Insufficiency–CEAP: TRICVI–C. Mendeley Data;2026. Version2. DOI:[10.17632/rf5m97cmm3.2](https://data.mendeley.com/datasets/rf5m97cmm3/2). Registro y protocolo de adquisición; datos de origen, sin grado de recomendación clínica.

La investigación fue documental y focalizada; no constituye una revisión sistemática exhaustiva ni una aprobación clínica independiente de las simulaciones, fotografías o cines seleccionados.
