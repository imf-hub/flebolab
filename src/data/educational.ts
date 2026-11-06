// Contenido editorial original de FLEBO LAB IMF. No es un clasificador ni una evaluación clínica individual.
export type EducationalSource = {
  id: string;
  title: string;
  url: string;
  type: string;
  summary: string;
  credit: string;
  license: string;
};
export type GlossaryTerm = {
  id: string;
  term: string;
  english: string;
  aliases: string[];
  definition: string;
  sourceIds: string[];
};
export type LessonControl = {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
};
export type DopplerLesson = {
  id: string;
  title: string;
  intro: string;
  keyPoints: string[];
  controls: LessonControl[];
  sourceIds: string[];
  nature: "illustration" | "experimental";
  demo: string;
  formula?: string;
  takeaway: string;
};
export type PathwayStep = {
  title: string;
  body: string;
  lab: "twin" | "dus" | "vision";
  target?: string;
};
export type Pathway = {
  id: string;
  title: string;
  description: string;
  minutes: number;
  steps: PathwayStep[];
  sourceIds: string[];
};
export type ObservationGuide = {
  id: string;
  title: string;
  visibleFindings: string[];
  contextNeeded: string[];
  limitations: string[];
  sources: string[];
};
export type EducationalPlate = {
  id: string;
  title: string;
  description: string;
  path: string;
  sourceIds: string[];
  nature: string;
  credit: string;
};

