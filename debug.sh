#!/bin/bash

echo "🔍 VideoX-Ai Debug Script"
echo "======================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "📋 System Information"
echo "-------------------"
echo "Node.js: $(node --version 2>/dev/null || echo 'Not installed')"
echo "Python: $(python --version 2>/dev/null || echo 'Not installed')"
echo "npm: $(npm --version 2>/dev/null || echo 'Not installed')"
echo "FFmpeg: $(ffmpeg -version 2>/dev/null | head -1 || echo 'Not installed')"

echo ""
echo "📁 Directory Structure"
echo "--------------------"
echo "VideoX-Ai structure:"
ls -la /workspace/cmi5dd0m501adpsilfibqqu43/VideoX-Ai/ | grep -E "(gateway|ai-processor|components|app)" || echo "Structure check failed"

echo ""
echo "🔧 Frontend Dependencies"
echo "-----------------------"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓ Node modules exist${NC}"
    echo "Key dependencies check:"
    [ -d "node_modules/next" ] && echo -e "  ${GREEN}✓ Next.js${NC}" || echo -e "  ${RED}✗ Next.js missing${NC}"
    [ -d "node_modules/react" ] && echo -e "  ${GREEN}✓ React${NC}" || echo -e "  ${RED}✗ React missing${NC}"
    [ -d "node_modules/framer-motion" ] && echo -e "  ${GREEN}✓ Framer Motion${NC}" || echo -e "  ${RED}✗ Framer Motion missing${NC}"
    [ -d "node_modules/firebase" ] && echo -e "  ${GREEN}✓ Firebase${NC}" || echo -e "  ${RED}✗ Firebase missing${NC}"
else
    echo -e "${RED}✗ Node modules not found${NC}"
    echo -e "${YELLOW}→ Run: npm install${NC}"
fi

echo ""
echo "🏗️  Backend Services"
echo "------------------"

echo "Node.js Gateway:"
if [ -d "gateway" ]; then
    [ -f "gateway/package.json" ] && echo -e "  ${GREEN}✓ package.json exists${NC}" || echo -e "  ${RED}✗ package.json missing${NC}"
    [ -f "gateway/server.js" ] && echo -e "  ${GREEN}✓ server.js exists${NC}" || echo -e "  ${RED}✗ server.js missing${NC}"
    [ -d "gateway/node_modules" ] && echo -e "  ${GREEN}✓ Dependencies installed${NC}" || echo -e "  ${RED}✗ Dependencies missing${NC}"
    node -c gateway/server.js 2>/dev/null && echo -e "  ${GREEN}✓ Syntax valid${NC}" || echo -e "  ${RED}✗ Syntax error${NC}"
else
    echo -e "${RED}✗ Gateway directory not found${NC}"
fi

echo ""
echo "Python AI Service:"
if [ -d "ai-processor" ]; then
    [ -f "ai-processor/main.py" ] && echo -e "  ${GREEN}✓ main.py exists${NC}" || echo -e "  ${RED}✗ main.py missing${NC}"
    [ -f "ai-processor/requirements.txt" ] && echo -e "  ${GREEN}✓ requirements.txt exists${NC}" || echo -e "  ${RED}✗ requirements.txt missing${NC}"
    [ -d "ai-processor/services" ] && echo -e "  ${GREEN}✓ Services directory exists${NC}" || echo -e "  ${RED}✗ Services directory missing${NC}"

    # Check Python syntax
    python -m py_compile ai-processor/main.py 2>/dev/null && echo -e "  ${GREEN}✓ Python syntax valid${NC}" || echo -e "  ${RED}✗ Python syntax error${NC}"

    # Check key Python dependencies
    echo "  Python dependencies check:"
    python -c "import fastapi" 2>/dev/null && echo -e "    ${GREEN}✓ FastAPI${NC}" || echo -e "    ${RED}✗ FastAPI${NC}"
    python -c "import uvicorn" 2>/dev/null && echo -e "    ${GREEN}✓ Uvicorn${NC}" || echo -e "    ${RED}✗ Uvicorn${NC}"
    python -c "import torch" 2>/dev/null && echo -e "    ${GREEN}✓ PyTorch${NC}" || echo -e "    ${YELLOW}⚠ PyTorch${NC}"
    python -c "import cv2" 2>/dev/null && echo -e "    ${GREEN}✓ OpenCV${NC}" || echo -e "    ${RED}✗ OpenCV${NC}"
