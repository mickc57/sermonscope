import React, { useState } from 'react';
import { BookOpen, Heart, ListChecks, Quote, Clock, BarChart3, FileText } from 'lucide-react';
import { AIAnalysisResult } from '../types/transcription';

interface AnalysisPanelProps {
  analysis: AIAnalysisResult;
}

function AnalysisPanel({ analysis }: AnalysisPanelProps) {
  const [activeTab, setActiveTab] = useState('summary');

  if (!analysis) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 border-b border-white/10">
        <button
          onClick={() => setActiveTab('summary')}
          className={`pb-4 px-2 text-sm font-medium transition-colors relative ${
            activeTab === 'summary'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Summary</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('analysis')}
          className={`pb-4 px-2 text-sm font-medium transition-colors relative ${
            activeTab === 'analysis'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Detailed Analysis</span>
          </div>
        </button>
      </div>

      {activeTab === 'summary' ? (
        <div className="glass-effect rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Summary</h2>
          <p className="text-gray-300 leading-relaxed">{analysis.summary}</p>
          
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium text-white">Key Points</h3>
            <ul className="space-y-2">
              {analysis.keyPoints?.map((point, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm">
                    {index + 1}
                  </span>
                  <span className="text-gray-300">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-white">Biblical References</h2>
            </div>
            <div className="space-y-4">
              {analysis.biblicalReferences?.map((ref, index) => (
                <div key={index} className="border-l-2 border-primary/30 pl-4">
                  <h3 className="font-medium text-white">{ref.reference}</h3>
                  <p className="text-sm text-gray-300 mt-1">{ref.context}</p>
                  <p className="text-sm text-gray-400 mt-1">{ref.relevance}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-white">Theological Themes</h2>
            </div>
            <div className="space-y-4">
              {analysis.theologicalThemes?.map((theme, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-medium text-white">{theme.theme}</h3>
                  <p className="text-sm text-gray-300">{theme.explanation}</p>
                  <div className="flex flex-wrap gap-2">
                    {theme.scripturalBasis?.map((scripture, i) => (
                      <span key={i} className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                        {scripture}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <ListChecks className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-white">Application Points</h2>
            </div>
            <div className="space-y-4">
              {analysis.applicationPoints?.map((point, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-medium text-white">{point.point}</h3>
                  <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                    {point.practicalSteps?.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                  <p className="text-sm text-primary">{point.targetAudience}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-white">Suggested Resources</h2>
            </div>
            <div className="space-y-4">
              {analysis.suggestedResources?.map((resource, index) => (
                <div key={index} className="space-y-1">
                  <h3 className="font-medium text-white">{resource.title}</h3>
                  <p className="text-xs text-primary uppercase">{resource.type}</p>
                  <p className="text-sm text-gray-300">{resource.description}</p>
                  {resource.url && (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:text-primary-light"
                    >
                      Learn More →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalysisPanel;