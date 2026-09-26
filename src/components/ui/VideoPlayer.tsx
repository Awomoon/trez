"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

type Props = {
  src: string;
  /** Real pixel size, so the space is held before the file loads. */
  width: number;
  height: number;
  label: string;
  onEnded?: () => void;
};

const HIDE_AFTER = 2600;

const clock = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

/* ------------------------------------------------------------------ */
/*  Icons. Currentcolor throughout so one class controls all of them.  */
/* ------------------------------------------------------------------ */
const Play = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M8 5.6a.6.6 0 0 1 .92-.5l9 6.4a.6.6 0 0 1 0 1l-9 6.4a.6.6 0 0 1-.92-.5V5.6Z" fill="currentColor" />
  </svg>
);

const Pause = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect x="7" y="5" width="3.6" height="14" rx="1.3" fill="currentColor" />
    <rect x="13.4" y="5" width="3.6" height="14" rx="1.3" fill="currentColor" />
  </svg>
);

const Replay = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M12 5a7 7 0 1 1-6.6 4.7"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
    />
    <path d="M4.2 4.6v4.6h4.6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Sound = ({ muted }: { muted: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M4 9.5h3.2L11.5 6v12L7.2 14.5H4a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5Z"
      fill="currentColor"
    />
    {muted ? (
      <path d="m15.5 9.5 4 5m0-5-4 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    ) : (
      <>
        <path d="M15.2 9.4a3.4 3.4 0 0 1 0 5.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M17.8 7.2a6.7 6.7 0 0 1 0 9.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </>
    )}
  </svg>
);

