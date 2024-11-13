import React from 'react';
import { Target, Lightbulb, BookOpen, CheckCircle } from 'lucide-react';
import { SermonSummary } from '../types';

interface SummaryPanelProps {
  summary: SermonSummary;
}

function SummaryPanel({ summary }: SummaryPanelProps) {
  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Purpose */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Target className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold">Sermon Purpose</h2>
        </div>
        <p className="text-gray-700 leading-relaxed">{summary.purpose}</p>
      </div>

      {/* Key Takeaways */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Lightbulb className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold">Key Takeaways</h2>
        </div>
        <ul className="space-y-3">
          {summary.keyTakeaways.map((takeaway, index) => (
            <li key={index} className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm">
                {index + 1}
              </span>
              <span className="text-gray-700">{takeaway}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Topics Covered */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-4">
          <BookOpen className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold">Topics Covered</h2>
        </div>
        <div className="space-y-4">
          {summary.topicsCovered.map((topic, index) => (
            <div key={index} className="border-l-4 border-indigo-200 pl-4">
              <h3 className="font-medium text-gray-900">{topic.topic}</h3>
              <p className="mt-1 text-sm text-gray-600">{topic.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-4">
          <CheckCircle className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold">Action Items</h2>
        </div>
        <div className="space-y-3">
          {summary.actionItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
            >
              <span className="text-gray-700">{item.item}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                {item.priority}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SummaryPanel;