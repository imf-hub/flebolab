import data from "../data/guided-lessons.json";
import audio from "../data/narration.json";
import type { Lesson, Narration } from "./types";
export const lessons = data as Lesson[];
export const narrations = audio as Record<string, Narration>;
export const groups = [
  { id: "twin", name: "Hemodinámica", short: "Twin" },
  { id: "anatomy", name: "Anatomía por planos", short: "Anatomía" },
  { id: "doppler", name: "Principios Doppler", short: "Doppler" },
  { id: "cine", name: "Cine de compresión", short: "Cine real" },
  { id: "vision", name: "Clínica y CEAP 2020", short: "CEAP" },
];