export const sources: EducationalSource[] = [
  {
    id: "ceap2020",
    title: "CEAP 2020: clasificación y documentación",
    url: "https://doi.org/10.1016/j.jvsv.2019.12.075",
    type: "Clasificación",
    summary:
      "Referencia para describir manifestaciones clínicas, etiología, anatomía y fisiopatología por miembro; incorpora corona flebectásica y modificadores de recurrencia.",
    credit: "Lurie y colaboradores, J Vasc Surg Venous Lymphat Disord, 2020",
    license: "Referencia bibliográfica; no se reproducen sus figuras",
  },
  {
    id: "svs2022",
    title: "SVS / AVF / AVLS: evaluación dúplex",
    url: "https://doi.org/10.1016/j.jvsv.2022.09.004",
    type: "Guía clínica",
    summary:
      "Sustenta la evaluación de reflujo con dúplex, la documentación del segmento y la aplicación de criterios diferenciados.",
    credit:
      "Society for Vascular Surgery, American Venous Forum y American Vein and Lymphatic Society",
    license: "Referencia bibliográfica; derechos de figuras separados",
  },
  {
    id: "esvs2022",
    title: "ESVS 2022: enfermedad venosa crónica",
    url: "https://findresearcher.sdu.dk/ws/files/206201181/1_s2.0_S1078588421009795_main.pdf",
    type: "Guía clínica",
    summary:
      "Marco de referencia para anatomía, mecanismos, evaluación y contexto de enfermedad venosa de miembros inferiores.",
    credit: "European Society for Vascular Surgery, 2022",
    license: "Consulta de la guía; no se importan sus figuras",
  },
  {
    id: "asa",
    title: "ASA: exploración de insuficiencia venosa",
    url: "https://www.sonographers.org/resources/clinical-resources/cvi-guideline",
    type: "Guía de sonografía",
    summary:
      "Organiza anatomía, maniobras, interpretación y documentación. Sus apartados ayudan a separar lo observado de los requisitos de una exploración completa.",
    credit:
      "Australasian Sonographers Association; secciones oficiales consultadas el 6 de noviembre de 2026",
    license: "Referencia; cada recurso enlazado conserva sus derechos",
  },
  {
    id: "dicom",
    title: "DICOM: calibración de regiones ultrasónicas",
    url: "https://dicom.nema.org/medical/dicom/current/output/chtml/part03/sect_C.8.5.5.html",
    type: "Estándar técnico",
    summary:
      "Define unidades y calibración por región de la imagen: distancia, tiempo, velocidad y otros parámetros no son intercambiables.",
    credit: "DICOM Standards Committee / NEMA, PS3.3",
    license: "Referencia al estándar",
  },
  {
    id: "keijsers2015",
    title: "Modelo de la bomba muscular de pantorrilla",
    url: "https://doi.org/10.1002/cnm.2714",
    type: "Modelo científico",
    summary:
      "Estudia mecanismos de bomba, válvulas, gravedad y colapso venoso mediante una formulación unidimensional.",
    credit: "Keijsers y colaboradores, 2015; DOI 10.1002/cnm.2714",
    license:
      "Referencia científica; el motor de FLEBO LAB es una formulación educativa propia",
  },
  {
    id: "ferlito2026",
    title: "Modelo venoso 1D de miembro inferior",
    url: "https://doi.org/10.1109/TBME.2026.3701594",
    type: "Modelo científico",
    summary:
      "Referencia de los mecanismos combinados de válvulas, perforantes, bomba muscular, gravedad y presión exterior.",
    credit: "Ferlito, Reda, Sen, Alastruey y Avril, 2026",
    license: "Referencia; no se afirma reutilizar el código de los autores",
  },
  {
    id: "tricvi",
    title: "TRICVI-C v2: RGB y termografía",
    url: "https://data.mendeley.com/datasets/rf5m97cmm3/2",
    type: "Datos clínicos",
    summary:
      "Fotografías y termografía con clasificación clínica de origen. Se mantienen relacionadas las vistas de un mismo caso.",
    credit:
      "Julian Ruiz, Pilar Gomez-Gil y Francisco Renero, 2026; DOI 10.17632/rf5m97cmm3.2",
    license: "CC BY 4.0",
  },
  {
    id: "thrombus",
    title: "ThrombUS+: compresión ecográfica",
    url: "https://zenodo.org/records/17659415",
    type: "Datos clínicos",
    summary:
      "Cines multisegmentarios de compresión con etiquetas del proveedor. Su selección docente no representa prevalencia clínica ni una exploración de reflujo completa.",
    credit: "Consorcio ThrombUS+; Didaskalou, Portokallidis y Kaldoudi",
    license: "CC BY 4.0 según el registro de Zenodo consultado",
  },
  {
    id: "waterloo",
    title: "UW-FemVein RF / Open-H-RF",
    url: "https://github.com/open-h/Open-H-RF/blob/main/datasets/waterloo-femoralvein/README.md",
    type: "Datos experimentales",
    summary:
      "Adquisiciones femorales y campos de velocidad durante contracción muscular e inclinación. Se identifica el procesamiento de cada extracto.",
    credit:
      "Nahas, Cohen, Zafiris, Ling, Yu, Au y VORTEX, University of Waterloo, 2026",
    license: "CC BY 4.0",
  },
  {
    id: "dopplerphysics",
    title: "Física del Doppler: frecuencia, ángulo y muestreo",
    url: "https://doi.org/10.1016/j.bjae.2020.01.003",
    type: "Referencia de física",
    summary:
      "Referencia conceptual para desplazamiento Doppler, proyección angular y límites del muestreo pulsado.",
    credit:
      "P. Magee. Essential notes on the physics of Doppler ultrasound. BJA Education, 2020;20(4):112–113. DOI 10.1016/j.bjae.2020.01.003",
    license: "Referencia bibliográfica; diagramas de FLEBO LAB originales",
  },
  {
    id: "bodyparts3d",
    title: "BodyParts3D",
    url: "https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html",
    type: "Anatomía de referencia",
    summary:
      "Fuente de geometrías anatómicas. Cada subconjunto usado se identifica en la ficha del activo.",
    credit: "BodyParts3D, Database Center for Life Science",
    license: "CC BY 4.0 según la página vigente del original",
  },
  {
    id: "servier",
    title: "Servier Medical Art",
    url: "https://smart.servier.com/using-smart-images-what-you-can-do/",
    type: "Ilustración",
    summary:
      "Recurso para ilustración adaptada con atribución, sin confundir ilustraciones y estudios clínicos reales.",
    credit: "Servier Medical Art",
    license: "CC BY 4.0; atribución por activo",
  },
  {
    id: "bioart",
    title: "NIH BioArt Source",
    url: "https://bioart.niaid.nih.gov/terms",
    type: "Ilustración",
    summary:
      "Ilustraciones científicas con condiciones y créditos en cada entrada. El uso de una fuente institucional no implica un aval de la aplicación.",
    credit: "NIAID NIH BioArt Source",
    license: "Ver licencia de la entrada concreta",
  },
  {
    id: "svzerod",
    title: "svZeroDSolver",
    url: "https://github.com/SimVascular/svZeroDSolver",
    type: "Herramienta científica",
    summary:
      "Referencia de redes hemodinámicas y bloques valvulares para contrastar formulaciones reducidas.",
    credit: "Stanford University, University of California y colaboradores",
    license: "BSD-3-Clause; dependencias con sus propios avisos",
  },
  {
    id: "uipduplex1",
    title:
      "Duplex ultrasound investigation of the veins in chronic venous disease of the lower limbs—UIP consensus document. Part I. Basic principles",
    url: "https://doi.org/10.1016/j.ejvs.2005.07.019",
    type: "Consenso de expertos sobre metodología dúplex",
    summary:
      "Metodología histórica de examen, posición, provocación, orientación e informe. Respalda distinguir un estudio de reflujo de un examen por sospecha de TVP.",
    credit:
      "International Union of Phlebology (UIP): iniciativa y consenso identificados en el artículo.",
    license: "Referencia bibliográfica; no se reproducen figuras",
  },
  {
    id: "uipduplex2",
    title:
      "Duplex ultrasound investigation of the veins in chronic venous disease of the lower limbs—UIP consensus document. Part II. Anatomy",
    url: "https://doi.org/10.1016/j.ejvs.2005.07.020",
    type: "Consenso sobre anatomía ecográfica",
    summary:
      "Marcadores fasciales, troncos safenos, tributarias, perforantes y variaciones. Fuente directa de nomenclatura y orientación docente GSV/SSV.",
    credit:
      "International Union of Phlebology (UIP): iniciativa de consenso anatómico dúplex.",
    license: "Referencia bibliográfica; no se reproducen figuras",
  },
  {
    id: "uipnomenclature",
    title:
      "Nomenclature of the veins of the lower limbs: an international interdisciplinary consensus statement",
    url: "https://doi.org/10.1067/mva.2002.125847",
    type: "Consenso internacional de nomenclatura anatómica",
    summary:
      "Base de normalización de términos y relaciones anatómicas venosas de miembros inferiores; complementar con refinamientos 2005 y actualizaciones específicas 2024.",
    credit:
      "Consenso interdisciplinario bajo auspicios de UIP, IFAA y FICAT; reunión de Roma 2001.",
    license: "Referencia bibliográfica; no se reproducen figuras",
  },
  {
    id: "asv2024",
    title:
      "The anterior saphenous vein. Part 1. A position statement endorsed by the American Vein and Lymphatic Society, the American Venous Forum, and the International Union of Phlebology",
    url: "https://doi.org/10.1016/j.jvsv.2023.101721",
    type: "Posición sobre terminología anatómica y clínica",
    summary:
      "Recomienda anterior saphenous vein(ASV) en lugar de anterior accessory saphenous vein(AASV), reconociendo su carácter troncular. Permite mantener AASV/AAGSV como equivalencias históricas en búsqueda y fuentes.",
    credit: "Panel multisocietario y posición respaldada por AVLS, AVF y UIP.",
    license: "Referencia bibliográfica; no se reproducen figuras",
  },
  {
    id: "uiphemodynamics",
    title:
      "Venous hemodynamic changes in lower limb venous disease: the UIP consensus according to scientific evidence",
    url: "https://pubmed.ncbi.nlm.nih.gov/27013029/",
    type: "Consenso de hemodinámica venosa",
    summary:
      "Referencia prioritaria para el marco conceptual de fisiología, bomba, válvulas, obstrucción y efectos de tratamientos. La lectura del resumen confirma el alcance, no parámetros cuantitativos del motor.",
    credit:
      "International Union of Phlebology(UIP); panel de expertos con participación de sociedades flebológicas y vasculares.",
    license: "Referencia bibliográfica; no se reproducen figuras",
  },
  {
    id: "uipedema",
    title: "Management of the patient with the swollen lower limb",
    url: "https://journals.sagepub.com/doi/10.1177/02683555231219726",
    type: "Informe breve y guía de una página basada en evidencia y consenso experto",
    summary:
      "La valoración de una pierna aumentada de volumen requiere historia, examen y diagnóstico diferencial; puede haber causas sistémicas, locales y mixtas. Complementa los límites docentes de C3 y de observación por fotografías.",
    credit:
      "UIP One-Page Guidelines; autoría on behalf of UIP y garante Alun Davies en nombre de UIP.",
    license: "Referencia bibliográfica; no se reproducen figuras",
  },
  {
    id: "ksp2023",
    title:
      "Proper Preparations for the Ultrasonographic Evaluation of Varicose Veins of the Lower Extremities - The 2023 Korean Society for Phlebology Clinical Practice Guidelines",
    url: "https://www.annphlebology.org/journal/view.html?uid=142&vmd=Full",
    type: "Guía clínica flebológica de preparación ecográfica",
    summary:
      "Estandarización de la exploración; bipedestación para reflujo y alternativas si no es posible. Complemento flebológico contemporáneo al consenso UIP.",
    credit: "Korean Society for Phlebology",
    license: "Referencia bibliográfica; no se reproducen figuras",
  },
  {
    id: "svs2023",
    title:
      "The 2023 Society for Vascular Surgery, American Venous Forum, and American Vein and Lymphatic Society clinical practice guidelines for the management of varicose veins of the lower extremities. Part II: Endorsed by the Society of Interventional Radiology and the Society for Vascular Medicine",
    url: "https://www.phlebology.ch/upload/pdf/dokumente/AVLS%20guidelines%2020230.pdf",
    type: "Guía clínica vascular y flebológica conjunta",
    summary:
      "Tabla completa de umbrales, postura y provocación por segmento; contexto de exploración y clasificación. La recomendación1.2.1 es1/fuerte,B/moderada; 1.3.x y1.4.x no heredan automáticamente ese grado.",
    credit:
      "Society for Vascular Surgery; American Venous Forum; American Vein and Lymphatic Society. Endorsed by Society of Interventional Radiology and Society for Vascular Medicine.",
    license: "Referencia bibliográfica; no se reproducen figuras",
  },
  {
    id: "esvsthrombosis2021",
    title:
      "European Society for Vascular Surgery (ESVS) 2021 Clinical Practice Guidelines on the Management of Venous Thrombosis",
    url: "https://doi.org/10.1016/j.ejvs.2020.09.023",
    type: "Guía clínica vascular de trombosis venosa",
    summary:
      "Probabilidad preprueba, vía diagnóstica validada y ecografía en sospecha de TVP. Distingue estudios de compresión limitados y ecografía de toda la pierna.",
    credit: "European Society for Vascular Surgery",
    license: "Referencia bibliográfica; no se reproducen figuras",
  },
  {
    id: "aium2026",
    title:
      "AIUM Practice Parameter for the Performance of a Peripheral Venous Ultrasound Examination, 2024 Revision",
    url: "https://www.aium.org/resources/practice-parameters/peripheral-venous",
    type: "Parámetro de práctica ecográfica",
    summary:
      "Extensión de la exploración, compresión transversal y documentación. Distingue una adquisición seleccionada de un estudio completo; solicita espectro y contexto para reflujo.",
    credit: "American Institute of Ultrasound in Medicine",
    license: "Referencia bibliográfica; no se reproducen figuras",
  },
  {
    id: "iac2026",
    title: "IAC Standards and Guidelines for Vascular Testing Accreditation",
    url: "https://intersocietal.org/wp-content/uploads/2026/08/IACVascularTestingStandardsAug2026.pdf",
    type: "Estándar de acreditación de laboratorios vasculares",
    summary:
      "Documentación multisegmentaria con y sin compresión, Doppler y protocolos específicos. Útil para describir lo que un banco de cuatro sitios no documenta.",
    credit: "Intersocietal Accreditation Commission",
    license: "Referencia bibliográfica; no se reproducen figuras",
  },
];

