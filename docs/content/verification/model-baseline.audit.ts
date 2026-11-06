/** Modelo educativo genérico 0D. Unidades relativas, sin calibración de paciente. */
export type Parameters = {
  posture: number;
  pump: number;
  leak: number;
  obstruction: number;
  compression: number;
  perforator: number;
  collateral: boolean;
  period: number;
};
export const defaults: Parameters = {
  posture: 75,
  pump: 1,
  leak: 0.02,
  obstruction: 1,
  compression: 0,
  perforator: 1,
  collateral: false,
  period: 5,
};
export type Sample = {
  t: number;
  pressure: number;
  superficialPressure: number;
  flow: number;
  superficialFlow: number;
  volume: number;
  pump: number;
  valve: number;
  perforator: number;
  reflux: number;
};
export type Solution = {
  samples: Sample[];
  parameters: Parameters;
  modelVersion: string;
  balanceError: number;
  netReturn: number;
  refluxVolume: number;
  meanPressure: number;
  peakPressure: number;
  period: number;
};
export const modelVersion = "imf-0d-relative-1.0";
export function activation(t: number, period: number) {
  const p = (((t % period) + period) % period) / period;
  return p < 0.4 ? Math.sin((Math.PI * p) / 0.4) ** 2 : 0;
}
export function valveFlow(
  headDifference: number,
  resistance: number,
  leak: number,
) {
  return (
    (headDifference / resistance) *
    (headDifference >= 0 ? 1 : Math.max(0, Math.min(1, leak)))
  );
}
export function sanitize(p: Partial<Parameters>): Parameters {
  const d = { ...defaults, ...p };
  return {
    posture: Math.min(90, Math.max(0, +d.posture || 0)),
    pump: Math.min(1.6, Math.max(0, +d.pump || 0)),
    leak: Math.min(1, Math.max(0, +d.leak || 0)),
    obstruction: Math.min(8, Math.max(1, +d.obstruction || 1)),
    compression: Math.min(2.5, Math.max(0, +d.compression || 0)),
    perforator: Math.min(1.6, Math.max(0, +d.perforator || 0)),
    collateral: !!d.collateral,
    period: Math.min(10, Math.max(2, +d.period || 5)),
  };
}
export function solve(input: Partial<Parameters>, dt = 0.01): Solution {
  const p = sanitize(input),
    C = [4, 3.4, 5, 4.2],
    v0 = [12, 10, 11, 9],
    V = [...v0];
  const z = [0.12, 0.84, 0.1, 0.86],
    gravity = 4 * Math.sin((p.posture * Math.PI) / 180),
    central = 0.6 + gravity * 1.2;
  const warmup = p.period * 12,
    duration = p.period * 2,
    total = warmup + duration,
    steps = Math.round(total / dt);
  let inflow = 0,
    outflow = 0,
    windowOut = 0,
    refluxVolume = 0;
  const samples: Sample[] = [];
  for (let k = 0; k <= steps; k++) {
    const t = k * dt,
      a = activation(t, p.period),
      external = [
        2.8 * p.pump * a,
        0.25 * p.pump * a,
        p.compression,
        p.compression * 0.6,
      ];
    const pressure = V.map((v, i) => 1 + (v - v0[i]) / C[i] + external[i]);
    const head = pressure.map((q, i) => q + gravity * z[i]);
    const deep = valveFlow(head[0] - head[1], 1.35, p.leak),
      sup = valveFlow(head[2] - head[3], 2, p.leak);
    const deepOut = valveFlow(head[1] - central, 1.6 * p.obstruction, p.leak),
      supOut = valveFlow(head[3] - central, 2.5, p.leak);
    const perf =
      valveFlow(head[2] - head[0], 3.5, Math.max(0.01, p.leak)) * p.perforator;
    const coll = p.collateral ? valveFlow(head[0] - central, 6, 0.01) : 0;
    const inputDeep = 0.48,
      inputSup = 0.22;
    if (t >= warmup) {
      windowOut += (deepOut + supOut + coll) * dt;
      refluxVolume += Math.max(0, -deep) * dt + Math.max(0, -sup) * dt;
      if (k % Math.max(1, Math.round(0.025 / dt)) === 0)
        samples.push({
          t: t - warmup,
          pressure: pressure[0],
          superficialPressure: pressure[2],
          flow: deep,
          superficialFlow: sup,
          volume: V[0],
          pump: a,
          valve: deep >= 0 ? 1 : p.leak,
          perforator: perf,
          reflux: Math.min(0, deep) + Math.min(0, sup),
        });
    }
    if (k < steps) {
      V[0] += (inputDeep + perf - deep - coll) * dt;
      V[1] += (deep - deepOut) * dt;
      V[2] += (inputSup - perf - sup) * dt;
      V[3] += (sup - supOut) * dt;
      inflow += (inputDeep + inputSup) * dt;
      outflow += (deepOut + supOut + coll) * dt;
    }
  }
  const pressures = samples.map((s) => s.pressure);
  return {
    samples,
    parameters: p,
    modelVersion,
    balanceError: Math.abs(
      V.reduce((a, b) => a + b, 0) -
        v0.reduce((a, b) => a + b, 0) -
        inflow +
        outflow,
    ),
    netReturn: windowOut / duration,
    refluxVolume,
    meanPressure: pressures.reduce((a, b) => a + b, 0) / pressures.length,
    peakPressure: Math.max(...pressures),
    period: p.period,
  };
}
export const scenarios = [
  {
    id: "TW01",
    family: "Postura",
    title: "El retorno en decúbito",
    subtitle: "Una referencia para comenzar",
    description:
      "Compara potencial, presión y flujo en una red genérica con baja carga gravitacional.",
    params: { posture: 0 },
    focus:
      "La postura cambia el potencial gravitacional de los compartimentos. Las presiones son relativas; no son medidas clínicas.",
  },
  {
    id: "TW02",
    family: "Postura",
    title: "De la horizontal a la vertical",
    subtitle: "El efecto de la gravedad",
    description:
      "Explora el cambio de postura manteniendo las demás condiciones.",
    params: { posture: 90 },
    focus:
      "Observa la referencia hidrostática y la presión necesaria para sostener el retorno en esta configuración.",
  },
  {
    id: "TW03",
    family: "Bomba muscular",
    title: "El pulso de la pantorrilla",
    subtitle: "Contracción y relajación",
    description:
      "Sigue el ciclo de presión exterior y su relación con el flujo.",
    params: { pump: 1.25 },
    focus:
      "La activación se aplica como presión extravascular a los compartimentos profundos. La animación y las curvas comparten el mismo ciclo.",
  },
  {
    id: "TW04",
    family: "Bomba muscular",
    title: "Cuando la bomba se mueve menos",
    subtitle: "Actividad reducida",
    description:
      "Contrasta un perfil de activación muscular reducido con el de referencia.",
    params: { pump: 0.2 },
    focus:
      "Una comparación de mecanismos; no estima la capacidad funcional de una persona.",
  },
  {
    id: "TW05",
    family: "Válvulas",
    title: "Una puerta en el sentido del retorno",
    subtitle: "Competencia valvular",
    description:
      "Una resistencia asimétrica representa una válvula competente.",
    params: { leak: 0 },
    focus:
      "El flujo inverso de una válvula ideal es cero. La geometría de las valvas es ilustrativa; no se resuelve su mecánica.",
  },
  {
    id: "TW06",
    family: "Válvulas",
    title: "Cuando el cierre deja pasar flujo",
    subtitle: "Fuga valvular",
    description:
      "Aumenta la conductancia inversa y observa cómo responde la red.",
    params: { leak: 0.65 },
    focus:
      "La fuga es un parámetro explícito del modelo. La curva no equivale a un Doppler ni a una graduación clínica de reflujo.",
  },
  {
    id: "TW07",
    family: "Conexiones",
    title: "Dos sistemas que se comunican",
    subtitle: "Superficial y profundo",
    description: "Explora la conexión perforante representada en el circuito.",
    params: { perforator: 1 },
    focus:
      "La red resume territorios. Una conexión genérica no representa todas las perforantes de una pierna real.",
  },
  {
    id: "TW08",
    family: "Conexiones",
    title: "Cambiar una conexión",
    subtitle: "Una comparación controlada",
    description:
      "Modifica la conductancia de la comunicación entre compartimentos.",
    params: { perforator: 0.1 },
    focus:
      "Compara con TW07 para aislar el efecto de esta conexión manteniendo iguales los demás parámetros.",
  },
  {
    id: "TW09",
    family: "Salida",
    title: "Mayor resistencia al retorno",
    subtitle: "Resistencia de salida",
    description: "Aumenta la resistencia del trayecto profundo proximal.",
    params: { obstruction: 5 },
    focus:
      "Representa un aumento de resistencia genérico. No identifica ni cuantifica una lesión anatómica específica.",
  },
  {
    id: "TW10",
    family: "Salida",
    title: "Una vía alternativa",
    subtitle: "Conexión colateral",
    description:
      "Añade una vía de salida al circuito con resistencia proximal elevada.",
    params: { obstruction: 5, collateral: true },
    focus:
      "La conexión colateral está definida en la red; no se crea una anatomía de paciente ni se predice su eficacia clínica.",
  },
  {
    id: "TW11",
    family: "Presión exterior",
    title: "La presión de fuera también cuenta",
    subtitle: "Presión transmural",
    description:
      "Explora la presión exterior y su relación con el volumen y el flujo.",
    params: { compression: 1.2 },
    focus:
      "La ley de pared es lineal en este rango educativo; no se representa el colapso de una vena ni se prescribe una dosis de compresión.",
  },
  {
    id: "TW12",
    family: "Presión exterior",
    title: "Ver el conjunto",
    subtitle: "Bomba, válvula y presión",
    description:
      "Compara un escenario integrado de fuga, bomba y presión exterior.",
    params: { leak: 0.4, compression: 0.8, pump: 1.2 },
    focus:
      "Los resultados pertenecen a este modelo y sus condiciones de contorno; no son una recomendación terapéutica.",
  },
] as const;
