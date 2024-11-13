import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface WaveformVisualizerProps {
  audioUrl: string;
}

function WaveformVisualizer({ audioUrl }: WaveformVisualizerProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isSubscribed = true;

    const initializeWaveSurfer = async () => {
      if (!waveformRef.current) return;

      try {
        // Cleanup previous instance
        if (wavesurfer.current) {
          wavesurfer.current.destroy();
          wavesurfer.current = null;
        }

        // Create new instance
        const ws = WaveSurfer.create({
          container: waveformRef.current,
          waveColor: '#818CF8',
          progressColor: '#4F46E5',
          cursorColor: '#4F46E5',
          barWidth: 2,
          barRadius: 3,
          cursorWidth: 1,
          height: 100,
          barGap: 3,
          autoplay: false,
          interact: true,
        });

        // Event listeners
        ws.on('ready', () => {
          if (isSubscribed) {
            setIsLoading(false);
            setError(null);
          }
        });

        ws.on('error', (err) => {
          if (isSubscribed) {
            setError('Error loading audio file');
            setIsLoading(false);
            console.error('WaveSurfer error:', err);
          }
        });

        ws.on('play', () => isSubscribed && setIsPlaying(true));
        ws.on('pause', () => isSubscribed && setIsPlaying(false));
        ws.on('finish', () => isSubscribed && setIsPlaying(false));

        // Load audio
        try {
          await ws.load(audioUrl);
          if (isSubscribed) {
            wavesurfer.current = ws;
          } else {
            ws.destroy();
          }
        } catch (err) {
          if (isSubscribed) {
            setError('Failed to load audio file');
            setIsLoading(false);
            console.error('Audio loading error:', err);
          }
          ws.destroy();
        }
      } catch (err) {
        if (isSubscribed) {
          setError('Failed to initialize audio player');
          setIsLoading(false);
          console.error('WaveSurfer initialization error:', err);
        }
      }
    };

    setIsLoading(true);
    setError(null);
    initializeWaveSurfer();

    // Cleanup function
    return () => {
      isSubscribed = false;
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
        wavesurfer.current = null;
      }
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    if (wavesurfer.current) {
      if (wavesurfer.current.isPlaying()) {
        wavesurfer.current.pause();
      } else {
        wavesurfer.current.play();
      }
    }
  };

  const restart = () => {
    if (wavesurfer.current) {
      wavesurfer.current.stop();
      wavesurfer.current.play();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div ref={waveformRef} className="mb-4" />
      
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      )}

      {error && (
        <div className="text-red-600 text-center py-4">
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <div className="flex justify-center space-x-4">
          <button
            onClick={togglePlayPause}
            className="p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 transition-colors"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6 text-indigo-600" />
            ) : (
              <Play className="h-6 w-6 text-indigo-600" />
            )}
          </button>
          <button
            onClick={restart}
            className="p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 transition-colors"
          >
            <RotateCcw className="h-6 w-6 text-indigo-600" />
          </button>
        </div>
      )}
    </div>
  );
}

export default WaveformVisualizer;