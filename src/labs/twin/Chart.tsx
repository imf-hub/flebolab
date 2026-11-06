import { useEffect, useRef } from "react";
import type { Solution } from "./model";
import { theme } from "../../shared/theme";
export default function Chart({
  a,
  b,
  metric,
  time,
  onTime,
  channel = "deep",
  flowBranch,
  onReady,
}: {
  a: Solution;
  b?: Solution;
  metric: "flow" | "pressure" | "volume";
  time: number;
  onTime?: (n: number) => void;
  channel?: "deep" | "superficial";
  flowBranch?: "perforator" | "collateral";
  onReady?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const click = useRef(onTime);
  click.current = onTime;
  const ready = useRef(onReady);
  ready.current = onReady;
  const field =
    metric === "flow" && flowBranch
      ? flowBranch
      : channel === "superficial"
        ? metric === "flow"
          ? "superficialFlow"
          : metric === "pressure"
            ? "superficialPressure"
            : "superficialVolume"
        : metric;
  useEffect(() => {
    let active = true;
    let plot: any;
    let observer: ResizeObserver | undefined;
    import("plotly.js-basic-dist-min").then((m) => {
      plot = m.default;
      if (!active || !ref.current) return;
      const data = [
        {
          x: a.samples.map((s) => s.t),
          y: a.samples.map((s) => s[field]),
          name: "Escenario A",
          type: "scatter",
          mode: "lines",
          line: { color: theme.brand, width: 2.5 },
        },
        ...(b
          ? [
              {
                x: b.samples.map((s) => s.t),
                y: b.samples.map((s) => s[field]),
                name: "Escenario B",
                type: "scatter",
                mode: "lines",
                line: { color: theme.deep, width: 2, dash: "dot" },
              },
            ]
          : []),
      ];
      const rendering = plot.newPlot(
        ref.current,
        data,
        {
          margin: { l: 48, r: 12, t: 15, b: 45 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          font: { family: "system-ui", color: theme.muted, size: 11 },
          hoverlabel: {
            bgcolor: theme.paper,
            bordercolor: theme.line,
            font: { color: theme.ink },
          },
          showlegend: false,
          xaxis: {
            title: { text: "Tiempo del modelo (s)" },
            range: [0, a.period * 2],
            gridcolor: theme.line,
            zerolinecolor: "#a5b0b8",
          },
          yaxis: {
            title: { text: "Unidades relativas" },
            gridcolor: theme.line,
            zerolinecolor: "#a5b0b8",
          },
          hovermode: "x unified",
          autosize: true,
        },
        { responsive: true, displayModeBar: false },
      );
      Promise.resolve(rendering).then(() => {
        if (!active || !ref.current) return;
        ready.current?.();
        (ref.current as any).on("plotly_click", (e: any) =>
          click.current?.(e.points[0].x),
        );
        observer = new ResizeObserver(() => {
          if (active && ref.current) plot.Plots.resize(ref.current);
        });
        observer.observe(ref.current);
      });
    });
    return () => {
      active = false;
      observer?.disconnect();
      if (plot && ref.current) plot.purge(ref.current);
    };
  }, [a, b, metric, channel, flowBranch]);
  return (
    <div className="chart-wrap" data-field={field}>
      <div ref={ref} className="plot-chart" />
      <div
        className="chart-cursor"
        style={{
          left: `calc(48px + (100% - 60px) * ${time / (a.period * 2)})`,
        }}
      />
      {onTime && (
        <span className="chart-tip">Pulsa la curva para situar el ciclo</span>
      )}
    </div>
  );
}
