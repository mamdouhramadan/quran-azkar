import { useState, useRef, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchSurahContent } from '@/core/api/quranApi';
import { fetchReciterAudioByChapter } from '@/core/api/reciterApi';
import { useSettings } from '@/core/hooks/useSettings';
import { useTranslation } from '@/core/hooks/useTranslation';
import { SkipBack, SkipForward, SpeakerHigh, SpeakerSlash, Repeat, RepeatOnce, Pause, Play } from '@phosphor-icons/react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface AudioPlayerProps {
  surahNumber: number;
  ayahNumber: number | null;
  onAyahChange: (surah: number, ayah: number) => void;
}

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5];

export const AudioPlayer = ({ surahNumber, ayahNumber, onAyahChange }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [wantPlay, setWantPlay] = useState(false);
  const [repeatMode, setRepeatMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const { settings } = useSettings();
  const { t } = useTranslation();

  const { data: surahData } = useQuery({
    queryKey: ['surah', surahNumber, settings.translationId],
    queryFn: () => fetchSurahContent(surahNumber, settings.translationId),
  });

  const { data: audioFiles } = useQuery({
    queryKey: ['audio', settings.reciterId, surahNumber],
    queryFn: () => fetchReciterAudioByChapter(settings.reciterId, surahNumber),
  });

  const totalAyahs = surahData?.ayahs?.length || 0;
  const currentAyah = ayahNumber || 1;
  const currentVerseKey = `${surahNumber}:${currentAyah}`;
  const audioUrl = audioFiles?.find(a => a.verseKey === currentVerseKey)?.url || '';

  // Create audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audioRef.current = audio;

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setWantPlay(true); // signal to advance
    });
    audio.addEventListener('playing', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Track if we should auto-play after src change
  const pendingPlay = useRef(false);

  // When wantPlay triggers after ended, repeat or advance
  useEffect(() => {
    if (wantPlay) {
      setWantPlay(false);
      if (repeatMode) {
        // Replay current ayah
        const audio = audioRef.current;
        if (audio) {
          audio.currentTime = 0;
          audio.play().catch(console.warn);
        }
      } else if (currentAyah < totalAyahs) {
        pendingPlay.current = true;
        onAyahChange(surahNumber, currentAyah + 1);
      } else if (surahNumber < 114) {
        // Reached end of Surah, go to next Surah
        pendingPlay.current = true;
        onAyahChange(surahNumber + 1, 1);
      }
    }
  }, [wantPlay, currentAyah, totalAyahs, onAyahChange, repeatMode, surahNumber]);

  // Load audio when URL changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const wasPlaying = !audio.paused || pendingPlay.current;
    audio.src = audioUrl;
    audio.playbackRate = playbackSpeed;
    setCurrentTime(0);
    setDuration(0);

    if (wasPlaying) {
      pendingPlay.current = true;
      const onCanPlay = () => {
        if (pendingPlay.current) {
          pendingPlay.current = false;
          audio.play().catch(console.warn);
        }
        audio.removeEventListener('canplay', onCanPlay);
      };
      audio.addEventListener('canplay', onCanPlay);
    } else {
      pendingPlay.current = false;
    }
  }, [audioUrl, playbackSpeed]);

  // Apply speed and mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.muted = isMuted;
    }
  }, [playbackSpeed, isMuted]);

  const doPlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.readyState >= 2) {
      audio.play().catch(console.warn);
    } else {
      pendingPlay.current = true;
      audio.load();
    }
  }, []);

  const doPause = useCallback(() => {
    audioRef.current?.pause();
    pendingPlay.current = false;
  }, []);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      doPlay();
    } else {
      doPause();
    }
  }, [doPlay, doPause]);

  // Listen for playAyah events from ayah cards
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail.surah === surahNumber && detail.ayah === currentAyah) {
        togglePlayPause();
      } else {
        // Different ayah: set pending play, then change ayah (triggers audioUrl change)
        pendingPlay.current = true;
        onAyahChange(detail.surah, detail.ayah);
      }
    };
    window.addEventListener('playAyah', handler);
    return () => window.removeEventListener('playAyah', handler);
  }, [surahNumber, currentAyah, togglePlayPause, onAyahChange]);

  // handleProgressClick seeks the current audio position based on progress-bar clicks.
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (progressRef.current && audio && duration) {
      const rect = progressRef.current.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      audio.currentTime = Math.max(0, Math.min(1, ratio)) * duration;
    }
  };

  // handlePrev restarts the current ayah or moves to the previous ayah when possible.
  const handlePrev = () => {
    if (currentTime > 3) {
      if (audioRef.current) audioRef.current.currentTime = 0;
    } else if (currentAyah > 1) {
      if (!audioRef.current?.paused) pendingPlay.current = true;
      onAyahChange(surahNumber, currentAyah - 1);
    } else if (surahNumber > 1) {
      if (!audioRef.current?.paused) pendingPlay.current = true;
      onAyahChange(surahNumber - 1, 1);
    }
  };

  // handleNext advances playback to the next available ayah or surah.
  const handleNext = () => {
    if (currentAyah < totalAyahs) {
      if (!audioRef.current?.paused) pendingPlay.current = true;
      onAyahChange(surahNumber, currentAyah + 1);
    } else if (surahNumber < 114) {
      if (!audioRef.current?.paused) pendingPlay.current = true;
      onAyahChange(surahNumber + 1, 1);
    }
  };

  const cycleSpeed = () => {
    const idx = SPEED_OPTIONS.indexOf(playbackSpeed);
    setPlaybackSpeed(SPEED_OPTIONS[(idx + 1) % SPEED_OPTIONS.length]);
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '00:00';
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-card/95 border-t border-primary/10 px-4 md:px-10 py-5 backdrop-blur-lg z-50">
      <div className="container flex flex-col gap-4">
        {/* Progress and Timing */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs font-medium text-muted-foreground" dir="ltr">
            <div className="flex gap-2 items-center">
              <span className="text-primary">{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>
            <span>
              {t('audioVerseOfTotal', { current: currentAyah, total: totalAyahs })}
            </span>
          </div>
          <div
            ref={progressRef}
            onClick={handleProgressClick}
            className="relative h-1.5 w-full bg-muted rounded-full overflow-hidden cursor-pointer group"
          >
            <div
              className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 h-3 w-3 bg-card border-2 border-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `${progress}%`, transform: `translate(-50%, -50%)` }}
            />
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center justify-between">
          <div className="hidden md:flex items-center gap-4 w-1/4">
            <button
              onClick={() => setRepeatMode(r => !r)}
              className={`transition-colors ${repeatMode ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
              title={repeatMode ? 'Repeat on' : 'Repeat off'}
            >
              {repeatMode ? <RepeatOnce className="text-xl" weight="regular" /> : <Repeat className="text-xl" weight="regular" />}
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger className="text-xs font-bold px-2 py-1 rounded-lg border border-primary/10 hover:border-primary hover:text-primary transition-colors min-w-[3.5rem] outline-none">
                {playbackSpeed}x
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" sideOffset={8} className="min-w-[4rem]">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                  <DropdownMenuItem key={speed} onClick={() => setPlaybackSpeed(speed)} className="justify-center cursor-pointer font-bold">
                    {speed}x
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-1 justify-center items-center gap-8">
            <button
              onClick={handlePrev}
              disabled={currentAyah <= 1}
              className="text-foreground/70 hover:text-primary transition-colors disabled:opacity-30"
            >
              <SkipBack className="text-3xl rtl:rotate-180" weight="regular" />
            </button>

            <button
              onClick={togglePlayPause}
              className="bg-primary text-primary-foreground h-14 w-14 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause className="text-4xl" weight="fill" /> : <Play className="text-4xl" weight="fill" />}
            </button>

            <button
              onClick={handleNext}
              disabled={currentAyah >= totalAyahs}
              className="text-foreground/70 hover:text-primary transition-colors disabled:opacity-30"
            >
              <SkipForward className="text-3xl rtl:rotate-180" weight="regular" />
            </button>
          </div>

          <div className="hidden md:flex items-center justify-end gap-4 w-1/4">
            <button onClick={() => setIsMuted(!isMuted)} className="text-muted-foreground hover:text-primary transition-colors">
              {isMuted ? <SpeakerSlash className="text-xl" weight="regular" /> : <SpeakerHigh className="text-xl" weight="regular" />}
            </button>
          </div>

          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger className="text-xs font-bold px-2 py-1 rounded-lg border border-primary/10 hover:border-primary hover:text-primary transition-colors min-w-[3.5rem] outline-none">
                {playbackSpeed}x
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" sideOffset={8} className="min-w-[4rem]">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                  <DropdownMenuItem key={speed} onClick={() => setPlaybackSpeed(speed)} className="justify-center cursor-pointer font-bold">
                    {speed}x
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </footer>
  );
};
