import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Search,
  ArrowLeftRight,
  ChevronLeft,
  Grid2X2,
  ScanLine,
  Bookmark,
  Play,
  Pause,
  Link2,
  ChevronRight,
} from "lucide-react";
import raw from "../../data/dus.json";
import { LabHeader, Note, SourceLink, Empty } from "../../shared/UI";
import { readLocal, saveLocal } from "../../shared/utils";
import Cine from "./Cine";
import Doppler from "./Doppler";
const clips: any[] = raw;
export default function Dus() {
  const [query, setQuery] = useSearchParams();
  const [tab, setTab] = useState(query.get("lesson") ? "doppler" : "cine"),
    [lesson, setLesson] = useState(query.get("lesson") ?? "DP01"),
    [id, setId] = useState(query.get("case") ?? clips[0].id),
    [site, setSite] = useState("Todos"),
    [compression, setCompression] = useState("Todos"),
    [side, setSide] = useState("Todos"),
    [search, setSearch] = useState(""),
    [view, setView] = useState(query.get("case") ? "detail" : "library"),
    [compare, setCompare] = useState(false),
    [bId, setBId] = useState(
      clips.find((c) => c.compressibility === 2)?.id ?? clips[1].id,
    ),
    [favorites, setFav] = useState(
      readLocal<string[]>("flebo-dus-favorites", []),
    ),
    [onlyFav, setOnlyFav] = useState(false),
    [labels, setLabels] = useState(true),
    [sharedPlaying, setSharedPlaying] = useState<boolean | undefined>(
      undefined,
    ),
    [phase, setPhase] = useState<number | undefined>(undefined);
  const clip = clips.find((c) => c.id === id) ?? clips[0],
    b = clips.find((c) => c.id === bId) ?? clips[1];
  useEffect(() => {
    setQuery(tab === "doppler" ? { lesson } : { case: id }, { replace: true });
  }, [id, tab, lesson]);
  const filtered = useMemo(
    () =>
      clips.filter(
        (c) =>
          (site === "Todos" || c.site === site) &&
          (compression === "Todos" ||
            String(c.compressibility) === compression) &&
          (side === "Todos" || c.side === side) &&
          (!onlyFav || favorites.includes(c.id)) &&
          `${c.id} ${c.segment} ${c.participantId}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [site, compression, side, search, onlyFav, favorites],
  );
  const select = (c: any) => {
    setId(c.id);
    setView("detail");
  };
  const favorite = (id: string) => {
    const next = favorites.includes(id)
      ? favorites.filter((x) => x !== id)
      : [...favorites, id];
    setFav(next);
    saveLocal("flebo-dus-favorites", next);
  };
  return (
    <>
      <LabHeader
        name="FleboDUS"
        tag="LABORATORIO 02 / ECOGRAFÍA VENOSA"
        title="El movimiento también se estudia."
        description="Cine ecográfico real, avance por cuadros y principios del Doppler para observar con contexto."
        color="teal"
      />
      <div className="container dus-container">
        <div className="main-tabs">
          <button
            className={tab === "cine" ? "active" : ""}
            onClick={() => setTab("cine")}
          >
            <ScanLine size={17} />
            Cine de compresión <small>{clips.length}</small>
          </button>
          <button
            className={tab === "doppler" ? "active" : ""}
            onClick={() => setTab("doppler")}
          >
            Fundamentos Doppler <small>10</small>
          </button>
          <button
            className={tab === "context" ? "active" : ""}
            onClick={() => setTab("context")}
          >
            Maniobras y contexto
          </button>
        </div>
        {tab === "doppler" ? (
          <Doppler id={lesson} onSelect={setLesson} />
        ) : tab === "context" ? (
          <div className="context-guide">
            <div>
              <span className="eyebrow">ANTES DE INTERPRETAR</span>
              <h2>
                Una imagen necesita
                <br />
                su exploración.
              </h2>
              <p className="lead-small">
                Este banco muestra compresión en modo B. El estudio de reflujo y
                la valoración clínica incorporan otras condiciones de
                adquisición.
              </p>
            </div>
            <div className="guide-grid">
              {[
                [
                  "01",
                  "Ubica el territorio",
                  "Identifica lado, vaso, segmento y relación anatómica. CFV: femoral común; GS: sitio safeno proximal; FV: femoral; PV: poplítea.",
                ],
                [
                  "02",
                  "Nombra la maniobra",
                  "Compresión directa del transductor en estos cines. La maniobra no es una medición Doppler de duración del flujo inverso.",
                ],
                [
                  "03",
                  "Conserva las referencias",
                  "Postura y orientación no están documentadas de forma suficiente en todos los registros; se muestran como no disponibles.",
                ],
                [
                  "04",
                  "Lee la calibración",
                  "El tiempo de cuadros está verificado en DICOM. Sin una región espacial calibrada validada, el visor mantiene bloqueadas las distancias y velocidades.",
                ],
                [
                  "05",
                  "Contrasta con el origen",
                  "Las etiquetas del banco se conservan. No constituyen una segunda valoración médica del equipo de FLEBO LAB.",
                ],
                [
                  "06",
                  "Documenta el conjunto",
                  "Una selección de72 clips no representa prevalencia ni sustituye la exploración de un miembro completo.",
                ],
              ].map(([n, t, p]) => (
                <article key={n}>
                  <span>{n}</span>
                  <h3>{t}</h3>
                  <p>{p}</p>
                </article>
              ))}
            </div>
            <SourceLink
              href="https://sonographers.org/resources/clinical-resources/cvi-guideline"
              label="Guía de exploración de insuficiencia venosa · ASA"
            />
          </div>
        ) : (
          <>
            <div className="library-toolbar">
              <div className="search-field">
                <Search size={16} />
                <input
                  aria-label="Buscar cine"
                  placeholder="Buscar segmento o participante…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                aria-label="Filtrar segmento"
                value={site}
                onChange={(e) => {
                  setSite(e.target.value);
                  setView("library");
                }}
              >
                {["Todos", "CFV", "GS", "FV", "PV"].map((v) => (
                  <option key={v} value={v}>
                    {v === "Todos" ? "Todos los segmentos" : v}
                  </option>
                ))}
              </select>
              <select
                aria-label="Filtrar compresibilidad"
                value={compression}
                onChange={(e) => {
                  setCompression(e.target.value);
                  setView("library");
                }}
              >
                <option value="Todos">Toda compresibilidad</option>
                <option value="0">No compresible</option>
                <option value="1">Parcial</option>
                <option value="2">Compresible</option>
              </select>
              <select
                aria-label="Filtrar lado"
                value={side}
                onChange={(e) => {
                  setSide(e.target.value);
                  setView("library");
                }}
              >
                <option value="Todos">Ambos lados</option>
                <option value="L">Izquierdo</option>
                <option value="R">Derecho</option>
              </select>
              <button
                className={`icon-button ${onlyFav ? "selected" : ""}`}
                aria-label="Solo cines guardados"
                onClick={() => {
                  setOnlyFav(!onlyFav);
                  setView("library");
                }}
              >
                <Bookmark size={17} />
              </button>
              <div className="toolbar-spacer" />
              <button
                className="button quiet"
                onClick={() =>
                  setView(view === "library" ? "detail" : "library")
                }
              >
                <Grid2X2 size={16} />
                {view === "library" ? "Visor" : "Biblioteca"}
              </button>
              <button
                className={`button quiet ${compare ? "selected" : ""}`}
                onClick={() => {
                  setCompare(!compare);
                  setView("detail");
                }}
              >
                <ArrowLeftRight size={16} />
                Comparar
              </button>
              <label className="check-field compact">
                <input
                  type="checkbox"
                  checked={labels}
                  onChange={(e) => setLabels(e.target.checked)}
                />
                Etiquetas
              </label>
            </div>
            {view === "library" ? (
              <>
                <div className="results-summary">
                  <span>
                    {filtered.length} cines ·{" "}
                    {new Set(filtered.map((c) => c.participantId)).size}{" "}
                    participantes
                  </span>
                  <span>ThrombUS+ · Modo B · Compresión</span>
                </div>
                {filtered.length ? (
                  <div className="cine-grid">
                    {filtered.map((c) => (
                      <article className="cine-card" key={c.id}>
                        <button
                          className="cine-open"
                          onClick={() => select(c)}
                          aria-label={`Abrir ${c.id}`}
                        >
                          <img
                            src={c.poster}
                            alt={`Ecografía de ${c.segment}`}
                            loading="lazy"
                            width="330"
                            height="285"
                          />
                          <span className="cine-play">
                            <Play size={19} />
                          </span>
                          <span className="cine-site">
                            {c.site} · {c.side === "L" ? "IZQ" : "DER"}
                          </span>
                          <span className="cine-duration">
                            {c.duration.toFixed(1)}s
                          </span>
                        </button>
                        <div className="photo-caption">
                          <button onClick={() => select(c)}>
                            <small>
                              {c.id.toUpperCase()} · {c.frameCount} CUADROS
                            </small>
                            <b>{c.segment}</b>
                            <span>
                              {labels
                                ? c.compressibilityLabel
                                : "Etiqueta oculta para observación"}
                            </span>
                          </button>
                          <button
                            className={`icon-button ${favorites.includes(c.id) ? "selected" : ""}`}
                            onClick={() => favorite(c.id)}
                            aria-label="Guardar cine"
                          >
                            <Bookmark size={16} />
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <Empty>No hay cines con estos filtros.</Empty>
                )}
              </>
            ) : (
              <>
                <div className="stage-title">
                  <div>
                    <button
                      className="back-link"
                      onClick={() => setView("library")}
                    >
                      <ChevronLeft size={14} />
                      Volver a los cines
                    </button>
                    <span className="eyebrow">
                      {clip.id} / {clip.site} /{" "}
                      {clip.side === "L" ? "IZQUIERDO" : "DERECHO"}
                    </span>
                    <h2>{clip.segment}</h2>
                  </div>
                  {compare && (
                    <div className="button-row">
                      <button
                        className="button quiet"
                        onClick={() => setSharedPlaying(!sharedPlaying)}
                      >
                        {sharedPlaying ? (
                          <Pause size={15} />
                        ) : (
                          <Play size={15} />
                        )}
                        Ambos cines
                      </button>
                      <button
                        className="button quiet"
                        onClick={() => {
                          setSharedPlaying(false);
                          setPhase(phase === 0 ? 0.0001 : 0);
                        }}
                      >
                        <Link2 size={15} />
                        Alinear inicio
                      </button>
                    </div>
                  )}
                </div>
                <div
                  className={compare ? "compare-grid count-2" : "dus-detail"}
                >
                  <div>
                    <Cine
                      key={clip.id}
                      clip={clip}
                      sharedPlaying={sharedPlaying}
                      sharedPhase={phase}
                    />
                    {compare && (
                      <div className="comparison-select">
                        <select
                          aria-label="Cine A"
                          value={id}
                          onChange={(e) => setId(e.target.value)}
                        >
                          {clips.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.id} · {c.segment} ·{" "}
                              {labels
                                ? c.compressibilityLabel
                                : "Etiqueta oculta"}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                  {compare ? (
                    <div>
                      <Cine
                        key={b.id}
                        clip={b}
                        sharedPlaying={sharedPlaying}
                        sharedPhase={phase}
                      />
                      <div className="comparison-select">
                        <select
                          aria-label="Cine B"
                          value={bId}
                          onChange={(e) => setBId(e.target.value)}
                        >
                          {clips.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.id} · {c.segment} ·{" "}
                              {labels
                                ? c.compressibilityLabel
                                : "Etiqueta oculta"}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ) : (
                    <aside className="clinical-context">
                      <span className="eyebrow">CONTEXTO DE ADQUISICIÓN</span>
                      <h3>
                        Observa la respuesta
                        <br />a la compresión.
                      </h3>
                      <div className="anatomy-map">
                        <svg
                          viewBox="0 0 220 210"
                          role="img"
                          aria-label={`Ubicación esquemática del sitio ${clip.site}; no corresponde a la anatomía individual del cine`}
                        >
                          <path
                            d="M28 10c-14 30 1 48 0 72s-7 33-5 58 7 28 2 42-12 12-10 18 31 4 34-3-4-17-3-37 9-35 5-56 9-66-3-90"
                            fill="#ded5ca"
                            stroke="#b7a58f"
                          />
                          <path
                            d="M38 20v160M24 32c-8 40 1 60 4 95"
                            stroke="#628ca0"
                            fill="none"
                            strokeWidth="3"
                          />
                          {[
                            ["CFV", 38, 29, "Femoral común"],
                            ["GS", 24, 49, "Sitio safeno proximal"],
                            ["FV", 38, 91, "Femoral"],
                            ["PV", 38, 144, "Poplítea"],
                          ].map(([site, x, y, title]) => (
                            <g key={site}>
                              <circle
                                cx={x}
                                cy={y}
                                r={clip.site === site ? 6 : 3}
                                fill={
                                  clip.site === site ? "#a92643" : "#9daeb1"
                                }
                              />
                              <path d={`M${+x + 7} ${y}H80`} stroke="#c9b6a1" />
                              <text
                                x="88"
                                y={+y + 4}
                                fontSize="9"
                                fill={
                                  clip.site === site ? "#a92643" : "#9a8672"
                                }
                              >
                                {title}
                              </text>
                            </g>
                          ))}
                        </svg>
                        <small>Mapa de localización esquemático</small>
                      </div>
                      <dl>
                        <dt>Segmento</dt>
                        <dd>{clip.segment}</dd>
                        <dt>Lado</dt>
                        <dd>{clip.side === "L" ? "Izquierdo" : "Derecho"}</dd>
                        <dt>Participante de origen</dt>
                        <dd>{clip.participantId}</dd>
                        <dt>Maniobra</dt>
                        <dd>Compresión con transductor</dd>
                        <dt>Postura / orientación</dt>
                        <dd>No documentadas</dd>
                        <dt>Etiqueta de compresibilidad</dt>
                        <dd>{labels ? clip.compressibilityLabel : "Oculta"}</dd>
                        <dt>Etiqueta de trombosis</dt>
                        <dd>
                          {labels
                            ? `${clip.thrombosis} (valor original del depósito)`
                            : "Oculta"}
                        </dd>
                      </dl>
                      <Note>{clip.clinicalContext}</Note>
                      <details>
                        <summary>Fuente y atribución</summary>
                        <p>{clip.attribution}</p>
                        <SourceLink href={clip.sourceUrl} />
                      </details>
                      <p className="local-note">
                        Espacio: reproducir / pausar. Flechas: un cuadro. Las
                        anotaciones permanecen en este navegador.
                      </p>
                    </aside>
                  )}
                </div>
                {compare && (
                  <Note>
                    La alineación usa el inicio de cada archivo; las maniobras
                    no están sincronizadas clínicamente. Cada cine conserva su
                    duración y permite situar los cuadros por separado.
                  </Note>
                )}
              </>
            )}
            <div className="below-lab">
              <Note>
                Los intervalos A–B corresponden a tiempo entre cuadros del cine
                B-mode. No miden duración de reflujo en un espectro. Distancia y
                velocidad permanecen bloqueadas sin calibración de región
                validada.
              </Note>
              <SourceLink
                href="https://zenodo.org/records/17659415"
                label="ThrombUS+ · Fuente y licencia CC BY 4.0"
              />
              <Link to="/fuentes" className="text-link">
                Ver método de selección <ChevronRight size={14} />
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
