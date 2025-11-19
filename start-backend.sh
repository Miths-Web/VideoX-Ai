#!/bin/bash

# VideoX-Ai Backend Services Startup Script

echo "🚀 Starting VideoX-Ai Backend Services..."

# Function to check if service is running
check_service() {
    local url=$1
    local name=$2
    local max_attempts=30
    local attempt=1

    echo "⏳ Checking $name..."
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            echo "✅ $name is ready!"
            return 0
        fi
        echo "   Attempt $attempt/$max_attempts..."
        sleep 2
        attempt=$((attempt + 1))
    done

    echo "❌ $name failed to start"
    return 1
}

# Function to start service in background
start_service() {
    local dir=$1
    local command=$2
    local name=$3

    echo "🔧 Starting $name..."
    cd "$dir"
    $command > ../logs/$name.log 2>&1 &
    local pid=$!
    echo $pid > ../pids/$name.pid
    echo "   PID: $pid"
    cd - > /dev/null
}

# Create necessary directories
mkdir -p logs pids

# Check if FFmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ FFmpeg not found. Please install FFmpeg first:"
    echo "   Ubuntu/Debian: sudo apt install ffmpeg"
    echo "   macOS: brew install ffmpeg"
    echo "   Windows: Download from https://ffmpeg.org/download.html"
    exit 1
fi

# Check if Python dependencies are installed
echo "🔍 Checking Python dependencies..."
cd ai-processor
if ! python -c "import fastapi, torch, cv2" &> /dev/null; then
    echo "⬇️ Installing Python dependencies..."
    pip install -r requirements.txt
fi
cd - > /dev/null

# Check if Node.js dependencies are installed
echo "🔍 Checking Node.js dependencies..."
cd gateway
if [ ! -d "node_modules" ]; then
    echo "⬇️ Installing Node.js dependencies..."
    npm install
fi
cd - > /dev/null

# Stop any existing services
echo "🛑 Stopping existing services..."
if [ -f "pids/ai-processor.pid" ]; then
    kill $(cat pids/ai-processor.pid) 2>/dev/null
    rm pids/ai-processor.pid
fi

if [ -f "pids/gateway.pid" ]; then
    kill $(cat pids/gateway.pid) 2>/dev/null
    rm pids/gateway.pid
fi

# Wait for services to stop
sleep 2

# Start Python AI Service
start_service "ai-processor" "python main.py" "ai-processor"

# Wait for AI service to be ready
sleep 5
check_service "http://localhost:8000/health" "AI Service"

if [ $? -ne 0 ]; then
    echo "❌ AI Service failed to start. Check logs/ai-processor.log"
    exit 1
fi

# Start Node.js Gateway
start_service "gateway" "npm run dev" "gateway"

# Wait for Gateway to be ready
sleep 5
check_service "http://localhost:5000/health" "Gateway Service"

if [ $? -ne 0 ]; then
    echo "❌ Gateway Service failed to start. Check logs/gateway.log"
    exit 1
fi

echo ""
echo "🎉 All services are running!"
echo ""
echo "📍 Service URLs:"
echo "   Frontend:     http://localhost:3000"
echo "   Gateway API:  http://localhost:5000"
echo "   AI Service:   http://localhost:8000"
echo ""
echo "📊 Monitoring:"
echo "   Health Check: http://localhost:5000/health"
echo "   GPU Status:   http://localhost:8000/gpu-status"
echo ""
echo "📝 Logs:"
echo "   Gateway:      logs/gateway.log"
echo "   AI Service:   logs/ai-processor.log"
echo ""
echo "🛑 To stop services: ./stop-backend.sh"
echo ""
echo "🚀 Ready to enhance some videos!"