export const glossary: GlossaryTerm[] = [
  {
    id: "G01",
    term: "Retorno venoso",
    english: "Venous return",
    aliases: ["retorno"],
    definition:
      "Flujo que retorna desde la periferia hacia el corazón. En el laboratorio se observa a través de la red y las fronteras del modelo.",
    sourceIds: ["keijsers2015", "esvs2022"],
  },
  {
    id: "G02",
    term: "Presión transmural",
    english: "Transmural pressure",
    aliases: ["Ptm"],
    definition:
      "Diferencia entre la presión dentro del vaso y la presión exterior. Ayuda a relacionar el entorno del vaso con su volumen.",
    sourceIds: ["keijsers2015"],
  },
  {
    id: "G03",
    term: "Diferencia de potencial hemodinámico",
    english: "Hemodynamic potential difference",
    aliases: ["gradiente de potencial", "carga gravitacional"],
    definition:
      "Diferencia que impulsa el flujo cuando se consideran presión y altura con una convención de referencia común.",
    sourceIds: ["keijsers2015"],
  },
  {
    id: "G04",
    term: "Complianza venosa",
    english: "Venous compliance",
    aliases: ["compliance"],
    definition:
      "Variación de volumen por variación de presión en una condición definida. La distensibilidad normaliza esa respuesta por el volumen de referencia; no son magnitudes intercambiables.",
    sourceIds: ["keijsers2015"],
  },
  {
    id: "G05",
    term: "Competencia valvular",
    english: "Valve competence",
    aliases: ["válvula competente"],
    definition:
      "Capacidad funcional representada de limitar el flujo inverso. La animación muestra el estado de una formulación educativa.",
    sourceIds: ["keijsers2015", "ferlito2026"],
  },
  {
    id: "G06",
    term: "Reflujo venoso",
    english: "Venous reflux",
    aliases: ["flujo retrógrado"],
    definition:
      "Flujo inverso evaluado con su duración, territorio y condiciones de provocación. Una inversión breve o un color aislado no completan su interpretación.",
    sourceIds: ["uipduplex1", "svs2022", "asa"],
  },
  {
    id: "G07",
    term: "Obstrucción",
    english: "Venous obstruction",
    aliases: ["resistencia de salida"],
    definition:
      "Limitación de la vía de salida. En FleboTwin se explora como una modificación de la red, sin diagnosticar una lesión individual.",
    sourceIds: ["esvs2022", "ferlito2026"],
  },
  {
    id: "G08",
    term: "Bomba muscular",
    english: "Calf muscle pump",
    aliases: ["bomba de pantorrilla"],
    definition:
      "Mecanismo en el que la actividad muscular modifica las condiciones de las venas y favorece el desplazamiento de sangre.",
    sourceIds: ["keijsers2015"],
  },
  {
    id: "G09",
    term: "Vena perforante",
    english: "Perforating vein",
    aliases: ["perforante"],
    definition:
      "Vena que atraviesa la fascia muscular para comunicar sistemas superficial y profundo. Su anatomía no implica por sí sola reflujo ni indicación terapéutica.",
    sourceIds: ["uipnomenclature", "uipduplex2", "asa", "esvs2022"],
  },
  {
    id: "G10",
    term: "Vena safena magna",
    english: "Great saphenous vein",
    aliases: ["GSV", "VSM", "safena mayor"],
    definition:
      "Vena del sistema superficial cuyo trayecto y uniones se consideran por segmento. Un cine de la unión no representa todo su estudio.",
    sourceIds: ["uipnomenclature", "uipduplex2", "asa"],
  },
  {
    id: "G11",
    term: "Vena safena menor",
    english: "Small saphenous vein",
    aliases: ["SSV", "VSP", "safena parva"],
    definition:
      "Vena superficial con trayecto posterior y variabilidad de sus conexiones; la denominación se conserva ligada al territorio observado.",
    sourceIds: ["uipnomenclature", "uipduplex2", "asa"],
  },
  {
    id: "G12",
    term: "Unión safenofemoral",
    english: "Saphenofemoral junction",
    aliases: ["SFJ", "USF"],
    definition:
      "Región de conexión de la safena magna con la femoral común. GS en ThrombUS+ identifica un sitio de adquisición cercano a esa relación.",
    sourceIds: ["uipnomenclature", "uipduplex2", "asa", "thrombus"],
  },
  {
    id: "G13",
    term: "Vena femoral común",
    english: "Common femoral vein",
    aliases: ["CFV", "VFC"],
    definition:
      "Segmento profundo proximal que se identifica por su relación anatómica y contexto de adquisición.",
    sourceIds: ["uipnomenclature", "uipduplex2", "asa", "thrombus"],
  },
  {
    id: "G14",
    term: "Vena femoral",
    english: "Femoral vein",
    aliases: ["FV", "VF"],
    definition:
      "Segmento del sistema venoso profundo del muslo; el término visible en la biblioteca se conserva según la fuente.",
    sourceIds: ["uipnomenclature", "uipduplex2", "asa", "thrombus"],
  },
  {
    id: "G15",
    term: "Vena poplítea",
    english: "Popliteal vein",
    aliases: ["PV", "VP"],
    definition:
      "Segmento profundo de la región de la rodilla. La orientación del cine debe conservarse al comparar imágenes.",
    sourceIds: ["uipnomenclature", "uipduplex2", "asa", "thrombus"],
  },
  {
    id: "G16",
    term: "Modo B",
    english: "B-mode",
    aliases: ["escala de grises"],
    definition:
      "Representación de ecos que permite observar forma y relaciones. Su brillo no asigna por sí solo una etiología.",
    sourceIds: ["uipduplex1", "asa"],
  },
  {
    id: "G17",
    term: "Compresibilidad",
    english: "Compressibility",
    aliases: ["compresión ecográfica"],
    definition:
      "Cambio de la luz vascular observado durante la presión del transductor. En los casos reales se conserva la etiqueta del proveedor.",
    sourceIds: ["uipduplex1", "thrombus", "asa"],
  },
  {
    id: "G18",
    term: "Doppler color",
    english: "Color Doppler",
    aliases: ["mapa de color"],
    definition:
      "Representación que codifica información de flujo con una leyenda. La interpretación de dirección requiere revisar mapa y orientación.",
    sourceIds: ["uipduplex1", "asa", "dicom"],
  },
  {
    id: "G19",
    term: "Doppler espectral",
    english: "Spectral Doppler",
    aliases: ["espectro", "trazado"],
    definition:
      "Representación temporal de información Doppler. Sus ejes y unidades deben conocerse antes de medir.",
    sourceIds: ["uipduplex1", "asa", "dicom"],
  },
  {
    id: "G20",
    term: "Línea base",
    english: "Baseline",
    aliases: ["cero espectral"],
    definition:
      "Referencia del espectro alrededor de la que se representa el signo de la señal. Moverla modifica la presentación, no la dirección anatómica real.",
    sourceIds: ["dopplerphysics", "dicom"],
  },
  {
    id: "G21",
    term: "PRF",
    english: "Pulse repetition frequency",
    aliases: ["frecuencia de repetición de pulsos"],
    definition:
      "Frecuencia de repetición usada en la adquisición pulsada. Interviene en el límite de muestreo de la señal Doppler.",
    sourceIds: ["dopplerphysics"],
  },
  {
    id: "G22",
    term: "Límite de Nyquist",
    english: "Nyquist limit",
    aliases: ["PRF/2"],
    definition:
      "Mitad de la frecuencia de muestreo en la representación pulsada ideal. Rebasarlo puede producir envolvimiento o aliasing.",
    sourceIds: ["dopplerphysics"],
  },
  {
    id: "G23",
    term: "Aliasing",
    english: "Aliasing",
    aliases: ["envolvimiento"],
    definition:
      "Representación ambigua por muestreo insuficiente. Puede aparentar un cambio de signo que no equivale a inversión fisiológica.",
    sourceIds: ["dopplerphysics"],
  },
  {
    id: "G24",
    term: "Ángulo Doppler",
    english: "Doppler angle",
    aliases: ["ángulo de insonación"],
    definition:
      "Ángulo entre el haz y la dirección del movimiento representado. La proyección angular influye en la señal Doppler.",
    sourceIds: ["dopplerphysics", "asa"],
  },
  {
    id: "G25",
    term: "Volumen de muestra",
    english: "Sample volume",
    aliases: ["gate", "compuerta"],
    definition:
      "Región de adquisición del Doppler pulsado. Su ubicación debe relacionarse con la anatomía mostrada.",
    sourceIds: ["uipduplex1", "asa", "dicom"],
  },
  {
    id: "G26",
    term: "Fasicidad",
    english: "Phasicity",
    aliases: ["modulación respiratoria"],
    definition:
      "Variación temporal del flujo. Un patrón se interpreta con segmento y contexto; no constituye una conclusión aislada.",
    sourceIds: ["uipduplex1", "asa"],
  },
  {
    id: "G27",
    term: "Aumentación distal",
    english: "Distal augmentation",
    aliases: ["provocación distal"],
    definition:
      "Maniobra que modifica el flujo desde una localización distal al punto de observación. Debe documentarse junto al espectro.",
    sourceIds: ["uipduplex1", "asa", "svs2022"],
  },
  {
    id: "G28",
    term: "CEAP",
    english: "Clinical Etiology Anatomy Pathophysiology",
    aliases: ["clase C"],
    definition:
      "Sistema de descripción de trastornos venosos. Una fotografía puede ilustrar signos, pero no reconstruye automáticamente todos sus componentes.",
    sourceIds: ["ceap2020"],
  },
  {
    id: "G29",
    term: "Telangiectasia",
    english: "Telangiectasia",
    aliases: ["araña vascular"],
    definition:
      "Hallazgo de pequeños vasos visibles que puede describirse por su distribución y aspecto, conservando el contexto del caso.",
    sourceIds: ["ceap2020", "esvs2022"],
  },
  {
    id: "G30",
    term: "Vena reticular",
    english: "Reticular vein",
    aliases: ["reticular"],
    definition:
      "Vena superficial visible con patrón reticular. La imagen es apoyo de descripción y no sustituye medición o exploración.",
    sourceIds: ["ceap2020", "esvs2022"],
  },
  {
    id: "G31",
    term: "Corona flebectásica",
    english: "Corona phlebectatica",
    aliases: ["C4c"],
    definition:
      "Descriptor incorporado como subclase clínica en CEAP 2020; debe documentarse en el caso antes de asignarlo a una fotografía.",
    sourceIds: ["ceap2020"],
  },
  {
    id: "G32",
    term: "Calibración por región",
    english: "Ultrasound region calibration",
    aliases: ["Physical Delta X", "Physical Delta Y"],
    definition:
      "Correspondencia de píxeles, ejes y unidades de una región concreta. La calibración de distancia no calibra automáticamente tiempo o velocidad.",
    sourceIds: ["dicom"],
  },
  {
    id: "G33",
    term: "Vena safena anterior",
    english: "Anterior saphenous vein",
    aliases: ["ASV", "AASV", "AAGSV", "safena accesoria anterior"],
    definition:
      "Tronco superficial reconocido como vena safena anterior en la posición multisocietaria de 2024. AASV y AAGSV son denominaciones históricas útiles al consultar fuentes anteriores. El nombre no implica enfermedad.",
    sourceIds: ["asv2024", "uipduplex2"],
  },
];

