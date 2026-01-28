"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, Square, Volume2, Trash2, Send, Check, AlertCircle, Activity } from "lucide-react";

interface VoiceRecorderProps {
  fieldId: string;
  fieldLabel: string;
  onSubmit: (audioData: Blob, transcript: string) => void;
  isSubmitting?: boolean;
  placeholder?: string;
}

export function VoiceRecorder({ fieldId, fieldLabel, onSubmit, isSubmitting, placeholder }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string>("");
  const [transcript, setTranscript] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioSize, setAudioSize] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onstart = () => setIsTranscribing(true);
        recognitionRef.current.onend = () => setIsTranscribing(false);
        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = "";
          let finalTranscript = "";
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + " ";
            } else {
              interimTranscript += transcript;
            }
          }
          
          if (finalTranscript) {
            setTranscript((prev) => (prev + " " + finalTranscript).trim());
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
        };
      }
    }
  }, []);

  // Timer for recording duration
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setRecordingTime(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  // Check microphone permission on mount
  useEffect(() => {
    navigator.permissions
      .query({ name: "microphone" as PermissionName })
      .then((result) => {
        setHasPermission(result.state === "granted");
      })
      .catch(() => setHasPermission(null));
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setHasPermission(true);

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
        setAudioSize(audioBlob.size);

        // Start transcription
        if (recognitionRef.current) {
          recognitionRef.current.start();
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (error) {
      console.error("Failed to access microphone:", error);
      setHasPermission(false);
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
    setAudioSize(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 KB";
    const kb = Math.round(bytes / 1024);
    return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
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
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-200">{fieldLabel}</p>
        {placeholder && <p className="text-xs text-slate-500">{placeholder}</p>}
      </div>

      {hasPermission === false && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2"
        >
          <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-red-300">
            Microphone permission denied. Please enable it in your browser settings to use voice recording.
          </div>
        </motion.div>
      )}

      {!audioURL ? (
        <motion.button
          onClick={isRecording ? stopRecording : startRecording}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-4 rounded-lg font-semibold flex items-center justify-center gap-3 transition relative overflow-hidden ${
            isRecording
              ? "bg-gradient-to-r from-red-500/30 to-red-600/30 border-2 border-red-500 text-red-300 hover:bg-gradient-to-r hover:from-red-500/40 hover:to-red-600/40 shadow-lg shadow-red-500/20"
              : "bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border-2 border-purple-500 text-purple-300 hover:bg-gradient-to-r hover:from-purple-500/30 hover:to-indigo-500/30 shadow-lg shadow-purple-500/10"
          }`}
        >
          {isRecording && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 bg-red-500/10"
            />
          )}
          <div className="relative flex items-center gap-3">
            {isRecording ? (
              <>
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.6, repeat: Infinity }}>
                  <Square className="w-5 h-5" />
                </motion.div>
                <span>Recording... {formatTime(recordingTime)}</span>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                <span>Start Recording</span>
              </>
            )}
          </div>
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 p-4 rounded-lg bg-gradient-to-br from-white/8 to-white/4 border border-white/15 backdrop-blur-sm"
        >
          {/* Recording Info Bar */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
                <Activity className="w-4 h-4 text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-400">Audio Recording</p>
                <p className="text-sm font-medium text-white">{formatFileSize(audioSize)}</p>
              </div>
            </div>
            <button
              onClick={playAudio}
              className="p-2 rounded-lg bg-purple-500/30 hover:bg-purple-500/50 text-purple-300 transition shadow-lg shadow-purple-500/20"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Transcript Section */}
          <div className="space-y-2">
            {isTranscribing ? (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                </motion.div>
                <p className="text-sm text-yellow-300">Transcribing audio...</p>
              </div>
            ) : transcript ? (
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Transcript</p>
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 min-h-12">
                  <p className="text-sm text-white leading-relaxed">{transcript}</p>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-yellow-300">No transcript available yet. Check back once transcription completes.</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={deleteRecording}
              className="flex-1 px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 font-semibold flex items-center justify-center gap-2 transition shadow-lg shadow-red-500/10"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Delete</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: submitted ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={submitRecording}
              disabled={isSubmitting || isTranscribing || !transcript}
              className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-500/20 to-green-500/20 hover:from-emerald-500/30 hover:to-green-500/30 disabled:opacity-40 disabled:cursor-not-allowed border border-emerald-500/30 text-emerald-300 font-semibold flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/10"
            >
              {submitted ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="hidden sm:inline">Submitted</span>
                </>
              ) : isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="w-4 h-4 border-2 border-emerald-300 border-t-transparent rounded-full" />
                  </motion.div>
                  <span className="hidden sm:inline">Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Submit</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Helper Text */}
          <p className="text-xs text-slate-500 text-center pt-1">
            {isTranscribing ? "Please wait while we transcribe your audio..." : transcript ? "Ready to submit your response" : "Waiting for transcription..."}
          </p>
        </motion.div>
      )}
    </div>
  );
}
