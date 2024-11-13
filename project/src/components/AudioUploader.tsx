import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { useTranscription } from '../hooks/useTranscription';
import ProgressIndicator from './ProgressIndicator';

interface AudioUploaderProps {
  onUpload: (file: File) => void;
}

function AudioUploader({ onUpload }: AudioUploaderProps) {
  const { startTranscription, status, error } = useTranscription();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      try {
        await startTranscription(file);
        onUpload(file);
      } catch (err) {
        console.error('Upload error:', err);
      }
    }
  }, [onUpload, startTranscription]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a']
    },
    maxFiles: 1,
    disabled: status?.status === 'transcribing' || status?.status === 'analyzing'
  });

  const isProcessing = status?.status === 'transcribing' || status?.status === 'analyzing';

  return (
    <div
      {...getRootProps()}
      className={`
        glass-effect
        border-2 border-dashed rounded-xl p-12
        flex flex-col items-center justify-center
        transition-all duration-300 ease-in-out
        ${isDragActive 
          ? 'border-primary bg-primary/10' 
          : 'border-gray-500/30 hover:border-primary/50'
        }
        ${isProcessing ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02]'}
      `}
    >
      <input {...getInputProps()} />
      {isProcessing && status ? (
        <ProgressIndicator
          status={status.status}
          progress={status.progress}
          message={status.status === 'transcribing' 
            ? 'Converting audio to text...' 
            : 'Analyzing sermon content...'}
        />
      ) : (
        <>
          <Upload 
            className={`h-12 w-12 mb-4 transition-colors duration-300 ${
              isDragActive ? 'text-primary' : 'text-gray-400'
            }`} 
          />
          <p className="text-xl font-medium text-gray-300 text-center">
            {isDragActive
              ? "Drop the sermon audio here"
              : "Drag & drop sermon audio, or click to select"}
          </p>
          <p className="mt-2 text-sm text-gray-400">
            Supports MP3, WAV, and M4A files
          </p>
          {error && (
            <p className="mt-4 text-sm text-red-400">
              Error: {error.message}
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default AudioUploader;