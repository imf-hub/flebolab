import type { ViewMode } from "../labs/twin/scenarioConfig";
export type Stage = {
  title: string;
  spoken: string;
  scenario?: string;
  view?: ViewMode;
  phase: number[];
  shot: string;
  values?: Record<string, number>;
  clinicalClass?: string;
  subclass?: string | null;
  example?: number;
  tissues?: string[];
  clipId?: string;
};
export type Lesson = {
  id: string;
  group: string;
  title: string;
  objective: string;
  sourceIds: string[];
  stages: Stage[];
  explore: string;
};
export type Caption = { start: number; end: number; text: string };
export type Narration = {
  audio: string;
  vtt: string;
  duration: number;
  sha256: string;
  stages: { index: number; start: number; end: number; speechEnd: number }[];
  captions: Caption[];
  voiceName: string;
  engine: string;
  language: string;
  playbackRate: number;
  transcriptVerified: boolean;
  package: string;
};
export type CameraGuide = {
  enabled: boolean;
  from: string;
  to: string;
  progress: number;
};