export const dopplerLessons: DopplerLesson[] = [
  {
    id: "DP01",
    title: "Dirección del haz y del flujo",
    intro:
      "Antes de interpretar un signo, ubica el haz y el movimiento. La dirección anatómica y la dirección respecto al transductor son referencias diferentes.",
    keyPoints: [
      "El signo Doppler depende de la proyección del movimiento sobre el haz.",
      "Una flecha hacia proximal no determina por sí sola si la señal aparece arriba o abajo de la línea base.",
      "Verifica la leyenda y orientación de la adquisición real.",
    ],
    controls: [
      {
        id: "angle",
        label: "Ángulo entre haz y flujo",
        min: 0,
        max: 180,
        step: 1,
        defaultValue: 45,
        unit: "°",
      },
      {
        id: "velocity",
        label: "Velocidad ilustrativa",
        min: -50,
        max: 50,
        step: 1,
        defaultValue: 20,
        unit: "cm/s",
      },
    ],
    sourceIds: ["uipduplex1", "dopplerphysics", "asa"],
    nature: "illustration",
    demo: "direction",
    formula: "fD = 2 · f0 · v · cos(θ) / c",
    takeaway:
      "Relaciona la señal con el haz; después tradúcela al territorio anatómico.",
  },
  {
    id: "DP02",
    title: "El mapa de color puede invertirse",
    intro:
      "La leyenda es parte de la imagen. El mismo movimiento puede cambiar de color cuando se invierte el mapa, sin cambiar la fisiología.",
    keyPoints: [
      "Rojo y azul no son etiquetas universales de arteria y vena.",
      "Una inversión de paleta no invierte el flujo real.",
      "El color complementa la evaluación; una captura estática no mide duración de reflujo.",
    ],
    controls: [
      {
        id: "invert",
        label: "Invertir mapa",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 0,
        unit: "",
      },
      {
        id: "velocity",
        label: "Señal ilustrativa",
        min: -50,
        max: 50,
        step: 1,
        defaultValue: 25,
        unit: "cm/s",
      },
    ],
    sourceIds: ["uipduplex1", "asa"],
    nature: "illustration",
    demo: "color",
    takeaway: "Conserva la leyenda al comparar y al exportar una imagen.",
  },
  {
    id: "DP03",
    title: "Encuentra la línea base",
    intro:
      "La línea base define una referencia de presentación. Observa el trazado y el cero antes de asignar un significado al signo.",
    keyPoints: [
      "La línea base puede desplazarse dentro de la pantalla.",
      "Mover la referencia no produce una nueva adquisición ni modifica el movimiento.",
      "La interpretación requiere la escala y la orientación del estudio.",
    ],
    controls: [
      {
        id: "baseline",
        label: "Desplazamiento de línea base",
        min: -40,
        max: 40,
        step: 1,
        defaultValue: 0,
        unit: "%",
      },
      {
        id: "scale",
        label: "Escala vertical ilustrativa",
        min: 20,
        max: 100,
        step: 5,
        defaultValue: 50,
        unit: "cm/s",
      },
    ],
    sourceIds: ["dicom", "dopplerphysics"],
    nature: "illustration",
    demo: "baseline",
    takeaway: "Describe la referencia antes de describir una deflexión.",
  },
  {
    id: "DP04",
    title: "Escala y fisiología son cosas distintas",
    intro:
      "Una escala más estrecha hace que una misma señal ocupe más espacio. El cambio en el dibujo puede obedecer a presentación y no a una diferencia fisiológica.",
    keyPoints: [
      "Compara unidades y escala antes de comparar altura de dos trazados.",
      "La amplitud en píxeles no es una velocidad física.",
      "En una imagen real la medida requiere la calibración de su región.",
    ],
    controls: [
      {
        id: "scale",
        label: "Escala vertical",
        min: 10,
        max: 100,
        step: 5,
        defaultValue: 40,
        unit: "cm/s",
      },
      {
        id: "velocity",
        label: "Velocidad ilustrativa",
        min: 5,
        max: 60,
        step: 1,
        defaultValue: 20,
        unit: "cm/s",
      },
    ],
    sourceIds: ["dicom", "dopplerphysics"],
    nature: "illustration",
    demo: "scale",
    takeaway: "Una comparación válida conserva o explica sus escalas.",
  },
  {
    id: "DP05",
    title: "El papel del ángulo Doppler",
    intro:
      "La ecuación proyecta el movimiento en la dirección del haz. Explora el término coseno y distingue este principio ideal de todas las condiciones de un estudio real.",
    keyPoints: [
      "Al acercarse a 90°, el componente ideal en la dirección del haz disminuye.",
      "Una pequeña incertidumbre angular puede cambiar la velocidad calculada, especialmente a ángulos altos.",
      "Los controles de este esquema no cambian el ángulo de un cine ya adquirido.",
    ],
    controls: [
      {
        id: "angle",
        label: "Ángulo",
        min: 0,
        max: 89,
        step: 1,
        defaultValue: 45,
        unit: "°",
      },
      {
        id: "frequency",
        label: "Frecuencia ilustrativa",
        min: 2,
        max: 10,
        step: 0.5,
        defaultValue: 5,
        unit: "MHz",
      },
      {
        id: "velocity",
        label: "Velocidad ilustrativa",
        min: 5,
        max: 60,
        step: 1,
        defaultValue: 20,
        unit: "cm/s",
      },
    ],
    sourceIds: ["uipduplex1", "dopplerphysics", "asa"],
    nature: "illustration",
    demo: "angle",
    formula: "fD = 2 · f0 · v · cos(θ) / c",
    takeaway:
      "La geometría de adquisición influye en la señal; anota su contexto.",
  },
  {
    id: "DP06",
    title: "Aliasing: un límite del muestreo",
    intro:
      "Una señal puede envolverse al superar el intervalo representable del muestreo pulsado. Este esquema permite distinguir el movimiento original y su representación muestreada.",
    keyPoints: [
      "En el esquema ideal, el límite simétrico corresponde a PRF/2.",
      "Un cambio aparente de signo puede ser un artefacto de representación.",
      "No se debe llamar reflujo a una inversión aparente sin revisar la adquisición.",
    ],
    controls: [
      {
        id: "prf",
        label: "PRF ilustrativa",
        min: 200,
        max: 4000,
        step: 100,
        defaultValue: 1000,
        unit: "Hz",
      },
      {
        id: "shift",
        label: "Desplazamiento Doppler",
        min: 100,
        max: 3000,
        step: 50,
        defaultValue: 800,
        unit: "Hz",
      },
    ],
    sourceIds: ["dopplerphysics"],
    nature: "illustration",
    demo: "aliasing",
    formula: "Límite de Nyquist = PRF / 2",
    takeaway:
      "Compara la señal original y la envuelta antes de interpretar su dirección.",
  },
  {
    id: "DP07",
    title: "Tiempo, evento y maniobra",
    intro:
      "Un intervalo se interpreta mejor cuando conocemos qué ocurrió y cuándo. Sitúa la maniobra y distingue el tiempo del espectro del tiempo de reproducción del cine.",
    keyPoints: [
      "El eje horizontal del espectro necesita una escala temporal válida.",
      "Cambiar la velocidad de reproducción no cambia la duración de origen.",
      "La maniobra, postura y segmento forman parte del contexto de lectura.",
    ],
    controls: [
      {
        id: "eventTime",
        label: "Momento de la maniobra",
        min: 0.5,
        max: 4,
        step: 0.1,
        defaultValue: 2,
        unit: "s",
      },
      {
        id: "duration",
        label: "Intervalo ilustrativo",
        min: 0.1,
        max: 2,
        step: 0.1,
        defaultValue: 0.8,
        unit: "s",
      },
    ],
    sourceIds: ["uipduplex1", "ksp2023", "dicom", "asa"],
    nature: "illustration",
    demo: "timing",
    takeaway: "Mide entre referencias del mismo eje calibrado.",
  },
  {
    id: "DP08",
    title: "Variación temporal del flujo",
    intro:
      "El flujo venoso puede cambiar con el tiempo. Este patrón sintético sirve para observar modulación; no representa una grabación de un paciente ni decide una causa clínica.",
    keyPoints: [
      "Un patrón temporal se relaciona con el vaso y las condiciones de registro.",
      "El tiempo de un ciclo ilustrativo no debe trasladarse a un estudio individual.",
      "Una alteración de fasicidad requiere evaluación con contexto adicional.",
    ],
    controls: [
      {
        id: "modulation",
        label: "Modulación ilustrativa",
        min: 0,
        max: 100,
        step: 5,
        defaultValue: 60,
        unit: "%",
      },
      {
        id: "period",
        label: "Periodo del esquema",
        min: 2,
        max: 8,
        step: 0.5,
        defaultValue: 4,
        unit: "s",
      },
    ],
    sourceIds: ["uipduplex1", "asa"],
    nature: "illustration",
    demo: "phasicity",
    takeaway:
      "Describe primero el patrón; interpreta después con el resto de la exploración.",
  },
  {
    id: "DP09",
    title: "Flujo femoral en un cine experimental",
    intro:
      "Recurso publicado de una adquisición femoral humana con vectores estimados por los autores. El conjunto describe un protocolo de contracción e inclinación; este extracto no incorpora metadatos individuales de Acq0.",
    keyPoints: [
      "El video conserva una reconstrucción de los autores. No son trayectorias eritrocitarias ni curvas espectrales obtenidas por la aplicación.",
      "Las demoras del GIF determinan su reproducción; no demuestran la escala temporal de la adquisición RF.",
      "No se importaron matrices de velocidades ni metadatos individuales. El visor no mide velocidad, caudal, diámetros o duración de reflujo en este recurso.",
    ],
    controls: [
      {
        id: "phase",
        label: "Posición del extracto",
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 0,
        unit: "%",
      },
      {
        id: "speed",
        label: "Velocidad de reproducción",
        min: 0.25,
        max: 2,
        step: 0.25,
        defaultValue: 1,
        unit: "×",
      },
    ],
    sourceIds: ["waterloo"],
    nature: "experimental",
    demo: "experimental",
    takeaway:
      "Distingue un flujo estimado y renderizado de una medición disponible para el visor.",
  },
  {
    id: "DP10",
    title: "Duración del flujo inverso",
    intro:
      "La duración del flujo inverso se interpreta por segmento, postura y maniobra. El esquema adopta los criterios segmentarios de SVS/AVF/AVLS; no diagnostica un caso.",
    keyPoints: [
      "SVS/AVF/AVLS: >0,5 s en troncos superficiales, venas tibiales, femoral profunda y perforantes; >1 s en femoral común, femoral y poplítea. Son criterios de implementación, no una escala de gravedad.",
      "La guía define una perforante patológica en C2 por flujo hacia afuera >0,5 s y diámetro >3,5 mm. Dirección, duración y diámetro son criterios diferentes; no se deducen de esta curva.",
      "ESVS describe variación entre >0,35 y >0,5 s para perforantes. Debe registrarse qué protocolo se aplicó. El valor exacto del umbral no cumple una condición estrictamente mayor.",
      "Documenta lado, segmento, posición y maniobra. La evaluación se realiza de pie cuando es posible, con alternativas si no se tolera; color aislado no sustituye la documentación espectral.",
    ],
    controls: [
      {
        id: "duration",
        label: "Duración ilustrativa",
        min: 0,
        max: 2,
        step: 0.05,
        defaultValue: 0.7,
        unit: "s",
      },
      {
        id: "deep",
        label: "Referencia femoropoplítea",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 0,
        unit: "",
      },
    ],
    sourceIds: [
      "uipduplex1",
      "uipduplex2",
      "svs2022",
      "svs2023",
      "esvs2022",
      "asa",
    ],
    nature: "illustration",
    demo: "reflux",
    takeaway: "Segmento, maniobra y escala dan significado a la duración.",
  },
];

