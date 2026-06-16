"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ============================================================
// Real microphone speech recognition + text-to-speech helpers
// using the browser Web Speech API. (PRD section 13.6)
// ============================================================

// --- Minimal type declarations (Web Speech API is not in lib.dom for all TS targets) ---
interface SpeechRecognitionAlternativeLike {
  transcript: string;
  confidence: number;
}
interface SpeechRecognitionResultLike {
  0: SpeechRecognitionAlternativeLike;
  isFinal: boolean;
  length: number;
}
interface SpeechRecognitionResultListLike {
  length: number;
  [index: number]: SpeechRecognitionResultLike;
}
interface SpeechRecognitionEventLike extends Event {
  results: SpeechRecognitionResultListLike;
  resultIndex: number;
}
interface SpeechRecognitionErrorEventLike extends Event {
  error: string;
  message?: string;
}
interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export interface UseSpeechRecognitionOptions {
  lang?: string;
  onFinal?: (transcript: string) => void;
}

export interface UseSpeechRecognitionReturn {
  supported: boolean;
  listening: boolean;
  transcript: string; // finalized text
  interim: string; // live, in-progress text
  error: string | null;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

/**
 * React hook wrapping the browser SpeechRecognition API.
 * Returns live interim + final transcripts, and graceful unsupported handling.
 */
export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn {
  const { lang = "de-DE", onFinal } = options;

  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const onFinalRef = useRef(onFinal);
  onFinalRef.current = onFinal;

  useEffect(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      setSupported(false);
      return;
    }
    setSupported(true);
    const recognition = new Ctor();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      setError(null);
    };

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0]?.transcript ?? "";
        if (result.isFinal) finalText += text;
        else interimText += text;
      }
      if (finalText) {
        setTranscript((prev) => {
          const combined = (prev ? prev + " " : "") + finalText.trim();
          onFinalRef.current?.(combined.trim());
          return combined.trim();
        });
        setInterim("");
      } else {
        setInterim(interimText);
      }
    };

    recognition.onerror = (event) => {
      const code = event.error;
      const messages: Record<string, string> = {
        "not-allowed": "Akses mikrofon ditolak. Izinkan mikrofon di browser lalu coba lagi.",
        "service-not-allowed": "Akses mikrofon ditolak. Izinkan mikrofon di browser lalu coba lagi.",
        "no-speech": "Tidak ada suara terdengar. Coba bicara sedikit lebih keras.",
        "audio-capture": "Mikrofon tidak ditemukan. Pastikan perangkat mikrofon tersedia.",
        network: "Masalah jaringan saat mengenali suara. Coba lagi.",
        aborted: "",
      };
      if (code !== "aborted") {
        setError(messages[code] ?? `Terjadi kesalahan mikrofon (${code}).`);
      }
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
      setInterim("");
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.onstart = null;
      try {
        recognition.abort();
      } catch {
        /* noop */
      }
      recognitionRef.current = null;
    };
  }, [lang]);

  const start = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    setError(null);
    setInterim("");
    try {
      recognition.start();
    } catch {
      // start() throws if already started — restart safely
      try {
        recognition.abort();
        recognition.start();
      } catch {
        /* noop */
      }
    }
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const reset = useCallback(() => {
    setTranscript("");
    setInterim("");
    setError(null);
  }, []);

  return { supported, listening, transcript, interim, error, start, stop, reset };
}

/** Speak a text aloud using the browser SpeechSynthesis API. */
export function speak(text: string, lang = "de-DE", rate = 1): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  const synth = window.speechSynthesis;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;
  // Prefer a German voice if one is installed
  const voices = synth.getVoices();
  const german = voices.find((v) => v.lang?.toLowerCase().startsWith("de"));
  if (german) utterance.voice = german;
  synth.speak(utterance);
  return true;
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}
