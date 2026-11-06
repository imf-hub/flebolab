import { defaults, sanitize, scenarios, type Parameters } from "./model";
export type ViewMode = "flow" | "valve" | "anatomy" | "circuit";
export type Focus =
  | "posture"
  | "pump"
  | "valve"
  | "perforator"
  | "obstruction"
  | "collateral"
  | "compression"
  | "integrated";
export type Metric = "flow" | "pressure" | "volume";
export const presentations: Record<
  string,
  {
    short: string;
    view: ViewMode;
    focus: Focus;
    metric: Metric;
    compare: string;
    cue: string;
  }
> = {
  TW01: {
    short: "Decúbito",
    view: "flow",
    focus: "posture",
    metric: "pressure",
    compare: "TW02",
    cue: "Rota la referencia y observa la carga gravitacional.",
  },
  TW02: {
    short: "Bipedestación",
    view: "flow",
    focus: "posture",
    metric: "pressure",
    compare: "TW01",
    cue: "La altura modifica el potencial y la presión de la red.",
  },
  TW03: {
    short: "Bomba activa",
    view: "flow",
    focus: "pump",
    metric: "flow",
    compare: "TW04",
    cue: "La contracción y la onda de flujo comparten el mismo ciclo.",
  },
  TW04: {
    short: "Bomba reducida",
    view: "flow",
    focus: "pump",
    metric: "flow",
    compare: "TW03",
    cue: "Compara la amplitud con una activación muscular mayor.",
  },
  TW05: {
    short: "Válvula competente",
    view: "valve",
    focus: "valve",
    metric: "flow",
    compare: "TW06",
    cue: "El cierre ideal bloquea el flujo inverso de esta rama.",
  },
  TW06: {
    short: "Fuga valvular",
    view: "valve",
    focus: "valve",
    metric: "flow",
    compare: "TW05",
    cue: "El hueco ilustrativo acompaña al flujo inverso calculado.",
  },
  TW07: {
    short: "Comunicación",
    view: "flow",
    focus: "perforator",
    metric: "flow",
    compare: "TW08",
    cue: "La rama verde comunica los compartimentos distales.",
  },
  TW08: {
    short: "Menor conexión",
    view: "flow",
    focus: "perforator",
    metric: "flow",
    compare: "TW07",
    cue: "La conductancia cambia el flujo de la conexión resaltada.",
  },
  TW09: {
    short: "Resistencia de salida",
    view: "flow",
    focus: "obstruction",
    metric: "pressure",
    compare: "TW10",
    cue: "El marcador naranja indica resistencia, no una estenosis anatómica.",
  },
  TW10: {
    short: "Vía colateral",
    view: "flow",
    focus: "collateral",
    metric: "pressure",
    compare: "TW09",
    cue: "Aparece una rama adicional con su propio flujo calculado.",
  },
  TW11: {
    short: "Presión exterior",
    view: "flow",
    focus: "compression",
    metric: "volume",
    compare: "baseline",
    cue: "La presión exterior cambia el volumen superficial de la red.",
  },
  TW12: {
    short: "Mecanismos combinados",
    view: "flow",
    focus: "integrated",
    metric: "flow",
    compare: "baseline",
    cue: "Explora bomba, conductancia inversa y presión exterior juntas.",
  },
};
export function scenarioParameters(id: string): Parameters {
  return sanitize({
    ...defaults,
    ...(scenarios.find((s) => s.id === id)?.params ?? {}),
  });
}
export function parseTwinQuery(query: URLSearchParams) {
  const scenario =
    scenarios.find((s) => s.id === query.get("scenario"))?.id ?? "TW01";
  let parameters = scenarioParameters(scenario);
  try {
    const value = JSON.parse(query.get("p") ?? "null");
    if (value && typeof value === "object" && !Array.isArray(value))
      parameters = sanitize({ ...parameters, ...value });
  } catch {
    /* Un enlace incompleto vuelve al perfil declarado. */
  }
  const proposed = query.get("view");
  const view: ViewMode = ["flow", "valve", "anatomy", "circuit"].includes(
    proposed ?? "",
  )
    ? (proposed as ViewMode)
    : presentations[scenario].view;
  return {
    scenario,
    parameters,
    view,
    custom:
      JSON.stringify(parameters) !==
      JSON.stringify(scenarioParameters(scenario)),
  };
}
