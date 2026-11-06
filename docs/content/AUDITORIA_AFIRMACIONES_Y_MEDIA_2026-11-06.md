# Auditoría de afirmaciones y medios de FLEBO LAB IMF

**Fecha:** 6 de noviembre de 2026. **Naturaleza:** contraste documental y revisión técnica/editorial de la copia de trabajo. **No constituye aprobación médica independiente, validación clínica ni certificación de los casos.**

## Resultado y alcance

La separación entre anatomía de referencia, modelo educativo, adquisición clínica y renderizado experimental está bien planteada. Las advertencias sobre C3, C5, reflujo y calibración evitan varias inferencias indebidas. Sin embargo, algunos dibujos y comportamientos visuales contradicen el mensaje que pretenden enseñar: destacan las valvas permanentemente en contacto mientras una partícula las atraviesa, la comparación gráfica de competencia/fuga y el trazo de aliasing dibujado sin correspondencia matemática con su señal original.

Se revisaron las 32 entradas de glosario, diez lecciones Doppler, doce recorridos, siete guías C0–C6 y metadatos de 18 láminas y seis animaciones en `src/data/educational.ts`; el texto y geometría SVG de las 24 piezas; su hoja de contacto; y los textos/cálculos visuales de `Scene.tsx`, `Twin.tsx`, `Vision.tsx`, `Dus.tsx`, `Doppler.tsx` y `Library.tsx`. Se consultaron también los metadatos de `vision.json`, `dus.json`, `assets.json`, `waterloo.json` y los escenarios de `model.ts` para comprobar lo que la interfaz afirma representar.

En los medios derivados se verificaron las dimensiones de las doce parejas térmicas y se inspeccionaron ejemplos RGB C3/C5, una térmica con valores incrustados y el renderizado Waterloo. No se hizo una lectura médica de los 72 cines completos, de los 12.830 cuadros ni de cada fotografía. Tampoco se revalidaron las etiquetas clínicas del proveedor. Las láminas se inspeccionaron estáticamente y se leyó el mecanismo de sus animaciones; esta auditoría no reemplaza su revisión dinámica en la web final.

Este documento registra **hallazgos del corte inspeccionado**, no correcciones ejecutadas. La aplicación se desarrolla en paralelo y las líneas pueden desplazarse. Solo se escribió este informe; no se modificaron la aplicación, los medios ni Git.

### Prioridad utilizada

- **P1:** corregir antes de presentar la pieza como explicación profesional del mecanismo: existe una contradicción visual o de correspondencia con los datos.
- **P2:** precisión anatómica, metrológica o editorial necesaria para reducir interpretaciones erróneas.
- **Conservar:** el límite o la afirmación está adecuadamente acotado en el corte revisado.

## Fuentes cotejadas y localizadores

Se buscó primero documentación UIP/WUIP; después sociedades de flebología y guías vasculares, y fuentes técnicas para física/calibración. Se cita el documento primario aunque algunas copias completas se alojan en otro servidor. La disponibilidad del texto se distingue de un registro bibliográfico.

