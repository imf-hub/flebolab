import { RotateCcw, SlidersHorizontal, ChevronDown } from "lucide-react";
import type { Parameters } from "./model";
import { Range } from "../../shared/UI";

export default function ControlsPanel({
  parameters: p,
  update,
  reset,
  open,
  setOpen,
}: {
  parameters: Parameters;
  update: (key: keyof Parameters, value: number | boolean) => void;
  reset: () => void;
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  return (
    <aside
      className={`twin-adjustments ${open ? "is-open" : "is-collapsed"}`}
      aria-label="Ajustes del experimento"
    >
      <div className="adjustments-heading">
        <div>
          <SlidersHorizontal size={18} />
          <h2>Ajustes</h2>
        </div>
        <button
          className="icon-button adjustments-toggle"
          aria-label={open ? "Contraer ajustes" : "Mostrar ajustes"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <ChevronDown size={16} />
        </button>
      </div>
      <p className="adjustments-intro">
        Mueve una condición. Observa el 3D y su curva.
      </p>
      <div className="adjustment-fields">
        <Range
          label="Postura"
          value={p.posture}
          max={90}
          step={1}
          display={`${p.posture}°`}
          onChange={(n) => update("posture", n)}
        />
        <Range
          label="Activación de bomba"
          value={p.pump}
          max={1.6}
          display={`${p.pump.toFixed(2)} u.r.`}
          onChange={(n) => update("pump", n)}
        />
        <Range
          label="Fuga inversa del modelo"
          value={p.leak}
          max={1}
          display={`${p.leak.toFixed(2)} u.r.`}
          onChange={(n) => update("leak", n)}
        />
        <Range
          label="Resistencia de salida"
          value={p.obstruction}
          min={1}
          max={8}
          step={0.1}
          display={`${p.obstruction.toFixed(1)} u.r.`}
          onChange={(n) => update("obstruction", n)}
        />
        <Range
          label="Presión exterior"
          value={p.compression}
          max={1.5}
          display={`${p.compression.toFixed(2)} u.r.`}
          onChange={(n) => update("compression", n)}
        />
        <Range
          label="Conexión perforante"
          value={p.perforator}
          max={1.6}
          display={`${p.perforator.toFixed(2)} u.r.`}
          onChange={(n) => update("perforator", n)}
        />
        <Range
          label="Período del ciclo"
          value={p.period}
          min={2}
          max={10}
          step={0.5}
          display={`${p.period} s`}
          onChange={(n) => update("period", n)}
        />
        <label className="collateral-switch">
          <input
            type="checkbox"
            checked={p.collateral}
            onChange={(e) => update("collateral", e.target.checked)}
          />
          <span>Vía colateral</span>
          <b>{p.collateral ? "Activa" : "Inactiva"}</b>
        </label>
        <button className="button quiet adjustments-reset" onClick={reset}>
          <RotateCcw size={14} />
          Restaurar experimento
        </button>
        <p className="adjustment-units">
          u.r. = unidades relativas. Parámetros docentes, sin calibración de
          paciente.
        </p>
      </div>
    </aside>
  );
}
