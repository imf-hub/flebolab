/** Modelo educativo genérico0D. Unidades relativas, sin calibración de paciente. */
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
  collateral: number;
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
  converged: boolean;
  warmupCycles: number;
  cycleResidual: number;
  minimumVolume: number;
};
export const modelVersion = "imf-0d-relative-1.1";
export const convergenceTolerance = 1e-5;
export function activation(t: number, period: number) {
  const phase = (((t % period) + period) % period) / period;
  return phase < 0.4 ? Math.sin((Math.PI * phase) / 0.4) ** 2 : 0;
}
export function valveFlow(
  difference: number,
  resistance: number,
  leak: number,
) {
  return (
    (difference / resistance) *
    (difference >= 0 ? 1 : Math.max(0, Math.min(1, leak)))
  );
}
export function sanitize(input: Partial<Parameters>): Parameters {
  const p = { ...defaults, ...input };
  return {
    posture: Math.min(90, Math.max(0, +p.posture || 0)),
    pump: Math.min(1.6, Math.max(0, +p.pump || 0)),
    leak: Math.min(1, Math.max(0, +p.leak || 0)),
    obstruction: Math.min(8, Math.max(1, +p.obstruction || 1)),
    compression: Math.min(1.5, Math.max(0, +p.compression || 0)),
    perforator: Math.min(1.6, Math.max(0, +p.perforator || 0)),
    collateral: !!p.collateral,
    period: Math.min(10, Math.max(2, +p.period || 5)),
  };
}
export function solve(
  input: Partial<Parameters>,
  requestedStep = 0.01,
): Solution {
  const p = sanitize(input),
    compliance = [4, 3.4, 5, 4.2],
    referenceVolume = [12, 10, 11, 9],
    volume = [...referenceVolume],
    height = [0.12, 0.84, 0.1, 0.86];
  const gravity = 4 * Math.sin((p.posture * Math.PI) / 180),
    central = 0.6 + gravity * 1.2;
  // An integer number of integration steps keeps cycle boundaries and the rendered clock aligned.
  const nominalStep = Number.isFinite(requestedStep)
    ? Math.min(0.02, Math.max(0.001, requestedStep))
    : 0.01;
  const stepsPerCycle = Math.ceil(p.period / nominalStep),
    dt = p.period / stepsPerCycle;
  let totalIn = 0,
    totalOut = 0,
    minimumVolume = Math.min(...volume);
  const evaluate = (time: number) => {
    const pump = activation(time, p.period),
      external = [
        2.8 * p.pump * pump,
        0.25 * p.pump * pump,
        p.compression,
        0.6 * p.compression,
      ];
    const pressure = volume.map(
      (v, i) => 1 + (v - referenceVolume[i]) / compliance[i] + external[i],
    );
    const head = pressure.map((value, i) => value + gravity * height[i]);
    const deep = valveFlow(head[0] - head[1], 1.35, p.leak),
      superficial = valveFlow(head[2] - head[3], 2, p.leak);
    const deepOut = valveFlow(head[1] - central, 1.6 * p.obstruction, p.leak),
      superficialOut = valveFlow(head[3] - central, 2.5, p.leak);
    const perforator =
      valveFlow(head[2] - head[0], 3.5, Math.max(0.01, p.leak)) * p.perforator;
    const collateral = p.collateral ? valveFlow(head[0] - central, 6, 0.01) : 0;
    return {
      pressure,
      pump,
      deep,
      superficial,
      deepOut,
      superficialOut,
      perforator,
      collateral,
    };
  };
  const advance = (state: ReturnType<typeof evaluate>) => {
    volume[0] += (0.48 + state.perforator - state.deep - state.collateral) * dt;
    volume[1] += (state.deep - state.deepOut) * dt;
    volume[2] += (0.22 - state.perforator - state.superficial) * dt;
    volume[3] += (state.superficial - state.superficialOut) * dt;
    totalIn += 0.7 * dt;
    totalOut += (state.deepOut + state.superficialOut + state.collateral) * dt;
    minimumVolume = Math.min(minimumVolume, ...volume);
  };
  let converged = false,
    warmupCycles = 0,
    cycleResidual = Infinity,
    stableCycles = 0;
  const maxWarmupCycles = Math.ceil(1800 / p.period);
  for (let cycle = 0; cycle < maxWarmupCycles; cycle++) {
    const previous = [...volume];
    for (let step = 0; step < stepsPerCycle; step++)
      advance(evaluate(step * dt));
    warmupCycles = cycle + 1;
    cycleResidual = Math.max(
      ...volume.map(
        (v, i) => Math.abs(v - previous[i]) / Math.max(1, Math.abs(v)),
      ),
    );
    stableCycles = cycleResidual <= convergenceTolerance ? stableCycles + 1 : 0;
    if (warmupCycles >= 12 && stableCycles >= 3) {
      converged = true;
      break;
    }
  }
  const samples: Sample[] = [],
    recordSteps = 2 * stepsPerCycle,
    recordDuration = 2 * p.period,
    sampleEvery = Math.max(1, Math.round(0.025 / dt));
  let windowOut = 0,
    refluxVolume = 0;
  for (let step = 0; step <= recordSteps; step++) {
    const time = step * dt,
      state = evaluate(time);
    if (step % sampleEvery === 0 || step === recordSteps)
      samples.push({
        t: time,
        pressure: state.pressure[0],
        superficialPressure: state.pressure[2],
        flow: state.deep,
        superficialFlow: state.superficial,
        volume: volume[0],
        pump: state.pump,
        valve: state.deep >= 0 ? 1 : p.leak,
        perforator: state.perforator,
        collateral: state.collateral,
        reflux: Math.min(0, state.deep) + Math.min(0, state.superficial),
      });
    if (step < recordSteps) {
      windowOut +=
        (state.deepOut + state.superficialOut + state.collateral) * dt;
      refluxVolume +=
        (Math.max(0, -state.deep) + Math.max(0, -state.superficial)) * dt;
      advance(state);
    }
  }
  const pressures = samples.map((s) => s.pressure);
  return {
    samples,
    parameters: p,
    modelVersion,
    balanceError: Math.abs(
      volume.reduce((a, b) => a + b, 0) -
        referenceVolume.reduce((a, b) => a + b, 0) -
        totalIn +
        totalOut,
    ),
    netReturn: windowOut / recordDuration,
    refluxVolume,
    meanPressure: pressures.reduce((a, b) => a + b, 0) / pressures.length,
    peakPressure: Math.max(...pressures),
    period: p.period,
    converged,
    warmupCycles,
    cycleResidual,
    minimumVolume,
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
