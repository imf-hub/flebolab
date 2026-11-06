import type { Lesson, Narration } from "./types";
export function locateTime(t: number, lesson: Lesson, narration: Narration) {
  const time = Math.max(
    0,
    Math.min(narration.duration, Number.isFinite(t) ? t : 0),
  );
  let index = 0;
  while (
    index + 1 < narration.stages.length &&
    time >= narration.stages[index + 1].start
  )
    index++;
  const timing = narration.stages[index],
    stage = lesson.stages[index];
  const progress = Math.max(
    0,
    Math.min(
      1,
      (time - timing.start) / Math.max(0.001, timing.end - timing.start),
    ),
  );
  return {
    index,
    stage,
    progress,
    phase: stage.phase[0] + (stage.phase[1] - stage.phase[0]) * progress,
  };
}
export function captionAt(t: number, narration: Narration) {
  return narration.captions.find((c) => t >= c.start && t < c.end)?.text ?? "";
}
export function formatTime(t: number) {
  const value = Math.max(0, Math.floor(Number.isFinite(t) ? t : 0));
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, "0")}`;
}
/** Reading-paced visual track. These estimated times are never presented as audio timestamps. */
export function visualTimeline(lesson: Lesson): Narration {
  let duration = 0;
  const captions: Narration["captions"] = [];
  const stages = lesson.stages.map((stage, index) => {
    const words = stage.spoken.split(/\s+/),
      start = duration,
      speechEnd = start + words.length / 2.4;
    for (let i = 0; i < words.length; i += 18)
      captions.push({
        start: start + i / 2.4,
        end: Math.min(speechEnd, start + (i + 18) / 2.4),
        text: words.slice(i, i + 18).join(" "),
      });
    duration = speechEnd + 1.2;
    return { index, start, end: duration, speechEnd };
  });
  return {
    audio: "",
    vtt: "",
    duration,
    sha256: "",
    stages,
    captions,
    voiceName: "Sin voz",
    engine: "none",
    language: "es",
    playbackRate: 1,
    transcriptVerified: false,
    package: "",
  };
}
