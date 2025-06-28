# Audio Assets Directory

This directory contains audio files for streaming.

## Adding Audio Files

1. Place your audio file in this directory
2. Rename it to `sample-audio.mp3` or update the path in `src/index.js`
3. Supported formats: MP3, WAV, M4A, etc.

## Example Audio Files

You can download sample audio files from:
- [Freesound](https://freesound.org/)
- [Zapsplat](https://www.zapsplat.com/)
- [AudioJungle](https://audiojungle.net/)

## File Size Considerations

- Larger files will take longer to stream
- Consider using compressed formats (MP3) for better performance
- The server streams in 64KB chunks by default

## Current Setup

If no audio file is present, the server will create a placeholder file automatically. 