import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  ScanLine,
} from "lucide-react";
import {
  clinicalClasses,
  clinicalClass,
  c4Subclasses,
  ceapDomains,
  ceapQuestions,
  classExamples,
} from "../../data/ceap";
import { References } from "../../shared/References";
import images from "../../data/vision";

export default function CEAPExplorer() {
  const [query, setQuery] = useSearchParams();
  const selected = clinicalClass(query.get("class")),
    lesson = clinicalClasses.find((c) => c.id === selected)!;
  const domain =
    ceapDomains.find((d) => d.id === query.get("domain")) ?? ceapDomains[0];
  const [sub, setSub] = useState("C4a"),
    [answer, setAnswer] = useState<Record<string, number>>({}),
    [step, setStep] = useState(0);
  const question = ceapQuestions[step],
    chosen = answer[question.id];
  const chooseClass = (id: string) =>
    setQuery({ class: id, domain: "C" }, { replace: true });
  const chooseDomain = (id: string) =>
    setQuery({ class: selected, domain: id }, { replace: true });
  const examples = classExamples(selected),
    count = images.filter((i) => i.ceap === selected).length;
  const correct = ceapQuestions.filter((q) => answer[q.id] === q.answer).length;
  return (
    <div className="container ceap-explorer">
      <section className="ceap-intro">
        <div>
          <span className="eyebrow">OBSERVAR · DESCRIBIR · COMPRENDER</span>
          <h2>La C no es toda la CEAP.</h2>
          <p>
            Elige una clase, aprende qué describe y contrástala con ejemplos
            reales.
          </p>
        </div>
        <div className="ceap-standard">
          <BookOpen size={19} />
          <b>CEAP 2020</b>
          <span>American Venous Forum</span>
        </div>
      </section>
      <div
        className="ceap-domain-tabs"
        role="group"
        aria-label="Componentes de CEAP"
      >
        {ceapDomains.map((d) => (
          <button
            key={d.id}
            aria-pressed={domain.id === d.id}
            className={domain.id === d.id ? "active" : ""}
            onClick={() => chooseDomain(d.id)}
          >
            <b>{d.id}</b>
            <span>
              {d.name}
              <small>
                {d.id === "C"
                  ? "Empieza por lo clínico"
                  : "Completa el contexto"}
              </small>
            </span>
          </button>
        ))}
      </div>
      {domain.id !== "C" ? (
        <section className="ceap-domain-lesson">
          <div>
            <span className="eyebrow">{domain.name}</span>
            <h2>{domain.question}</h2>
            <p>{domain.method}</p>
            <Link className="button secondary" to="/flebodus">
              <ScanLine size={16} />
              Explorar el laboratorio dúplex
            </Link>
          </div>
          <div className="ceap-code-list">
            {domain.codes.map((c) => (
              <div key={c.id}>
                <b>{c.id}</b>
                <span>{c.name}</span>
              </div>
            ))}
            <p>
              Dato faltante no equivale a un código «n». Registra lo evaluado y
              sus límites.
            </p>
          </div>
        </section>
      ) : (
        <>
          <div className="ceap-step-heading">
            <span className="step-number">1</span>
            <div>
              <h3>Elige una clase clínica</h3>
              <p>
                Se describe cada miembro. Las clases no son una escala de
                gravedad ni una progresión obligatoria.
              </p>
            </div>
          </div>
          <div
            className="ceap-class-map"
            role="group"
            aria-label="Clases clínicas CEAP"
          >
            {clinicalClasses.map((c) => (
              <button
                key={c.id}
                onClick={() => chooseClass(c.id)}
                aria-pressed={selected === c.id}
                className={selected === c.id ? "active" : ""}
              >
                <b>{c.id}</b>
                <span>{c.short}</span>
              </button>
            ))}
          </div>
          <section
            className="ceap-class-lesson"
            aria-label={`Aprender ${selected}`}
          >
            <div className="ceap-description">
              <span className="clinical-code">{selected}</span>
              <h2>{lesson.name}</h2>
              <div className="observation-prompt">
                <Eye size={17} />
                <div>
                  <b>Qué observar</b>
                  <p>{lesson.observe}</p>
                </div>
              </div>
              <div className="clinical-context-prompt">
                <b>Qué necesita contexto</b>
                <p>{lesson.context}</p>
              </div>
              {selected === "C4" && (
                <div className="c4-update">
                  <span className="eyebrow">SUBCLASES · CEAP 2020</span>
                  <div role="group" aria-label="Subclases C4">
                    {c4Subclasses.map((c) => (
                      <button
                        key={c.id}
                        aria-pressed={sub === c.id}
                        className={sub === c.id ? "active" : ""}
                        onClick={() => setSub(c.id)}
                      >
                        {c.id}
                      </button>
                    ))}
                  </div>
                  <h3>{c4Subclasses.find((c) => c.id === sub)!.name}</h3>
                  <p>{c4Subclasses.find((c) => c.id === sub)!.note}</p>
                </div>
              )}
              {(selected === "C2" || selected === "C6") && (
                <div className="recurrence-note">
                  <b>{selected}r · Recurrencia</b>
                  <p>
                    La r se añade con antecedentes clínicos documentados. No es
                    una nueva etiqueta automática de la imagen.
                  </p>
                </div>
              )}
              <details className="ceap-reporting">
                <summary>Cómo se registra: básico, avanzado y síntomas</summary>
                <p>
                  <b>Básico:</b> la clase C más alta del miembro.{" "}
                  <b>Avanzado:</b> las clases C presentes. Los calificadores{" "}
                  <b>s</b> y <b>a</b> indican sintomático o asintomático; este
                  calificador es distinto del dominio anatómico A.
                </p>
                <p>La fotografía no completa los dominios E, A y P.</p>
                <References ids={["ceap2020"]} />
              </details>
            </div>
            <div className="ceap-examples">
              <div className="ceap-examples-title">
                <span className="step-number">2</span>
                <div>
                  <h3>Observa y describe</h3>
                  <p>{lesson.question}</p>
                </div>
              </div>
              <div className="ceap-example-grid">
                {examples.map((image) => (
                  <Link
                    key={image.id}
                    to={`/flebovision?view=bank&class=${selected}&case=${image.id}`}
                  >
                    <img
                      src={image.thumbnail}
                      alt={`Ejemplo del depósito etiquetado ${selected}, vista ${image.viewIndex}`}
                      width="320"
                      height="240"
                      loading="lazy"
                    />
                    <span>
                      <b>Ejemplo {examples.indexOf(image) + 1}</b>
                      <small>Etiqueta de origen {selected}</small>
                      <ArrowRight size={15} />
                    </span>
                  </Link>
                ))}
              </div>
              <Link
                className="button secondary ceap-open-bank"
                to={`/flebovision?view=bank&class=${selected}`}
              >
                Explorar {count} imágenes de {selected}
                <ArrowRight size={16} />
              </Link>
              <small className="ceap-origin-note">
                TRICVI–C · Etiquetas conservadas del depósito. Abre una imagen
                para ampliar, comparar o anotar.
              </small>
            </div>
          </section>
        </>
      )}
      <section className="ceap-practice">
        <div className="practice-heading">
          <span className="step-number">3</span>
          <div>
            <h3>Comprueba lo aprendido</h3>
            <p>Preguntas sobre el sistema, sin diagnosticar las fotografías.</p>
          </div>
          <span className="practice-score">
            {Object.keys(answer).length}/{ceapQuestions.length} respondidas ·{" "}
            {correct} correctas
          </span>
        </div>
        <div className="practice-body">
          <div>
            <span className="eyebrow">
              PREGUNTA {step + 1} / {ceapQuestions.length}
            </span>
            <h3>{question.question}</h3>
            <div className="practice-options">
              {question.options.map((option, i) => (
                <button
                  key={option}
                  aria-pressed={chosen === i}
                  className={chosen === i ? "selected" : ""}
                  onClick={() => setAnswer((a) => ({ ...a, [question.id]: i }))}
                >
                  <span>{String.fromCharCode(65 + i)}</span>
                  {option}
                </button>
              ))}
            </div>
          </div>
          <aside
            aria-live="polite"
            className={`practice-feedback ${chosen === undefined ? "is-pending" : chosen === question.answer ? "is-correct" : "is-review"}`}
          >
            {chosen === undefined ? (
              <>
                <HelpCircle size={24} />
                <h4>Elige una respuesta</h4>
                <p>
                  Recibirás la explicación y podrás contrastarla con el
                  documento de referencia.
                </p>
              </>
            ) : (
              <>
                <CheckCircle2 size={23} />
                <h4>
                  {chosen === question.answer
                    ? "Correcto"
                    : "Revisa el concepto"}
                </h4>
                <p>{question.explanation}</p>
                <References ids={["ceap2020"]} />
              </>
            )}
          </aside>
        </div>
        <div className="practice-navigation">
          <button
            className="button quiet"
            disabled={step === 0}
            onClick={() => setStep(step - 1)}
          >
            Anterior
          </button>
          <button
            className="button quiet"
            onClick={() => {
              setAnswer({});
              setStep(0);
            }}
          >
            <RotateCcw size={14} />
            Reiniciar
          </button>
          <button
            className="button secondary"
            disabled={step === ceapQuestions.length - 1}
            onClick={() => setStep(step + 1)}
          >
            Siguiente
            <ArrowRight size={15} />
          </button>
        </div>
      </section>
      <div className="ceap-evidence">
        <p>
          CEAP es una descripción clínica, no una puntuación de gravedad. Las
          etiquetas del banco son ejemplos para aprendizaje y no una validación
          diagnóstica independiente.
        </p>
        <References ids={["ceap2020", "esvs2022"]} />
      </div>
    </div>
  );
}
