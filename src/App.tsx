import React, { useState } from 'react';
import './App.css';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import TextInput from './components/TextInput';
import PlaybackControls from './components/PlaybackControls';
import ControlPanel from './components/ControlPanel';

function App() {
  const [text, setText] = useState('');
  const {
    speak,
    cancel,
    pause,
    resume,
    speaking,
    paused,
    supported,
    voices,
    voice,
    setVoice,
    rate,
    setRate,
    pitch,
    setPitch,
    volume,
    setVolume,
  } = useSpeechSynthesis();

  const handleSpeak = () => {
    speak(text);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Text to Speech Converter</h1>
        <p>Convert any text to natural-sounding speech using your browser's built-in speech synthesis.</p>
      </header>
      
      <main className="App-main">
        <div className="container">
          <TextInput
            value={text}
            onChange={setText}
            disabled={speaking && !paused}
          />
          
          <PlaybackControls
            onSpeak={handleSpeak}
            onPause={pause}
            onResume={resume}
            onStop={cancel}
            speaking={speaking}
            paused={paused}
            supported={supported}
            text={text}
          />
          
          {supported && voices.length > 0 && (
            <ControlPanel
              voices={voices}
              selectedVoice={voice}
              onVoiceChange={setVoice}
              rate={rate}
              onRateChange={setRate}
              pitch={pitch}
              onPitchChange={setPitch}
              volume={volume}
              onVolumeChange={setVolume}
            />
          )}
        </div>
      </main>
      
      <footer className="App-footer">
        <p>Built with React and Web Speech API</p>
      </footer>
    </div>
  );
}

export default App;
