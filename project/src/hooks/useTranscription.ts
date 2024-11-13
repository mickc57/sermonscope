import { useState, useEffect, useRef } from 'react';
import { transcriptionAPI } from '../services/api';
import { TranscriptionStatus, TranscriptionResult, AIAnalysisResult } from '../types/transcription';

export function useTranscription() {
  const [transcriptionId, setTranscriptionId] = useState<string | null>(null);
  const [status, setStatus] = useState<TranscriptionStatus | null>(null);
  const [transcription, setTranscription] = useState<TranscriptionResult | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const pollInterval = useRef<number>();

  useEffect(() => {
    if (!transcriptionId) return;

    const pollStatus = async () => {
      try {
        const currentStatus = await transcriptionAPI.getTranscriptionStatus(transcriptionId);
        setStatus(currentStatus);

        if (currentStatus.status === 'completed') {
          const [transcriptionResult, analysisResult] = await Promise.all([
            transcriptionAPI.getTranscriptionResult(transcriptionId),
            transcriptionAPI.getAIAnalysis(transcriptionId)
          ]);
          setTranscription(transcriptionResult);
          setAnalysis(analysisResult);
          
          if (pollInterval.current) {
            clearInterval(pollInterval.current);
          }
        } else if (currentStatus.status === 'error') {
          setError(new Error(currentStatus.error));
          if (pollInterval.current) {
            clearInterval(pollInterval.current);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to get transcription status'));
        if (pollInterval.current) {
          clearInterval(pollInterval.current);
        }
      }
    };

    pollInterval.current = window.setInterval(pollStatus, 1000);
    pollStatus();

    return () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
      }
    };
  }, [transcriptionId]);

  const startTranscription = async (file: File) => {
    try {
      setError(null);
      setStatus(null);
      setTranscription(null);
      setAnalysis(null);

      const { transcriptionId: newId } = await transcriptionAPI.startTranscription(file);
      setTranscriptionId(newId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to start transcription'));
      throw err;
    }
  };

  return {
    status,
    transcription,
    analysis,
    error,
    startTranscription
  };
}