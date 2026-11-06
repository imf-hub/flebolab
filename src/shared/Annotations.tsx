import { useEffect, useRef, useState, useId } from "react";
import {
  MousePointer2,
  MoveUpRight,
  Circle,
  Minus,
  Trash2,
  Download,
  Undo2,
} from "lucide-react";
import { readLocal, saveLocal, download } from "./utils";
export type Mark = {
  id: string;
  tool: string;
  a: [number, number];
  b: [number, number];
  note?: string;
};
export function AnnotationTools({
  tool,
  setTool,
  clear,
  undo,
  exportMarks,
}: {
  tool: string;
  setTool: (s: string) => void;
  clear: () => void;
  undo: () => void;
  exportMarks: () => void;
}) {
  return (
    <div className="annotation-tools" aria-label="Herramientas de anotación">
      {[
        ["pan", "Mover", MousePointer2],
        ["arrow", "Flecha", MoveUpRight],
        ["point", "Punto", Circle],
        ["line", "Línea", Minus],
      ].map(([id, label, Icon]: any) => (
        <button
          key={id}
          className={tool === id ? "active" : ""}
          aria-label={label}
          title={label}
          onClick={() => setTool(id)}
        >
          <Icon size={17} />
          <span>{label}</span>
        </button>
      ))}
      <span className="tool-divider" />
      <button aria-label="Deshacer anotación" title="Deshacer" onClick={undo}>
        <Undo2 size={16} />
      </button>
      <button
        aria-label="Borrar anotaciones"
        title="Borrar anotaciones"
        onClick={clear}
      >
        <Trash2 size={16} />
      </button>
      <button
        aria-label="Exportar anotaciones"
        title="Exportar JSON"
        onClick={exportMarks}
      >
        <Download size={16} />
      </button>
    </div>
  );
}
export function useAnnotations(id: string) {
  const [marks, set] = useState<Mark[]>(() =>
    readLocal(`flebo-notes-${id}`, []),
  );
  useEffect(() => set(readLocal(`flebo-notes-${id}`, [])), [id]);
  const update = (next: Mark[]) => {
    set(next);
    saveLocal(`flebo-notes-${id}`, next);
  };
  return {
    marks,
    add: (m: Mark) => update([...marks, m]),
    clear: () => update([]),
    undo: () => update(marks.slice(0, -1)),
    exportMarks: () =>
      download(
        `flebolab-anotaciones-${id}.json`,
        JSON.stringify(
          {
            resource: id,
            nature: "anotaciones docentes personales",
            coordinates: "normalizadas 0–1",
            marks,
          },
          null,
          2,
        ),
        "application/json",
      ),
  };
}
export function AnnotationLayer({
  marks,
  onAdd,
  tool,
  viewBox = "0 0 1000 1000",
  className = "annotation-layer",
}: {
  marks: Mark[];
  onAdd: (m: Mark) => void;
  tool: string;
  viewBox?: string;
  className?: string;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const markerId = useId().replace(/:/g, "");
  const [draft, setDraft] = useState<Mark | null>(null);
  const coord = (e: React.PointerEvent) => {
    const el = ref.current!;
    const pt = el.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const v = pt.matrixTransform(el.getScreenCTM()!.inverse());
    const b = el.viewBox.baseVal;
    return [
      Math.min(1, Math.max(0, v.x / b.width)),
      Math.min(1, Math.max(0, v.y / b.height)),
    ] as [number, number];
  };
  const box = viewBox.split(" ").map(Number),
    w = box[2],
    h = box[3];
  return (
    <svg
      ref={ref}
      className={className}
      viewBox={viewBox}
      preserveAspectRatio="none"
      style={{
        pointerEvents: tool === "pan" ? "none" : "auto",
        touchAction: "none",
      }}
      onPointerDown={(e) => {
        if (tool === "pan") return;
        e.stopPropagation();
        e.currentTarget.setPointerCapture(e.pointerId);
        const a = coord(e);
        setDraft({ id: crypto.randomUUID(), tool, a, b: a });
      }}
      onPointerMove={(e) => {
        if (draft) setDraft({ ...draft, b: coord(e) });
      }}
      onPointerUp={(e) => {
        if (draft) {
          onAdd({ ...draft, b: coord(e) });
          setDraft(null);
        }
      }}
    >
      <defs>
        <marker
          id={markerId}
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0 0L6 3 0 6" fill="#ffde84" />
        </marker>
      </defs>
      {[...marks, ...(draft ? [draft] : [])].map((m, i) =>
        m.tool === "point" ? (
          <g key={m.id}>
            <circle
              cx={m.a[0] * w}
              cy={m.a[1] * h}
              r={w * 0.012}
              fill="#ffde8433"
              stroke="#ffde84"
              strokeWidth={w * 0.003}
            />
            <text
              x={m.a[0] * w + w * 0.017}
              y={m.a[1] * h}
              fontSize={w * 0.025}
              fill="#ffde84"
            >
              {i + 1}
            </text>
          </g>
        ) : (
          <line
            key={m.id}
            x1={m.a[0] * w}
            y1={m.a[1] * h}
            x2={m.b[0] * w}
            y2={m.b[1] * h}
            stroke="#ffde84"
            strokeWidth={w * 0.0035}
            markerEnd={m.tool === "arrow" ? `url(#${markerId})` : undefined}
          />
        ),
      )}
    </svg>
  );
}
