// Shared constants and utilities for audio streaming

const AUDIO_CONFIG = {
  CHUNK_SIZE: 64 * 1024, // 64KB chunks
  SAMPLE_RATE: 44100,
  CHANNELS: 2,
  BIT_DEPTH: 16
}

const SOCKET_EVENTS = {
  START_STREAM: 'startStream',
  STOP_STREAM: 'stopStream',
  AUDIO_CHUNK: 'audioChunk',
  STREAM_END: 'streamEnd',
  STREAM_ERROR: 'streamError',
  STREAM_STOPPED: 'streamStopped'
}

const SERVER_CONFIG = {
  PORT: process.env.PORT || 3001,
  CLIENT_URL: 'http://localhost:3002'
}

// Utility function to format bytes
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

// Utility function to calculate audio duration from file size
function calculateAudioDuration(fileSizeBytes, bitRate = 128000) {
  // bitRate is in bits per second
  const durationSeconds = (fileSizeBytes * 8) / bitRate
  const minutes = Math.floor(durationSeconds / 60)
  const seconds = Math.floor(durationSeconds % 60)
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

module.exports = {
  AUDIO_CONFIG,
  SOCKET_EVENTS,
  SERVER_CONFIG,
  formatBytes,
  calculateAudioDuration
} 