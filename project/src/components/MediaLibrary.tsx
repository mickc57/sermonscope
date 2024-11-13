import React, { useState } from 'react';
import { Search, Calendar, Clock, User, Tag } from 'lucide-react';
import { SermonRecording } from '../types';

interface MediaLibraryProps {
  recordings: SermonRecording[];
  onSelectRecording: (recording: SermonRecording) => void;
}

function MediaLibrary({ recordings, onSelectRecording }: MediaLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get unique tags from all recordings
  const allTags = Array.from(
    new Set(recordings.flatMap(recording => recording.tags))
  );

  const filteredRecordings = recordings.filter(recording => {
    const matchesSearch = (
      recording.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recording.preacher?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recording.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => recording.tags.includes(tag));

    return matchesSearch && matchesTags;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Search and Filter Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search recordings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        
        {/* Tags Filter */}
        <div className="mt-3 flex flex-wrap gap-2">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedTags.includes(tag)
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Recordings List */}
      <div className="divide-y divide-gray-200">
        {filteredRecordings.map(recording => (
          <button
            key={recording.id}
            onClick={() => onSelectRecording(recording)}
            className="w-full p-4 hover:bg-gray-50 transition-colors flex items-center space-x-4"
          >
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">{recording.title}</h3>
              <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {recording.date}
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {recording.duration}
                </span>
                {recording.preacher && (
                  <span className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {recording.preacher}
                  </span>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {recording.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}
        {filteredRecordings.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No recordings found matching your search criteria
          </div>
        )}
      </div>
    </div>
  );
}

export default MediaLibrary;