const Expand = ({ on }: { on: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    {on ? (
      <path
        d="M9.5 4.5v5h-5m10 10v-5h5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ) : (
      <path
        d="M4.5 9.5v-5h5m5 0h5v5m0 5v5h-5m-5 0h-5v-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
  </svg>
);

/**
 * A small player, written for this page rather than pulled in.
 *
 * The two range inputs are deliberately native. A styled div would have
 * meant writing drag, touch, keyboard and ARIA by hand and getting all four
 * right; `input[type=range]` arrives with them, and CSS can make it look
 * like anything. The track is a hairline, the input around it is tall
 * enough to hit with a thumb.
 */
export default function VideoPlayer({ src, width, height, label, onEnded }: Props) {
  const shell = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const hideTimer = useRef(0);

  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [scrubbing, setScrubbing] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  /* Controls stay put unless the video is actually running. */
  const keepControls = useCallback(() => {
    window.clearTimeout(hideTimer.current);
    setShowControls(true);
    const v = video.current;
    if (v && !v.paused && !v.ended) {
      hideTimer.current = window.setTimeout(
        () => setShowControls(false),
        HIDE_AFTER,
      );
    }
  }, []);

  const toggle = useCallback(() => {
    const v = video.current;
    if (!v) return;
    if (v.ended) {
      v.currentTime = 0;
      void v.play();
    } else if (v.paused) {
      void v.play();
    } else {
      v.pause();
    }
    keepControls();
  }, [keepControls]);

  const replay = useCallback(() => {
    const v = video.current;
    if (!v) return;
    v.currentTime = 0;
    void v.play();
    keepControls();
  }, [keepControls]);

  /* ---- everything the element tells us ---- */
  useEffect(() => {
    const v = video.current;
    if (!v) return;

    const onPlay = () => {
      setPlaying(true);
      setEnded(false);
      keepControls();
    };
    const onPause = () => {
      setPlaying(false);
      window.clearTimeout(hideTimer.current);
      setShowControls(true);
    };
    const onEnd = () => {
      setPlaying(false);
      setEnded(true);
      window.clearTimeout(hideTimer.current);
      setShowControls(true);
      onEnded?.();
    };
    const onTime = () => {
      if (!scrubbing) setTime(v.currentTime);
    };
    const onMeta = () => setDuration(v.duration || 0);
    const onVol = () => {
      setMuted(v.muted);
      setVolume(v.volume);
    };

    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("ended", onEnd);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("durationchange", onMeta);
    v.addEventListener("volumechange", onVol);
    onMeta();
    onVol();

    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("ended", onEnd);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("durationchange", onMeta);
      v.removeEventListener("volumechange", onVol);
    };
  }, [keepControls, onEnded, scrubbing]);

  /* ---- fullscreen ---- */
  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const box = shell.current;
    const v = video.current as
      | (HTMLVideoElement & { webkitEnterFullscreen?: () => void })
      | null;
    if (!box) return;

    if (document.fullscreenElement) {
      void document.exitFullscreen();
      return;
    }
    if (box.requestFullscreen) {
      void box.requestFullscreen().catch(() => {});
      return;
    }
    /* iPhone Safari will not take an arbitrary element fullscreen, only the
       video itself, which hands over to the system player. */
    v?.webkitEnterFullscreen?.();
  }, []);

  useEffect(() => () => window.clearTimeout(hideTimer.current), []);

  /* ---- keyboard, but only when the player itself has focus, so it never
          steals space or arrows from the page or from its own buttons ---- */
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.target !== shell.current) return;
    const v = video.current;
    if (!v) return;
    const keys = [" ", "k", "ArrowLeft", "ArrowRight", "m", "f"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    if (event.key === " " || event.key === "k") toggle();
    if (event.key === "ArrowLeft") v.currentTime = Math.max(0, v.currentTime - 5);
    if (event.key === "ArrowRight")
      v.currentTime = Math.min(v.duration || 0, v.currentTime + 5);
    if (event.key === "m") v.muted = !v.muted;
    if (event.key === "f") toggleFullscreen();
    keepControls();
  };

  const seek = (value: number) => {
    const v = video.current;
    if (!v) return;
    setTime(value);
    v.currentTime = value;
  };

  const progress = duration ? (time / duration) * 100 : 0;
  const visible = showControls || !playing || ended;

  /* Anything inside the control bar handles its own click, so the tap to
     toggle on the surface behind it must not also fire. */
  const swallow = (event: ReactPointerEvent | React.MouseEvent) =>
    event.stopPropagation();

  return (
    <div
      ref={shell}
      tabIndex={0}
      role="group"
      aria-label={label}
      onKeyDown={onKeyDown}
      onPointerMove={keepControls}
      onPointerLeave={() => playing && setShowControls(false)}
      onClick={toggle}
      className="player group relative isolate overflow-hidden rounded-[1.35rem] bg-black"
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <video
        ref={video}
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-contain"
        aria-label={label}
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* A wash at the bottom so the controls always have something to sit
          against, whatever frame is underneath. */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 via-black/25 to-transparent transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* ---- The big one in the middle ---- */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <button
          type="button"
          onClick={(e) => {
            swallow(e);
            if (ended) replay();
            else toggle();
          }}
          aria-label={ended ? "Replay" : playing ? "Pause" : "Play"}
          /* Tied to the same `visible` the bar uses rather than to
             :hover. A phone has no hover, so a hover-only pause button
             would simply never exist there. */
          className={`player-orb pointer-events-auto grid h-[4.2rem] w-[4.2rem] place-items-center rounded-full text-frost transition-all duration-300 sm:h-[4.6rem] sm:w-[4.6rem] ${
            playing && !ended && !visible
              ? "pointer-events-none scale-95 opacity-0"
              : "scale-100 opacity-100"
          }`}
        >
          {ended ? <Replay size={24} /> : playing ? <Pause size={24} /> : <Play size={24} />}
        </button>
      </div>

      {/* ---- The bar ---- */}
      <div
        onClick={swallow}
        onPointerDown={swallow}
        className={`absolute inset-x-0 bottom-0 z-[3] px-3 pb-2.5 pt-2 transition-opacity duration-300 sm:px-4 sm:pb-3 ${
          visible ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <input
          type="range"
          className="player-range player-seek w-full"
          min={0}
          max={duration || 0}
          step={0.01}
          value={time}
          onChange={(e) => seek(Number(e.target.value))}
          onPointerDown={() => setScrubbing(true)}
          onPointerUp={() => setScrubbing(false)}
          onPointerCancel={() => setScrubbing(false)}
          aria-label="Seek"
          aria-valuetext={`${clock(time)} of ${clock(duration)}`}
          style={{ ["--played" as string]: `${progress}%` }}
        />

        <div className="mt-1.5 flex items-center gap-2.5">
          <span className="font-mono text-[0.6rem] tabular-nums tracking-[0.12em] text-ice/55">
            {clock(time)} / {clock(duration)}
          </span>

          <span className="flex-1" />

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                const v = video.current;
                if (v) v.muted = !v.muted;
                keepControls();
              }}
              aria-label={muted ? "Unmute" : "Mute"}
              className="player-btn"
            >
              <Sound muted={muted || volume === 0} />
            </button>

            {/* Desktop only: a phone has a hardware volume rocker. */}
            <input
              type="range"
              className="player-range player-volume hidden w-16 sm:block"
              min={0}
              max={1}
              step={0.02}
              value={muted ? 0 : volume}
              onChange={(e) => {
                const v = video.current;
                if (!v) return;
                v.volume = Number(e.target.value);
                v.muted = Number(e.target.value) === 0;
                keepControls();
              }}
              aria-label="Volume"
              style={{ ["--played" as string]: `${(muted ? 0 : volume) * 100}%` }}
            />

            <button
              type="button"
              onClick={() => {
                toggleFullscreen();
                keepControls();
              }}
              aria-label={fullscreen ? "Exit full screen" : "Full screen"}
              className="player-btn"
            >
              <Expand on={fullscreen} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
