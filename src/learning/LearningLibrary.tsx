import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Headphones,
  Search,
  Play,
  Layers3,
  Activity,
  ScanLine,
  Eye,
} from "lucide-react";
import { lessons, narrations, groups } from "./catalog";
import { formatTime } from "./timeline";
import previews from "../data/lesson-previews.json";
import { assetUrl } from "../shared/assets";
import "./learning.css";
const icons: Record<string, typeof Activity> = {
  twin: Activity,
  anatomy: Layers3,
  doppler: ScanLine,
  cine: ScanLine,
  vision: Eye,
};
export default function LearningLibrary() {
  const normalize = (value: string) =>
    value
      .toLocaleLowerCase("es")
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");
  const [group, setGroup] = useState("all"),
    [search, setSearch] = useState("");
  const visible = lessons.filter(
    (l) =>
      (group === "all" || l.group === group) &&
      normalize(
        `${l.id} ${l.title} ${l.objective} ${l.stages.map((s) => s.title + " " + s.spoken).join(" ")}`,
      ).includes(normalize(search)),
  );
  return (
    <section className="container learning-library">
      <header className="learning-library-heading">
        <div>
          <span className="eyebrow">
            AULA VISUAL / INSTITUTO MEXICANO DE FLEBOLOGÍA
          </span>
          <h1>
            Comprende el mecanismo.
            <br />
            <em>Después, explóralo.</em>
          </h1>
          <p>
            Explicaciones guiadas con modelos, curvas y material real. Tú
            controlas el ritmo.
          </p>
        </div>
        <div className="learning-stat">
          <Headphones size={29} />
          <b>{lessons.length}</b>
          <span>conceptos · 124 tomas</span>
          <small>
            {Object.keys(narrations).length} con voz en español · texto y
            fuentes en todas
          </small>
        </div>
      </header>
      <div className="learning-library-tools">
        <div role="group" aria-label="Área de aprendizaje">
          <button
            className={group === "all" ? "active" : ""}
            aria-pressed={group === "all"}
            onClick={() => setGroup("all")}
          >
            Todas
          </button>
          {groups.map((g) => (
            <button
              key={g.id}
              className={group === g.id ? "active" : ""}
              aria-pressed={group === g.id}
              onClick={() => setGroup(g.id)}
            >
              {g.short}
            </button>
          ))}
        </div>
        <label>
          <Search size={16} />
          <input
            aria-label="Buscar explicación"
            value={search}
            placeholder="Busca un concepto…"
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </div>
      <div className="lesson-catalog">
        {visible.map((lesson) => {
          const Icon = icons[lesson.group],
            n = narrations[lesson.id];
          return (
            <Link
              to={`/aprender/${lesson.id}`}
              className={`lesson-card group-${lesson.group}`}
              key={lesson.id}
            >
              <div className="lesson-card-top">
                <span>{groups.find((g) => g.id === lesson.group)?.name}</span>
                <Icon size={21} />
              </div>
              <div className="lesson-card-figure has-preview">
                <img
                  src={assetUrl(
                    (previews as Record<string, { path: string }>)[lesson.id]
                      .path,
                  )}
                  alt=""
                  loading="lazy"
                  width="784"
                  height="365"
                />
                <span>{lesson.id}</span>
                <b>
                  <Play size={18} />
                </b>
              </div>
              <h2>{lesson.title}</h2>
              <p>{lesson.objective}</p>
              <footer>
                <span>
                  <Headphones size={13} />
                  {n
                    ? `${formatTime(n.duration)} · voz · 4 tomas`
                    : "Guía visual · 4 tomas"}
                </span>
                <ArrowUpRight size={18} />
              </footer>
            </Link>
          );
        })}
      </div>
      {visible.length === 0 && (
        <p className="empty-state">
          No encontramos ese concepto. Prueba otro término.
        </p>
      )}
      <p className="learning-footnote">
        Esquemas docentes, modelos relativos y recursos clínicos identificados
        por separado. Las explicaciones conservan sus fuentes y el acceso a la
        exploración libre.
      </p>
    </section>
  );
}
