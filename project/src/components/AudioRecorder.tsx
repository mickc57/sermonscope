import React, { useState, useRef } from 'react';
import { Mic, Square, AlertCircle, Loader } from 'lucide-react';
import { useTranscription } from '../hooks/useTranscription';

interface AudioRecorderProps {
  onRecordingComplete: (file: File) => void;
}

function AudioRecorder({ onRecordingComplete }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const { startTranscription, status } = useTranscription();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      chunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        const blob = new Blob(chunks.current, { type: 'audio/wav' });
        const file = new File([blob], 'recording.wav', { type: 'audio/wav' });
        
        setIsProcessing(true);
        try {
          await startTranscription(file);
          onRecordingComplete(file);
        } catch (err) {
          setError('Failed to process recording');
          console.error('Processing error:', err);
        } finally {
          setIsProcessing(false);
        }
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setError(null);
    } catch (err) {
      setError('Please allow microphone access to record');
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 glass-effect p-6 rounded-xl">
      <h2 className="text-xl font-semibold text-white">Record Sermon</h2>
      
      {isProcessing ? (
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-8 w-8 text-primary animate-spin" />
          <p className="text-gray-300">Processing recording...</p>
          {status && (
            <p className="text-sm text-gray-400">
              {status.status}: {status.progress}%
            </p>
          )}
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className={`
              p-4 rounded-full transition-all duration-200
              ${isRecording 
                ? 'bg-red-500/20 hover:bg-red-500/30' 
                : 'bg-primary/20 hover:bg-primary/30'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {isRecording ? (
              <Square className="h-6 w-6 text-red-500" />
            ) : (
              <Mic className="h-6 w-6 text-primary" />
            )}
          </button>
        </div>
      )}

      {isRecording && (
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-300">Recording in progress...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-2 text-red-400">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
}

export default AudioRecorder;