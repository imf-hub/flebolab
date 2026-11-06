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
}: {
  a: Solution;
  b?: Solution;
  metric: "flow" | "pressure" | "volume";
  time: number;
  onTime: (n: number) => void;
  channel?: "deep" | "superficial";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const field =
    channel === "superficial"
      ? metric === "flow"
        ? "superficialFlow"
        : metric === "pressure"
          ? "superficialPressure"
          : "superficialVolume"
      : metric;
  useEffect(() => {
    let active = true;
    let plot: any;
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
      plot.newPlot(
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
          showlegend: !!b,
          legend: { orientation: "h", x: 0, y: 1.18 },
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
        },
        { responsive: true, displayModeBar: false },
      );
      (ref.current as any).on("plotly_click", (e: any) =>
        onTime(e.points[0].x),
      );
    });
    return () => {
      active = false;
      if (plot && ref.current) plot.purge(ref.current);
    };
  }, [a, b, metric, channel]);
  return (
    <div className="chart-wrap">
      <div ref={ref} className="plot-chart" />
      <div
        className="chart-cursor"
        style={{
          left: `calc(48px + (100% - 60px) * ${time / (a.period * 2)})`,
        }}
      />
      <span className="chart-tip">Pulsa la curva para situar el ciclo</span>
    </div>
  );
}
