# VideoX-Ai Backend Services

This document explains the backend architecture for real AI video enhancement.

## Architecture Overview

VideoX-Ai uses a two-tier backend architecture:

1. **Node.js Gateway** (port 5000) - API gateway and file handling
2. **Python AI Service** (port 8000) - AI video processing with models

```
Frontend (Next.js) → Node.js Gateway → Python AI Service
```

## Services

### 1. Node.js Gateway (gateway/)

**Purpose:** API gateway between frontend and Python AI service

**Features:**
- File upload handling with validation
- Request forwarding to Python service
- Rate limiting and security
- Error handling and logging
- Health checks

**Endpoints:**
- `POST /api/upload` - Upload video and start enhancement
- `GET /api/status/:taskId` - Check processing status
- `GET /api/download/:taskId` - Download enhanced video
- `GET /health` - Health check

**Start:**
```bash
cd gateway
npm install
npm run dev
```

### 2. Python AI Service (ai-processor/)

**Purpose:** Core AI video enhancement processing

**Features:**
- Real-ESRGAN super resolution
- RIFE frame interpolation
- OpenCV denoising and enhancement
- Async task management
- Progress tracking
- GPU acceleration support

**AI Models Supported:**
- **Super Resolution**: Real-ESRGAN for 2x/4x upscaling
- **Frame Interpolation**: RIFE for smooth motion
- **Denoising**: OpenCV + AI-based denoising
- **Restoration**: Combined enhancement pipeline

**Endpoints:**
- `POST /process` - Start video enhancement
- `GET /status/:taskId` - Get real-time status
- `GET /download/:taskId` - Download processed video
- `GET /health` - Health check
- `GET /gpu-status` - GPU status

**Start:**
```bash
cd ai-processor
pip install -r requirements.txt
python main.py
```

## Setup Instructions

### Prerequisites

**For Python AI Service:**
- Python 3.9+
- CUDA Toolkit 11.0+ (for GPU acceleration)
- FFmpeg installed on system
- 8GB+ VRAM for 4K processing

**For Node.js Gateway:**
- Node.js 16+
- npm or yarn

### Installation

1. **Install Node.js Gateway dependencies:**
```bash
cd gateway
npm install
```

2. **Install Python AI Service dependencies:**
```bash
cd ai-processor
pip install -r requirements.txt
```

3. **Install FFmpeg (system-wide):**
```bash
# Ubuntu/Debian:
sudo apt update && sudo apt install ffmpeg

# macOS:
brew install ffmpeg

# Windows:
# Download from https://ffmpeg.org/download.html
```

### Configuration

**Environment Variables:**

**Gateway (.env):**
```env
PORT=5000
PYTHON_SERVICE_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
```

**AI Processor (.env):**
```env
HOST=0.0.0.0
PORT=8000
MAX_CONCURRENT_TASKS=2
TEMP_DIR=./temp
CUDA_VISIBLE_DEVICES=0
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

### Starting Services

**Method 1: Manual (Development)**
```bash
# Terminal 1: Start Python AI Service
cd ai-processor
python main.py

# Terminal 2: Start Node.js Gateway
cd gateway
npm run dev

# Terminal 3: Start Frontend (from root)
npm run dev
```

**Method 2: Using Scripts**
```bash
# From root directory
./start-backend.sh
```

## AI Enhancement Details

### Super Resolution
- **Model**: Real-ESRGAN with 4x upscaling
- **Input**: Any resolution up to 1080p
- **Output**: 720p → 4K, 1080p → 8K
- **Processing**: Frame-by-frame with temporal consistency

### Frame Interpolation
- **Model**: RIFE (Real-time Intermediate Flow Estimation)
- **Input**: 24-60 FPS videos
- **Output**: Double or triple FPS (up to 120 FPS)
- **Processing**: Motion-aware frame generation

### Denoising
- **Algorithm**: OpenCV Non-local Means + AI-based denoising
- **Input**: Videos with compression noise, low-light noise
- **Output**: Clean, artifact-free video
- **Processing**: Adaptive noise reduction preserving details

### Video Restoration
- **Combination**: Super resolution + denoising + color correction
- **Input**: Old/damaged videos
- **Output**: Restored quality with enhanced details
- **Processing**: Multi-stage enhancement pipeline

## Performance

**Processing Speed Estimates:**
- 1-minute 720p video: ~2-3 minutes processing time
- 1-minute 1080p video: ~4-6 minutes processing time
- 1-minute 4K video: ~10-15 minutes processing time

**Resource Requirements:**
- **GPU**: NVIDIA GTX 1070+ or RTX series with 8GB+ VRAM
- **RAM**: 16GB+ system memory
- **Storage**: 50GB+ free space for temp processing

## Monitoring

### Health Checks
```bash
# Gateway health
curl http://localhost:5000/health

# AI Service health
curl http://localhost:8000/health

# GPU status
curl http://localhost:8000/gpu-status
```

### Logs
- **Gateway**: `gateway/combined.log`
- **AI Service**: Console output (structured JSON)

## Troubleshooting

### Common Issues

1. **"GPU not available"**
   - Check CUDA installation: `nvidia-smi`
   - Verify PyTorch CUDA support
   - Update GPU drivers

2. **"ffmpeg not found"**
   - Install FFmpeg system-wide
   - Add FFmpeg to PATH

3. **"Out of memory"**
   - Reduce concurrent tasks in `.env`
   - Use smaller video files for testing
   - Monitor GPU memory usage

4. **"Connection refused"**
   - Ensure both services are running
   - Check port conflicts
   - Verify firewall settings

### Debug Mode

Enable debug logging:
```bash
# Gateway
DEBUG=1 npm run dev

# AI Service
LOG_LEVEL=debug python main.py
```

## Production Deployment

### Environment Setup
- Use GPU-enabled cloud instances (AWS P3, Google Cloud GPU)
- Configure proper load balancing
- Set up monitoring and logging
- Configure auto-scaling for gateway service

### Security
- Enable HTTPS for all services
- Configure proper authentication
- Set up IP-based rate limiting
- Enable file validation and scanning

### Monitoring
- Set up health check monitoring
- Monitor GPU usage and temperature
- Track processing queue length
- Set up alerting for failures

## API Documentation

### Gateway API Documentation

See [gateway/API.md](gateway/API.md) for detailed API documentation.

### AI Service API Documentation

See [ai-processor/API.md](ai-processor/API.md) for detailed API documentation.