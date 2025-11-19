#!/bin/bash

# VideoX-Ai Backend Services Stop Script

echo "🛑 Stopping VideoX-Ai Backend Services..."

# Function to stop service
stop_service() {
    local name=$1
    local pid_file="pids/$name.pid"

    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        echo "🛑 Stopping $name (PID: $pid)..."

        # Try graceful shutdown first
        kill $pid 2>/dev/null

        # Wait for graceful shutdown
        local count=0
        while kill -0 $pid 2>/dev/null; do
            if [ $count -ge 10 ]; then
                echo "   Force killing $name..."
                kill -9 $pid 2>/dev/null
                break
            fi
            sleep 1
            count=$((count + 1))
        done

        rm "$pid_file"
        echo "✅ $name stopped"
    else
        echo "⚠️ $name PID file not found"
    fi
}

# Stop all services
stop_service "gateway"
stop_service "ai-processor"

# Also clean up any remaining processes
echo "🧹 Cleaning up remaining processes..."
pkill -f "python main.py" 2>/dev/null
pkill -f "node server.js" 2>/dev/null

echo ""
echo "✅ All services stopped!"
echo ""
echo "📝 Logs are still available in logs/ directory"
echo "🚀 To start services again: ./start-backend.sh"