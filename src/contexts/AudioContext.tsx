import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export interface Track {
  id: string;
  title: string;
  artist: string;
  cover?: string;
  url: string;
  duration?: number;
}

interface AudioContextType {
  track: Track | null;
  setTrack: (track: Track | null) => void;
  queue: Track[];
  setQueue: (queue: Track[]) => void;
  currentIndex: number;
  playNext: () => void;
  playPrev: () => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

interface AudioProviderProps {
  children: ReactNode;
}

export function AudioProvider({ children }: AudioProviderProps) {
  const [track, setTrack] = useState<Track | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const playNext = () => {
    if (queue.length > 0 && currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setTrack(queue[nextIndex]);
    }
  };

  const playPrev = () => {
    if (queue.length > 0 && currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setTrack(queue[prevIndex]);
    }
  };

  // When a new track is set, update the queue and current index
  const handleSetTrack = (newTrack: Track | null) => {
    if (newTrack) {
      setTrack(newTrack);
      // If the track is not in the current queue, add it
      const trackIndex = queue.findIndex((t) => t.id === newTrack.id);
      if (trackIndex === -1) {
        // Add to queue and set as current
        const newQueue = [...queue, newTrack];
        setQueue(newQueue);
        setCurrentIndex(newQueue.length - 1);
      } else {
        // Track is already in queue, just update index
        setCurrentIndex(trackIndex);
      }
    } else {
      setTrack(null);
      setCurrentIndex(-1);
    }
  };

  // Modified setQueue to also update currentIndex if track is in the new queue
  const handleSetQueue = (newQueue: Track[]) => {
    setQueue(newQueue);
    // If current track exists and is in the new queue, update index
    if (track) {
      const trackIndex = newQueue.findIndex((t) => t.id === track.id);
      setCurrentIndex(trackIndex >= 0 ? trackIndex : -1);
    }
  };

  const value: AudioContextType = {
    track,
    setTrack: handleSetTrack,
    queue,
    setQueue: handleSetQueue,
    currentIndex,
    playNext,
    playPrev,
    isPlaying,
    setIsPlaying,
  };

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
