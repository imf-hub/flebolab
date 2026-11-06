import { theme } from "../../shared/theme";
import type { Solution } from "./model";
import { sampleAt } from "./transport";
export default function Circuit({
  solution,
  time,
}: {
  solution: Solution;
  time: number;
}) {
  const s = sampleAt(solution, time);
  const nodes = [
    {
      x: 200,
      y: 300,
      p: s.pressure,
      v: s.volume,
      label: "Profundo distal",
      color: theme.deep,
    },
    {
      x: 200,
      y: 100,
      p: s.proximalDeepPressure,
      v: s.proximalDeepVolume,
      label: "Profundo proximal",
      color: theme.deep,
    },
    {
      x: 570,
      y: 300,
      p: s.superficialPressure,
      v: s.superficialVolume,
      label: "Superficial distal",
      color: theme.superficial,
    },
    {
      x: 570,
      y: 100,
      p: s.proximalSuperficialPressure,
      v: s.proximalSuperficialVolume,
      label: "Superficial proximal",
      color: theme.superficial,
    },
  ];
  const edge = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    q: number,
    label: string,
    color: string,
  ) => (
    <g>
      <line
        x1={q < 0 ? x2 : x1}
        y1={q < 0 ? y2 : y1}
        x2={q < 0 ? x1 : x2}
        y2={q < 0 ? y1 : y2}
        stroke={q < 0 ? theme.reverse : color}
        strokeWidth={2 + Math.min(6, Math.abs(q) * 2)}
        markerEnd={Math.abs(q) > 1e-6 ? "url(#circuit-arrow)" : undefined}
      />
      <text
        x={(x1 + x2) / 2 + 10}
        y={(y1 + y2) / 2 - 10}
        fill={color}
        fontSize="13"
      >
        {label} {q.toFixed(3)}
      </text>
    </g>
  );
  return (
    <div className="circuit-panel">
      <div className="scene-top">
        <span className="nature-badge">
          CUATRO COMPARTIMENTOS · MISMAS ECUACIONES
        </span>
      </div>
      <svg
        viewBox="0 0 780 460"
        role="img"
        aria-label="Circuito venoso: presiones, volúmenes y flujos calculados"
      >
        <defs>
          <marker
            id="circuit-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M0 0L10 5L0 10z" fill="context-stroke" />
          </marker>
        </defs>
        {edge(200, 265, 200, 140, s.flow, "Qd", theme.deep)}
        {edge(570, 265, 570, 140, s.superficialFlow, "Qs", theme.superficial)}
        {edge(530, 300, 240, 300, s.perforator, "Qp", theme.perforator)}
        {edge(200, 60, 330, 30, s.deepOut, "Salida d", theme.deep)}
        {edge(
          570,
          60,
          450,
          30,
          s.superficialOut,
          "Salida s",
          theme.superficial,
        )}
        {solution.parameters.collateral && (
          <g>
            {edge(
              240,
              340,
              450,
              55,
              s.collateral,
              "Colateral",
              theme.collateral,
            )}
          </g>
        )}
        {nodes.map((n) => (
          <g key={n.label}>
            <circle
              cx={n.x}
              cy={n.y}
              r={32 + Math.sqrt(Math.max(0, n.v)) * 2}
              fill={theme.paper}
              stroke={n.color}
              strokeWidth="1.5"
            />
            <text
              x={n.x}
              y={n.y - 5}
              textAnchor="middle"
              fill={theme.ink}
              fontSize="14"
            >
              P {n.p.toFixed(2)}
            </text>
            <text
              x={n.x}
              y={n.y + 15}
              textAnchor="middle"
              fill={n.color}
              fontSize="12"
            >
              V {n.v.toFixed(2)}
            </text>
            <text
              x={n.x}
              y={n.y + 72}
              textAnchor="middle"
              fill={theme.muted}
              fontSize="13"
            >
              {n.label}
            </text>
          </g>
        ))}
        <text
          x="390"
          y="430"
          textAnchor="middle"
          fill={theme.muted}
          fontSize="12"
        >
          Unidades relativas · Entradas constantes 0,48 + 0,22 · dV/dt =
          entradas − salidas
        </text>
      </svg>
    </div>
  );
}
