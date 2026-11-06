import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Info,
  Check,
  Share2,
  Maximize2,
} from "lucide-react";
import { useState } from "react";
import { share, fullscreen } from "./utils";
export function LabHeader({
  name,
  tag,
  title,
  description,
  color = "red",
  children,
}: {
  name: string;
  tag: string;
  title: string;
  description: string;
  color?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`lab-heading container ${color}`}>
      <div>
        <Link to="/" className="back-link">
          <ArrowLeft size={14} /> Todos los laboratorios
        </Link>
        <div className="eyebrow">{tag}</div>
        <h1>
          {name}
          <span>{title}</span>
        </h1>
        <p>{description}</p>
      </div>
      <div className="lab-actions">
        {children}
        <ShareButton />
        <button className="button quiet" onClick={() => fullscreen()}>
          <Maximize2 size={16} />
          <span>Presentar</span>
        </button>
      </div>
    </div>
  );
}
export function ShareButton() {
  const [done, setDone] = useState(false),
    [manual, setManual] = useState(false);
  return (
    <>
      <button
        className="button quiet"
        onClick={async () => {
          const copied = await share();
          setDone(copied);
          setManual(!copied);
          setTimeout(() => setDone(false), 2200);
        }}
      >
        {done ? <Check size={16} /> : <Share2 size={16} />}
        <span>{done ? "Enlace copiado" : "Compartir"}</span>
      </button>
      {manual && (
        <input
          className="manual-share"
          aria-label="Enlace para copiar"
          readOnly
          value={location.href}
          onFocus={(e) => e.target.select()}
        />
      )}
    </>
  );
}
export function Note({ children }: { children: ReactNode }) {
  return (
    <div className="info-note">
      <Info size={16} />
      <div>{children}</div>
    </div>
  );
}
export function SourceLink({
  href,
  label = "Ver fuente",
}: {
  href: string;
  label?: string;
}) {
  return (
    <a className="source-link" href={href} target="_blank" rel="noreferrer">
      {label}
      <ArrowUpRight size={13} />
    </a>
  );
}
export function Range({
  label,
  value,
  min = 0,
  max = 1,
  step = 0.01,
  onChange,
  display,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (n: number) => void;
  display?: string;
}) {
  return (
    <label className="range-field">
      <span>
        {label}
        <b>{display ?? value.toFixed(2)}</b>
      </span>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(+e.target.value)}
      />
    </label>
  );
}
export function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="empty-state">
      <Info />
      {children}
    </div>
  );
}