export const pathways: Pathway[] = [
  {
    id: "RC01",
    title: "Un primer recorrido por FLEBO LAB",
    description:
      "Tres formas de estudiar un mismo territorio: mecanismos, adquisición y signos visibles.",
    minutes: 6,
    steps: [
      {
        title: "Mecanismo",
        body: "Abre el territorio y observa qué representa cada capa. Identifica que la red funcional es una simplificación educativa.",
        lab: "twin",
        target: "TW01",
      },
      {
        title: "Movimiento y tiempo",
        body: "Reproduce un ciclo. Pausa y relaciona el estado visible con la curva activa.",
        lab: "twin",
        target: "TW03",
      },
      {
        title: "Una adquisición real",
        body: "Abre un cine de compresión. Comprueba su segmento y lado antes de mirar la etiqueta de origen.",
        lab: "dus",
      },
      {
        title: "Observación clínica",
        body: "Compara dos vistas y describe únicamente lo que ves. Consulta el contexto después.",
        lab: "vision",
      },
      {
        title: "Procedencia",
        body: "Abre la fuente de un caso y diferencia archivo, vista y caso de origen.",
        lab: "vision",
      },
    ],
    sourceIds: ["keijsers2015", "thrombus", "tricvi"],
  },
  {
    id: "RC02",
    title: "De la válvula al retorno venoso",
    description:
      "Sigue dirección, estado valvular y flujo en una comparación controlada.",
    minutes: 7,
    steps: [
      {
        title: "Referencia competente",
        body: "Observa el escenario de referencia y la convención de flujo.",
        lab: "twin",
        target: "TW05",
      },
      {
        title: "Sigue una fase",
        body: "Pausa después de la contracción y localiza el estado de la válvula.",
        lab: "twin",
        target: "TW03",
      },
      {
        title: "Introduce fuga",
        body: "Modifica la condición valvular manteniendo las demás condiciones fijas.",
        lab: "twin",
        target: "TW06",
      },
      {
        title: "Compara curvas",
        body: "Compara signo y tiempo de flujo, conservando las mismas unidades y presión de referencia.",
        lab: "twin",
        target: "TW06",
      },
      {
        title: "Límite de la representación",
        body: "Consulta el modelo: la geometría animada no constituye una solución fluido-estructura de valvas.",
        lab: "twin",
        target: "TW05",
      },
    ],
    sourceIds: ["keijsers2015", "ferlito2026"],
  },
  {
    id: "RC03",
    title: "La pierna al cambiar de postura",
    description:
      "Relaciona alturas y referencias de presión sin contar dos veces la carga gravitacional.",
    minutes: 6,
    steps: [
      {
        title: "Red de referencia",
        body: "Identifica entrada, salida y alturas del modelo.",
        lab: "twin",
        target: "TW01",
      },
      {
        title: "Cambia la postura",
        body: "Activa el cambio de postura y observa qué variables se recalculan.",
        lab: "twin",
        target: "TW02",
      },
      {
        title: "Lee la referencia",
        body: "Distingue presión interior, exterior y potencial cuando la vista los ofrezca.",
        lab: "twin",
        target: "TW02",
      },
      {
        title: "Compara con pausa",
        body: "Usa A/B para mantener el mismo instante y la misma cámara.",
        lab: "twin",
        target: "TW02",
      },
    ],
    sourceIds: ["keijsers2015"],
  },
  {
    id: "RC04",
    title: "Contracción y relajación de la pantorrilla",
    description:
      "Conecta un mecanismo reducido con una observación experimental femoral.",
    minutes: 8,
    steps: [
      {
        title: "Ciclo de bomba",
        body: "Localiza la contracción y la relajación en el reloj del modelo.",
        lab: "twin",
        target: "TW03",
      },
      {
        title: "Activa menos la bomba",
        body: "Compara un perfil conservado y otro reducido; identifica qué parámetro cambió.",
        lab: "twin",
        target: "TW04",
      },
      {
        title: "Observa el experimento",
        body: "Abre los extractos disponibles de Waterloo y consulta su condición de adquisición.",
        lab: "dus",
        target: "DP09",
      },
      {
        title: "Separa dos tipos de evidencia",
        body: "El circuito es un modelo genérico y el extracto es una adquisición experimental. La relación es temática, no un mismo paciente.",
        lab: "dus",
        target: "DP09",
      },
    ],
    sourceIds: ["keijsers2015", "waterloo"],
  },
  {
    id: "RC05",
    title: "Vena, arteria y compresión",
    description:
      "Observa la luz y la maniobra sin convertir una etiqueta aislada en una exploración completa.",
    minutes: 7,
    steps: [
      {
        title: "Ubica el segmento",
        body: "Empieza por la ficha y el mapa de adquisición.",
        lab: "dus",
      },
      {
        title: "Mira el cine limpio",
        body: "Reproduce sin anotaciones y localiza cambios de forma.",
        lab: "dus",
      },
      {
        title: "Inspecciona el momento",
        body: "Pausa y avanza por cuadros para describir la compresión observada.",
        lab: "dus",
      },
      {
        title: "Compara otro ejemplo",
        body: "Abre un segundo caso de origen distinto y consulta sus etiquetas.",
        lab: "dus",
      },
      {
        title: "Conserva el alcance",
        body: "Una selección de compresión con el transductor no constituye una exploración diagnóstica completa de TVP ni de reflujo. Conserva la probabilidad clínica y los territorios no mostrados como información ausente.",
        lab: "dus",
      },
    ],
    sourceIds: [
      "uipduplex1",
      "thrombus",
      "asa",
      "esvsthrombosis2021",
      "aium2026",
    ],
  },
  {
    id: "RC06",
    title: "Cuatro sitios de exploración",
    description: "Recorre CFV, GS, FV y PV con el contexto de ThrombUS+.",
    minutes: 8,
    steps: [
      {
        title: "Femoral común",
        body: "Localiza el sitio CFV y sus relaciones en la región inguinal.",
        lab: "dus",
      },
      {
        title: "Unión safena",
        body: "Observa GS como sitio safeno proximal descrito por el proveedor; no garantiza mostrar el ostium exacto; evita asumir que representa el trayecto safeno completo.",
        lab: "dus",
      },
      {
        title: "Muslo",
        body: "Compara la adquisición FV con la región proximal.",
        lab: "dus",
      },
      {
        title: "Región poplítea",
        body: "Abre PV y comprueba orientación y lado.",
        lab: "dus",
      },
      {
        title: "Una ficha completa",
        body: "Reconoce qué postura, maniobra o parámetros no constan en una adquisición.",
        lab: "dus",
      },
    ],
    sourceIds: ["uipduplex1", "thrombus", "asa"],
  },
  {
    id: "RC07",
    title: "Qué representa el color Doppler",
    description:
      "Primero la leyenda y el haz; después la interpretación anatómica.",
    minutes: 6,
    steps: [
      {
        title: "Define referencias",
        body: "Relaciona haz y dirección del movimiento en el esquema.",
        lab: "dus",
        target: "DP01",
      },
      {
        title: "Invierte la paleta",
        body: "Comprueba que cambia el color mientras se conserva el movimiento.",
        lab: "dus",
        target: "DP02",
      },
      {
        title: "Comprueba la escala",
        body: "Compara la misma señal con otra escala de presentación.",
        lab: "dus",
        target: "DP04",
      },
      {
        title: "Distingue artefactos",
        body: "Observa el envolvimiento por muestreo antes de llamar inverso a un flujo.",
        lab: "dus",
        target: "DP06",
      },
    ],
    sourceIds: ["uipduplex1", "asa", "dopplerphysics"],
  },
  {
    id: "RC08",
    title: "Cómo se lee un intervalo espectral",
    description:
      "Segmento, maniobra y eje temporal dan contexto a una duración.",
    minutes: 7,
    steps: [
      {
        title: "Localiza el cero",
        body: "Reconoce línea base y unidades del espectro.",
        lab: "dus",
        target: "DP03",
      },
      {
        title: "Identifica el evento",
        body: "Sitúa el inicio de la maniobra y los límites del intervalo.",
        lab: "dus",
        target: "DP07",
      },
      {
        title: "Mide el tiempo",
        body: "Explora el ejemplo calibrado sin confundirlo con la velocidad del reproductor.",
        lab: "dus",
        target: "DP10",
      },
      {
        title: "Consulta el territorio",
        body: "Revisa los criterios diferenciados y el contexto que requeriría un estudio real.",
        lab: "dus",
        target: "DP10",
      },
    ],
    sourceIds: ["uipduplex1", "svs2022", "asa", "dicom"],
  },
  {
    id: "RC09",
    title: "Telangiectasias, reticulares y várices",
    description:
      "Practica descripción visual y compara con la etiqueta de origen.",
    minutes: 7,
    steps: [
      {
        title: "Observa distribución",
        body: "Explora imágenes de C1 y describe patrón y localización sin deducir síntomas.",
        lab: "vision",
        target: "C1",
      },
      {
        title: "Compara calibre aparente",
        body: "Compara un ejemplo C2 con otro de la misma región; recuerda que los píxeles no calibran diámetro.",
        lab: "vision",
        target: "C2",
      },
      {
        title: "Amplía con criterio",
        body: "Acércate hasta el detalle real del archivo y vuelve a la vista de contexto.",
        lab: "vision",
      },
      {
        title: "Consulta el caso",
        body: "Distingue signo visible, clase aportada por la fuente y datos faltantes.",
        lab: "vision",
      },
    ],
    sourceIds: ["ceap2020", "tricvi"],
  },
  {
    id: "RC10",
    title: "Cambios de piel y heridas",
    description:
      "Una fotografía ilustra un hallazgo; la etiología exige contexto.",
    minutes: 8,
    steps: [
      {
        title: "Describe el aspecto",
        body: "Observa color, textura y distribución en los ejemplos C4.",
        lab: "vision",
        target: "C4",
      },
      {
        title: "Conserva la historia",
        body: "En C5 consulta qué información sustenta que existió una úlcera.",
        lab: "vision",
        target: "C5",
      },
      {
        title: "Observa una herida",
        body: "En C6 separa la descripción del defecto visible de la atribución etiológica de origen.",
        lab: "vision",
        target: "C6",
      },
      {
        title: "Compara sin diagnosticar",
        body: "Relaciona diferencias entre vistas y consulta los límites de la fotografía.",
        lab: "vision",
      },
    ],
    sourceIds: ["ceap2020", "esvs2022", "tricvi"],
  },
  {
    id: "RC11",
    title: "Obstrucción y reflujo como mecanismos distintos",
    description:
      "Compara una vía de salida limitada y una fuga valvular con condiciones explícitas.",
    minutes: 7,
    steps: [
      {
        title: "Resistencia de salida",
        body: "Observa qué modifica el escenario de resistencia proximal.",
        lab: "twin",
        target: "TW09",
      },
      {
        title: "Fuga valvular",
        body: "Compara con un cambio de conductancia inversa.",
        lab: "twin",
        target: "TW06",
      },
      {
        title: "Salida alternativa",
        body: "Explora la conexión colateral genérica incluida en la red.",
        lab: "twin",
        target: "TW10",
      },
      {
        title: "Observación y mecanismo",
        body: "Relaciona estas ideas con los datos apropiados; un patrón aislado no identifica todas las causas posibles.",
        lab: "dus",
        target: "DP08",
      },
    ],
    sourceIds: ["esvs2022", "ferlito2026"],
  },
  {
    id: "RC12",
    title: "Dos modalidades del mismo caso",
    description:
      "Compara RGB y termografía preservando identidad de caso y escala.",
    minutes: 6,
    steps: [
      {
        title: "Verifica la pareja",
        body: "Selecciona una pareja identificada por caso y vista.",
        lab: "vision",
      },
      {
        title: "Describe la RGB",
        body: "Enumera hallazgos visibles sin usar el color térmico como etiología.",
        lab: "vision",
      },
      {
        title: "Revisa la térmica",
        body: "Compara cualitativamente las representaciones originales. No se dispone de matriz térmica calibrada ni se verificó registro geométrico o sincronía entre modalidades; el color no asigna etiología.",
        lab: "vision",
      },
      {
        title: "Define el alcance",
        body: "Ambas modalidades se complementan como material docente. La pareja no confirma reflujo ni sustituye al dúplex.",
        lab: "vision",
      },
    ],
    sourceIds: ["tricvi", "esvs2022"],
  },
];

