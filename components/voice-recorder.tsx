"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, Square, Volume2, Trash2, Send, Check } from "lucide-react";

interface VoiceRecorderProps {
  fieldId: string;
  fieldLabel: string;
  onSubmit: (audioData: Blob, transcript: string) => void;
  isSubmitting?: boolean;
}

export function VoiceRecorder({ fieldId, fieldLabel, onSubmit, isSubmitting }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string>("");
  const [transcript, setTranscript] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onstart = () => setIsTranscribing(true);
        recognitionRef.current.onend = () => setIsTranscribing(false);
        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + " ";
            }
          }
          if (finalTranscript) {
            setTranscript(finalTranscript.trim());
          }
        };
      }
    }
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);

        // Start transcription
        if (recognitionRef.current) {
          recognitionRef.current.start();
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Failed to access microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Stop all audio tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    }
  };

  const playAudio = () => {
    if (audioURL) {
      const audio = new Audio(audioURL);
      audio.play();
    }
  };

  const deleteRecording = () => {
    setAudioURL("");
    setTranscript("");
    setSubmitted(false);
  };

  const submitRecording = async () => {
    if (!audioURL) return;

    try {
      const response = await fetch(audioURL);
      const blob = await response.blob();
      onSubmit(blob, transcript);
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit recording:", error);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-300">{fieldLabel}</p>

      {!audioURL ? (
        <motion.button
          onClick={isRecording ? stopRecording : startRecording}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
            isRecording
              ? "bg-red-500/30 border-2 border-red-500 text-red-300 hover:bg-red-500/40"
              : "bg-purple-500/20 border-2 border-purple-500 text-purple-300 hover:bg-purple-500/30"
          }`}
        >
          {isRecording ? (
            <>
              <Square className="w-5 h-5" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="w-5 h-5" />
              Start Recording
            </>
          )}
        </motion.button>
      ) : (
        <div className="space-y-3 p-4 rounded-lg bg-white/5 border border-white/10">
          {/* Audio Player */}
          <div className="flex items-center gap-2">
            <button
              onClick={playAudio}
              className="p-2 rounded-lg bg-purple-500/30 hover:bg-purple-500/50 text-purple-300 transition"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <div className="flex-1 text-sm text-slate-300">
              Audio recorded ({Math.round(audioURL.length / 1024)} KB)
            </div>
          </div>

          {/* Transcript */}
          {isTranscribing ? (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              Transcribing...
            </div>
          ) : transcript ? (
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-xs text-slate-400 mb-1">Transcript:</p>
              <p className="text-sm text-white">{transcript}</p>
            </div>
          ) : null}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={deleteRecording}
              className="flex-1 px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 font-semibold flex items-center justify-center gap-2 transition"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
            <button
              onClick={submitRecording}
              disabled={isSubmitting || isTranscribing}
              className="flex-1 px-3 py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-green-300 font-semibold flex items-center justify-center gap-2 transition"
            >
              {submitted ? (
                <>
                  <Check className="w-4 h-4" />
                  Submitted
                </>
              ) : isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-green-300 border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
