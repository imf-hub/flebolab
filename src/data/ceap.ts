import images from "./vision";

export const clinicalClasses = [
  {
    id: "C0",
    name: "Sin signos visibles o palpables",
    short: "Sin signos",
    observe: "Describe lo que puedes ver y lo que la fotografía no muestra.",
    context:
      "C0 no significa ausencia de síntomas. La palpación y la historia no están contenidas en una foto.",
    question:
      "¿Qué dato de exploración te falta para completar esta descripción?",
  },
  {
    id: "C1",
    name: "Telangiectasias o venas reticulares",
    short: "Telangiectasias / reticulares",
    observe:
      "Observa el patrón superficial, su distribución y el contexto del tobillo y el pie.",
    context:
      "C1 admite telangiectasias o reticulares. No midas diámetro real desde una imagen sin escala validada.",
    question:
      "¿Puedes describir el patrón sin atribuirle un circuito de reflujo?",
  },
  {
    id: "C2",
    name: "Várices",
    short: "Várices",
    observe:
      "Sigue los trayectos superficiales visibles y compara su distribución.",
    context:
      "La recurrencia C2r requiere antecedentes. La imagen no establece por sí sola síntomas ni anatomía de reflujo.",
    question: "¿Qué preguntarías antes de añadir la r de recurrencia?",
  },
  {
    id: "C3",
    name: "Edema",
    short: "Edema",
    observe:
      "Observa contorno y asimetría; después identifica qué requiere examen físico.",
    context:
      "La fotografía aislada no confirma edema ni demuestra su causa venosa. Hace falta exploración y contexto clínico.",
    question: "¿Qué hallazgo tendrías que comprobar directamente?",
  },
  {
    id: "C4",
    name: "Cambios cutáneos y subcutáneos",
    short: "Cambios cutáneos",
    observe:
      "Describe superficie, color y localización. Distingue las subclases antes de nombrarlas.",
    context:
      "El banco etiqueta C4 de forma general. Sus fotos no están reclasificadas por la aplicación como C4a, C4b o C4c.",
    question:
      "¿Qué observación y qué dato clínico necesitas para distinguir las subclases?",
  },
  {
    id: "C5",
    name: "Úlcera venosa cicatrizada",
    short: "Úlcera cicatrizada",
    observe:
      "Describe el área cicatricial y contrástala con los antecedentes de ulceración.",
    context:
      "Una cicatriz visible no demuestra por sí sola una úlcera venosa previa. Se necesita la historia clínica.",
    question: "¿Cómo confirmarías el antecedente y su naturaleza venosa?",
  },
  {
    id: "C6",
    name: "Úlcera venosa activa",
    short: "Úlcera activa",
    observe:
      "Describe la pérdida de continuidad de la piel y su distribución, sin deducir la etiología desde el color.",
    context:
      "La causa venosa y la recurrencia C6r requieren valoración e historia; una fotografía no excluye otras etiologías.",
    question:
      "¿Qué información falta para sostener la etiología y la recurrencia?",
  },
] as const;
export type ClinicalClass = (typeof clinicalClasses)[number]["id"];
export const c4Subclasses = [
  {
    id: "C4a",
    name: "Pigmentación o eccema",
    note: "Dos hallazgos alternativos dentro de esta subclase.",
  },
  {
    id: "C4b",
    name: "Lipodermatosclerosis o atrofia blanca",
    note: "La induración y el contexto requieren exploración clínica.",
  },
  {
    id: "C4c",
    name: "Corona flebectásica",
    note: "Patrón de pequeñas venas intradérmicas en abanico en tobillo y pie. Incorporada a C4 en 2020; no equivale a cualquier telangiectasia aislada.",
  },
] as const;
export const ceapDomains = [
  {
    id: "C",
    name: "Clínica",
    question: "¿Qué manifestaciones presenta el miembro?",
    method:
      "Historia y exploración clínica. Las fotografías apoyan la descripción visible.",
    codes: [],
  },
  {
    id: "E",
    name: "Etiología",
    question: "¿Cuál es el origen del trastorno?",
    method:
      "Historia, evaluación clínica y estudios pertinentes; no se asigna por el aspecto de una foto.",
    codes: [
      { id: "Ep", name: "Primaria" },
      { id: "Es", name: "Secundaria" },
      { id: "Esi", name: "Secundaria intravenosa" },
      { id: "Ese", name: "Secundaria extravenosa" },
      { id: "Ec", name: "Congénita" },
      { id: "En", name: "Sin causa identificada" },
    ],
  },
  {
    id: "A",
    name: "Anatomía",
    question: "¿Qué territorio venoso está involucrado?",
    method:
      "Se documenta el territorio y, cuando corresponde, los segmentos con evaluación anatómica y dúplex.",
    codes: [
      { id: "As", name: "Superficial" },
      { id: "Ad", name: "Profundo" },
      { id: "Ap", name: "Perforantes" },
      { id: "An", name: "Sin localización venosa identificada" },
    ],
  },
  {
    id: "P",
    name: "Fisiopatología",
    question: "¿Qué alteración funcional se documenta?",
    method:
      "Requiere el estudio funcional correspondiente. Un mapa de color o una fotografía aislados no lo completan.",
    codes: [
      { id: "Pr", name: "Reflujo" },
      { id: "Po", name: "Obstrucción" },
      { id: "Pr,o", name: "Reflujo y obstrucción" },
      { id: "Pn", name: "Sin fisiopatología venosa identificada" },
    ],
  },
] as const;
export const ceapQuestions = [
  {
    id: "clinical",
    question: "En CEAP, ¿qué describe la C?",
    options: [
      "Las manifestaciones clínicas",
      "Una puntuación global de gravedad",
      "La causa de la enfermedad",
    ],
    answer: 0,
    explanation:
      "C es clínica. CEAP describe; no sustituye una escala de gravedad como VCSS.",
  },
  {
    id: "corona",
    question: "¿Dónde se sitúa la corona flebectásica en CEAP 2020?",
    options: ["Siempre en C1", "En C4c", "En C6r"],
    answer: 1,
    explanation:
      "La revisión 2020 incorpora C4c. Debe distinguirse el patrón de corona de una telangiectasia aislada.",
  },
  {
    id: "recurrence",
    question: "¿Qué hace falta antes de añadir r a C2 o C6?",
    options: [
      "El color de la fotografía",
      "Un mayor número de vasos visibles",
      "Antecedentes de recurrencia documentados",
    ],
    answer: 2,
    explanation:
      "La recurrencia es una definición clínica. La r se aplica a C2r y C6r, y no se deduce de una foto.",
  },
  {
    id: "basic",
    question:
      "Un caso docente presenta C2 y C4a en el mismo miembro. ¿Qué C registra el CEAP básico?",
    options: ["C2", "C4a", "La media de ambos códigos"],
    answer: 1,
    explanation:
      "El básico consigna la clase C más alta por miembro; el avanzado enumera las clases presentes. El caso es ficticio.",
  },
  {
    id: "symptoms",
    question:
      "¿Se pueden asignar los calificadores sintomático o asintomático desde una fotografía?",
    options: [
      "Sí, por la extensión visible",
      "Sí, si conocemos la clase C",
      "No; hace falta la historia de síntomas",
    ],
    answer: 2,
    explanation:
      "Los calificadores s y a indican presencia o ausencia de síntomas atribuibles al trastorno venoso; no se observan en la imagen.",
  },
  {
    id: "missing",
    question:
      "Si no se ha evaluado la fisiopatología, ¿corresponde escribir Pn automáticamente?",
    options: [
      "No: dato faltante no equivale a un resultado negativo",
      "Sí: significa no evaluado",
      "Solo cuando la fotografía es C0",
    ],
    answer: 0,
    explanation:
      "Los códigos n expresan ausencia de una causa, localización o fisiopatología identificada tras valorar ese dominio; no sustituyen datos faltantes.",
  },
] as const;
export function clinicalClass(value: string | null): ClinicalClass {
  return clinicalClasses.some((item) => item.id === value)
    ? (value as ClinicalClass)
    : "C2";
}
export function classExamples(id: ClinicalClass) {
  // Selection by useful framing, preserving every provider label and view ID.
  // C5/C6 use two views of one record where the area is less obscured; these are not two cases.
  const curated: Partial<Record<ClinicalClass, string[]>> = {
    C4: ["vision-c4-004-v5", "vision-c4-001-v1"],
    C5: ["vision-c5-001-v5", "vision-c5-001-v1"],
    C6: ["vision-c6-003-v1", "vision-c6-003-v5"],
  };
  if (curated[id])
    return curated[id]!.map((key) => images.find((image) => image.id === key)!);
  const seen = new Set<string>();
  return images
    .filter((image) => {
      if (
        image.ceap !== id ||
        image.viewIndex !== 1 ||
        seen.has(image.sourceCaseId)
      )
        return false;
      seen.add(image.sourceCaseId);
      return true;
    })
    .slice(0, 2);
}
