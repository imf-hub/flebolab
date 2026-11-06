import { References } from "../../shared/References";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Search,
  Bookmark,
  ArrowLeftRight,
  Eye,
  ChevronLeft,
  ChevronRight,
  Grid2X2,
  Thermometer,
  Check,
  Layers,
} from "lucide-react";
import images from "../../data/vision.json";
import { observationGuides } from "../../data/educational";
import { LabHeader, Note, SourceLink, Empty } from "../../shared/UI";
import { AnnotationTools, useAnnotations } from "../../shared/Annotations";
import { readLocal, saveLocal } from "../../shared/utils";
const ImageViewer = lazy(() => import("./ImageViewer"));
type Image = (typeof images)[number];
function ClinicalViewer({
  image,
  thermal = false,
  blind = false,
}: {
  image: Image;
  thermal?: boolean;
  blind?: boolean;
}) {
  const width = thermal ? (image.thermalWidth ?? image.width) : image.width;
  const height = thermal ? (image.thermalHeight ?? image.height) : image.height;
  const [tool, setTool] = useState("pan");
  const annotations = useAnnotations(image.id + (thermal ? "-thermal" : ""));
  return (
    <>
      <AnnotationTools tool={tool} setTool={setTool} {...annotations} />
      <Suspense
        fallback={<div className="image-viewer loading">Cargando imagen…</div>}
      >
        <ImageViewer
          src={thermal && image.thermal ? image.thermal : image.image}
          width={width}
          height={height}
          tool={tool}
          marks={annotations.marks}
          onAdd={annotations.add}
        />
      </Suspense>
      <div className="viewer-caption">
        <span>
          {thermal ? "TERMOGRAFÍA EMPAREJADA" : "FOTOGRAFÍA CLÍNICA REAL"}
        </span>
        <span>
          {blind
            ? `Imagen ${images.findIndex((i) => i.id === image.id) + 1}`
            : image.sourceCaseId}{" "}
          · {width} × {height}px
        </span>
      </div>
    </>
  );
}
export default function Vision() {
  const [query, setQuery] = useSearchParams();
  const [cls, setCls] = useState(query.get("class") ?? "Todas"),
    [search, setSearch] = useState(""),
    [id, setId] = useState(query.get("case") ?? images[0].id),
    [favorites, setFav] = useState(
      readLocal<string[]>("flebo-vision-favorites", []),
    ),
    [onlyFav, setOnlyFav] = useState(false),
    [thermalOnly, setThermalOnly] = useState(false),
    [mode, setMode] = useState("single"),
    [thermal, setThermal] = useState(false),
    [compareIds, setCompareIds] = useState<string[]>([
      images[0].id,
      images[21]?.id ?? images[1].id,
    ]),
    [showLabels, setShowLabels] = useState(true),
    [view, setView] = useState(query.get("case") ? "detail" : "library");
  const filtered = useMemo(
    () =>
      images.filter(
        (i) =>
          (cls === "Todas" || i.ceap === cls) &&
          (!onlyFav || favorites.includes(i.id)) &&
          (!thermalOnly || i.thermal) &&
          `${i.title} ${i.sourceCaseId}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [cls, search, onlyFav, thermalOnly, favorites],
  );
  const current = images.find((i) => i.id === id) ?? images[0];
  const guide = observationGuides.find((g) => g.id === current.ceap);
  const related = images.filter(
    (i) => i.sourceCaseId === current.sourceCaseId && i.id !== id,
  );
  useEffect(() => {
    setQuery({ case: id, class: cls }, { replace: true });
  }, [id, cls]);
  const select = (i: Image) => {
    setId(i.id);
    setThermal(false);
    setView("detail");
  };
  const favorite = (key: string) => {
    const next = favorites.includes(key)
      ? favorites.filter((x) => x !== key)
      : [...favorites, key];
    setFav(next);
    saveLocal("flebo-vision-favorites", next);
  };
  const move = (n: number) => {
    const index = filtered.findIndex((i) => i.id === id);
    if (filtered.length)
      select(filtered[(index + n + filtered.length) % filtered.length]);
  };
  return (
    <>
      <LabHeader
        name="FleboVision"
        tag="LABORATORIO 03 / OBSERVACIÓN CLÍNICA"
        title="Observa. Amplía. Describe."
        description="Fotografía real para afinar la observación y conversar sobre hallazgos, contexto y límites de una imagen."
        color="gold"
      />
      <div className="container vision-container">
        <div className="library-toolbar">
          <div className="search-field">
            <Search size={17} />
            <input
              aria-label="Buscar fotografía"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar hallazgo o caso…"
            />
          </div>
          <button
            className={`button quiet ${onlyFav ? "selected" : ""}`}
            onClick={() => setOnlyFav(!onlyFav)}
          >
            <Bookmark size={15} />
            Guardadas ({favorites.length})
          </button>
          <button
            className={`button quiet ${thermalOnly ? "selected" : ""}`}
            onClick={() => setThermalOnly(!thermalOnly)}
          >
            <Thermometer size={16} />
            Con térmica
          </button>
          <div className="toolbar-spacer" />
          <div className="segmented">
            <button
              className={view === "library" ? "active" : ""}
              onClick={() => setView("library")}
            >
              <Grid2X2 size={15} />
              Biblioteca
            </button>
            <button
              className={view === "detail" ? "active" : ""}
              onClick={() => setView("detail")}
            >
              <Eye size={15} />
              Visor
            </button>
          </div>
          <button
            className="button quiet"
            onClick={() => {
              setMode(mode === "compare" ? "single" : "compare");
              setView("detail");
              setCompareIds([
                current.id,
                images.find(
                  (i) => i.id !== current.id && i.ceap !== current.ceap,
                )?.id ?? images[1].id,
              ]);
            }}
          >
            <ArrowLeftRight size={16} />
            {mode === "compare" ? "Vista individual" : "Comparar"}
          </button>
        </div>
        <div className="filter-row">
          <span>CLASE DE ORIGEN</span>
          {["Todas", "C0", "C1", "C2", "C3", "C4", "C5", "C6"].map((c) => (
            <button
              key={c}
              className={cls === c ? "active" : ""}
              onClick={() => {
                setCls(c);
                setView("library");
              }}
            >
              {c}
              <small>
                {c === "Todas"
                  ? images.length
                  : images.filter((i) => i.ceap === c).length}
              </small>
            </button>
          ))}
          <label className="hide-labels">
            <input
              type="checkbox"
              checked={showLabels}
              onChange={(e) => setShowLabels(e.target.checked)}
            />
            Mostrar etiquetas
          </label>
        </div>
        {view === "library" ? (
          <>
            <div className="results-summary">
              <span>
                {filtered.length} fotografías ·{" "}
                {new Set(filtered.map((i) => i.sourceCaseId)).size} carpetas de
                caso
              </span>
              <span>TRICVI–C v2 · Clasificación del depósito</span>
            </div>
            {filtered.length ? (
              <div className="photo-grid">
                {filtered.map((i) => (
                  <article className="photo-card" key={i.id}>
                    <button
                      className="photo-open"
                      onClick={() => select(i)}
                      aria-label={
                        showLabels
                          ? `Abrir ${i.title}`
                          : `Abrir imagen ${images.findIndex((x) => x.id === i.id) + 1}`
                      }
                    >
                      <img
                        src={i.thumbnail}
                        alt={
                          showLabels
                            ? `Fotografía clínica, carpeta ${i.sourceCaseId}`
                            : "Fotografía clínica sin etiqueta"
                        }
                        loading="lazy"
                        width="320"
                        height="240"
                      />
                      {showLabels && (
                        <span className="class-badge">{i.ceap}</span>
                      )}
                      {i.thermal && (
                        <span className="thermal-badge">
                          <Thermometer size={13} />
                          RGB + térmica
                        </span>
                      )}
                    </button>
                    <div className="photo-caption">
                      <button onClick={() => select(i)}>
                        <small>
                          {showLabels
                            ? `CASO ${i.sourceCaseId}`
                            : `IMAGEN ${images.findIndex((x) => x.id === i.id) + 1}`}{" "}
                          · VISTA {i.viewIndex}
                        </small>
                        <b>
                          {showLabels
                            ? i.category
                            : "Observa antes de consultar la etiqueta"}
                        </b>
                      </button>
                      <button
                        className={`icon-button ${favorites.includes(i.id) ? "selected" : ""}`}
                        aria-label="Guardar fotografía"
                        onClick={() => favorite(i.id)}
                      >
                        <Bookmark size={16} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <Empty>
                No hay imágenes con estos filtros. Prueba otra clase o borra la
                búsqueda.
              </Empty>
            )}
          </>
        ) : mode === "compare" ? (
          <section className="comparison-workspace">
            <div className="comparison-header">
              <h2>Una mirada en paralelo.</h2>
              <div className="segmented">
                <button
                  className={compareIds.length === 2 ? "active" : ""}
                  onClick={() => setCompareIds(compareIds.slice(0, 2))}
                >
                  2 imágenes
                </button>
                <button
                  className={compareIds.length === 4 ? "active" : ""}
                  onClick={() =>
                    setCompareIds([
                      ...compareIds,
                      ...images
                        .filter((i) => !compareIds.includes(i.id))
                        .slice(0, 4 - compareIds.length)
                        .map((i) => i.id),
                    ])
                  }
                >
                  4 imágenes
                </button>
              </div>
            </div>
            <div className={`compare-grid count-${compareIds.length}`}>
              {compareIds.map((key, index) => {
                const image = images.find((i) => i.id === key)!;
                return (
                  <div className="compare-cell" key={index}>
                    <label className="comparison-select">
                      Imagen {index + 1}
                      <select
                        value={key}
                        onChange={(e) =>
                          setCompareIds((ids) =>
                            ids.map((x, j) =>
                              j === index ? e.target.value : x,
                            ),
                          )
                        }
                      >
                        {images.map((i) => (
                          <option key={i.id} value={i.id}>
                            {showLabels
                              ? i.sourceCaseId
                              : `Imagen ${images.findIndex((x) => x.id === i.id) + 1}`}{" "}
                            · vista {i.viewIndex}
                            {showLabels ? ` · ${i.category}` : ""}
                          </option>
                        ))}
                      </select>
                    </label>
                    <ClinicalViewer image={image} blind={!showLabels} />
                  </div>
                );
              })}
            </div>
            <Note>
              Cada visor conserva su ampliación y sus anotaciones. Compara
              distribución y aspecto; las condiciones de captura pueden ser
              distintas.
            </Note>
          </section>
        ) : (
          <section className="vision-detail">
            <div className="clinical-stage">
              <div className="stage-title">
                <div>
                  <span className="eyebrow">
                    TRICVI–C /{" "}
                    {showLabels
                      ? current.sourceCaseId
                      : "OBSERVACIÓN SIN ETIQUETA"}
                  </span>
                  <h2>
                    {showLabels
                      ? current.category
                      : "Observa y describe los hallazgos"}
                  </h2>
                </div>
                <div className="button-row">
                  <button
                    className="icon-button"
                    onClick={() => move(-1)}
                    aria-label="Fotografía anterior"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    className="icon-button"
                    onClick={() => move(1)}
                    aria-label="Fotografía siguiente"
                  >
                    <ChevronRight size={18} />
                  </button>
                  <button
                    className={`icon-button ${favorites.includes(current.id) ? "selected" : ""}`}
                    onClick={() => favorite(current.id)}
                    aria-label="Guardar fotografía"
                  >
                    <Bookmark size={18} />
                  </button>
                </div>
              </div>
              {current.thermal && (
                <div className="view-tabs">
                  <button
                    className={!thermal ? "active" : ""}
                    onClick={() => setThermal(false)}
                  >
                    RGB
                  </button>
                  <button
                    className={thermal ? "active" : ""}
                    onClick={() => setThermal(true)}
                  >
                    Térmica emparejada
                  </button>
                </div>
              )}
              <ClinicalViewer
                key={current.id + thermal}
                image={current}
                blind={!showLabels}
                thermal={thermal}
              />
              {thermal && (
                <Note>
                  No añadimos mediciones de temperatura. La escala y los valores
                  incrustados pertenecen al archivo original; su calibración
                  radiométrica no está validada en este visor.
                </Note>
              )}
              {related.length > 0 && (
                <div className="related-views">
                  <b>Otras vistas del mismo caso</b>
                  {related.map((i) => (
                    <button key={i.id} onClick={() => select(i)}>
                      <img src={i.thumbnail} alt={`Vista ${i.viewIndex}`} />
                      <span>Vista {i.viewIndex}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <aside className="clinical-context">
              {!showLabels ? (
                <>
                  <div className="eyebrow">OBSERVACIÓN DOCENTE</div>
                  <h3>Describe antes de consultar.</h3>
                  <p>
                    Las etiquetas, los identificadores de clase y la guía
                    específica están ocultos. Observa superficie, distribución y
                    límites de la fotografía.
                  </p>
                  <p>
                    Activa Mostrar etiquetas para contrastar con la
                    clasificación del depósito.
                  </p>
                </>
              ) : (
                <>
                  <div className="eyebrow">GUÍA DE OBSERVACIÓN</div>
                  <h3>Primero, describe.</h3>
                  <ul>
                    {guide?.visibleFindings.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  <h4>¿Qué contexto falta?</h4>
                  <ul>
                    {guide?.contextNeeded.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  <details>
                    <summary>Etiqueta y límites de interpretación</summary>
                    <p>
                      {showLabels
                        ? `${current.ceap} · ${current.category}`
                        : "Etiquetas ocultas para observación docente."}
                    </p>
                    <p>{current.clinicalContext}</p>
                    {guide?.limitations.map((t) => (
                      <p key={t}>{t}</p>
                    ))}
                  </details>
                  <References ids={guide?.sources ?? ["ceap2020"]} />
                  <details>
                    <summary>Procedencia y transformaciones</summary>
                    <p>{current.attribution}</p>
                    <p>
                      Codificación WebP para distribución; se conservan
                      proporción y dimensiones. No se aplica retoque clínico.
                    </p>
                    <SourceLink href={current.sourceUrl} />
                  </details>
                  <p className="local-note">
                    Tus anotaciones y favoritos se guardan en este navegador.
                    Puedes exportarlos como JSON.
                  </p>
                </>
              )}
            </aside>
          </section>
        )}
        <div className="below-lab">
          <Note>
            Las clases C provienen del conjunto original. Una fotografía aislada
            no completa CEAP ni permite inferir etiología, anatomía o
            fisiopatología. Las 71 carpetas de caso no se presentan como 71
            pacientes confirmados.
          </Note>
          <SourceLink
            href="https://data.mendeley.com/datasets/rf5m97cmm3/2"
            label="TRICVI–C v2 · Ruiz, Gomez-Gil y Renero · CC BY 4.0"
          />
          <Link to="/recorridos" className="text-link">
            Recorridos de observación <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </>
  );
}
