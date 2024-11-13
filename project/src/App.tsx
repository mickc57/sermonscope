import React, { useState } from 'react';
import { Waves, Home, Library, Settings, Upload, Mic, ArrowRight, Clock, Calendar } from 'lucide-react';
import AudioRecorder from './components/AudioRecorder';
import AudioUploader from './components/AudioUploader';
import WaveformVisualizer from './components/WaveformVisualizer';
import MediaLibrary from './components/MediaLibrary';
import AnalysisPanel from './components/AnalysisPanel';
import SettingsPanel from './components/SettingsPanel';
import UserProfileButton from './components/UserProfileButton';
import { SermonRecording } from './types';
import { useTranscription } from './hooks/useTranscription';

// Sample recent recordings data
const recentRecordings = [
  {
    id: '1',
    title: 'Understanding Grace',
    date: '2024-03-10',
    duration: '35:20',
    preacher: 'Rev. John Smith',
    thumbnail: 'https://images.unsplash.com/photo-1447014421976-7fec21d26d86?w=800&h=600&fit=crop',
    tags: ['Grace', 'Salvation', 'New Testament']
  },
  {
    id: '2',
    title: 'The Power of Prayer',
    date: '2024-03-03',
    duration: '42:15',
    preacher: 'Rev. Sarah Johnson',
    thumbnail: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&h=600&fit=crop',
    tags: ['Prayer', 'Spiritual Growth']
  },
  {
    id: '3',
    title: 'Walking in Faith',
    date: '2024-02-25',
    duration: '38:45',
    preacher: 'Rev. Michael Brown',
    thumbnail: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop',
    tags: ['Faith', 'Christian Living']
  },
  {
    id: '4',
    title: 'Living with Purpose',
    date: '2024-02-18',
    duration: '40:30',
    preacher: 'Rev. Emily Davis',
    thumbnail: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=800&h=600&fit=crop',
    tags: ['Purpose', 'Christian Life']
  }
];

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showRecorder, setShowRecorder] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const { status, analysis, error } = useTranscription();
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
  });

  const handleRecordingComplete = (file: File) => {
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setShowRecorder(false);
  };

  const handleFileUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
  };

  const handleSelectRecording = (recording: SermonRecording) => {
    console.log('Selected recording:', recording);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark to-dark-lighter text-gray-100">
      <nav className="bg-dark-lighter/50 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Waves className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold text-white">SermonScribe Pro</span>
              </div>
              <div className="hidden md:flex space-x-4">
                <button
                  onClick={() => setCurrentPage('home')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === 'home'
                      ? 'bg-primary/20 text-primary'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </div>
                </button>
                <button
                  onClick={() => setCurrentPage('library')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === 'library'
                      ? 'bg-primary/20 text-primary'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Library className="h-4 w-4" />
                    <span>Library</span>
                  </div>
                </button>
                <button
                  onClick={() => setCurrentPage('settings')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === 'settings'
                      ? 'bg-primary/20 text-primary'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </div>
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <UserProfileButton
                user={user}
                onClick={() => setCurrentPage('settings')}
              />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'home' && !audioUrl && (
          <div className="space-y-12">
            <div className="text-center space-y-4 hero-gradient py-16">
              <h1 className="text-4xl font-bold text-white sm:text-5xl">
                Transform Your Sermons with AI
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Upload or record your sermons and get instant AI-powered insights, analysis, and key takeaways.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <button
                onClick={() => setShowRecorder(true)}
                className="group glass-effect p-8 rounded-xl hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                        <Mic className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">Record Sermon</h3>
                    </div>
                    <p className="text-gray-300">Start recording your sermon directly in your browser</p>
                  </div>
                  <ArrowRight className="h-6 w-6 text-primary transform group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button
                onClick={() => setShowRecorder(false)}
                className="group glass-effect p-8 rounded-xl hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                        <Upload className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">Upload Sermon</h3>
                    </div>
                    <p className="text-gray-300">Upload an existing sermon recording</p>
                  </div>
                  <ArrowRight className="h-6 w-6 text-primary transform group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>

            {showRecorder ? (
              <AudioRecorder onRecordingComplete={handleRecordingComplete} />
            ) : (
              <AudioUploader onUpload={handleFileUpload} />
            )}

            <div className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Recent Recordings</h2>
                <button
                  onClick={() => setCurrentPage('library')}
                  className="text-primary hover:text-primary-light font-medium flex items-center"
                >
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recentRecordings.map((recording) => (
                  <div
                    key={recording.id}
                    className="glass-effect rounded-lg overflow-hidden hover:scale-[1.02] transition-all duration-300 group"
                  >
                    <div className="relative aspect-video">
                      <img
                        src={recording.thumbnail}
                        alt={recording.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="px-4 py-2 bg-primary/90 rounded-full text-white font-medium transform -translate-y-2 group-hover:translate-y-0 transition-transform">
                          Play Recording
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-white mb-2 line-clamp-1">
                        {recording.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-300 space-x-4">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {recording.date}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {recording.duration}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-2">{recording.preacher}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentPage === 'home' && audioUrl && (
          <div className="space-y-8">
            <WaveformVisualizer audioUrl={audioUrl} />
            {status?.status === 'completed' && analysis && (
              <AnalysisPanel analysis={analysis} />
            )}
            {status?.status !== 'completed' && (
              <div className="glass-effect p-6 rounded-xl text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
                <p className="text-gray-300">
                  {status?.status === 'transcribing' ? 'Transcribing audio...' : 'Analyzing sermon...'}
                </p>
                {status?.progress && (
                  <p className="text-sm text-gray-400 mt-2">
                    Progress: {status.progress}%
                  </p>
                )}
              </div>
            )}
            {error && (
              <div className="glass-effect p-6 rounded-xl text-center text-red-400">
                <p>Error: {error.message}</p>
              </div>
            )}
          </div>
        )}

        {currentPage === 'library' && (
          <MediaLibrary recordings={recentRecordings} onSelectRecording={handleSelectRecording} />
        )}

        {currentPage === 'settings' && (
          <SettingsPanel user={user} onUpdateUser={setUser} />
        )}
      </main>
    </div>
  );
}

export default App;