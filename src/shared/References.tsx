import { Link } from "react-router-dom";
import { sources } from "../data/educational";
import { medicalReferences } from "../data/references";
export function References({
  ids,
  label = "Referencias y contexto",
}: {
  ids: string[];
  label?: string;
}) {
  const ordered = [...new Set(ids)].sort(
    (a, b) =>
      (medicalReferences.find((r) => r.id === a)?.rank ?? 4) -
      (medicalReferences.find((r) => r.id === b)?.rank ?? 4),
  );
  return (
    <div className="context-references">
      <small>{label}</small>
      <div className="source-row">
        {ordered.map((id) => {
          const reference = medicalReferences.find((r) => r.id === id);
          const source = sources.find((r) => r.id === id);
          return reference ? (
            <Link key={id} to={`/bibliografia#${id}`} className="source-link">
              {reference.id.startsWith("uip")
                ? "UIP"
                : reference.id === "ceap2020"
                  ? "AVF · CEAP"
                  : reference.id === "asv2024"
                    ? "AVLS / AVF / UIP · ASV"
                    : reference.id === "ksp2023"
                      ? "KSP"
                      : reference.id.startsWith("svs")
                        ? "SVS / AVF / AVLS"
                        : reference.id.startsWith("esvs")
                          ? "ESVS"
                          : reference.id === "keijsers2015"
                            ? "Keijsers et al."
                            : reference.id === "ferlito2026"
                              ? "Ferlito et al."
                              : reference.id === "dopplerphysics"
                                ? "Magee"
                                : reference.id.toUpperCase()}{" "}
              ·{" "}
              {reference.id === "uipduplex1"
                ? "Dúplex I · "
                : reference.id === "uipduplex2"
                  ? "Dúplex II · "
                  : ""}
              {reference.year ?? "s.f."} ↗
            </Link>
          ) : source ? (
            <a
              key={id}
              className="source-link"
              href={source.url}
              target="_blank"
              rel="noreferrer"
            >
              {source.title} ↗
            </a>
          ) : null;
        })}
      </div>
    </div>
  );
}
