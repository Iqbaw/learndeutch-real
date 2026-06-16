"use client";

// ============================================================
// Lightweight UI sound engine (Web Audio API).
// No audio files needed — every sound is synthesized, so it is
// tiny, works offline, and never blocks. Inspired by the playful
// feedback of apps like Duolingo.
// ============================================================

let audioCtx: AudioContext | null = null;
let enabled = true;

type WindowWithAudio = Window &
  typeof globalThis & { webkitAudioContext?: typeof AudioContext };

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const w = window as WindowWithAudio;
  const Ctor = window.AudioContext ?? w.webkitAudioContext;
  if (!Ctor) return null;
  if (!audioCtx) audioCtx = new Ctor();
  // browsers start the context suspended until a user gesture
  if (audioCtx.state === "suspended") void audioCtx.resume();
  return audioCtx;
}

/** Resume the audio context (call from a user gesture, e.g. first tap). */
export function unlockAudio(): void {
  getCtx();
}

export function setSoundEnabled(value: boolean): void {
  enabled = value;
}

export function isSoundEnabled(): boolean {
  return enabled;
}

interface Note {
  freq: number;
  start: number; // seconds offset
  dur: number;
  type?: OscillatorType;
  peak?: number; // 0..1
}

function playNotes(notes: Note[]): void {
  const ctx = getCtx();
  if (!ctx) return;
  const base = ctx.currentTime;
  for (const n of notes) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = n.type ?? "sine";
    osc.frequency.value = n.freq;
    osc.connect(gain);
    gain.connect(ctx.destination);

    const t0 = base + n.start;
    const peak = n.peak ?? 0.12;
    // quick attack + smooth exponential decay to avoid clicks/pops
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + n.dur);

    osc.start(t0);
    osc.stop(t0 + n.dur + 0.03);
  }
}

// musical note frequencies
const C5 = 523.25;
const D5 = 587.33;
const E5 = 659.25;
const G5 = 783.99;
const A5 = 880.0;
const C6 = 1046.5;
const E6 = 1318.51;
const G6 = 1567.98;

export type SoundName =
  | "tap"
  | "select"
  | "correct"
  | "wrong"
  | "complete"
  | "levelup"
  | "pop"
  | "start"
  | "whoosh";

const players: Record<SoundName, () => void> = {
  // subtle, short tap for any button press
  tap: () => playNotes([{ freq: 660, start: 0, dur: 0.06, type: "sine", peak: 0.05 }]),
  // slightly brighter select tick
  select: () => playNotes([{ freq: 880, start: 0, dur: 0.07, type: "triangle", peak: 0.06 }]),
  // happy rising arpeggio for correct answers
  correct: () =>
    playNotes([
      { freq: E5, start: 0, dur: 0.14, type: "triangle", peak: 0.12 },
      { freq: G5, start: 0.08, dur: 0.16, type: "triangle", peak: 0.12 },
      { freq: C6, start: 0.16, dur: 0.22, type: "triangle", peak: 0.13 },
    ]),
  // gentle, non-harsh descending two-tone for wrong answers
  wrong: () =>
    playNotes([
      { freq: 233.08, start: 0, dur: 0.16, type: "sine", peak: 0.12 },
      { freq: 174.61, start: 0.12, dur: 0.24, type: "sine", peak: 0.12 },
    ]),
  // triumphant little fanfare for finishing a lesson/review
  complete: () =>
    playNotes([
      { freq: C5, start: 0, dur: 0.16, type: "triangle", peak: 0.12 },
      { freq: E5, start: 0.12, dur: 0.16, type: "triangle", peak: 0.12 },
      { freq: G5, start: 0.24, dur: 0.16, type: "triangle", peak: 0.12 },
      { freq: C6, start: 0.36, dur: 0.34, type: "triangle", peak: 0.14 },
      { freq: G5, start: 0.36, dur: 0.34, type: "sine", peak: 0.05 },
    ]),
  // bigger sparkle for level up / passing a test
  levelup: () =>
    playNotes([
      { freq: C5, start: 0, dur: 0.14, type: "triangle", peak: 0.12 },
      { freq: E5, start: 0.1, dur: 0.14, type: "triangle", peak: 0.12 },
      { freq: G5, start: 0.2, dur: 0.14, type: "triangle", peak: 0.12 },
      { freq: C6, start: 0.3, dur: 0.16, type: "triangle", peak: 0.13 },
      { freq: E6, start: 0.42, dur: 0.18, type: "triangle", peak: 0.13 },
      { freq: G6, start: 0.54, dur: 0.4, type: "triangle", peak: 0.14 },
    ]),
  // light pop for adding/learning something
  pop: () =>
    playNotes([
      { freq: A5, start: 0, dur: 0.07, type: "sine", peak: 0.1 },
      { freq: E6, start: 0.05, dur: 0.1, type: "sine", peak: 0.1 },
    ]),
  // soft start cue
  start: () =>
    playNotes([
      { freq: D5, start: 0, dur: 0.1, type: "triangle", peak: 0.1 },
      { freq: A5, start: 0.08, dur: 0.16, type: "triangle", peak: 0.1 },
    ]),
  // quick transition whoosh
  whoosh: () => playNotes([{ freq: 520, start: 0, dur: 0.12, type: "sine", peak: 0.06 }]),
};

/** Play a named UI sound (no-op when sound is disabled or unsupported). */
export function playSound(name: SoundName): void {
  if (!enabled) return;
  try {
    players[name]?.();
  } catch {
    /* audio not available — ignore */
  }
}
