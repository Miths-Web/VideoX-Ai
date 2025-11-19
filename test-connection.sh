#!/bin/bash

echo "🧪 VideoX-Ai Frontend-Backend Connection Test"
echo "=============================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test Results
PASSED=0
FAILED=0

# Function to test endpoint
test_endpoint() {
    local name="$1"
    local url="$2"
    local expected_status="$3"

    echo -n "Testing $name... "

    response=$(curl -s -w "%{http_code}" "$url" 2>/dev/null)
    http_code="${response: -3}"
    response_body="${response%???}"

    if [ "$http_code" = "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS${NC} (HTTP $http_code)"
        PASSED=$((PASSED + 1))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC} (HTTP $http_code, expected $expected_status)"
        FAILED=$((FAILED + 1))
        return 1
    fi
}

echo ""
echo "🔧 Checking if services are running..."

# Check if services are running
if ! curl -s http://localhost:5000/health > /dev/null; then
    echo -e "${RED}❌ Gateway not running on port 5000${NC}"
    echo "Start backend with: ./start-backend.sh"
    exit 1
fi

if ! curl -s http://localhost:8000/health > /dev/null; then
    echo -e "${RED}❌ AI Service not running on port 8000${NC}"
    echo "Start backend with: ./start-backend.sh"
    exit 1
fi

echo -e "${GREEN}✅ Both services are running!${NC}"

echo ""
echo "🧪 Running Connection Tests..."

# Test Gateway Health
test_endpoint "Gateway Health" "http://localhost:5000/health" "200"

# Test AI Service Health
test_endpoint "AI Service Health" "http://localhost:8000/health" "200"

# Test Status Endpoint (should return 404 for non-existent task)
test_endpoint "Status Endpoint" "http://localhost:5000/api/status/test123" "404"

# Test Download Endpoint (should return 404 for non-existent file)
test_endpoint "Download Endpoint" "http://localhost:5000/api/download/test.mp4" "404"

# Test Upload Validation (with invalid file)
echo -n "Testing Upload Validation... "
upload_response=$(curl -s -w "%{http_code}" -X POST http://localhost:5000/api/upload \
  -F "video=@/dev/null" \
  -F "enhancement_type=super_resolution" 2>/dev/null)

upload_status="${upload_response: -3}"
if [ "$upload_status" = "400" ]; then
    echo -e "${GREEN}✅ PASS${NC} (Correctly rejected invalid file)"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC} (HTTP $upload_status)"
    FAILED=$((FAILED + 1))
fi

# Test Gateway Root Endpoint
test_endpoint "Gateway Root" "http://localhost:5000/" "200"

# Test AI Service Root Endpoint
test_endpoint "AI Service Root" "http://localhost:8000/" "200"

echo ""
echo "📊 Connection Test Results"
echo "========================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo -e "Total: $((PASSED + FAILED))"

if [ $FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 All Connection Tests Passed!${NC}"
    echo ""
    echo -e "${YELLOW}✅ Frontend-Backend Connection is WORKING!${NC}"
    echo ""
    echo "🚀 Next Steps:"
    echo "1. Start frontend: npm run dev"
    echo "2. Open browser: http://localhost:3000"
    echo "3. Test video upload flow"
    echo ""
    echo "📱 The frontend can now communicate with the backend!"
    exit 0
else
    echo ""
    echo -e "${RED}❌ Some Connection Tests Failed${NC}"
    echo ""
    echo "🔧 Troubleshooting:"
    echo "1. Check if both services are running"
    echo "2. Verify ports 5000 and 8000 are available"
    echo "3. Check service logs for errors"
    exit 1
fi