export interface SermonSummary {
  purpose: string;
  keyTakeaways: string[];
  topicsCovered: {
    topic: string;
    description: string;
  }[];
  actionItems: {
    item: string;
    priority: 'high' | 'medium' | 'low';
  }[];
}

export interface SermonAnalysis {
  summary: SermonSummary;
  themes: string[];
  biblicalReferences: {
    reference: string;
    context: string;
  }[];
  sentiment: {
    overall: string;
    emotional_moments: {
      timestamp: string;
      emotion: string;
      intensity: number;
    }[];
  };
  mainPoints: string[];
  timeline: {
    time: string;
    topic: string;
  }[];
  engagement: {
    clarity: number;
    relevance: number;
    scriptural_accuracy: number;
  };
}

export interface SermonRecording {
  id: string;
  title: string;
  date: string;
  duration: string;
  fileUrl: string;
  preacher?: string;
  tags: string[];
  analysis?: SermonAnalysis;
}

export interface UserProfile {
  name: string;
  email: string;
  profilePicture: string;
}