import { Link } from "react-router-dom";
import { ZoomIn } from "lucide-react";
import {
  classExamples,
  clinicalClass,
  clinicalClasses,
  c4Subclasses,
} from "../data/ceap";
import type { Stage } from "./types";
export default function VisionPresentation({ stage }: { stage: Stage }) {
  const cls = clinicalClass(stage.clinicalClass ?? null),
    examples = classExamples(cls),
    definition = clinicalClasses.find((c) => c.id === cls)!;
  return (
    <div className="guided-clinical">
      <div className="guided-clinical-heading">
        <span className="clinical-code">{cls}</span>
        <div>
          <h3>{definition.name}</h3>
          <small>
            {new Set(examples.map((i) => i.sourceCaseId)).size === 1
              ? "Dos vistas del mismo registro"
              : "Dos registros del banco"}{" "}
            · etiquetas originales
          </small>
        </div>
      </div>
      <div className="clinical-picture-grid">
        {examples.map((image, i) => (
          <Link
            className={stage.example === i ? "focused-example" : ""}
            key={image.id}
            to={`/flebovision?view=bank&class=${cls}&case=${image.id}`}
          >
            <img
              src={image.image}
              alt={`Ejemplo de origen ${cls}, carpeta ${image.sourceCaseId}`}
              width={image.width}
              height={image.height}
            />
            <div>
              <span>
                <b>Etiqueta de origen {cls}</b>
                <small>
                  {image.sourceCaseId} · vista {image.viewIndex}
                </small>
              </span>
              <ZoomIn size={18} />
            </div>
          </Link>
        ))}
      </div>
      {cls === "C4" ? (
        <div className="guided-c4">
          <span>SUBCLASE QUE SE EXPLICA</span>
          {c4Subclasses.map((c) => (
            <div className={stage.subclass === c.id ? "active" : ""} key={c.id}>
              <b>{c.id}</b>
              <span>{c.name}</span>
            </div>
          ))}
          <small>
            Los ejemplos siguen etiquetados C4. No se adjudican subclases a
            estas fotos.
          </small>
        </div>
      ) : (
        <div className="clinical-question">
          <span>OBSERVACIÓN Y CONTEXTO</span>
          <p>{definition.question}</p>
        </div>
      )}
      <nav
        className="guided-class-navigation"
        aria-label="Otra explicación CEAP"
      >
        {clinicalClasses.map((c) => (
          <Link
            aria-current={c.id === cls ? "page" : undefined}
            className={c.id === cls ? "active" : ""}
            to={`/aprender/CEAP-${c.id}`}
            key={c.id}
          >
            {c.id}
          </Link>
        ))}
      </nav>
    </div>
  );
}
