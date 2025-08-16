import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw } from 'lucide-react';

const BackgroundMusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMinimized, setIsMinimized] = useState(true);
  const audioRef = useRef(null);

  // Futuristic/Gaming music track (using a royalty-free cyberpunk-style track)
  const musicTrack = {
    title: "Cyber Dreams",
    artist: "LoyalHOOD",
    url: "https://www.soundjay.com/misc/sounds-effects/beep-7a.mp3" // Placeholder - you can replace with actual cyberpunk music
  };

  useEffect(() => {
    const audio = audioRef.current;
    
    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    if (audio) {
      audio.addEventListener('loadeddata', setAudioData);
      audio.addEventListener('timeupdate', setAudioTime);
      audio.volume = volume;
      audio.loop = true; // Loop the background music
    }

    return () => {
      if (audio) {
        audio.removeEventListener('loadeddata', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
      }
    };
  }, [volume]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(e => {
        console.log('Audio play failed:', e);
        // Handle autoplay policy restrictions
      });
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    const audio = audioRef.current;
    audio.volume = newVolume;
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const restartTrack = () => {
    const audio = audioRef.current;
    audio.currentTime = 0;
    if (!isPlaying) {
      audio.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <audio ref={audioRef} src={musicTrack.url} preload="metadata" />
      
      <div className={`bg-black/90 backdrop-blur-md border-2 border-[var(--brand-primary)] rounded-lg 
                      transition-all duration-300 ${isMinimized ? 'w-16 h-16' : 'w-80 h-32'}`}>
        
        {isMinimized ? (
          /* Minimized Player */
          <button
            onClick={() => setIsMinimized(false)}
            className="w-full h-full flex items-center justify-center hover:bg-[var(--brand-primary)]/10 
                     transition-colors rounded-lg group"
          >
            <Volume2 className={`w-6 h-6 transition-colors ${
              isPlaying ? 'text-[var(--brand-primary)] animate-pulse' : 'text-[var(--text-muted)]'
            } group-hover:text-[var(--brand-primary)]`} />
          </button>
        ) : (
          /* Expanded Player */
          <div className="p-4">
            {/* Header with minimize button */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-[var(--text-primary)] truncate">
                  {musicTrack.title}
                </h4>
                <p className="text-xs text-[var(--text-muted)] truncate">
                  {musicTrack.artist}
                </p>
              </div>
              <button
                onClick={() => setIsMinimized(true)}
                className="text-[var(--text-muted)] hover:text-[var(--brand-primary)] ml-2"
              >
                <VolumeX className="w-4 h-4" />
              </button>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={restartTrack}
                  className="text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                
                <button
                  onClick={togglePlayPause}
                  className="bg-[var(--brand-primary)] hover:bg-[var(--brand-active)] text-black p-2 
                           rounded-full transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                
                <button
                  onClick={toggleMute}
                  className="text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center gap-2 flex-1 max-w-24 ml-4">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="flex-1 h-1 bg-[var(--border-subtle)] rounded-lg appearance-none cursor-pointer
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 
                           [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[var(--brand-primary)]
                           [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>
            </div>

            {/* Time Display */}
            <div className="flex justify-between text-xs text-[var(--text-muted)] mt-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Audio visualization effect when playing */}
      {isPlaying && !isMinimized && (
        <div className="absolute -top-2 -right-2 w-4 h-4">
          <div className="w-full h-full bg-[var(--brand-primary)] rounded-full animate-ping opacity-75"></div>
        </div>
      )}
    </div>
  );
};

export default BackgroundMusicPlayer;