"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Mic, MicOff, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Hospital } from "@/lib/types";
import type { EligibilitySummary } from "@/lib/eligibility/storage";

const EMIRATES = ["dubai", "abu dhabi", "sharjah", "ajman", "rak", "fujairah", "uaq"];

const normalize = (value: string) => value.toLowerCase().trim();

const findEmirate = (text: string) => EMIRATES.find((e) => text.includes(e));

const includesAny = (text: string, options: string[]) => options.some((opt) => text.includes(opt));

const getEligibilityState = (summary: EligibilitySummary | null) => summary?.eligibilityStatus ?? "INCOMPLETE";

type ProgramListing = {
  id: string;
  hospitalId?: string;
  name?: string;
  departmentName?: string;
  description?: string;
  requirements?: string[];
  programType?: string;
};

type VoiceAssistantProps = {
  programs: ProgramListing[];
  hospitals: Hospital[];
  eligibilitySummary: EligibilitySummary | null;
  onFilter: (programIds: string[], active: boolean, spokenQuery: string) => void;
};

const getSpeechRecognition = () => {
  if (typeof window === "undefined") return null;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
};

export function VoiceProgramAssistant({ programs, hospitals, eligibilitySummary, onFilter }: VoiceAssistantProps) {
  const supported = useMemo(() => Boolean(getSpeechRecognition()), []);
  const [listening, setListening] = useState(false);
  const [lastTranscript, setLastTranscript] = useState("");
  const [statusMessage, setStatusMessage] = useState("Say: \"Find eligible surgery observerships in Dubai\".");
  const recognitionRef = useRef<any>(null);

  const hospitalLookup = useMemo(() => {
    const map = new Map(hospitals.map((h) => [h.id, h]));
    return map;
  }, [hospitals]);

  const speak = useCallback((message: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, []);

  const handleTranscript = useCallback((transcript: string) => {
    const text = normalize(transcript);
    if (!text) return;
    setLastTranscript(transcript);

    const wantsEligibleOnly = includesAny(text, ["eligible", "meet", "qualified"]) && includesAny(text, ["only", "show", "find", "list"]);
    const includesElective = text.includes("elective");
    const includesObservership = text.includes("observership") || text.includes("observer");
    const emirate = findEmirate(text);

    const eligibilityState = getEligibilityState(eligibilitySummary);

    if (wantsEligibleOnly && eligibilityState !== "ELIGIBLE") {
      const message = "You are not yet marked as eligible. Upload the required documents to see eligible programs.";
      setStatusMessage(message);
      speak(message);
      onFilter([], true, transcript);
      return;
    }

    const keywords = text
      .split(/\s+/)
      .filter((word) => word.length > 2 && !["show", "find", "search", "list", "eligible", "only", "programs", "program", "in", "for", "me"].includes(word));

    const matches = programs.filter((program) => {
      const hospital = hospitalLookup.get(program.hospitalId);
      const title = program.departmentName || program.name || "";
      const programText = normalize(`${title} ${program.programType || ""} ${program.description || ""} ${program.requirements?.join(" ") || ""}`);
      const hospitalText = hospital ? normalize(`${hospital.name} ${hospital.emirate} ${hospital.city} ${hospital.departments.join(" ")}`) : "";

      const lowerTitle = title.toLowerCase();
      const lowerType = (program.programType || "").toLowerCase();
      const typeMatch = includesElective
        ? lowerTitle.includes("elective") || lowerType.includes("elective")
        : includesObservership
        ? lowerTitle.includes("observership") || lowerType.includes("observership")
        : true;

      const emirateMatch = emirate ? hospitalText.includes(emirate) : true;
      const keywordMatch = keywords.length === 0
        ? true
        : keywords.some((keyword) => programText.includes(keyword) || hospitalText.includes(keyword));

      return typeMatch && emirateMatch && keywordMatch;
    });

    const ids = matches.map((program) => program.id);
    const message = ids.length
      ? `I found ${ids.length} program${ids.length > 1 ? "s" : ""} that match your criteria.`
      : "No programs match that request. Try a different specialty or location.";

    setStatusMessage(message);
    speak(message);
    onFilter(ids, true, transcript);
  }, [eligibilitySummary, hospitalLookup, onFilter, programs, speak]);

  useEffect(() => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event?.results?.[0]?.[0]?.transcript || "";
      handleTranscript(transcript);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
      setStatusMessage("Voice recognition failed. Try again.");
    };

    recognitionRef.current = recognition;
    return () => {
      recognition.stop?.();
    };
  }, [handleTranscript]);

  const handleListen = () => {
    if (!recognitionRef.current) return;
    setListening(true);
    setStatusMessage("Listening...");
    recognitionRef.current.start();
  };

  const handleStop = () => {
    recognitionRef.current?.stop?.();
    setListening(false);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg p-5 sm:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-cyan-200 font-semibold">
            <Sparkles className="w-4 h-4" />
            Voice Program Assistant
          </div>
          <p className="text-sm text-slate-300 mt-2">Use voice commands to search programs and auto-match eligibility.</p>
          <p className="text-xs text-slate-400 mt-1">Example: “Find eligible cardiology electives in Abu Dhabi.”</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="bg-linear-to-r from-cyan-500 to-indigo-600 text-white"
            onClick={handleListen}
            disabled={!supported || listening}
          >
            <Mic className="w-4 h-4 mr-2" />
            Start
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-white/20 text-slate-100"
            onClick={handleStop}
            disabled={!listening}
          >
            <MicOff className="w-4 h-4 mr-2" />
            Stop
          </Button>
        </div>
      </div>

      {!supported && (
        <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
          Voice recognition is not supported in this browser.
        </div>
      )}

      <div className="mt-4 text-sm text-slate-200">{statusMessage}</div>
      {lastTranscript && (
        <div className="mt-2 text-xs text-slate-400">Heard: “{lastTranscript}”</div>
      )}
    </div>
  );
}
