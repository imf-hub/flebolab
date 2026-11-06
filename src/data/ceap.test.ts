import { describe, expect, it } from "vitest";
import {
  clinicalClasses,
  clinicalClass,
  c4Subclasses,
  ceapDomains,
  ceapQuestions,
  classExamples,
} from "./ceap";
import images from "./vision";
import { medicalReferences } from "./references";

describe("recorrido docente CEAP 2020", () => {
  it("cubre C0–C6 con observación y contexto separados", () => {
    expect(clinicalClasses.map((c) => c.id)).toEqual([
      "C0",
      "C1",
      "C2",
      "C3",
      "C4",
      "C5",
      "C6",
    ]);
    expect(clinicalClass("C4c")).toBe("C2");
    expect(clinicalClass(null)).toBe("C2");
    expect(clinicalClass("C0")).toBe("C0");
    expect(clinicalClasses[1].name).toContain(" o ");
    for (const lesson of clinicalClasses) {
      expect(lesson.observe.length).toBeGreaterThan(40);
      expect(lesson.context.length).toBeGreaterThan(40);
      expect(lesson.question).toContain("?");
    }
  });
  it("enseña subclases sin reclasificar las fotos generales del depósito", () => {
    expect(c4Subclasses.map((c) => c.id)).toEqual(["C4a", "C4b", "C4c"]);
    expect(c4Subclasses[2].name).toBe("Corona flebectásica");
    expect(images.some((i) => /^C4[abc]$/.test(i.ceap))).toBe(false);
    for (const lesson of clinicalClasses) {
      const examples = classExamples(lesson.id);
      expect(examples.length).toBe(2);
      expect(new Set(examples.map((i) => i.sourceCaseId)).size).toBe(
        ["C5", "C6"].includes(lesson.id) ? 1 : 2,
      );
      expect(new Set(examples.map((i) => i.id)).size).toBe(2);
      for (const image of examples) {
        expect(image.ceap).toBe(lesson.id);
        expect(image.viewIndex).toBeGreaterThan(0);
        expect(images.find((i) => i.id === image.id)).toBe(image);
      }
    }
  });
  it("conserva los cuatro dominios, los subtipos secundarios y las combinaciones funcionales", () => {
    expect(ceapDomains.map((d) => d.id)).toEqual(["C", "E", "A", "P"]);
    expect(
      ceapDomains.find((d) => d.id === "E")!.codes.map((c) => c.id),
    ).toContain("Esi");
    expect(
      ceapDomains.find((d) => d.id === "E")!.codes.map((c) => c.id),
    ).toContain("Ese");
    expect(
      ceapDomains.find((d) => d.id === "P")!.codes.map((c) => c.id),
    ).toContain("Pr,o");
    const source = medicalReferences.find((r) => r.id === "ceap2020")!;
    expect(source.doi).toBe("10.1016/j.jvsv.2019.12.075");
  });
  it("las respuestas evitan inferir síntomas, recurrencia o datos negativos desde una imagen", () => {
    const answer = (id: string) => {
      const q = ceapQuestions.find((q) => q.id === id)!;
      return q.options[q.answer];
    };
    expect(answer("corona")).toBe("En C4c");
    expect(answer("recurrence")).toContain("Antecedentes");
    expect(answer("symptoms")).toContain("historia");
    expect(answer("missing")).toContain("No:");
    expect(answer("basic")).toBe("C4a");
    for (const q of ceapQuestions)
      expect(q.explanation.length).toBeGreaterThan(70);
  });
});
