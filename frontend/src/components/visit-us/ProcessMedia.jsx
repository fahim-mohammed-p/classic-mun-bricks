import React, { useRef, useState, useEffect } from 'react';

/**
 * ProcessMedia Component
 * Manages the "Photograph comes alive" crossfade interaction.
 * Supports:
 * - Desktop hover preview (muted loop, smooth fade back on mouse leave)
 * - Mobile tap / intentional click playback (stays playing with minimal controls)
 * - Single-active-video coordination (pauses when another video starts)
 * - Zero layout shift and accessible keyboard controls
 */
const ProcessMedia = ({
  stepNumber,
  image,
  video,
  altText,
  badgeText,
  activeVideoId,
  setActiveVideoId,
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isIntentional, setIsIntentional] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPausedByUser, setIsPausedByUser] = useState(false);

  const isCurrentActive = activeVideoId === stepNumber;

  // If another video becomes active globally, pause this one
  useEffect(() => {
    if (!isCurrentActive && isPlaying) {
      handleStopPlayback();
    }
  }, [activeVideoId, isCurrentActive]);

  const handleStartPlayback = (intentional = false) => {
    if (setActiveVideoId) {
      setActiveVideoId(stepNumber);
    }
    if (videoRef.current) {
      videoRef.current.currentTime = videoRef.current.currentTime || 0;
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsPausedByUser(false);
          if (intentional) {
            setIsIntentional(true);
          }
        })
        .catch(() => {
          // Autoplay policy fallback
        });
    }
  };

  const handleStopPlayback = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setIsIntentional(false);
    setIsHovered(false);
    setIsPausedByUser(false);
    if (isCurrentActive && setActiveVideoId) {
      setActiveVideoId(null);
    }
  };

  const handleTogglePause = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPausedByUser(false);
    } else {
      videoRef.current.pause();
      setIsPausedByUser(true);
    }
  };

  const handleRestart = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPausedByUser(false);
  };

  // Desktop Hover handlers
  const handleMouseEnter = () => {
    setIsHovered(true);
    // If not already in intentional playback, start hover preview
    if (!isIntentional) {
      handleStartPlayback(false);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // If user only hovered (not intentionally clicked), stop and return to poster
    if (!isIntentional) {
      handleStopPlayback();
    }
  };

  // Click / Tap handler for intentional playback
  const handleClick = () => {
    if (!isIntentional) {
      handleStartPlayback(true);
    } else {
      // If already intentional, clicking toggles pause
      if (videoRef.current) {
        if (videoRef.current.paused) {
          videoRef.current.play();
          setIsPausedByUser(false);
        } else {
          videoRef.current.pause();
          setIsPausedByUser(true);
        }
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    } else if (e.key === 'Escape' && isIntentional) {
      e.preventDefault();
      handleStopPlayback();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`process-media-wrapper ${isPlaying ? 'is-playing' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Process ${stepNumber}: ${altText}. Press Enter or tap to watch footage`}
    >
      {/* Poster Image (shown initially; crossfades out when video plays) */}
      {image && (
        <img
          src={image}
          alt={altText}
          loading="lazy"
          className="process-poster-img"
        />
      )}

      {/* Video Element */}
      <video
        ref={videoRef}
        src={video ? `${video}#t=0.001` : undefined}
        muted
        loop
        playsInline
        preload="metadata"
        className="process-video-element"
        aria-label={`Footage for process step ${stepNumber}`}
      />

      {/* Gradient Overlay */}
      <div className="process-media-overlay" />

      {/* Watch Process Badge (visible when not playing) */}
      <div className="watch-process-badge">
        <i className="bi bi-play-circle-fill"></i>
        <span>{badgeText ? `Watch ${badgeText}` : 'Watch Process'}</span>
      </div>

      {/* Intentional Playback Controls Bar */}
      {isIntentional && (
        <div className="media-controls-bar" onClick={(e) => e.stopPropagation()}>
          <div className="playing-pulse-badge">
            <span className="playing-pulse-dot"></span>
            <span>{isPausedByUser ? 'Paused' : 'Playing Footage'}</span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="control-btn"
              onClick={handleTogglePause}
              title={isPausedByUser ? 'Resume Playback' : 'Pause Footage'}
              aria-label={isPausedByUser ? 'Resume Footage' : 'Pause Footage'}
            >
              <i className={`bi ${isPausedByUser ? 'bi-play-fill' : 'bi-pause-fill'}`}></i>
            </button>

            <button
              type="button"
              className="control-btn"
              onClick={handleRestart}
              title="Restart Footage"
              aria-label="Restart Footage"
            >
              <i className="bi bi-arrow-counterclockwise"></i>
            </button>

            <button
              type="button"
              className="control-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleStopPlayback();
              }}
              title="Close and Return to Photo"
              aria-label="Return to Poster View"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessMedia;
