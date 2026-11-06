import { lazy, Suspense, useMemo, useState } from "react";
import type { Lesson, Stage, CameraGuide } from "./types";
import { solve } from "../labs/twin/model";
import { scenarioParameters, presentations } from "../labs/twin/scenarioConfig";
import { sampleAt } from "../labs/twin/transport";
import Circuit from "../labs/twin/Circuit";
const Scene = lazy(() => import("../labs/twin/VenousScene"));
const Chart = lazy(() => import("../labs/twin/Chart"));
export default function TwinPresentation({
  lesson,
  stage,
  timeRef,
  phase,
  guide,
  onCameraInput,
}: {
  lesson: Lesson;
  stage: Stage;
  timeRef: React.RefObject<number>;
  phase: number;
  guide: React.RefObject<CameraGuide>;
  onCameraInput: () => void;
}) {
  const id = stage.scenario ?? "TW03",
    solution = useMemo(() => solve(scenarioParameters(id)), [id]);
  const [actualTissues, setActualTissues] = useState(stage.tissues ?? []);
  const t = phase * solution.period;
  timeRef.current = t;
  const config = presentations[id],
    sample = sampleAt(solution, t),
    anatomy = lesson.group === "anatomy";
  const metric = config.focus === "collateral" ? "flow" : config.metric;
  const flowBranch =
    config.focus === "perforator"
      ? "perforator"
      : config.focus === "collateral"
        ? "collateral"
        : undefined;
  const label =
    metric === "volume"
      ? "Volumen superficial"
      : metric === "pressure"
        ? "Presión profunda"
        : flowBranch === "perforator"
          ? "Flujo perforante"
          : flowBranch === "collateral"
            ? "Flujo colateral"
            : "Flujo profundo";
  const value =
    metric === "volume"
      ? sample.superficialVolume
      : metric === "pressure"
        ? sample.pressure
        : flowBranch
          ? sample[flowBranch]
          : sample.flow;
  return (
    <div
      className={`guided-twin ${anatomy ? "anatomy-presentation" : ""}`}
      data-scenario={id}
      data-view={stage.view}
    >
      <div className="guided-model">
        {stage.view === "circuit" ? (
          <Circuit solution={solution} time={t} compact />
        ) : (
          <Suspense
            fallback={
              <div className="scene-wrap loading">Preparando el modelo…</div>
            }
          >
            <Scene
              mode={stage.view ?? "flow"}
              solution={solution}
              timeRef={timeRef}
              focus={config.focus}
              guidance={guide}
              onCameraInput={onCameraInput}
              tissues={stage.tissues}
              onTissuesChange={setActualTissues}
            />
          </Suspense>
        )}
      </div>
      {anatomy ? (
        <div className="anatomy-reading">
          <span className="eyebrow">ORIENTACIÓN POR PLANOS</span>
          <h3>{stage.title}</h3>
          <div className="anatomy-plane-list">
            {[
              ["bone", "Huesos"],
              ["muscle", "Músculos"],
              ["vein", "Venas"],
            ].map(([id, name]) => (
              <div
                className={actualTissues.includes(id) ? "active" : ""}
                key={id}
              >
                <i />
                {name}
                <span>
                  {actualTissues.includes(id) ? "Capa activa" : "Capa oculta"}
                </span>
              </div>
            ))}
          </div>
          <p>
            Miembro inferior izquierdo · selección de 12 estructuras
            BodyParts3D.
          </p>
          <small>
            Referencia anatómica independiente. No contiene todas las variantes
            ni se deforma con el solver.
          </small>
        </div>
      ) : (
        <div className="guided-curves">
          <header>
            <span>MODELO · {id}</span>
            <b>{label}</b>
          </header>
          <div className="guided-numbers">
            <div>
              <small>{label}</small>
              <b>
                {value.toFixed(3)}
                <em>u.r.</em>
              </b>
            </div>
            <div>
              <small>
                {metric === "pressure"
                  ? "Flujo profundo"
                  : metric === "volume"
                    ? "Presión superficial"
                    : "Presión profunda"}
              </small>
              <b>
                {(metric === "pressure"
                  ? sample.flow
                  : metric === "volume"
                    ? sample.superficialPressure
                    : sample.pressure
                ).toFixed(3)}
                <em>u.r.</em>
              </b>
            </div>
          </div>
          <Suspense fallback={<div className="loading">Preparando curva…</div>}>
            <Chart
              a={solution}
              time={t}
              metric={metric}
              channel={metric === "volume" ? "superficial" : "deep"}
              flowBranch={flowBranch}
            />
          </Suspense>
          <small className="guided-model-time">
            Tiempo del modelo: {t.toFixed(2)} s · período {solution.period} s
          </small>
        </div>
      )}
    </div>
  );
}
