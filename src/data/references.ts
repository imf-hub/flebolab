import uip from "./clinical-uip.json";
import vascular from "./clinical-vascular.json";
import science from "./clinical-science.json";

export type MedicalReference = {
  id: string;
  title: string;
  authors: string;
  year: number | null;
  journal: string | null;
  doi?: string | null;
  url: string;
  organization: string;
  kind: string;
  access: string;
  locator: string;
  scope: string;
  limitations: string;
  rank: number;
};
export const revisionDate = "6 de noviembre de 2026";
export const medicalReferences: MedicalReference[] = [
  ...uip,
  ...vascular,
  ...science,
].sort((a, b) => a.rank - b.rank);
export const controversies = [
  {
    id: "reflujo",
    title: "Un umbral de reflujo no sirve para todos los segmentos",
    text: "UIP 2006 describía >0,5 s y reconocía falta de acuerdo definitivo. SVS/AVF/AVLS diferencia >0,5 s en troncos superficiales, tibiales, femoral profunda y perforantes, y >1 s en femoral común, femoral y poplítea. El modelo docente adopta esta distinción. Son criterios de implementación; no heredan automáticamente el grado de la recomendación general de usar dúplex.",
    consequence:
      "Registrar segmento, lado, postura y maniobra. El tiempo de un cine B-mode no mide la duración espectral del reflujo.",
    refs: ["uipduplex1", "svs2022", "svs2023"],
  },
  {
    id: "perforantes",
    title:
      "Perforantes: dirección, duración y diámetro son criterios distintos",
    text: "ESVS recoge la variación entre >0,35 y >0,5 s para flujo hacia afuera. SVS/AVF/AVLS Parte II (2023) emplea flujo exterior >0,5 s y diámetro >3,5 mm para una perforante patológica en C2. La Parte I (2022) redactó este criterio con ≥0,5 s y ≥3,5 mm; esta app adopta la notación de 2023 y explicita la diferencia en el límite. No son definiciones universales de toda perforante ni una indicación de tratamiento por sí solas.",
    consequence:
      "Declarar el protocolo usado, la clase clínica y las condiciones de medición; no aplicar estos cortes a una fotografía ni a un esquema sin calibración.",
    refs: ["esvs2022", "svs2022", "svs2023"],
  },
  {
    id: "ceap",
    title: "CEAP describe el miembro; la fotografía muestra una vista",
    text: "CEAP 2020 distingue C4a (pigmentación o eccema), C4b (lipodermatoesclerosis o atrofia blanca) y C4c (corona flebectásica). CEAP básico registra la clase clínica más alta por miembro; avanzado documenta las clases presentes. La clase no sustituye una escala de gravedad ni documenta por sí sola síntomas, etiología, anatomía o fisiopatología.",
    consequence:
      "Se conservan las clases de origen de TRICVI–C. C4 no se convierte retrospectivamente en C4a/b/c. Edema, cicatriz y herida necesitan historia y exploración; la apariencia no demuestra causa venosa.",
    refs: ["ceap2020", "esvs2022"],
  },
  {
    id: "nomenclatura",
    title: "La vena safena anterior tiene una nomenclatura actualizada",
    text: "La posición de 2024 respaldada por AVLS, AVF y UIP propone anterior saphenous vein (ASV), vena safena anterior, en lugar de anterior accessory saphenous vein. AASV y AAGSV permanecen como sinónimos históricos útiles al consultar estudios anteriores.",
    consequence:
      "La nomenclatura actual convive con los rótulos originales de los bancos. Un cambio de nombre no implica enfermedad o indicación terapéutica.",
    refs: ["asv2024", "uipduplex2"],
  },
  {
    id: "termografia",
    title: "Una imagen térmica no equivale a un examen dúplex",
    text: "TRICVI–C aporta imágenes emparejadas RGB y térmicas. Su paleta y los valores incrustados pertenecen al archivo original. Este visor no ha validado la calibración radiométrica ni reconstruye una matriz de temperaturas a partir de sus colores. La comparación es docente; no se atribuye precisión diagnóstica al visor.",
    consequence:
      "No se usa la termografía para inferir permeabilidad, reflujo, trombosis o etiología de una lesión. El protocolo dúplex exige información distinta.",
    refs: ["uipduplex1", "esvs2022", "tricvi"],
  },
  {
    id: "simulacion",
    title:
      "Coherencia numérica y validación fisiológica son verificaciones diferentes",
    text: "FleboTwin conserva volumen y se comprueba dentro de un dominio numérico declarado. Es una red educativa propia de unidades relativas. Las guías clínicas y los modelos de investigación citados no calibran automáticamente sus parámetros ni avalan sus resultados como mediciones de paciente.",
    consequence:
      "Las partículas señalan transporte simbólico según el flujo calculado; no son trayectorias eritrocitarias ni velocidades anatómicas. La presión exterior del modelo no equivale a mmHg o a una clase de media de compresión.",
    refs: ["uiphemodynamics", "esvs2022", "keijsers2015", "ferlito2026"],
  },
];
