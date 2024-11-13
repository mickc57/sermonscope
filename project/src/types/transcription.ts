export interface TranscriptionStatus {
  id: string;
  status: 'pending' | 'transcribing' | 'analyzing' | 'completed' | 'error';
  progress: number;
  error?: string;
}

export interface TranscriptionResult {
  id: string;
  text: string;
  segments: {
    start: number;
    end: number;
    text: string;
    confidence: number;
  }[];
  speakers?: {
    id: string;
    segments: number[];
  }[];
}

export interface AIAnalysisResult {
  summary: string;
  keyPoints: string[];
  biblicalReferences: {
    reference: string;
    context: string;
    relevance: string;
  }[];
  theologicalThemes: {
    theme: string;
    explanation: string;
    scripturalBasis: string[];
  }[];
  applicationPoints: {
    point: string;
    practicalSteps: string[];
    targetAudience: string;
  }[];
  suggestedResources: {
    title: string;
    type: 'book' | 'article' | 'scripture' | 'commentary';
    description: string;
    url?: string;
  }[];
}