import React from 'react';
import { Loader } from 'lucide-react';

interface ProgressIndicatorProps {
  status: string;
  progress: number;
  message?: string;
}

function ProgressIndicator({ status, progress, message }: ProgressIndicatorProps) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16">
          <div className="absolute inset-0">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-dark-lighter stroke-current"
                strokeWidth="8"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
              />
              <circle
                className="text-primary stroke-current progress-ring"
                strokeWidth="8"
                strokeLinecap="round"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
                style={{
                  strokeDasharray: `${2 * Math.PI * 42}`,
                  strokeDashoffset: `${2 * Math.PI * 42 * (1 - progress / 100)}`,
                }}
              />
            </svg>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader className="w-6 h-6 text-primary animate-spin" />
          </div>
        </div>
      </div>
      <div className="text-center">
        <p className="text-lg font-medium text-white capitalize">{status}</p>
        <p className="text-sm text-gray-400">{progress}% complete</p>
        {message && <p className="text-sm text-gray-300 mt-1">{message}</p>}
      </div>
    </div>
  );
}

export default ProgressIndicator;