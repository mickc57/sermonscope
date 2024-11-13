import { TranscriptionStatus, TranscriptionResult, AIAnalysisResult } from '../types/transcription';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new APIError(response.status, error.message);
  }
  return response.json();
}

export const transcriptionAPI = {
  async startTranscription(audioFile: File): Promise<{ transcriptionId: string }> {
    const formData = new FormData();
    formData.append('audio', audioFile);

    const response = await fetch(`${API_BASE_URL}/api/transcribe`, {
      method: 'POST',
      body: formData,
    });

    return handleResponse(response);
  },

  async getTranscriptionStatus(transcriptionId: string): Promise<TranscriptionStatus> {
    const response = await fetch(
      `${API_BASE_URL}/api/transcribe/${transcriptionId}/status`
    );
    return handleResponse(response);
  },

  async getTranscriptionResult(transcriptionId: string): Promise<TranscriptionResult> {
    const response = await fetch(
      `${API_BASE_URL}/api/transcribe/${transcriptionId}/result`
    );
    return handleResponse(response);
  },

  async getAIAnalysis(transcriptionId: string): Promise<AIAnalysisResult> {
    const response = await fetch(
      `${API_BASE_URL}/api/analyze/${transcriptionId}`
    );
    return handleResponse(response);
  }
};