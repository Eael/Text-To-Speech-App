import React, { useState, useRef } from 'react';
import { Play, Pause, Download, Volume2, FileText, Mic } from 'lucide-react';
import './App.css';

const TextToSpeechApp = () => {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [voice, setVoice] = useState('Joanna');
  const [speed, setSpeed] = useState('medium');
  const [history, setHistory] = useState([]);
  const audioRef = useRef(null);

  const API_ENDPOINT = 'https://a38bwo4dv5.execute-api.us-east-1.amazonaws.com/dev/convert';

  const voices = [
    { id: 'Joanna', name: 'Joanna (US Female)' },
    { id: 'Matthew', name: 'Matthew (US Male)' },
    { id: 'Amy', name: 'Amy (UK Female)' },
    { id: 'Brian', name: 'Brian (UK Male)' },
    { id: 'Emma', name: 'Emma (UK Female)' },
    { id: 'Joey', name: 'Joey (US Male)' }
  ];

  const speeds = [
    { id: 'x-slow', name: 'Extra Slow' },
    { id: 'slow', name: 'Slow' },
    { id: 'medium', name: 'Medium' },
    { id: 'fast', name: 'Fast' },
    { id: 'x-fast', name: 'Extra Fast' }
  ];
        
  const handleConvert = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          voice,
          speed
        })
      });

      if (!response.ok) throw new Error('Conversion failed');

      const data = await response.json();
      const payload = data.body;
      console.log("API Response:", payload);

      if (payload.audioUrl) {
        setAudioUrl(payload.audioUrl);
      } else {
        alert("No audioUrl returned from API");
      }
      
      const newEntry = {
        id: Date.now(),
        text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        audioUrl: payload.audioUrl,
        voice: payload.voice,
        speed: payload.speed,
        timestamp: new Date().toLocaleString()
      };
      setHistory(prev => [newEntry, ...prev.slice(0, 9)]);

    } catch (error) {
      alert('Error converting text to speech: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleDownload = () => {
    if (audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `tts-audio-${Date.now()}.mp3`;
      a.click();
    }
  };

  const loadSampleText = () => {
    setText(`Welcome to our Text-to-Speech application! This is a sample text that demonstrates how you can convert written content into natural-sounding speech. 

You can use this application to:
- Convert blog posts into audio for listening while commuting
- Transform articles into podcasts for multitasking
- Create audio versions of books or documents for accessibility
- Generate voice content for presentations or videos

Simply paste your text, choose your preferred voice and speed, then click convert. The application uses AWS Polly to generate high-quality, natural-sounding speech that you can play directly in your browser or download for offline use.`);
  };



  return (
    <div className="container">
      <div className="wrapper">
        <div className="header">
          <div className="header-title">
            <Volume2 size={32} color="#4f46e5" />
            <h1 className="title">Text to Speech</h1>
          </div>
          <p className="subtitle">Convert your text into natural-sounding audio using AWS Polly</p>
        </div>

        {/* <div className="grid"> */}
          <div className="main-section">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Enter Text</h2>
                <button
                  onClick={loadSampleText}
                  className="sample-button"
                >
                  <FileText size={16} />
                  Load Sample
                </button>
              </div>
              
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your text here... (blog posts, articles, books, etc.)"
                className="textarea"
                maxLength={5000}
              />
              
              <div className="char-count">
                <span className="char-text">{text.length}/5000 characters</span>
              </div>

              <div className="settings-grid">
                <div>
                  <label className="label">Voice</label>
                  <select
                    value={voice}
                    onChange={(e) => setVoice(e.target.value)}
                    className="select"
                  >
                    {voices.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="label">Speed</label>
                  <select
                    value={speed}
                    onChange={(e) => setSpeed(e.target.value)}
                    className="select"
                  >
                    {speeds.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleConvert}
                disabled={isLoading || !text.trim()}
                className={`convert-button ${isLoading || !text.trim() ? 'disabled' : ''}`}
              >
                {isLoading ? (
                  <div className="spinner"></div>
                ) : (
                  <Mic size={20} />
                )}
                {isLoading ? 'Converting...' : 'Convert to Speech'}
              </button>
            </div>
          {/* </div> */}

          <div className="side-column">
            {audioUrl && (
              <div className="card">
                <h3 className="card-title">Audio Player</h3>
                
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  className="audio-player"
                  controls
                />

                <div className="button-group">
                  <button
                    onClick={togglePlayback}
                    className="play-button"
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </button>
                  
                  <button
                    onClick={handleDownload}
                    className="download-button"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>
            )}

            {history.length > 0 && (
              <div className="card">
                <h3 className="card-title">Recent Conversions</h3>
                
                <div className="history-container">
                  {history.map(item => (
                    <div key={item.id} className="history-item">
                      <p className="history-text">{item.text}</p>
                      <div className="history-meta">
                        <span className="history-info">{item.voice} • {item.timestamp}</span>
                        <button
                          onClick={() => setAudioUrl(item.audioUrl)}
                          className="history-button"
                        >
                          Load
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="card">
              <h3 className="card-title">Usage Tips</h3>
              <ul className="tips-list">
                <li className="tips-item">• Perfect for converting blog posts to audio</li>
                <li className="tips-item">• Great for listening while driving or exercising</li>
                <li className="tips-item">• Supports up to 5,000 characters per conversion</li>
                <li className="tips-item">• Choose different voices for variety</li>
                <li className="tips-item">• Download audio files for offline use</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextToSpeechApp;