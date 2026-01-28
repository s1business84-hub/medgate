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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-lg border border-purple-500/30 bg-purple-500/10 space-y-4"
    >
      <div>
        <p className="font-semibold text-white mb-2 flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-purple-400" />
          Voice Answer
        </p>
        <p className="text-sm text-slate-300">{question}</p>
      </div>

      {/* Recording Controls */}
      <div className="flex gap-2">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="flex-1 px-4 py-2 rounded-lg bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold flex items-center justify-center gap-2 transition"
          >
            <Mic className="w-4 h-4" />
            Start Recording
          </button>
        ) : (
          <>
            <div className="flex-1 px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 font-semibold flex items-center justify-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-3 h-3 rounded-full bg-red-500"
              />
              {formatTime(recordingTime)}
            </div>
            <button
              onClick={stopRecording}
              className="px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 text-white font-semibold flex items-center gap-2 transition"
            >
              <Square className="w-4 h-4" />
              Stop
            </button>
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
              className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">
                  Recording {index + 1} ({formatTime(recording.duration)})
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const audio = new Audio(recording.url);
                      audio.play();
                    }}
                    className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-slate-300 transition"
                    title="Play"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteRecording(index)}
                    className="p-1 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-300 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Transcription Section */}
              {!recording.transcript ? (
                <button
                  onClick={() => transcribeAudio(index)}
                  disabled={isTranscribing}
                  className="w-full px-3 py-1 rounded text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 transition flex items-center justify-center gap-2"
                >
                  {isTranscribing ? (
                    <>
                      <Loader className="w-3 h-3 animate-spin" />
                      Transcribing...
                    </>
                  ) : (
                    "Transcribe"
                  )}
                </button>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => setShowTranscription(!showTranscription)}
                    className="text-xs text-blue-300 hover:text-blue-200 transition"
                  >
                    {showTranscription ? "Hide" : "Show"} Transcription
                  </button>
                  {showTranscription && (
                    <p className="text-xs text-slate-300 p-2 rounded bg-white/5 border border-white/10">
                      {recording.transcript}
                    </p>
                  )}
                </div>
              )}

              {/* Save Button */}
              <button
                onClick={() => saveAnswer(index)}
                className="w-full px-3 py-1 rounded text-xs bg-green-500/20 hover:bg-green-500/30 text-green-300 transition flex items-center justify-center gap-2"
              >
                <Upload className="w-3 h-3" />
                Use This Answer
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
