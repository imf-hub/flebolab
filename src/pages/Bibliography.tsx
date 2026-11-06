import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Download, Search, ArrowUpRight } from "lucide-react";
import {
  medicalReferences,
  controversies,
  revisionDate,
} from "../data/references";
import { References } from "../shared/References";
import { Note } from "../shared/UI";
function CitationText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(https:\/\/[^\s]+)/g).map((part, index) =>
        part.startsWith("https://") ? (
          <a
            key={index}
            href={part.replace(/\.$/, "")}
            target="_blank"
            rel="noreferrer"
          >
            Texto consultado ↗
          </a>
        ) : (
          part
        ),
      )}
    </>
  );
}
function shortAuthors(authors: string) {
  const names = authors.split(", ");
  return names.length > 6 ? names.slice(0, 6).join(", ") + ", et al." : authors;
}
export default function Bibliography() {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) {
      setQuery("");
      setRank(0);
    }
  }, [hash]);
  const [query, setQuery] = useState("");
  const [rank, setRank] = useState(0);
  const groups = [
    "UIP y sociedades de flebología",
    "Sociedades vasculares y angiología",
    "Otras especialidades, estándares y ciencia básica",
  ];
  const filtered = medicalReferences.filter(
    (r) =>
      (!rank || r.rank === rank) &&
      `${r.title} ${r.organization} ${r.scope} ${r.doi} ${r.locator}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <section className="container library-page bibliography-page">
      <header className="library-heading">
        <div className="eyebrow">FUNDAMENTO MÉDICO / FUENTES PRIMARIAS</div>
        <h1>Referencias que puedes revisar.</h1>
        <p>
          Guías, consensos y criterios de interpretación, con su alcance,
          ubicación y límites. Primero flebología; después sociedades
          vasculares; finalmente otras especialidades.
        </p>
      </header>
      <div className="bibliography-intro">
        <BookOpen size={29} />
        <div>
          <b>Revisión editorial: {revisionDate}</b>
          <p>
            La prioridad institucional organiza la consulta; no sustituye la
            valoración de actualidad, método y certeza de cada documento. Una
            guía conjunta conserva sus autores y su respaldo institucional.
          </p>
        </div>
        <a href="#controversias" className="text-link">
          Controversias y matices ↓
        </a>
      </div>
      <div className="reference-method">
        <h2>Cómo usamos la evidencia</h2>
        <div className="nature-grid">
          <article>
            <b>Autoría y respaldo identificados</b>
            <p>
              Se distingue quién elaboró, respaldó o distribuyó el documento.
              Estar alojado en una sociedad o publicarse en una revista no
              implica aval del producto.
            </p>
          </article>
          <article>
            <b>Texto y localizador comprobables</b>
            <p>
              Cada ficha indica si se revisó texto completo, resumen o registro.
              Los documentos históricos conservan su fecha; una ficha
              bibliográfica sola no respalda nuevos detalles clínicos.
            </p>
          </article>
          <article>
            <b>Recomendaciones con su categoría</b>
            <p>
              No se convierten consensos o declaraciones de buena práctica en
              recomendaciones de alta certeza. Los umbrales técnicos conservan
              su contexto, población y condiciones.
            </p>
          </article>
        </div>
      </div>
      <div className="button-row reference-downloads">
        <a
          className="button secondary"
          href="/references/flebolab-vancouver.txt"
          download
        >
          <Download size={16} /> Bibliografía en texto
        </a>
        <a className="button quiet" href="/references/flebolab.bib" download>
          <Download size={16} /> BibTeX
        </a>
        <Link className="text-link" to="/fuentes">
          Bancos de datos, medios y modelo <ArrowUpRight size={16} />
        </Link>
      </div>
      <div className="library-toolbar">
        <div className="search-field">
          <Search size={17} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Buscar referencia médica"
            placeholder="Tema, sociedad, título o DOI…"
          />
        </div>
        <select
          aria-label="Filtrar por prioridad de fuentes"
          value={rank}
          onChange={(e) => setRank(Number(e.target.value))}
        >
          <option value={0}>Todas las fuentes médicas</option>
          {groups.map((g, i) => (
            <option key={g} value={i + 1}>
              {i + 1}. {g}
            </option>
          ))}
        </select>
        <span>{filtered.length} referencias</span>
      </div>
      {groups.map(
        (group, i) =>
          filtered.some((r) => r.rank === i + 1) && (
            <section key={group} className="reference-group">
              <h2>
                <span>0{i + 1}</span>
                {group}
              </h2>
              {filtered
                .filter((r) => r.rank === i + 1)
                .map((r) => (
                  <article className="reference-card" id={r.id} key={r.id}>
                    <div className="reference-card-top">
                      <span className="eyebrow">
                        {r.organization} / {r.year ?? "s.f."}
                      </span>
                      <span className="nature-badge">{r.kind}</span>
                    </div>
                    <h3>{r.title}</h3>
                    <p className="citation-full">
                      {shortAuthors(r.authors)} {r.title}. {r.journal}
                      {r.doi && ` DOI: ${r.doi}.`}
                    </p>
                    <p>{r.scope}</p>
                    <dl>
                      <div>
                        <dt>Acceso contrastado</dt>
                        <dd>{r.access}</dd>
                      </div>
                      <div>
                        <dt>Dónde consultar</dt>
                        <dd>
                          <CitationText text={r.locator} />
                        </dd>
                      </div>
                      <div>
                        <dt>Límite de uso</dt>
                        <dd>{r.limitations}</dd>
                      </div>
                    </dl>
                    <a
                      className="text-link"
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Consultar documento primario <ArrowUpRight size={16} />
                    </a>
                    {r.doi && (
                      <a
                        className="text-link reference-doi"
                        href={`https://doi.org/${r.doi}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Resolver DOI ↗
                      </a>
                    )}
                  </article>
                ))}
            </section>
          ),
      )}
      {!filtered.length && (
        <p>No hay referencias que coincidan con la búsqueda.</p>
      )}
      <section id="controversias" className="controversies">
        <div className="eyebrow">LECTURA CRÍTICA</div>
        <h2>Controversias, cambios y límites.</h2>
        <p>
          Algunas diferencias provienen del protocolo, la fecha o el alcance del
          documento. Se explican aquí para evitar convertirlas en reglas
          universales.
        </p>
        {controversies.map((c) => (
          <article id={c.id} key={c.id}>
            <h3>{c.title}</h3>
            <p>{c.text}</p>
            <p className="clinical-consequence">
              <b>En FLEBO LAB: </b>
              {c.consequence}
            </p>
            <References ids={c.refs} />
          </article>
        ))}
      </section>
      <Note>
        Esta es una revisión editorial y técnica de fuentes públicas, no una
        revisión sistemática ni una validación clínica independiente del
        producto. Falta la firma de un comité médico externo sobre el contenido,
        los casos y su uso docente. No se presentan las sociedades citadas como
        patrocinadoras o avalistas de FLEBO LAB.
      </Note>
      <p className="local-note">
        No se reproducen figuras o PDFs de las guías. Los derechos de cada
        publicación se conservan. Detectamos y corregimos un DOI erróneo del
        catálogo UIP para dúplex parte I: el artículo pertinente es
        10.1016/j.ejvs.2005.07.019.
      </p>
    </section>
  );
}