else
    echo -e "${RED}✗ AI Processor directory not found${NC}"
fi

echo ""
echo "⚙️  Configuration Files"
echo "---------------------"
[ -f ".env.local" ] && echo -e "${GREEN}✓ .env.local exists${NC}" || echo -e "${RED}✗ .env.local missing${NC}"
[ -f "gateway/.env" ] && echo -e "${GREEN}✓ Gateway .env exists${NC}" || echo -e "${RED}✗ Gateway .env missing${NC}"
[ -f "ai-processor/.env" ] && echo -e "${GREEN}✓ AI Processor .env exists${NC}" || echo -e "${RED}✗ AI Processor .env missing${NC}"

echo ""
echo "🧪 Port Availability Check"
echo "-------------------------"
echo "Checking if ports are available:"
lsof -i :3000 2>/dev/null && echo -e "  ${RED}✗ Port 3000 (Frontend) in use${NC}" || echo -e "  ${GREEN}✓ Port 3000 (Frontend) available${NC}"
lsof -i :5000 2>/dev/null && echo -e "  ${RED}✗ Port 5000 (Gateway) in use${NC}" || echo -e "  ${GREEN}✓ Port 5000 (Gateway) available${NC}"
lsof -i :8000 2>/dev/null && echo -e "  ${RED}✗ Port 8000 (AI Service) in use${NC}" || echo -e "  ${GREEN}✓ Port 8000 (AI Service) available${NC}"

echo ""
echo "🔍 Frontend Component Check"
echo "--------------------------"
if [ -d "components/ui" ]; then
    echo "UI Components found:"
    ls components/ui/ | while read component; do
        echo -e "  ${GREEN}✓ $component${NC}"
    done

    # Check for Badge component specifically
    [ -f "components/ui/badge.tsx" ] && echo -e "  ${GREEN}✓ Badge component exists${NC}" || echo -e "  ${RED}✗ Badge component missing${NC}"
else
    echo -e "${RED}✗ UI components directory not found${NC}"
fi

echo ""
echo "🚀 Quick Start Commands"
echo "-----------------------"
echo "If everything looks good, you can start the services:"
echo ""
echo "1. Install frontend dependencies:"
echo "   ${YELLOW}npm install${NC}"
echo ""
echo "2. Start all services:"
echo "   ${YELLOW}./start-backend.sh${NC}"
echo ""
echo "3. Or start individually:"
echo "   ${YELLOW}# Terminal 1: Frontend${NC}"
echo "   ${YELLOW}npm run dev${NC}"
echo ""
echo "   ${YELLOW}# Terminal 2: Gateway${NC}"
echo "   ${YELLOW}cd gateway && npm run dev${NC}"
echo ""
echo "   ${YELLOW}# Terminal 3: AI Service${NC}"
echo "   ${YELLOW}cd ai-processor && python main.py${NC}"

echo ""
echo "🐛 Common Issues & Solutions"
echo "---------------------------"
echo -e "${YELLOW}• If frontend won't start:${NC} Run 'npm install' to install dependencies"
echo -e "${YELLOW}• If Badge component missing: Check that badge.tsx exists in components/ui/"
echo -e "${YELLOW}• If gateway fails: Check gateway/.env configuration"
echo -e "${YELLOW}• If AI service fails: Install Python dependencies with pip install -r ai-processor/requirements.txt"
echo -e "${YELLOW}• If FFmpeg missing: Install with 'sudo apt install ffmpeg' (Ubuntu) or 'brew install ffmpeg' (macOS)"

echo ""
echo "✨ Debug script complete!"