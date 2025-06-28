import React, { useState, useRef } from 'react'
import './App.css'

function App() {
  const [isRecording, setIsRecording] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [recordedAudio, setRecordedAudio] = useState(null)
  const [uploadStatus, setUploadStatus] = useState('')
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        setRecordedAudio(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setUploadStatus('')
    } catch (error) {
      console.error('Error starting recording:', error)
      setUploadStatus('Error: Could not access microphone')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const uploadAudio = async () => {
    if (!recordedAudio) {
      setUploadStatus('No audio recorded to upload')
      return
    }

    setIsUploading(true)
    setUploadStatus('Uploading...')

    try {
      const formData = new FormData()
      formData.append('audio', recordedAudio, 'recording.webm')

      const response = await fetch('http://localhost:3001/api/upload-audio', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        setUploadStatus(`Upload successful! File saved as: ${result.filename}`)
        setRecordedAudio(null) // Clear the recorded audio after successful upload
      } else {
        const error = await response.text()
        setUploadStatus(`Upload failed: ${error}`)
      }
    } catch (error) {
      console.error('Error uploading audio:', error)
      setUploadStatus('Upload failed: Network error')
    } finally {
      setIsUploading(false)
    }
  }

  const playRecording = () => {
    if (recordedAudio) {
      const audioUrl = URL.createObjectURL(recordedAudio)
      const audio = new Audio(audioUrl)
      audio.play()
    }
  }

  const clearRecording = () => {
    setRecordedAudio(null)
    setUploadStatus('')
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Audio Recorder</h1>
        <div className="status">
          <span className={`status-indicator ${isRecording ? 'recording' : 'idle'}`}>
            {isRecording ? 'Recording...' : 'Ready'}
          </span>
        </div>
      </header>

      <main className="app-main">
        <div className="controls">
          <button 
            onClick={startRecording}
            disabled={isRecording}
            className="control-btn record-btn"
          >
            Start Recording
          </button>
          <button 
            onClick={stopRecording}
            disabled={!isRecording}
            className="control-btn stop-btn"
          >
            Stop Recording
          </button>
        </div>

        {recordedAudio && (
          <div className="recording-controls">
            <button 
              onClick={playRecording}
              className="control-btn play-btn"
            >
              Play Recording
            </button>
            <button 
              onClick={uploadAudio}
              disabled={isUploading}
              className="control-btn upload-btn"
            >
              {isUploading ? 'Uploading...' : 'Upload to Server'}
            </button>
            <button 
              onClick={clearRecording}
              className="control-btn clear-btn"
            >
              Clear Recording
            </button>
          </div>
        )}

        <div className="info">
          <p>Status: {isRecording ? 'Recording' : recordedAudio ? 'Recording Complete' : 'No Recording'}</p>
          {recordedAudio && (
            <p>Recording size: {(recordedAudio.size / 1024).toFixed(2)} KB</p>
          )}
          {uploadStatus && (
            <p className="upload-status">{uploadStatus}</p>
          )}
        </div>
      </main>
    </div>
  )
}

export default App 