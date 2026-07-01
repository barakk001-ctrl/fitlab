import { useEffect, useRef, useState } from 'react';
import { VIDEO_START, stretchEmbedSrc } from '../data/stretches.js';
let ytApiPromise = null;
function loadYouTubeAPI() {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { if (typeof prev === 'function') prev(); resolve(window.YT); };
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  });
  return ytApiPromise;
}

const videoPoster = (video) => `https://i.ytimg.com/vi/${video}/hqdefault.jpg`;
const posterStyle = (loaded) => ({ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: loaded ? 0 : 1, transition: 'opacity .4s ease' });
const frameWrap = (maxWidth) => ({ position: 'relative', width: '100%', maxWidth: maxWidth || '100%', aspectRatio: '16 / 9', borderRadius: '8px', overflow: 'hidden', background: '#000' });

// Autoplaying demo that loops ONLY the exercise segment — replays from the
// per-video start time instead of YouTube's default loop-back-to-0 (the intro).
function LoopingPlayer({ video, title, maxWidth }) {
  const holderRef = useRef(null);
  const playerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const start = VIDEO_START[video] || 0;

  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    loadYouTubeAPI().then((YT) => {
      if (cancelled || !YT || !holderRef.current) return;
      playerRef.current = new YT.Player(holderRef.current, {
        width: '100%', height: '100%', videoId: video,
        host: 'https://www.youtube-nocookie.com',
        playerVars: { autoplay: 1, mute: 1, controls: 1, rel: 0, modestbranding: 1, playsinline: 1, start, loop: 0 },
        events: {
          onReady: (e) => { try { e.target.mute(); if (start > 0) e.target.seekTo(start, true); e.target.playVideo(); } catch {} },
          onStateChange: (e) => {
            if (e.data === 1) setLoaded(true);            // PLAYING → reveal
            if (e.data === 0) { try { e.target.seekTo(start, true); e.target.playVideo(); } catch {} } // ENDED → loop from start
          },
        },
      });
    });
    return () => { cancelled = true; try { playerRef.current && playerRef.current.destroy(); } catch {} };
  }, [video, start]);

  // Recover playback after returning from the background — iOS suspends the
  // player when you switch apps, and it otherwise stays paused/stuck.
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState !== 'visible') return;
      const p = playerRef.current;
      if (!p || !p.getPlayerState) return;
      let st = null;
      try { st = p.getPlayerState(); } catch {}
      if (st === 1 || st === 3) return; // already playing / buffering
      try { p.mute(); p.playVideo(); } catch {}
      // If a gentle nudge didn't take, hard-reload the segment.
      setTimeout(() => {
        try {
          const s2 = p.getPlayerState ? p.getPlayerState() : null;
          if (s2 !== 1 && s2 !== 3) { p.loadVideoById({ videoId: video, startSeconds: start }); p.mute(); p.playVideo(); }
        } catch {}
      }, 500);
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [video, start]);

  return (
    <div className="vid-embed" style={frameWrap(maxWidth)}>
      <img src={videoPoster(video)} alt={title || ''} aria-hidden="true" style={posterStyle(loaded)} />
      <div ref={holderRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
    </div>
  );
}

// Lightweight embed for lists — plain (lazy) iframe, opens at the start time.
function SimpleEmbed({ video, title, lazy, maxWidth }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setLoaded(false); }, [video]);
  return (
    <div style={frameWrap(maxWidth)}>
      <img src={videoPoster(video)} alt={title || ''} aria-hidden="true" style={posterStyle(loaded)} />
      <iframe
        src={stretchEmbedSrc(video, { autoplay: false })}
        title={title || 'Demonstration'}
        loading={lazy ? 'lazy' : 'eager'}
        onLoad={() => setLoaded(true)}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, opacity: loaded ? 1 : 0, transition: 'opacity .4s ease' }}
      />
    </div>
  );
}

function StretchVideo({ video, title, autoplay = false, lazy = false, maxWidth }) {
  if (!video) return null;
  // Autoplay contexts (guided session, preview) get the segment-looping player;
  // lists keep the cheap lazy iframe.
  return autoplay
    ? <LoopingPlayer key={video} video={video} title={title} maxWidth={maxWidth} />
    : <SimpleEmbed key={video} video={video} title={title} lazy={lazy} maxWidth={maxWidth} />;
}

// ------------------------------------------------------------
// Stretch sequence row
// ------------------------------------------------------------


export { loadYouTubeAPI, videoPoster, posterStyle, frameWrap, LoopingPlayer, SimpleEmbed, StretchVideo };