export const observationGuides: ObservationGuide[] = [
  {
    id: "C0",
    title: "C0 · Sin signos venosos visibles o palpables documentados",
    visibleFindings: [
      "Describe la superficie y la distribución visibles en la fotografía.",
    ],
    contextNeeded: [
      "La ausencia de signos en una fotografía no informa todos los síntomas ni el examen palpable.",
    ],
    limitations: [
      "No equivale a descartar enfermedad venosa mediante una imagen.",
    ],
    sources: ["ceap2020", "tricvi"],
  },
  {
    id: "C1",
    title: "C1 · Telangiectasias o venas reticulares",
    visibleFindings: [
      "Patrón vascular superficial, distribución y zona anatómica.",
    ],
    contextNeeded: ["Correlación con exploración y el rótulo de origen."],
    limitations: [
      "No deducir síntomas, diámetro físico o reflujo a partir de píxeles.",
    ],
    sources: ["ceap2020", "tricvi"],
  },
  {
    id: "C2",
    title: "C2 · Várices documentadas en el caso",
    visibleFindings: ["Trayecto superficial prominente y morfología visible."],
    contextNeeded: [
      "Historia si se quiere indicar recurrencia; exploración y estudio anatómico cuando corresponda.",
    ],
    limitations: [
      "Una fotografía no determina el origen del reflujo ni toda su extensión.",
    ],
    sources: ["ceap2020", "esvs2022", "tricvi"],
  },
  {
    id: "C3",
    title: "C3 · Edema documentado",
    visibleFindings: [
      "Cambios de contorno o volumen aparentes que pueden describirse como observación.",
    ],
    contextNeeded: [
      "Exploración, evolución y otras causas posibles del aumento de volumen.",
    ],
    limitations: [
      "La fotografía aislada no confirma edema ni su etiología venosa.",
    ],
    sources: ["uipedema", "ceap2020", "esvs2022", "tricvi"],
  },
  {
    id: "C4",
    title: "C4 · Cambios de piel y tejido subcutáneo",
    visibleFindings: [
      "Color, textura, localización y extensión del cambio observado.",
    ],
    contextNeeded: [
      "La subclase solo se muestra si está documentada: C4a, C4b o C4c; consulta la fuente.",
    ],
    limitations: [
      "El aspecto puede superponerse con otras dermatosis. Una etiqueta C4 genérica no autoriza inventar una subclase.",
    ],
    sources: ["ceap2020", "esvs2022", "tricvi"],
  },
  {
    id: "C5",
    title: "C5 · Úlcera venosa cicatrizada documentada",
    visibleFindings: [
      "Área de piel cicatrizada y cambios acompañantes descritos por el origen.",
    ],
    contextNeeded: [
      "Historia que documente la úlcera previa y su atribución venosa.",
    ],
    limitations: [
      "Una cicatriz o cambio de color sin historia no establece por sí solo C5.",
    ],
    sources: ["ceap2020", "esvs2022", "tricvi"],
  },
  {
    id: "C6",
    title: "C6 · Úlcera venosa activa documentada",
    visibleFindings: [
      "Localización, contorno y superficie de la lesión visible.",
    ],
    contextNeeded: [
      "Información que sustente la etiología y una evaluación clínica completa de la herida.",
    ],
    limitations: [
      "La imagen no permite valorar todos los componentes de la lesión ni excluir otras etiologías.",
    ],
    sources: ["ceap2020", "esvs2022", "tricvi"],
  },
];

