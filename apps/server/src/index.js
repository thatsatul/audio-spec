const express = require('express')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now()
    const originalName = file.originalname || 'recording'
    const extension = path.extname(originalName) || '.webm'
    cb(null, `audio_${timestamp}${extension}`)
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept audio files
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true)
    } else {
      cb(new Error('Only audio files are allowed'), false)
    }
  }
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Audio Upload Server'
  })
})

// Upload audio endpoint
app.post('/api/upload-audio', upload.single('audio'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' })
    }

    const fileInfo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadedAt: new Date().toISOString()
    }

    console.log('Audio file uploaded:', fileInfo)

    res.json({
      message: 'Audio file uploaded successfully',
      filename: req.file.filename,
      size: req.file.size,
      uploadedAt: fileInfo.uploadedAt
    })
  } catch (error) {
    console.error('Error uploading audio:', error)
    res.status(500).json({ error: 'Failed to upload audio file' })
  }
})

// Get uploaded files list
app.get('/api/audio-files', (req, res) => {
  try {
    const uploadDir = path.join(__dirname, '../uploads')
    if (!fs.existsSync(uploadDir)) {
      return res.json({ files: [] })
    }

    const files = fs.readdirSync(uploadDir)
      .filter(file => file.match(/\.(webm|mp3|wav|ogg|m4a)$/i))
      .map(file => {
        const filePath = path.join(uploadDir, file)
        const stats = fs.statSync(filePath)
        return {
          filename: file,
          size: stats.size,
          uploadedAt: stats.mtime.toISOString()
        }
      })
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))

    res.json({ files })
  } catch (error) {
    console.error('Error getting audio files:', error)
    res.status(500).json({ error: 'Failed to get audio files' })
  }
})

// Download audio file
app.get('/api/audio-files/:filename', (req, res) => {
  try {
    const filename = req.params.filename
    const filePath = path.join(__dirname, '../uploads', filename)
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' })
    }

    res.download(filePath)
  } catch (error) {
    console.error('Error downloading audio file:', error)
    res.status(500).json({ error: 'Failed to download audio file' })
  }
})

// Delete audio file
app.delete('/api/audio-files/:filename', (req, res) => {
  try {
    const filename = req.params.filename
    const filePath = path.join(__dirname, '../uploads', filename)
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' })
    }

    fs.unlinkSync(filePath)
    console.log('Audio file deleted:', filename)

    res.json({ message: 'Audio file deleted successfully' })
  } catch (error) {
    console.error('Error deleting audio file:', error)
    res.status(500).json({ error: 'Failed to delete audio file' })
  }
})

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 50MB.' })
    }
  }
  
  console.error('Server error:', error)
  res.status(500).json({ error: 'Internal server error' })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Audio upload server running on port ${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/health`)
  console.log(`Upload endpoint: http://localhost:${PORT}/api/upload-audio`)
  console.log(`Files endpoint: http://localhost:${PORT}/api/audio-files`)
}) 