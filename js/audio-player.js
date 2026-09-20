/**
 * SALON VELLORA - NEXT-LEVEL LUXURY HERO AUDIO PLAYER
 * Features:
 * - Autoplay engine with modern browser policy graceful fallback
 * - First-gesture auto-unlock (click/scroll/touch anywhere to play)
 * - Animated rotating vinyl disc with brand monogram
 * - Dynamic soundwave equalizer visualizer bars
 * - Clickable & draggable progress scrubber
 * - Accurate time formatting (current & duration)
 * - Volume / mute toggle with animated icons
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroAudioPlayer();
});

function initHeroAudioPlayer() {
  const audio = document.getElementById('heroWelcomeAudio');
  const card = document.getElementById('heroAudioCard');
  const playBtn = document.getElementById('btnAudioPlayPause');
  const playIcon = document.getElementById('audioPlayIcon');
  const discWrapper = document.getElementById('audioDiscWrapper');
  const visualizer = document.getElementById('soundwaveVisualizer');
  const scrubBar = document.getElementById('audioScrubBar');
  const scrubFill = document.getElementById('audioScrubFill');
  const scrubThumb = document.getElementById('audioScrubThumb');
  const currentTimeEl = document.getElementById('audioCurrentTime');
  const durationEl = document.getElementById('audioDuration');
  const muteBtn = document.getElementById('btnAudioMute');
  const volumeIcon = document.getElementById('audioVolumeIcon');

  if (!audio || !playBtn) return;

  let isPlaying = false;
  let isScrubbing = false;

  // Format seconds to M:SS
  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Update visual state when playing or paused
  const setPlayState = (playing) => {
    isPlaying = playing;
    if (playing) {
      playIcon.classList.remove('fa-play');
      playIcon.classList.add('fa-pause');
      discWrapper.classList.add('playing');
      visualizer.classList.add('playing');
      card.classList.add('is-active');
      playBtn.setAttribute('aria-label', 'Pause welcome voice greeting');
    } else {
      playIcon.classList.remove('fa-pause');
      playIcon.classList.add('fa-play');
      discWrapper.classList.remove('playing');
      visualizer.classList.remove('playing');
      card.classList.remove('is-active');
      playBtn.setAttribute('aria-label', 'Play welcome voice greeting');
    }
  };

  // Toggle Play / Pause
  const togglePlay = () => {
    if (audio.paused) {
      audio.play().then(() => {
        setPlayState(true);
      }).catch((err) => {
        console.warn('Audio play request blocked or failed:', err);
      });
    } else {
      audio.pause();
      setPlayState(false);
    }
  };

  playBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    togglePlay();
  });

  discWrapper.addEventListener('click', (e) => {
    if (e.target !== playBtn && !playBtn.contains(e.target)) {
      togglePlay();
    }
  });

  // Handle Audio Metadata (Duration)
  audio.addEventListener('loadedmetadata', () => {
    if (durationEl) {
      durationEl.textContent = formatTime(audio.duration);
    }
  });

  // Duration change fallback if loaded asynchronously
  audio.addEventListener('durationchange', () => {
    if (durationEl) {
      durationEl.textContent = formatTime(audio.duration);
    }
  });

  // Time update progress bar
  audio.addEventListener('timeupdate', () => {
    if (isScrubbing) return;
    const current = audio.currentTime;
    const duration = audio.duration || 1;
    const progressPercent = Math.min(100, Math.max(0, (current / duration) * 100));

    if (currentTimeEl) currentTimeEl.textContent = formatTime(current);
    if (scrubFill) scrubFill.style.width = `${progressPercent}%`;
    if (scrubThumb) scrubThumb.style.left = `${progressPercent}%`;
  });

  // Reset when audio finishes
  audio.addEventListener('ended', () => {
    setPlayState(false);
    audio.currentTime = 0;
    if (scrubFill) scrubFill.style.width = '0%';
    if (scrubThumb) scrubThumb.style.left = '0%';
    if (currentTimeEl) currentTimeEl.textContent = '0:00';
  });

  // Scrubbing / Seeking functionality
  const seekTo = (e) => {
    const rect = scrubBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    if (audio.duration) {
      audio.currentTime = percentage * audio.duration;
    }
    if (scrubFill) scrubFill.style.width = `${percentage * 100}%`;
    if (scrubThumb) scrubThumb.style.left = `${percentage * 100}%`;
  };

  if (scrubBar) {
    scrubBar.addEventListener('click', (e) => {
      seekTo(e);
    });

    scrubBar.addEventListener('mousedown', (e) => {
      isScrubbing = true;
      seekTo(e);

      const onMouseMove = (moveEvent) => {
        if (isScrubbing) seekTo(moveEvent);
      };

      const onMouseUp = () => {
        isScrubbing = false;
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    });
  }

  // Mute / Unmute Toggle
  if (muteBtn) {
    muteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      audio.muted = !audio.muted;
      if (audio.muted) {
        volumeIcon.className = 'fas fa-volume-mute';
        muteBtn.classList.add('muted');
        muteBtn.setAttribute('title', 'Unmute');
      } else {
        volumeIcon.className = 'fas fa-volume-up';
        muteBtn.classList.remove('muted');
        muteBtn.setAttribute('title', 'Mute');
      }
    });
  }

  /* --------------------------------------------------------------------------
     AUTOPLAY ENGINE WITH BROWSER INTERACTION FALLBACK
     -------------------------------------------------------------------------- */
  let hasAutoplayTriggered = false;

  const attemptPlay = () => {
    if (hasAutoplayTriggered) return;
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          hasAutoplayTriggered = true;
          setPlayState(true);
        })
        .catch(() => {
          // Autoplay was restricted by browser policy.
          // Listen for first user click / touch anywhere to unlock sound!
          setPlayState(false);
          setupGestureUnlock();
        });
    }
  };

  const setupGestureUnlock = () => {
    const unlockHandler = () => {
      if (!hasAutoplayTriggered && audio.paused) {
        audio.play().then(() => {
          hasAutoplayTriggered = true;
          setPlayState(true);
          if (window.showToast) {
            showToast('Welcome to Salon Vellora! 🌸 Playing audio greeting.', 'fa-volume-up');
          }
        }).catch(() => {});
      }
      cleanupGestureListeners();
    };

    const cleanupGestureListeners = () => {
      window.removeEventListener('click', unlockHandler);
      window.removeEventListener('touchstart', unlockHandler);
      window.removeEventListener('keydown', unlockHandler);
    };

    window.addEventListener('click', unlockHandler, { once: true });
    window.addEventListener('touchstart', unlockHandler, { once: true });
    window.addEventListener('keydown', unlockHandler, { once: true });
  };

  // Attempt initial playback as requested
  attemptPlay();
}
