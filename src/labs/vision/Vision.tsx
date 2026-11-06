import { lazy, Suspense } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BookOpen, Images, ArrowLeftRight } from "lucide-react";
import { LabHeader } from "../../shared/UI";
import CEAPExplorer from "./CEAPExplorer";
import { clinicalClass } from "../../data/ceap";
import "./learning.css";
const Bank = lazy(() => import("./VisionBank"));
export default function Vision() {
  const [query] = useSearchParams();
  const bank =
    query.has("case") || ["bank", "compare"].includes(query.get("view") ?? "");
  const comparison = query.get("view") === "compare";
  const cls = query.get("class") ?? "C2";
  return (
    <>
      <LabHeader
        name="FleboVision"
        tag="LABORATORIO 03 / OBSERVACIÓN CLÍNICA"
        title="Aprende a observar con CEAP 2020"
        description={
          bank
            ? "Amplía, compara y describe hallazgos reales."
            : "Comprende la clasificación. Observa con un propósito."
        }
        color="gold"
      >
        <Link
          className="button secondary"
          to={`/aprender/CEAP-${clinicalClass(query.get("class"))}`}
        >
          <BookOpen size={14} />
          Explicación guiada
        </Link>
      </LabHeader>
      <nav
        className="container vision-mode-nav"
        aria-label="Actividad de FleboVision"
      >
        <Link
          className={!bank ? "active" : ""}
          aria-current={!bank ? "page" : undefined}
          to={`/flebovision?class=${cls}`}
        >
          <BookOpen size={17} />
          Aprender CEAP 2020
        </Link>
        <Link
          className={bank && !comparison ? "active" : ""}
          aria-current={bank && !comparison ? "page" : undefined}
          to={`/flebovision?view=bank&class=${cls}`}
        >
          <Images size={17} />
          Banco de imágenes
        </Link>
        <Link
          className={comparison ? "active" : ""}
          aria-current={comparison ? "page" : undefined}
          to={`/flebovision?view=compare&class=${cls}`}
        >
          <ArrowLeftRight size={17} />
          Comparar
        </Link>
      </nav>
      {bank ? (
        <Suspense
          fallback={
            <div className="page-loading">Preparando el banco de imágenes…</div>
          }
        >
          <Bank />
        </Suspense>
      ) : (
        <CEAPExplorer />
      )}
    </>
  );
}
