import React, { useState, useRef } from 'react'
import AudioRecorder from './components/AudioRecorder'
import VideoAndAudioSeparate from './components/VideoAndAudioSeparate/VideoAndAudioSeparate'

function App() {
  const [currentRoute, setCurrentRoute] = useState('home')

  const renderContent = () => {
    switch (currentRoute) {
      case 'audiorecorder':
        return <AudioRecorder />;
      case 'videoandaudios':
        return <VideoAndAudioSeparate />;
      default:
        return (
          <div className="home-content">
            <h1>Welcome to Audio Recorder App</h1>
            <p>Click the button below to start recording audio</p>
          </div>
        )
    }
  }

  return (
    <div className="App">
      <header className="app-header">
        <nav>
          <button 
            onClick={() => setCurrentRoute('home')}
            className={`nav-btn ${currentRoute === 'home' ? 'active' : ''}`}
          >
            Home
          </button>
          <button 
            onClick={() => setCurrentRoute('audiorecorder')}
            className={`nav-btn ${currentRoute === 'audiorecorder' ? 'active' : ''}`}
          >
            Audio Recorder
          </button>
          <button 
            onClick={() => setCurrentRoute('videoandaudios')}
            className={`nav-btn ${currentRoute === 'videoandaudios' ? 'active' : ''}`}
          >
            Video and Audio
          </button>
        </nav>
      </header>
      <main>
        {renderContent()}
      </main>
    </div>
  )
}

export default App 