export const plates: EducationalPlate[] = [
  {
    id: "PL01",
    title: "El retorno necesita una referencia",
    description: "Presión, altura y conexiones forman un sistema.",
    path: "/media/plates/pl01.svg",
    sourceIds: ["keijsers2015"],
    nature: "illustration",
    credit: "Esquema original de FLEBO LAB IMF, 2026",
  },
  {
    id: "PL02",
    title: "Superficial y profundo",
    description: "Una relación espacial que ayuda a organizar la observación.",
    path: "/media/plates/pl02.svg",
    sourceIds: ["uipduplex1", "uipduplex2", "asa", "esvs2022"],
    nature: "illustration",
    credit: "Esquema original de FLEBO LAB IMF, 2026",
  },
  {
    id: "PL03",
    title: "Postura y carga gravitacional",
    description: "El potencial se interpreta con la altura y su referencia.",
    path: "/media/plates/pl03.svg",
    sourceIds: ["keijsers2015"],
    nature: "illustration",
    credit: "Esquema original de FLEBO LAB IMF, 2026",
  },
  {
    id: "PL04",
    title: "La bomba tiene dos fases",
    description:
      "Contracción y relajación cambian las condiciones del circuito.",
    path: "/media/plates/pl04.svg",
    sourceIds: ["keijsers2015"],
    nature: "illustration",
    credit: "Esquema original de FLEBO LAB IMF, 2026",
  },
  {
    id: "PL05",
    title: "Competencia y fuga valvular",
    description: "Dos configuraciones de una representación educativa.",
    path: "/media/plates/pl05.svg",
    sourceIds: ["keijsers2015", "ferlito2026"],
    nature: "illustration",
    credit: "Esquema original de FLEBO LAB IMF, 2026",
  },
  {
    id: "PL06",
    title: "Presión transmural",
    description:
      "La diferencia entre interior y exterior da contexto al volumen.",
    path: "/media/plates/pl06.svg",
    sourceIds: ["keijsers2015"],
    nature: "illustration",
    credit: "Esquema original de FLEBO LAB IMF, 2026",
  },
  {
    id: "PL07",
    title: "Conservar volumen",
    description: "El cambio de volumen corresponde al balance del circuito.",
    path: "/media/plates/pl07.svg",
    sourceIds: ["keijsers2015", "svzerod"],
    nature: "illustration",
    credit: "Esquema original de FLEBO LAB IMF, 2026",
  },
  {
    id: "PL08",
    title: "Una salida alternativa",
    description: "Una conexión solo modifica el cálculo si existe en la red.",
    path: "/media/plates/pl08.svg",
    sourceIds: ["ferlito2026", "svzerod"],
    nature: "illustration",
    credit: "Esquema original de FLEBO LAB IMF, 2026",
  },
  {
    id: "PL09",
    title: "Observar una compresión",
    description: "La secuencia importa más que una captura aislada.",
    path: "/media/plates/pl09.svg",
    sourceIds: ["uipduplex1", "uipduplex2", "thrombus", "asa"],
    nature: "illustration",
    credit: "Esquema original de FLEBO LAB IMF, 2026",
  },
  {
    id: "PL10",
    title: "Vista transversal y longitudinal",
    description: "Conserva orientación, lado y segmento al comparar.",
    path: "/media/plates/pl10.svg",
    sourceIds: ["uipduplex1", "uipduplex2", "asa"],
    nature: "illustration",
    credit: "Esquema original de FLEBO LAB IMF, 2026",
  },
  {
    id: "PL11",
    title: "El color necesita una leyenda",
    description: "Invertir el mapa no cambia el movimiento real.",
    path: "/media/plates/pl11.svg",
    sourceIds: ["uipduplex1", "uipduplex2", "asa"],
    nature: "illustration",
    credit: "Esquema original de FLEBO LAB IMF, 2026",
  },
  {
    id: "PL12",
    title: "Los ejes dan significado al espectro",
    description:
      "Representación sintética de una señal; no es una adquisición.",
    path: "/media/plates/pl12.svg",
    sourceIds: ["dicom", "dopplerphysics"],
    nature: "illustration",
    credit: "Esquema original de FLEBO LAB IMF, 2026",
  },
  {
    id: "PL13",
    title: "Una duración pertenece a un eje calibrado",
    description: "La velocidad del reproductor no cambia el tiempo de origen.",
    path: "/media/plates/pl13.svg",
    sourceIds: ["uipduplex1", "uipduplex2", "dicom", "asa"],
    nature: "illustration",
    credit: "Esquema original de FLEBO LAB IMF, 2026",
  },
  {
    id: "PL14",
    title: "La señal depende de una proyección",
    description: "El ángulo comparte vértice con haz y movimiento.",
    path: "/media/plates/pl14.svg",
    sourceIds: ["dopplerphysics"],
    nature: "illustration",
    credit: "Esquema original de FLEBO LAB IMF, 2026",
  },
  {
    id: "PL15",
    title: "Aliasing y señal original",
    description: "f aparente = ((f + PRF/2) módulo PRF) − PRF/2",
    path: "/media/plates/pl15.svg",
    sourceIds: ["dopplerphysics"],
    nature: "illustration",
    credit: "Esquema original de FLEBO LAB IMF, 2026",
  },
  {
    id: "PL16",
    title: "Maniobra, segmento y tiempo",
    description:
      "El registro debe permitir relacionar un evento con la respuesta.",
    path: "/media/plates/pl16.svg",
    sourceIds: ["uipduplex1", "uipduplex2", "asa", "svs2022"],
    nature: "illustration",
    credit: "Esquema original de FLEBO LAB IMF, 2026",
  },
  {
    id: "PL17",
    title: "CEAP: descripción con contexto",
    description: "Una guía de lectura, no un clasificador por apariencia.",
    path: "/media/plates/pl17.svg",
    sourceIds: ["ceap2020", "esvs2022"],
    nature: "illustration",
    credit: "Esquema original de FLEBO LAB IMF, 2026",
  },
  {
    id: "PL18",
    title: "Dos modalidades, un mismo caso",
    description:
      "Conserva la relación de vista y las escalas de cada modalidad.",
    path: "/media/plates/pl18.svg",
    sourceIds: ["tricvi"],
    nature: "illustration",
    credit: "Esquema original de FLEBO LAB IMF, 2026",
  },
];