| ID | Fuente y enlace | Localizador y alcance de consulta |
|---|---|---|
| R01 | [WUIP: archivo oficial de consensos](https://www.uip-phlebology.org/committees/consensus-guidelines) | Índice oficial: nomenclatura 2002, dúplex partes I/II 2006, C3 2012 y hemodinámica 2016. El índice acredita procedencia; no sustituye el texto del consenso. Varios enlaces del editor devolvieron 403 o redirecciones no accesibles. |
| R02 | Cavezzi et al. **UIP, Part II: Anatomy**, EJVES 2006;31:288–299, [DOI](https://doi.org/10.1016/j.ejvs.2005.07.020), [texto completo cotejado](https://www.strteknikk.no/venopulse/Cavezzi%2006%20Duplex%20Consensus%20II.pdf) | Pp. **290–291**: compartimento safeno y tributarias; **291–293**: safenas/uniones y Fig. 5; **297**: perforantes atravesando fascia muscular. PDF pp. 3–6 y 10. Es un consenso UIP primario; la copia accesible se aloja fuera de UIP. También se localizó [copia universitaria](https://unicampus.iris.pri.cineca.it/retrieve/8f540262-76a8-4493-9abb-c549b1e29c50/Cavezzi_Duplex_2006.pdf), cuya descarga con el lector web no terminó. |
| R03 | Cornu-Thénard et al. **UIP 2011 C3 consensus**, Int Angiol 2012;31:414–419, [registro primario](https://pubmed.ncbi.nlm.nih.gov/22990502/) | Se verificaron título, autores y paginación; el texto del editor estuvo bloqueado. **No se atribuye una página puntual ni una conclusión nueva al texto completo no recuperado.** Para el criterio operativo C3 se emplean R04 y R06. |
| R04 | Lurie et al. **CEAP 2020**, JVSV 2020;8:342–352, [DOI](https://doi.org/10.1016/j.jvsv.2019.12.075), [texto completo cotejado](https://www.angiolife.com.ua/media/pages/files/CEAP%202020.pdf) | Pp. **343–344**: clasificación descriptiva y límites; **347, tabla III**: clases clínicas; **349, tabla V**, anatomía; **350, tabla VI**, fisiopatología. PDF pp. 2–3, 6, 8–9. El artículo primario fue consultado en copia pública; no se importaron figuras. |
| R05 | **SVS/AVF/AVLS 2023, Part II**, [texto primario abierto](https://pmc.ncbi.nlm.nih.gov/articles/PMC11523430/) | **Implementation remarks 1.3.1–1.3.4** y buenas prácticas **1.4.1–1.4.5**. Localizador HTML estable por número de recomendación; no se inventa página PDF. Se cotejó el texto indexado; la apertura directa alternó con una comprobación de navegador. Reitera los criterios de la [parte I de 2022](https://doi.org/10.1016/j.jvsv.2022.09.004). |
| R06 | **ESVS 2022 CVD**, [DOI](https://doi.org/10.1016/j.ejvs.2021.12.024), [PDF en Société Française de Phlébologie](https://www.sf-phlebologie.org/wp-content/uploads/2022/04/ESVS-2022-CVD-guidelines.pdf) | Pp. **194–195**, §1.2, anatomía; **195–196**, §1.3, mecanismos; **196**, signos; **198**, §2.3.1, dúplex y controversia de criterios perforantes. PDF pp. 11–15. El enlace ESVS incluido actualmente en la aplicación redirigió a login; la copia de la sociedad francesa sí abrió. |
| R07 | **ASA, Section C: Venous anatomy**, [PDF oficial](https://www.sonographers.org/publicassets/e6c705f1-b557-f011-913e-0050568796d8/Section-C---Venous-anatomy-of-the-lower-limb.pdf) | P. **1**: fascia muscular y compartimentos; pp. **2–3**: venas profundas, safenas y nomenclatura; p. **5**: unión safenofemoral. Complementa el consenso UIP; no sustituye la identificación individual por dúplex. |
| R08 | **ASA, Section E**, actualizada 17-07-2025, [PDF oficial](https://www.sonographers.org/publicassets/f1c705f1-b557-f011-913e-0050568796d8/Section-E---Performing-and-interpreting-venous-insufficiency-ultrasound-examination.pdf) | P. **2**: información de B-mode y compresibilidad; p. **5**, recomendación **E5**, umbrales por segmento; tablas de evaluación segmentaria siguientes. |
| R09 | **ASA, Section G: Technical considerations**, [PDF oficial](https://www.sonographers.org/publicassets/fbc705f1-b557-f011-913e-0050568796d8/Section-G---Technical-considerations.pdf) | P. **2**, postura; pp. **3–4**, recomendación **G3**, maniobras y variabilidad de su respuesta. |
| R10 | **DICOM PS3.3 2026d, C.8.5.5**, [estándar oficial](https://dicom.nema.org/medical/dicom/current/output/chtml/part03/sect_C.8.5.5.html) | **Tabla C.8-17**, unidades/deltas y límites por región; §§C.8.5.5.1.14–17. Para duración de cuadros: [C.7.6.5, Cine Module](https://dicom.nema.org/medical/dicom/current/output/chtml/part03/sect_C.7.6.5.html). Estándar HTML: se usan secciones, no páginas. |
| R11 | Magee. **Essential notes on the physics of Doppler ultrasound**, BJA Education 2020;20:112–113, [artículo primario](https://pmc.ncbi.nlm.nih.gov/articles/PMC7807840/) | Pp. **112–113**: ecuación Doppler y proyección angular; p. **113**: muestreo/aliasing y espectro. Se cotejó el texto primario indexado. |
| R12 | Keijsers et al. **A 1D pulse wave propagation model…**, 2015, [texto primario del editor](https://onlinelibrary.wiley.com/doi/full/10.1002/cnm.2714) | **Fig. 1**, §§**2.3**, **2.4**, **2.7**, **3.3–3.4** y discusión. HTML, localizadores por sección. Referencia conceptual; sus resultados/validación no se transfieren al circuito de FLEBO LAB. |
| R13 | [TRICVI–C v2, ficha original](https://data.mendeley.com/datasets/rf5m97cmm3/2) y `investigacion/2026-11-05/evidencias/TRICVI_Protocolo_original.pdf` | Ficha: descripción y protocolo. PDF local original de **3 páginas**: p. **1**, preparación/ambiente; p. **2**, captura/equipo; p. **3**, ética y alcance del operador. Se extrajo su texto mediante el runtime PDF disponible. |
| R14 | [ThrombUS+, registro original](https://zenodo.org/records/17659415) | **Description**, párrafos de los cuatro sitios y reporte experto; **Columns**, `Anatomical Site`, `Compressibility`, `Thrombosis`. Fuente de etiquetas, no una segunda interpretación del equipo. |
| R15 | [UW-FemVeinRF, ficha fijada a commit](https://github.com/open-h/Open-H-RF/blob/5eae31257f55391129c5aadb178659948448da5d/datasets/waterloo-femoralvein/README.md) | Dataset Characterization, Dataset Format, Known Issues y [script de reconstrucción](https://github.com/open-h/Open-H-RF/blob/5eae31257f55391129c5aadb178659948448da5d/datasets/waterloo-femoralvein/reconstruct.py). Metadatos importados en `waterloo.json`; sin matrices RF/vectoriales. |
| R16 | [BodyParts3D: README original](https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/README_e.html), [catálogo ISA](https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/isa_parts_list_e.txt) y [correspondencia de mallas](https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/isa_element_parts.txt) | Modelo de referencia de varón adulto; identidades BP/FMA/FJ y estructuras realmente importadas. Son geometrías estáticas. |
| R17 | Ferlito et al., 2026, [registro PubMed](https://pubmed.ncbi.nlm.nih.gov/42258676/), [editor IEEE](https://doi.org/10.1109/TBME.2026.3701594) | Se cotejaron metadatos y **resumen** del modelo 1D. No se usó como prueba de haber reproducido su método, ni se asignó una página a ecuaciones no cotejadas del texto final. |

## Matriz de afirmaciones, evidencia y correcciones

Las ubicaciones de código son relativas a `sites/flebolab`. Los cambios propuestos describen el resultado editorial esperado; no son instrucciones clínicas para un paciente.

### Anatomía y correspondencia del modelo

| ID / prioridad | Afirmación o representación y ubicación | Contraste y fuente | Corrección o decisión |
|---|---|---|---|
| A01 · Conservar | G10/G11 safenas superficiales; G13/G14/G15 femoral común, femoral y poplítea profundas (`educational.ts:313–365`). | Correcto; R07, pp. 2–3. No se encontró «femoral superficial» como nombre de la vena en el contenido inspeccionado. | Conservar. Evitar que el color asignado a una capa se interprete como clasificación por sí mismo. |
| A02 · P2 | G09 «a través de los planos fasciales»; PL02 «Plano fascial». | La estructura que distingue la perforante es su paso por **fascia muscular**; R02 p. 297. El compartimento safeno requiere otra distinción fascial; R02 pp. 290–291. | Especificar «fascia muscular (profunda)». El dibujo de dos territorios sirve como esquema; no identifica una perforante concreta ni todo el compartimento safeno. |
| A03 · P2 | «Pierna izquierda · 12 estructuras» (`Scene.tsx`, pie de visor; conjunto BodyParts3D). | El conjunto contiene fémur y segmentos del muslo, además de pierna; R16 y manifest. | Preferir «Miembro inferior izquierdo · subconjunto de 12 estructuras». No insinuar pie, piel o anatomía exhaustiva. |
| A04 · P2 | GS se presenta como `segment: Unión safenofemoral` en `dus.json`; el glosario G12 dice prudentemente «sitio de adquisición cercano». | R14 sitúa GS en una adquisición safena proximal relacionada con CFV; no aporta una anotación del ostium para cada cuadro. | Mostrar «Región safenofemoral / sitio safeno proximal (GS)» y conservar `GS` original. La unión puede explicarse como contexto, sin certificar que cada clip la delimite. |
| A05 · Conservar | BodyParts3D y red funcional separados (`Twin.tsx:583–586`; `Library.tsx:395–400`). | R16: mallas de referencia; código: el circuito no usa esas geometrías para resolver flujo. | Conservar esta separación también en capturas/exportaciones. No dar nombres anatómicos a conexiones paramétricas solo por su proximidad visual a una malla. |
| A06 · P1 | `Scene.tsx:Tracer`: las conexiones reciben `s.flow`; la primera superficial recibe `s.superficialFlow`. La rapidez se fija con `t*0.13` y el signo; el trazador continúa con flujo cero. | Evidencia directa del código; `model.ts` dispone de flujo perforante distinto. R12 distingue los flujos por rama en Fig. 10. | Conectar cada trayecto a su flujo calculado, detenerlo cuando corresponda y declarar la rapidez como ilustrativa. Si una conexión solo es decorativa, retirar sus partículas o identificarla expresamente. No mostrar la dirección profunda como si fuera la perforante. |
| A07 · Conservar | «Una conexión genérica no representa todas las perforantes» y límites de colaterales (`model.ts`, TW07–TW10). | Adecuado: R02 p. 297 describe variabilidad; el circuito define sus propias ramas. | Conservar. No traducir el control «Conexión perforante» a cantidad, calibre o competencia de perforantes individuales. |

### Valvas, presión, retorno y bomba

| ID / prioridad | Afirmación o representación y ubicación | Contraste y fuente | Corrección o decisión |
|---|---|---|---|
| H01 · P1 | AN01: las dos curvas de valvas terminan permanentemente en el mismo punto central; la partícula cruza ese punto durante toda la animación (`an01.svg`). | Contradicción geométrica interna: se dibuja coaptación y paso simultáneo. R12 Fig. 1 distingue estados; R02 Fig. 5B, p. 293, muestra estados valvulares en adquisición. | Dibujar una abertura visible durante el paso y cierre sin tránsito inverso en la representación competente; o retirar la promesa de enseñar el estado valvular y conservar solo una flecha de sentido convencional. |
| H02 · P1 | PL05 «Competencia» frente a «Fuga representada»: ambas valvas terminan unidas en el eje; en la fuga solo se reduce su tamaño, separándolas de las paredes (`pl05.svg`). | El dibujo no representa un defecto de coaptación entre bordes libres; su reducción introduce una unión parietal visualmente incoherente. | Redibujar bordes libres separados en la configuración de fuga, manteniendo inserción parietal; diferenciar abierto/cerrado de competente/incompetente. La flecha inversa no debe atravesar una barrera dibujada cerrada. R12 §2.4 y límites del modelo. |
| H03 · P2 | PL04 «Contracción / Relajación y llenado», con una sola válvula en posiciones distintas. | Puede leerse como compartimento entre válvula distal y proximal, pero esas referencias no están nombradas. R12 Fig. 1. | Añadir proximal/distal, identificar qué válvula se representa en cada panel y la región que se llena/vacía. No concluir que toda válvula de la extremidad adopta un único estado por fase. |
| H04 · Conservar | `Scene.Valve` depende del flujo/signo y de `leak`; aviso «VÁLVULA ILUSTRATIVA · NO BIOMECÁNICA». | Es una regla de dibujo, no una solución de apertura de valvas. R12 §2.4 diferencia una formulación reducida de modelos más detallados. | Conservar el aviso. Describir «estado representado del modelo»; no asignar ángulos, velocidad de apertura o fuerzas reales a la animación. |
| H05 · Conservar | Ptm = Pi − Pe (G02/PL06); complianza frente a distensibilidad (G04). | Definiciones coherentes; R12 §2.3. | Conservar. En AN04 un círculo representa sección, no un volumen medido: ver inventario y H06. |
| H06 · P2 | AN04 cambia el radio de un círculo con un reloj libre y lo llama «Volumen representado». | No contiene longitud ni una ley cuantificada de presión/volumen; evidencia del SVG. | Llamarlo «cambio de sección/calibre conceptual», o explicitar longitud fija y el vínculo presión–área/volumen. No presentar el movimiento periódico autónomo como respuesta calculada a Pi/Pe. |
| H07 · Conservar | Cuatro compartimentos, pared lineal, entrada constante y retorno medio 0,7 (`Library.tsx:355–404`). | El propio código fija esas entradas; en régimen periódico su suma fija la salida media. R12 y R17 no validan este circuito nuevo. | Conservar la explicación ya presente: comparar presión/forma de onda/flujo inverso; no anunciar aumento de eficiencia de bomba o de retorno medio provocado por un control en este modelo. |
| H08 · Conservar | TW11/TW12 no prescriben compresión; no se resuelve colapso, viscoelasticidad o interacción fluido-estructura. | Límites reconocidos. R12 §2.3 utiliza una pared venosa no lineal; no es equivalente a la pared lineal de la app. | Conservar el límite de dominio y las unidades relativas. Un rango numéricamente estable no es un rango clínicamente validado ni una dosis de prenda compresiva. |
| H09 · P2 | G03 se llama «Gradiente de potencial» pero define una diferencia; PL03 advierte no duplicar gravedad. | En el circuito se usa una **diferencia** de H entre nodos; la palabra gradiente añade una interpretación por longitud que no se explicita. | Preferir «Diferencia de potencial hemodinámico» en esta red. Mantener una sola referencia de altura y presión. La postura del circuito no deforma el cuerpo anatómico ni representa una transición ortostática medida. |

### Doppler, compresión y mediciones

| ID / prioridad | Afirmación o representación y ubicación | Contraste y fuente | Corrección o decisión |
|---|---|---|---|
| D01 · P2 | DP01/DP05 usan fD = 2f0v cosθ/c; `Doppler.tsx` fija c = 1540 y grafica v cosθ en cm/s. | La ecuación ideal y dependencia angular son correctas; R11 pp. 112–113. La curva es componente proyectada, no automáticamente velocidad corregida por ángulo de un equipo. | Rotular esa curva «componente proyectada v·cosθ». Explicar c = 1540 m/s como supuesto de tejido blando; conservar conversión cm/s → m/s. Evitar que cambiar frecuencia parezca modificar la velocidad verdadera. |
| D02 · P2 | PL14: el arco θ no comparte un vértice claro con haz y vector de movimiento. | La geometría no delimita inequívocamente el ángulo de la ecuación; inspección del SVG. | Dibujar vectores con vértice común y θ entre ambos; marcar la proyección. La fórmula es correcta; la ubicación actual del arco necesita precisión. R11 p. 113. |
| D03 · P1 | PL15: trazo rojo manual `M350,370 L380,510…` sobre una curva azul independiente. | El rojo no se calcula como envolvimiento de la curva azul ni sus discontinuidades coinciden con todos los cruces del límite. | Generar ambos con la misma señal y la misma transformación módulo PRF, dibujar ±Nyquist y añadir leyendas. Alternativa: no presentarlo como comparación «señal original/representación». R11 p. 113; comprobación directa del SVG. |
| D04 · Conservar / P2 visual | DP06 calcula `wrapped = mod(fD + PRF/2, PRF) − PRF/2`, con rótulos en Hz. | El cálculo numérico ideal es coherente. No existe por ello inversión fisiológica; R11 p. 113. La gráfica no tiene marcas numéricas completas. | Conservar métricas y fórmula; si se pretende lectura cuantitativa de la altura, añadir escala vertical coherente con los Hz mostrados. No llamar velocidad en cm/s a una frecuencia de aliasing. |
| D05 · P2 | DP10: >0,5 s en «troncos superficiales y otros segmentos» frente a >1 s en femoral común/femoral/poplítea. | Los valores citados coinciden con R05 §1.3.1 y R08 E5, p. 5. «Otros» oculta una distinción docente relevante. | Enumerar tibiales, femoral profunda y perforantes para >0,5 s cuando se cite esa guía; no usar «profundo = 1 s» como regla general. Mantener signo **>**, territorio y maniobra. |
| D06 · Conservar | DP02: rojo/azul no significa arteria/vena; invertir paleta no invierte movimiento. | Correcto; R11 p. 113. | Conservar leyenda hacia/se aleja y orientar respecto al transductor. PL11 puede añadir esa misma leyenda; una flecha anatómica proximal no fija el signo espectral. |
| D07 · Conservar | DUS A–B mide intervalo entre cuadros B-mode, no duración de reflujo; distancia/velocidad bloqueadas. | R10 separa calibraciones por región. R14 aporta compresión, no un estudio espectral de reflujo. | Conservar esta distinción en exportaciones. La ausencia de calibración **validada** no debe confundirse con ausencia de campos: algunos registros sí contienen regiones/deltas todavía no verificadas para uso del visor. |
| D08 · Conservar | No compresible/parcial/compresible y trombosis se atribuyen al proveedor. | R14 define sus códigos; el banco no es un protocolo de reflujo. | Conservar valores originales separados. No convertir automáticamente 0/1/2 de compresibilidad en diagnóstico nuevo, carga trombótica o antigüedad del trombo. |
| D09 · Conservar | DP08: patrón sintético de fasicidad sin etiología individual. | Alcance prudente. El contexto de adquisición importa: R09, pp. 2–4. | Conservar. En G26 puede precisarse «variación periódica, frecuentemente respiratoria»; no presentar una sinusoidal única como patrón normal obligatorio de todas las venas. |
| D10 · Conservar | DP09: medio experimental, vectores estimados, sin curva numérica; 10 fps y 6,1 s son reproducción del GIF. | R15 y metadatos del recurso. El video no incluye escala temporal fisiológica ni leyenda de velocidad verificada. | Conservar `quantitativeDataAvailable:false`. No usar el GIF para medir velocidad, reflujo, caudal o fase de contracción; la relación con Twin es temática, no una validación pareada. |
| D11 · P2 | DP09 habla de «extractos» y pide «conserva participante… condición del experimento» (`educational.ts:821–827`). | La entrega contiene **una previsualización de Acq0** y una figura. No se importaron identificador/condición individual del HDF5; el protocolo proviene de la ficha general. | Especificar «previsualización publicada de Acq0». Formular la pauta como dato necesario para un análisis posterior, sin sugerir que la ficha actual certifica todos los datos individuales. No confundir cuadros con experimentos o participantes nuevos. |

### Fotografía, CEAP y termografía

| ID / prioridad | Afirmación o representación y ubicación | Contraste y fuente | Corrección o decisión |
|---|---|---|---|
| C01 · Conservar | Fotografía no completa E/A/P; clase del depósito y cantidad de carpetas no equivale a pacientes confirmados. | R04 pp. 343–344 y 347; R13 aporta clase de origen. | Conservar. CEAP no debe presentarse como puntuación calculada por apariencia o escala de resultado terapéutico. |
| C02 · P2 | `vision.json` C1: «Telangiectasias **y** venas reticulares». G/C1 ya dice «o». | R04 tabla III p. 347 usa alternativas; la clase no acredita ambos hallazgos simultáneos. | «Telangiectasias **o** venas reticulares · clase del depósito». No añadir diámetros a partir de estos píxeles no calibrados. |
| C03 · Conservar | Guía C3: contorno/volumen aparente; fotografía aislada no confirma edema ni etiología venosa. | Compatible con clase C3 en R04 y evaluación contextual en R06. La foto C3/001 inspeccionada no permite probar fóvea o evolución. | Conservar esa cautela y «según depósito». No añadir «edema con fóvea», causa o intensidad sin exploración documentada. |
| C04 · P2 | C5 `visibleFindings`: «Área de piel cicatrizada y cambios acompañantes descritos por el origen». | La importación aporta clase C5, no una anotación que delimite la cicatriz en todas las fotografías; R13 y metadatos. | Hacer condicional: «Si distingues un área cicatricial, describe su aspecto; no atribuyas su causa desde la foto». Mantener historia previa requerida. C5 significa úlcera venosa cicatrizada, no cualquier cicatriz. R04 p. 347. |
| C05 · Conservar | C4 genérica no autoriza C4a/b/c; C6 requiere etiología documentada. | R04 tabla III y texto de la clasificación. | Conservar. Una pigmentación visible no permite declarar lipodermatoesclerosis o atrofia blanca sin respaldo del caso. En C6, usar «si la lesión es visible en esta vista» cuando corresponda. |
| C06 · P2 | PL17 abrevia C1 «Vasos», C4 «Piel», C5 «Cicatrizada», C6 «Activa». | La abreviación pierde el objeto clínico y puede inducir equivalencias excesivas. | Usar denominaciones completas, especialmente «úlcera venosa cicatrizada/activa»; añadir C4a/b/c como contexto, sin asignarlas a fotos C4 genéricas. R04, p. 347. |
| C07 · P2 | `Vision.tsx:421–423`: «no se muestran mediciones de °C». | La térmica C3/001 contiene «max 32.1 °C» y escala 20.3–31.8 incrustados. Esos números siguen visibles aunque el visor no añada mediciones. | «No añadimos mediciones de temperatura. La escala y los valores incrustados pertenecen al archivo original; su calibración radiométrica no está validada en este visor». No ocultar su procedencia ni presentarlos como mediciones nuevas. |
| C08 · P2 | `ClinicalViewer` recibe/imprime siempre `image.width × image.height`, incluso con `thermal`. | Las doce RGB son **640×480** y sus térmicas **320×240**. OpenSeadragon abre el archivo real; el error comprobado afecta al rótulo/resolución declarada, no demuestra una deformación de aspecto. | Mostrar dimensiones reales por modalidad y conservarlas en metadatos. No insinuar que ampliar crea resolución térmica adicional. |
| C09 · Conservar / precisar | Parejas térmicas por carpeta y nombre; sin °C calculados, sin matrices radiométricas. | R13, protocolo pp. 1–2, describe condiciones de captura y emisividad 0,95; no es una calibración radiométrica retrospectiva del derivado. | Conservar la falta de calibración validada. «Emparejada» significa relación de archivo/caso; no afirmar corregistro píxel a píxel, identidad exacta de campo ni temperatura comparable entre capturas. |
| C10 · Conservar | Dos modalidades no confirman reflujo; no se retocan signos con mejora generativa. | La naturaleza importada y transformaciones están declaradas. R13 no aporta validación de un test diagnóstico por el color térmico. | Mantener la observación separada de hipótesis etiológicas. Evitar «zona caliente = inflamación/reflujo» o «fría = obstrucción» sin un estudio que respalde esa inferencia en esa condición. |
| C11 · Conservar | Derivados H.264/WebP con pérdida de textura, etiquetas de origen y revisión médica independiente pendiente (`Library.tsx:427–444`). | Coincide con el registro técnico; no demuestra equivalencia diagnóstica de los derivados. | Conservar «derivado docente». La resolución nativa no implica igualdad de información ni calidad diagnóstica. La revisión clínica futura debe hacerse sobre fuentes apropiadas. |

### Enlaces y fuerza de las referencias

| ID / prioridad | Ubicación | Corrección o decisión |
|---|---|---|
| R-A · P2 | Fuente `esvs2022` en `educational.ts` y `FUENTES_COTEJADAS.md`. | El enlace actual redirigió a login. Usar DOI canónico y ofrecer el [PDF accesible desde la sociedad francesa](https://www.sf-phlebologie.org/wp-content/uploads/2022/04/ESVS-2022-CVD-guidelines.pdf); identificar versión 2022. |
| R-B · P2 | Referencias generales de anatomía/mecanismos. | Añadir el consenso UIP anatómico con sus secciones concretas, no solo una página de enlaces. Las referencias existentes ASA/ESVS sí respaldan aspectos anatómicos; su presencia no demuestra revisión de cada malla o fotografía. |
| R-C · Conservar | Cita Ferlito 2026 y aviso de modelo propio. | Metadatos/resumen confirmados (R17). No usar «modelo validado» de ese artículo para describir Twin ni trasladar porcentajes, mL o mmHg del artículo al circuito relativo. |

## Inventario de las 24 piezas originales

«Conservar» significa que no se detectó una contradicción en su afirmación principal dentro del alcance revisado; no implica aprobación médica de la pieza final.

| Pieza | Resultado |
|---|---|
| PL01 | Conservar convención entrada/salida y referencia común. |
| PL02 | Precisar fascia muscular y límites de compartimento; A02. |
| PL03 | Conservar principio de altura/referencia; evitar doble cómputo de gravedad, H09. |
| PL04 | Añadir proximal/distal y función de cada válvula; H03. |
| PL05 | **Corregir geometría competencia/fuga**; H02. |
| PL06 | Conservar Ptm = Pi − Pe. No convierte presión interior aislada en distensión clínica. |
| PL07 | Conservar balance de entradas/salidas; si se usa Δ finito, entender flujos medios del intervalo. |
| PL08 | Conservar configuración genérica y vía alternativa; no cuantifica eficacia clínica. |
| PL09 | Conservar secuencia ilustrativa antes/durante; no rotularla como test diagnóstico real. |
| PL10 | Conservar forma transversal/longitudinal conceptual; no enseña por sí sola identidad del vaso. |
| PL11 | Conservar inversión de mapa; añadir leyenda direccional concreta, D06. |
| PL12 | Conservar carácter sintético; no hay escala adquirida ni medición de paciente. |
| PL13 | Conservar principio de calibración temporal. La propia lámina no aporta una escala clínica numérica. |
| PL14 | Corregir construcción geométrica del ángulo; D02. |
| PL15 | **Rehacer relación señal original/envolvimiento**; D03. |
| PL16 | Conservar evento y contexto; el evento dibujado no demuestra una maniobra clínica específica. |
| PL17 | Completar objetos clínicos de las clases, especialmente C5/C6; C06. |
| PL18 | Conservar distinción de modalidades; no presupone corregistro o radiometría. |
| AN01 | **Abrir/cerrar valvas de forma congruente con el tránsito**, o reducir el objetivo; H01. |
| AN02 | Conservar como animación conceptual de referencia; la barra no es presión calculada de un paciente. |
| AN03 | Añadir indicador de fase; las flechas externas actuales permanecen fijas mientras cambia la sección. Evitar sugerir compresión constante durante todo el llenado. |
| AN04 | Precisar sección/calibre frente a volumen y reloj libre; H06. |
| AN05 | Conservar secuencia de compresión genérica; no enseña por sí sola presencia/ausencia de trombosis. |
| AN06 | Conservar como explicación de cursor/tiempo. No equivale a sincronización clínica entre archivos distintos. |

## Controversias y fronteras que deben permanecer visibles

1. **Perforantes: anatomía y regla de flujo no son intercambiables.** La fascia define el territorio anatómico; su comportamiento requiere condiciones de adquisición. R06 §2.3.1, p. 198, reconoce discrepancias de duración (>0,35 s frente a >0,5 s) para incompetencia perforante. R05 §1.3.1 y R08 E5 usan >0,5 s. La app puede enseñar una guía identificada, sin anunciar un único corte universal o deducir indicación de tratamiento por un control de conductancia.
2. **Maniobra y postura afectan a lo observado.** R09 G3, pp. 3–4, diferencia técnicas y reconoce variabilidad. La presión directa del transductor de los cines de compresión no es la aumentación distal utilizada para provocar una respuesta Doppler. No rellenar postura/orientación desconocidas como si se hubieran documentado.
3. **Modelo válido numéricamente no significa validado fisiológicamente.** Un balance conservado, positividad y convergencia son verificaciones importantes del cálculo. No validan sus coeficientes, su dominio clínico ni una equivalencia de apertura valvular. El retorno medio fijado por las entradas limita qué puede concluirse al comparar escenarios.
4. **La clase del depósito conserva una atribución; no demuestra visibilidad de todos sus signos en cada vista.** Una foto puede estar correctamente archivada como C3 o C5 y aun así no permitir al observador confirmar edema o delimitar una cicatriz en ese encuadre. La guía debe invitar a describir lo visible, con condiciones explícitas.
5. **Temperatura publicada, temperatura recuperable y temperatura validada son tres alcances distintos.** El raster térmico puede conservar números originales; eso no crea una matriz radiométrica ni un calibrador en la app. El protocolo del conjunto no convierte el patrón térmico en etiología venosa.
6. **Experimento y simulación no están pareados.** Waterloo aporta un ejemplo procesado real; Twin aporta un circuito genérico. No se importó una serie numérica para contrastar parámetros/ROI/tiempos. Su presentación conjunta sirve para comparar naturalezas de evidencia, no para certificar concordancia cuantitativa.

## Verificación recomendada después de las correcciones

- Volver a inspeccionar PL05, PL15 y AN01 en sus estados extremos; comprobar que apertura, flechas y coaptación no se contradicen.
- En Twin, revisar por rama signo y ausencia de movimiento con flujo nulo; una conexión decorativa debe distinguirse de una calculada.
- En Doppler, mostrar referencias/ejes suficientes para las cantidades calculadas y conservar criterios por segmento, con guía identificada.
- En Vision, comprobar ambos tamaños por modalidad y el texto frente a valores térmicos incrustados; mantener la clase original separada de hallazgos verificados en esa vista.
- Registrar la revisión médica independiente futura con profesional responsable, versión, fecha, piezas revisadas y decisiones. Este informe no debe figurar como esa aprobación.

### Identificación del corte de archivos

SHA-256 observado durante la auditoría, para distinguir esta revisión de modificaciones posteriores:

| Archivo | SHA-256 |
|---|---|
| `src/data/educational.ts` | `61BDC054D5CDE6426426D8FD6541D51879AB1FED9B6A5A93939E54FCE06290F5` |
| `src/labs/twin/Scene.tsx` | `76EA140B190FED5309F52D1CB58858F51018CF7047EB7BA031CDEFF48AF19681` |
| `src/labs/twin/Twin.tsx` | `4E3A0E6A5AF45940C1D61812CDEF0B46A750DCAD6CB0F1AF7008F1EE22545944` |
| `src/labs/dus/Doppler.tsx` | `DD739FB0D0321BC0560D23BF033E06BE840E1612190DE4BC17F6A1794A22BA81` |
| `src/labs/vision/Vision.tsx` | `63ECD4FF3A63F3EDD7E7DA6EEBCA48FD2DE19114A9D47FA31C423B010F89AAEB` |
| `src/pages/Library.tsx` | `96CDC2C9B8F325ED9BA21E81C41EF1B852EE52D0A5BFC4115FF6F27B555AB8DC` |
