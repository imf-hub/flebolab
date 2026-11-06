import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ZoomIn } from "lucide-react";
import {
  classExamples,
  clinicalClass,
  clinicalClasses,
  c4Subclasses,
} from "../data/ceap";
import type { Stage } from "./types";
export default function VisionPresentation({
  stage,
  onReady,
}: {
  stage: Stage;
  onReady?: () => void;
}) {
  const [media, setMedia] = useState<Record<string, "ready" | "error">>({});
  const cls = clinicalClass(stage.clinicalClass ?? null),
    examples = classExamples(cls),
    definition = clinicalClasses.find((c) => c.id === cls)!;
  useEffect(() => {
    if (examples.every((image) => media[image.id] === "ready")) onReady?.();
  }, [media, cls, onReady]);
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
              onLoad={() => setMedia((m) => ({ ...m, [image.id]: "ready" }))}
              onError={() => setMedia((m) => ({ ...m, [image.id]: "error" }))}
              data-ready={media[image.id] === "ready"}
            />
            {media[image.id] !== "ready" && (
              <span className="guided-resource-loading" role="status">
                {media[image.id] === "error"
                  ? "Imagen no disponible. Abre el banco para revisar el recurso."
                  : "Cargando fotografía original…"}
              </span>
            )}
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
