"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mic,
  Square,
  Play,
  Trash2,
  Upload,
  Loader,
  Volume2,
  AlertCircle,
  Clock,
  CheckCircle,
  Copy,
  FileAudio,
} from "lucide-react";

interface VoiceAnswerRecorderProps {
  questionId: string;
  question: string;
  onAnswerSaved?: (answer: {
    questionId: string;
    voiceUrl?: string;
    transcript?: string;
    duration: number;
  }) => void;
}

export function VoiceAnswerRecorder({
  questionId,
  question,
  onAnswerSaved,
}: VoiceAnswerRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<
    Array<{ url: string; duration: number; transcript?: string }>
  >([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [showTranscription, setShowTranscription] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";
      }
    }
  }, []);

  // Check microphone permission
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
      setPermissionError(null);

      // Create audio context for visualization
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      analyzerRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyzerRef.current);

      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        const duration = recordingTime;

        setRecordings((prev) => [
          ...prev,
          { url, duration, transcript: undefined },
        ]);
        setRecordingTime(0);
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start timer
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      setHasPermission(false);
      setPermissionError("Unable to access microphone. Please check your browser permissions.");
      alert("Unable to access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getFileSize = (url: string): string => {
    try {
      const sizeInKb = url.length / 1024;
      return sizeInKb > 1024 ? `${(sizeInKb / 1024).toFixed(1)} MB` : `${Math.round(sizeInKb)} KB`;
    } catch {
      return "Unknown";
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const playRecording = (url: string) => {
    const audio = new Audio(url);
    audio.play();
  };

  const transcribeAudio = async (index: number) => {
    const recording = recordings[index];
    if (!recording.url) return;

    setIsTranscribing(true);

    try {
      // Fetch the blob from the URL
      const response = await fetch(recording.url);
      const blob = await response.blob();

      // In a real app, you'd send this to a speech-to-text API
      // For now, we'll create a mock transcription
      const formData = new FormData();
      formData.append("audio", blob, "recording.webm");

      // Mock transcription - in production, use Whisper API or similar
      const mockTranscript =
        "This is a transcription of the voice answer. In production, this would use a real speech-to-text service.";

      setRecordings((prev) =>
        prev.map((r, i) =>
          i === index ? { ...r, transcript: mockTranscript } : r
        )
      );
    } catch (error) {
      console.error("Error transcribing:", error);
    } finally {
      setIsTranscribing(false);
    }
  };

  const deleteRecording = (index: number) => {
    const recording = recordings[index];
    URL.revokeObjectURL(recording.url);
    setRecordings((prev) => prev.filter((_, i) => i !== index));
  };

  const saveAnswer = (index: number) => {
    const recording = recordings[index];
    onAnswerSaved?.({
      questionId,
      voiceUrl: recording.url,
      transcript: recording.transcript,
      duration: recording.duration,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-lg border border-indigo-500/30 bg-indigo-500/10 space-y-4"
    >
      <div>
        <p className="font-semibold text-white mb-2 flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-indigo-400" />
          Voice Answer
        </p>
        <p className="text-sm text-slate-300">{question}</p>
      </div>

      {/* Permission Error */}
      {hasPermission === false && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-2"
        >
          <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-300">{permissionError}</p>
        </motion.div>
      )}

      {/* Recording Controls */}
      <div className="flex gap-2">
        {!isRecording ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={startRecording}
            disabled={hasPermission === false}
            className="flex-1 px-4 py-3 rounded-lg bg-linear-to-r from-indigo-600 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold flex items-center justify-center gap-2 transition shadow-lg"
          >
            <Mic className="w-5 h-5" />
            Start Recording
          </motion.button>
        ) : (
          <>
            <div className="flex-1 px-4 py-3 rounded-lg bg-red-500/20 border-2 border-red-500/50 text-red-300 font-semibold flex items-center justify-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="w-3 h-3 rounded-full bg-red-500"
              />
              <span className="text-lg font-mono">{formatTime(recordingTime)}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={stopRecording}
              className="px-6 py-3 rounded-lg bg-slate-600 hover:bg-slate-500 text-white font-semibold flex items-center gap-2 transition shadow-lg"
            >
              <Square className="w-5 h-5" />
              Stop
            </motion.button>
          </>
        )}
      </div>

      {/* Recordings List */}
      {recordings.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-white/10">
          {recordings.map((recording, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-gradient-to-br from-white/5 to-white/2 border border-white/15 hover:border-white/25 transition space-y-3"
            >
              {/* Header with Recording Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30">
                    <FileAudio className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-slate-200">
                      Recording {index + 1}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      {formatTime(recording.duration)}
                      <span className="text-slate-600">•</span>
                      <span>{getFileSize(recording.url)}</span>
                      {recording.transcript && (
                        <>
                          <span className="text-slate-600">•</span>
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Transcribed</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => playRecording(recording.url)}
                    className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-slate-300 transition"
                    title="Play recording"
                  >
                    <Play className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => deleteRecording(index)}
                    className="p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-300 transition"
                    title="Delete recording"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Transcription Section */}
              {!recording.transcript ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => transcribeAudio(index)}
                  disabled={isTranscribing}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-blue-500/20 hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-blue-300 transition flex items-center justify-center gap-2 font-medium"
                >
                  {isTranscribing ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Transcribing...
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      Transcribe Audio
                    </>
                  )}
                </motion.button>
              ) : (
                <div className="space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setShowTranscription(!showTranscription)}
                    className="text-sm text-blue-300 hover:text-blue-200 transition flex items-center gap-1 font-medium"
                  >
                    <Volume2 className="w-3 h-3" />
                    {showTranscription ? "Hide" : "Show"} Transcription
                  </motion.button>
                  {showTranscription && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm text-slate-300 p-3 rounded-lg bg-white/5 border border-white/10 space-y-2"
                    >
                      <p className="leading-relaxed">{recording.transcript}</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => copyToClipboard(recording.transcript || "", index)}
                        className="text-xs text-slate-500 hover:text-slate-300 transition flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        {copiedIndex === index ? "Copied!" : "Copy text"}
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Save Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => saveAnswer(index)}
                className="w-full px-4 py-2 rounded-lg text-sm bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition flex items-center justify-center gap-2 font-semibold border border-emerald-500/30 hover:border-emerald-500/50"
              >
                <CheckCircle className="w-4 h-4" />
                Use This Answer
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
