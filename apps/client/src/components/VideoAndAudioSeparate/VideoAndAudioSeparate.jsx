import React, { useState, useRef } from 'react'
// import './VideoAndAudioSeparate.css'

function VideoAndAudioSeparate() {
  const videoRef = useRef(null)
  const videoStreamRef = useRef(null)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [error, setError] = useState('')

  const audioChunksRef = useRef([])
  const audioStreamRef = useRef(null)
  const audioRef = useRef(null)
  const mediaRecorderRef = useRef(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        // audio: true
      })
      
      videoStreamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      
      setIsCameraOn(true)
      setError('')
    } catch (error) {
      console.error('Error accessing camera:', error)
      setError('Error: Could not access camera/microphone')
    }
  }

  const stopCamera = () => {
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach(track => track.stop())
      videoStreamRef.current = null
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    
    setIsCameraOn(false)
  }

  const startAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioStreamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        audioRef.current.src = URL.createObjectURL(audioBlob)
      }

      mediaRecorder.start()
    } catch (error) {
      console.error('Error accessing microphone:', error)
      setError('Error: Could not access microphone')
    }
  }

  const stopAudio = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop())
      audioStreamRef.current = null
    }
  }

  return (
    <div>
      <div className="video-recorder">
        <div className="video-container">
          <video 
            ref={videoRef}
            autoPlay 
            muted 
            playsInline
            className="video-preview"
          />
        </div>
        
        <div className="controls">
          {!isCameraOn ? (
            <button 
              onClick={startCamera}
              className="record-btn"
            >
              Open Camera
            </button>
          ) : (
            <button 
              onClick={stopCamera}
              className="stop-btn"
            >
              Close Camera
            </button>
          )}
        </div>
        
        {error && <div className="error">{error}</div>}
      </div>
      <div className="audio-recorder">
        <div className="audio-container">
          <audio ref={audioRef} controls />
          <button onClick={startAudio} className="record-btn">
            Start Recording
          </button>
          <button onClick={stopAudio} className="stop-btn">
            Stop Recording
          </button>
        </div>
      </div>
    </div>
  )
}

export default VideoAndAudioSeparate