export const animations: EducationalPlate[] = [
  {
    id: "AN01",
    title: "Válvula y dirección",
    description: "Movimiento conceptual ligado a una dirección de referencia.",
    path: "/media/animations/an01.svg",
    sourceIds: ["keijsers2015"],
    nature: "illustration",
    credit: "Animación vectorial original de FLEBO LAB IMF, 2026",
  },
  {
    id: "AN02",
    title: "Postura y referencia",
    description:
      "Una columna de altura ayuda a relacionar potencial y posición.",
    path: "/media/animations/an02.svg",
    sourceIds: ["keijsers2015"],
    nature: "illustration",
    credit: "Animación vectorial original de FLEBO LAB IMF, 2026",
  },
  {
    id: "AN03",
    title: "Dos fases de la bomba",
    description: "Esquema de contracción y relajación, sin unidades clínicas.",
    path: "/media/animations/an03.svg",
    sourceIds: ["keijsers2015"],
    nature: "illustration",
    credit: "Animación vectorial original de FLEBO LAB IMF, 2026",
  },
  {
    id: "AN04",
    title: "Presión y sección",
    description:
      "Cambio conceptual de calibre; no es una respuesta calculada de pared.",
    path: "/media/animations/an04.svg",
    sourceIds: ["keijsers2015"],
    nature: "illustration",
    credit: "Animación vectorial original de FLEBO LAB IMF, 2026",
  },
  {
    id: "AN05",
    title: "Compresión: observa una secuencia",
    description:
      "La maniobra tiene tiempo; una sola captura muestra solo un momento.",
    path: "/media/animations/an05.svg",
    sourceIds: ["asa", "thrombus"],
    nature: "illustration",
    credit: "Animación vectorial original de FLEBO LAB IMF, 2026",
  },
  {
    id: "AN06",
    title: "Un cursor y un mismo tiempo",
    description: "Escena y curva deben leer la misma serie temporal.",
    path: "/media/animations/an06.svg",
    sourceIds: ["dicom"],
    nature: "illustration",
    credit: "Animación vectorial original de FLEBO LAB IMF, 2026",
  },
];
