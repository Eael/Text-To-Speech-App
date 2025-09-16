import React from 'react';
import './ControlPanel.css';

interface ControlPanelProps {
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  onVoiceChange: (voice: SpeechSynthesisVoice | null) => void;
  rate: number;
  onRateChange: (rate: number) => void;
  pitch: number;
  onPitchChange: (pitch: number) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  voices,
  selectedVoice,
  onVoiceChange,
  rate,
  onRateChange,
  pitch,
  onPitchChange,
  volume,
  onVolumeChange,
}) => {
  return (
    <div className="control-panel">
      <h3>Voice Settings</h3>
      
      <div className="control-group">
        <label htmlFor="voice-select">Voice:</label>
        <select
          id="voice-select"
          value={selectedVoice?.name || ''}
          onChange={(e) => {
            const voice = voices.find(v => v.name === e.target.value) || null;
            onVoiceChange(voice);
          }}
        >
          {voices.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
      </div>

      <div className="control-group">
        <label htmlFor="rate-slider">
          Speed: {rate.toFixed(1)}x
        </label>
        <input
          id="rate-slider"
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={rate}
          onChange={(e) => onRateChange(parseFloat(e.target.value))}
        />
      </div>

      <div className="control-group">
        <label htmlFor="pitch-slider">
          Pitch: {pitch.toFixed(1)}
        </label>
        <input
          id="pitch-slider"
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={pitch}
          onChange={(e) => onPitchChange(parseFloat(e.target.value))}
        />
      </div>

      <div className="control-group">
        <label htmlFor="volume-slider">
          Volume: {Math.round(volume * 100)}%
        </label>
        <input
          id="volume-slider"
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
        />
      </div>
    </div>
  );
};

export default ControlPanel;