import { useRef, useEffect, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { useAudio } from "../contexts/AudioContext";
import {
  PlayIcon,
  PauseIcon,
  PreviousIcon,
  NextIcon,
  ShuffleIcon,
  VolumeIcon,
  RepeatIcon,
} from "./ui/AudioPlayerIcons";
import SongPlayerBg from "./ui/SongPlayerBg";
import "../styles/AudioPlayer.css";
import CloseIcon from "../assets/icons/CloseIcon";
// import SongPlayerBg from "../assets/svgs/song-player-bg.svg";

export default function GlobalAudioPlayer() {
  const { track, playNext, playPrev, isPlaying, setIsPlaying, setTrack } =
    useAudio();
  const playerRef = useRef<AudioPlayer>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isDraggingTimeline, setIsDraggingTimeline] = useState(false);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [isRepeatOn, setIsRepeatOn] = useState(false);

  useEffect(() => {
    if (playerRef.current && track) {
      const audioElement = playerRef.current.audio.current;
      if (audioElement) {
        // Reset timeline when new track is loaded
        audioElement.currentTime = 0;
        setCurrentTime(0);

        // Set up event listeners for progress tracking
        const handleTimeUpdate = () => {
          setCurrentTime(audioElement.currentTime || 0);
        };

        const handleLoadedMetadata = () => {
          setDuration(audioElement.duration || 0);
          // Ensure timeline is reset after metadata loads
          audioElement.currentTime = 0;
          setCurrentTime(0);
        };

        const handleVolumeChange = () => {
          setVolume(audioElement.volume || 0.8);
        };

        audioElement.addEventListener("timeupdate", handleTimeUpdate);
        audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);
        audioElement.addEventListener("volumechange", handleVolumeChange);

        // Set initial volume
        audioElement.volume = volume;

        // Cleanup listeners
        return () => {
          audioElement.removeEventListener("timeupdate", handleTimeUpdate);
          audioElement.removeEventListener(
            "loadedmetadata",
            handleLoadedMetadata
          );
          audioElement.removeEventListener("volumechange", handleVolumeChange);
        };
      }
    }
  }, [track, volume]);

  // Reset timeline when track changes
  useEffect(() => {
    if (playerRef.current && track) {
      const audioElement = playerRef.current.audio.current;
      if (audioElement) {
        audioElement.currentTime = 0;
        setCurrentTime(0);
      }
    }
  }, [track?.id]); // Only trigger when track ID changes

  // Handle mouse move for dragging
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (isDraggingTimeline && playerRef.current && duration) {
        const timelineElement = document.querySelector(
          "[data-timeline]"
        ) as HTMLDivElement;
        if (timelineElement) {
          const rect = timelineElement.getBoundingClientRect();
          const clickX = event.clientX - rect.left;
          const percentage = Math.max(0, Math.min(1, clickX / rect.width));
          const newTime = percentage * duration;

          const audioElement = playerRef.current.audio.current;
          if (audioElement) {
            audioElement.currentTime = newTime;
            setCurrentTime(newTime);
          }
        }
      }

      if (isDraggingVolume && playerRef.current) {
        const volumeElement = document.querySelector(
          "[data-volume]"
        ) as HTMLDivElement;
        if (volumeElement) {
          const rect = volumeElement.getBoundingClientRect();
          const clickX = event.clientX - rect.left;
          const percentage = Math.max(0, Math.min(1, clickX / rect.width));

          const audioElement = playerRef.current.audio.current;
          if (audioElement) {
            audioElement.volume = percentage;
            setVolume(percentage);
          }
        }
      }
    };

    const handleMouseUp = () => {
      setIsDraggingTimeline(false);
      setIsDraggingVolume(false);
    };

    if (isDraggingTimeline || isDraggingVolume) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingTimeline, isDraggingVolume, duration]);

  useEffect(() => {
    if (playerRef.current && track) {
      const audioElement = playerRef.current.audio.current;
      if (audioElement) {
        if (isPlaying) {
          audioElement.play().catch(console.error);
        } else {
          audioElement.pause();
        }
      }
    }
  }, [isPlaying, track]);

  if (!track) return null;

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volumePercentage = volume * 100;

  // Handle timeline click/drag
  const handleTimelineClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current || !duration) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = percentage * duration;

    const audioElement = playerRef.current.audio.current;
    if (audioElement) {
      audioElement.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Handle timeline mouse down (start dragging)
  const handleTimelineMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDraggingTimeline(true);
    handleTimelineClick(event);
  };

  // Handle volume click/drag
  const handleVolumeClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));

    const audioElement = playerRef.current.audio.current;
    if (audioElement) {
      audioElement.volume = percentage;
      setVolume(percentage);
    }
  };

  // Handle volume mouse down (start dragging)
  const handleVolumeMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDraggingVolume(true);
    handleVolumeClick(event);
  };

  return (
    <div className="global-audio-player" style={{ backgroundColor: '#DECDAD' }}>
      {/* Background Design Elements matching Figma */}
      {/* <img
        src={SongPlayerBg}
        className="absolute inset-0 object-cover w-full h-full"
      /> */}

      {/* <div className="absolute inset-0 w-full h-full">
        <SongPlayerBg />
      </div> */}
      
      {/* Mobile Layout */}
      <div className="relative flex flex-col lg:hidden px-4 py-2 h-full">
        {/* Top Row - Song Info, Main Control, and Close */}
        <div className="flex items-center justify-between mb-2">
          {/* Song Info */}
          <div className="flex gap-3 items-center flex-1 min-w-0">
            {/* Cover Image */}
            <div
              className="bg-center bg-no-repeat bg-cover rounded-sm shrink-0 w-12 h-12"
              style={{
                backgroundImage: track.cover
                  ? `url('${track.cover}')`
                  : "linear-gradient(45deg, var(--primary-500) 0%, var(--primary-400) 100%)",
              }}
            />
            {/* Song Details */}
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <div style={{ color: '#674A1D' }} className="font-serif font-semibold text-base leading-5 tracking-tight truncate">
                {track.title}
              </div>
              <div style={{ color: '#674A1D', opacity: 0.7 }} className="font-sans font-normal text-xs leading-4 truncate">
                {track.artist}
              </div>
            </div>
          </div>

          {/* Right side: Play button + Close icon */}
          <div className="flex items-center gap-2 ml-3 shrink-0">
            
            {/* Close icon - absolute top right */}
            <button
              className="absolute top-2 right-2 z-10"
              onClick={() => setTrack(null)}
            >
              <CloseIcon className="w-5 h-5 text-[#674A1D]" />
            </button>

            {/* Play button — mr-7 to avoid overlap with close icon */}
            <button
              className={`audio-control-btn audio-control-large shrink-0 mr-7 ml-3 ${isPlaying ? "active" : ""}`}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <PauseIcon className="w-5 h-5" />
              ) : (
                <PlayIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 items-center mb-1">
          <div style={{ color: '#674A1D' }} className="font-medium text-xs leading-4">
            {formatTime(currentTime)}
          </div>
          <div
            className="progress-bar-container flex-1"
            onClick={handleTimelineClick}
            onMouseDown={handleTimelineMouseDown}
            data-timeline
          >
            <div className="progress-bar-track w-full">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="progress-bar-thumb"></div>
              </div>
            </div>
          </div>
          <div style={{ color: '#674A1D', opacity: 0.6 }} className="font-medium text-xs leading-4">
            {formatTime(duration)}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-4 items-center justify-center">
          <button
            className={`audio-control-btn audio-control-small ${isShuffleOn ? "active" : ""}`}
            onClick={() => setIsShuffleOn(!isShuffleOn)}
          >
            <ShuffleIcon className="w-4 h-4" />
          </button>
          <button className="audio-control-btn audio-control-small" onClick={playPrev}>
            <PreviousIcon className="w-4 h-4" />
          </button>
          <button className="audio-control-btn audio-control-small" onClick={playNext}>
            <NextIcon className="w-4 h-4" />
          </button>
          <button
            className={`audio-control-btn audio-control-small ${isRepeatOn ? "active" : ""}`}
            onClick={() => setIsRepeatOn(!isRepeatOn)}
          >
            <RepeatIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Desktop Layout - keep the absolute close icon only for desktop */}
      <div
        className="absolute right-3 top-4 z-10 cursor-pointer hidden lg:block"
        onClick={() => setTrack(null)}
      >
        <CloseIcon className="w-6 h-6 text-[#674A1D]" />
      </div>

      {/* Desktop Layout */}
      <div className="relative hidden lg:flex items-center justify-between px-4 md:px-8 lg:px-20 xl:px-30 py-0 h-full">
        {/* Left Section - Song Info */}
        <div className="basis-0 flex gap-6 grow items-center min-h-px min-w-px relative shrink-0">
          <div className="flex gap-4 items-center relative shrink-0">
            {/* Cover Image */}
            <div
              className="bg-center bg-no-repeat bg-cover rounded-sm shrink-0 w-14 h-14"
              style={{
                backgroundImage: track.cover
                  ? `url('${track.cover}')`
                  : "linear-gradient(45deg, var(--primary-500) 0%, var(--primary-400) 100%)",
              }}
            />

            {/* Song Details */}
            <div className="flex flex-row items-center self-stretch">
              <div className="flex flex-col gap-1.5 h-full items-start relative shrink-0">
                <div className="flex gap-2.5 items-center justify-center relative shrink-0">
                  <div className="song-title-text max-w-xs">
                    {track.title}
                  </div>
                </div>
                <div className="song-artist-text max-w-xs">
                  {track.artist}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Section - Controls and Progress */}
        <div className="flex flex-col gap-3 items-center relative shrink-0">
          {/* Control Buttons */}
          <div className="flex gap-4 items-center relative shrink-0">
            <button
              className={`audio-control-btn audio-control-small ${
                isShuffleOn ? "active" : ""
              }`}
              onClick={() => setIsShuffleOn(!isShuffleOn)}
            >
              <ShuffleIcon className="w-4 h-4" />
            </button>

            <button
              className="audio-control-btn audio-control-small"
              onClick={playPrev}
            >
              <PreviousIcon className="w-3 h-3" />
            </button>

            <button
              className={`audio-control-btn audio-control-large ${
                isPlaying ? "active" : ""
              }`}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <PauseIcon className="w-5 h-5" />
              ) : (
                <PlayIcon className="w-5 h-5" />
              )}
            </button>

            <button
              className="audio-control-btn audio-control-small"
              onClick={playNext}
            >
              <NextIcon className="w-3 h-3" />
            </button>

            <button
              className={`audio-control-btn audio-control-small ${
                isRepeatOn ? "active" : ""
              }`}
              onClick={() => setIsRepeatOn(!isRepeatOn)}
            >
              <RepeatIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex gap-4 items-center leading-0 relative shrink-0">
            <div className="font-medium text-primary-200 text-sm leading-6 relative shrink-0">
              {formatTime(currentTime)}
            </div>
            <div
              className="inline-grid place-items-start relative shrink-0 cursor-pointer"
              style={{ gridTemplate: "max-content / max-content" }}
              onClick={handleTimelineClick}
              onMouseDown={handleTimelineMouseDown}
              data-timeline
            >
              <div
                className="bg-primary-200/50 h-1.5 rounded ml-0 mt-0 w-80"
                style={{ gridArea: "1 / 1" }}
              />
              <div
                className="bg-primary-200 h-1.5 rounded ml-0 mt-0"
                style={{
                  gridArea: "1 / 1",
                  width: `${Math.min(progressPercentage * 3.2, 320)}px`, // 320px = 80 * 4 (w-80)
                }}
              />
            </div>
            <div className="font-medium text-primary-400 text-sm leading-6 relative shrink-0">
              {formatTime(duration)}
            </div>
          </div>
        </div>

        {/* Right Section - Volume */}
        <div className="basis-0 flex gap-3 grow items-center justify-end min-h-px min-w-px relative shrink-0">
          <button className="audio-control-btn audio-control-small">
            <VolumeIcon className="w-4 h-4" />
          </button>
          <div
            className="inline-grid place-items-start relative shrink-0 cursor-pointer"
            style={{ gridTemplate: "max-content / max-content" }}
            onClick={handleVolumeClick}
            onMouseDown={handleVolumeMouseDown}
            data-volume
          >
            <div
              className="bg-primary-200/50 h-1.5 rounded ml-0 mt-0 w-30"
              style={{ gridArea: "1 / 1" }}
            />
            <div
              className="bg-primary-200 h-1.5 rounded ml-0 mt-0"
              style={{
                gridArea: "1 / 1",
                width: `${Math.min(volumePercentage * 1.2, 120)}px`, // 120px = 30 * 4 (w-30)
              }}
            />
          </div>
        </div>
      </div>

      {/* Hidden Audio Player */}
      <div className="sr-only">
        <AudioPlayer
          ref={playerRef}
          src={track.url}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={playNext}
          showSkipControls={false}
          showJumpControls={false}
          customProgressBarSection={[]}
          customControlsSection={[]}
          customVolumeControls={[]}
          layout="horizontal"
          volume={volume}
        />
      </div>
    </div>
  );
}