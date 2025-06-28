# Audio Recorder Turbo Repo

A Turbo repo setup for browser-based audio recording and server-side storage. This project consists of a React client for audio recording and a Node.js server for audio file uploads and management.

## Project Structure

```
audio-stream-turbo/
├── apps/
│   ├── client/          # React client for audio recording
│   └── server/          # Node.js server for audio uploads
├── packages/
│   └── shared/          # Shared utilities and constants
├── package.json         # Root package.json with workspace config
└── turbo.json          # Turbo build configuration
```

## Features

- **Browser Audio Recording**: Record audio directly in the browser using MediaRecorder API
- **Modern React Client**: Beautiful UI with real-time recording status
- **Node.js Server**: REST API for audio file uploads and management
- **Turbo Repo**: Monorepo setup for easy development and deployment
- **File Management**: Upload, download, and delete audio files
- **Multiple Audio Formats**: Support for WebM, MP3, WAV, OGG, M4A

## Prerequisites

- Node.js 18+ 
- npm 8+
- Modern browser with MediaRecorder API support

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development servers**:
   ```bash
   npm run dev
   ```

   This will start both the client (port 3002) and server (port 3001) in development mode.

3. **Record Audio**:
   - Open http://localhost:3002 in your browser
   - Click "Start Recording" to begin recording audio
   - Click "Stop Recording" when finished
   - Play back your recording or upload it to the server

## Development

### Client (React App)

- **Port**: 3002
- **URL**: http://localhost:3002
- **Features**:
  - Real-time audio recording with MediaRecorder API
  - Audio playback before upload
  - File upload to server via REST API
  - Modern, responsive UI with recording status

### Server (Node.js)

- **Port**: 3001
- **Features**:
  - REST API for audio file uploads
  - File management (list, download, delete)
  - Multer middleware for file handling
  - CORS support for client communication
  - Automatic upload directory creation

### Available Scripts

```bash
# Development
npm run dev          # Start all apps in development mode

# Build
npm run build        # Build all apps

# Linting
npm run lint         # Lint all apps

# Clean
npm run clean        # Clean all build artifacts

# Format
npm run format       # Format code with Prettier
```

## API Endpoints

### Server Endpoints

- `GET /health` - Health check
- `POST /api/upload-audio` - Upload audio file (multipart/form-data)
- `GET /api/audio-files` - List all uploaded audio files
- `GET /api/audio-files/:filename` - Download specific audio file
- `DELETE /api/audio-files/:filename` - Delete specific audio file

### File Upload

Audio files are uploaded using `multipart/form-data` with the field name `audio`. Supported formats:
- WebM (recommended for browser recording)
- MP3
- WAV
- OGG
- M4A

Maximum file size: 50MB

## Configuration

### Upload Directory

By default, uploaded files are stored in `apps/server/uploads/`. The directory is created automatically if it doesn't exist.

### Port Configuration

- Client: 3002 (configurable in `apps/client/vite.config.js`)
- Server: 3001 (configurable via `PORT` environment variable)

## Troubleshooting

### Common Issues

1. **Microphone access denied**: 
   - Check browser permissions for microphone access
   - Ensure you're using HTTPS in production (required for getUserMedia)
   - Try refreshing the page and granting permissions

2. **Recording not working**:
   - Check browser console for errors
   - Ensure your browser supports MediaRecorder API
   - Verify microphone is connected and working

3. **Upload issues**:
   - Check if server is running on port 3001
   - Verify CORS settings in server configuration
   - Check file size (max 50MB)
   - Ensure file format is supported

4. **Browser Compatibility**:
   - Chrome/Edge: Full support
   - Firefox: Full support
   - Safari: Limited support (may need different MIME type)

### Debug Mode

Enable debug logging by setting environment variables:

```bash
DEBUG=* npm run dev
```

## Production Deployment

1. **Build the applications**:
   ```bash
   npm run build
   ```

2. **Start production servers**:
   ```bash
   # Start server
   cd apps/server && npm start
   
   # Serve client (use a static file server)
   cd apps/client && npm run preview
   ```

3. **HTTPS Requirement**:
   - MediaRecorder API requires HTTPS in production
   - Set up SSL certificates for your domain
   - Update CORS settings to match your domain

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details. 