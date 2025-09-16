import React from 'react';
import './PlaybackControls.css';

interface PlaybackControlsProps {
  onSpeak: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  speaking: boolean;
  paused: boolean;
  supported: boolean;
  text: string;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  onSpeak,
  onPause,
  onResume,
  onStop,
  speaking,
  paused,
  supported,
  text,
}) => {
  const hasText = text.trim().length > 0;
  const canSpeak = supported && hasText && !speaking;
  const canPause = supported && speaking && !paused;
  const canResume = supported && speaking && paused;
  const canStop = supported && speaking;

  if (!supported) {
    return (
      <div className="playback-controls">
        <div className="error-message">
          Speech synthesis is not supported in your browser.
        </div>
      </div>
    );
  }

  return (
    <div className="playback-controls">
      <button
        className="control-button play"
        onClick={onSpeak}
        disabled={!canSpeak}
        title={!hasText ? "Enter some text first" : "Play"}
      >
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path d="M8 5v14l11-7z" fill="currentColor" />
        </svg>
        Play
      </button>

      <button
        className="control-button pause"
        onClick={canResume ? onResume : onPause}
        disabled={!canPause && !canResume}
        title={paused ? "Resume" : "Pause"}
      >
        {paused ? (
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M8 5v14l11-7z" fill="currentColor" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="currentColor" />
          </svg>
        )}
        {paused ? 'Resume' : 'Pause'}
      </button>

      <button
        className="control-button stop"
        onClick={onStop}
        disabled={!canStop}
        title="Stop"
      >
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path d="M6 6h12v12H6z" fill="currentColor" />
        </svg>
        Stop
      </button>

      {speaking && (
        <div className="status-indicator">
          <div className="pulse"></div>
          {paused ? 'Paused' : 'Speaking...'}
        </div>
      )}
    </div>
  );
};

export default PlaybackControls;