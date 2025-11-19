#!/bin/bash

echo "🧪 VideoX-Ai System Test"
echo "======================="

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Test Results
PASSED=0
FAILED=0

# Function to report test result
test_result() {
    local test_name="$1"
    local result="$2"
    local details="$3"

    if [ "$result" = "PASS" ]; then
        echo -e "  ${GREEN}✓ PASS${NC} $test_name"
        PASSED=$((PASSED + 1))
    else
        echo -e "  ${RED}✗ FAIL${NC} $test_name"
        [ -n "$details" ] && echo -e "    ${YELLOW}→ $details${NC}"
        FAILED=$((FAILED + 1))
    fi
}

echo ""
echo "🔧 Frontend Tests"
echo "----------------"

# Test 1: Node.js and npm
if command -v node >/dev/null 2>&1 && [ -f "package.json" ]; then
    test_result "Node.js Environment" "PASS"
else
    test_result "Node.js Environment" "FAIL" "Node.js or package.json not found"
fi

# Test 2: Next.js available
if npm list next >/dev/null 2>&1 || [ -d "node_modules/next" ]; then
    test_result "Next.js Installed" "PASS"
else
    test_result "Next.js Installed" "FAIL" "Run: npm install"
fi

# Test 3: UI Components
if [ -f "components/ui/badge.tsx" ] && [ -f "components/ui/button.tsx" ]; then
    test_result "UI Components" "PASS"
else
    test_result "UI Components" "FAIL" "Missing UI components"
fi

# Test 4: Environment file
if [ -f ".env.local" ]; then
    test_result "Frontend Environment" "PASS"
else
    test_result "Frontend Environment" "FAIL" "Missing .env.local"
fi

echo ""
echo "🏗️  Backend Gateway Tests"
echo "------------------------"

# Test 5: Gateway package.json
if [ -f "gateway/package.json" ]; then
    test_result "Gateway Configuration" "PASS"
else
    test_result "Gateway Configuration" "FAIL" "Missing gateway/package.json"
fi

# Test 6: Gateway syntax
if node -c gateway/server.js 2>/dev/null; then
    test_result "Gateway Syntax" "PASS"
else
    test_result "Gateway Syntax" "FAIL" "Syntax errors in gateway/server.js"
fi

# Test 7: Gateway dependencies
if [ -d "gateway/node_modules" ]; then
    test_result "Gateway Dependencies" "PASS"
else
    test_result "Gateway Dependencies" "FAIL" "Run: cd gateway && npm install"
fi

echo ""
echo "🤖 AI Service Tests"
echo "------------------"

# Test 8: Python service files
if [ -f "ai-processor/main.py" ] && [ -f "ai-processor/requirements.txt" ]; then
    test_result "AI Service Structure" "PASS"
else
    test_result "AI Service Structure" "FAIL" "Missing main.py or requirements.txt"
fi

# Test 9: Python syntax
if python -m py_compile ai-processor/main.py 2>/dev/null; then
    test_result "Python Syntax" "PASS"
else
    test_result "Python Syntax" "FAIL" "Syntax errors in Python files"
fi

# Test 10: Service modules
if [ -f "ai-processor/services/task_manager.py" ] && [ -f "ai-processor/services/enhancement_processor.py" ]; then
    test_result "AI Service Modules" "PASS"
else
    test_result "AI Service Modules" "FAIL" "Missing service modules"
fi

echo ""
echo "📦 Dependencies Tests"
echo "--------------------"

# Test 11: Essential Node modules
essential_modules=("react" "react-dom" "next" "framer-motion" "firebase")
all_modules_found=true

for module in "${essential_modules[@]}"; do
    if [ ! -d "node_modules/$module" ]; then
        all_modules_found=false
        break
    fi
done

if [ "$all_modules_found" = true ]; then
    test_result "Essential Dependencies" "PASS"
else
    test_result "Essential Dependencies" "FAIL" "Missing Node modules - run npm install"
fi

# Test 12: Python dependencies
python_deps_ok=true
python -c "import fastapi, uvicorn" 2>/dev/null || python_deps_ok=false

if [ "$python_deps_ok" = true ]; then
    test_result "Python Core Dependencies" "PASS"
else
    test_result "Python Core Dependencies" "FAIL" "Install: pip install fastapi uvicorn"
fi

echo ""
echo "🚀 Startup Scripts"
echo "-----------------"

# Test 13: Backend scripts
if [ -f "start-backend.sh" ] && [ -f "stop-backend.sh" ]; then
    test_result "Startup Scripts" "PASS"
else
    test_result "Startup Scripts" "FAIL" "Missing startup scripts"
fi

# Test 14: Script permissions
if [ -x "start-backend.sh" ] && [ -x "stop-backend.sh" ]; then
    test_result "Script Permissions" "PASS"
else
    test_result "Script Permissions" "FAIL" "Run: chmod +x *.sh"
fi

echo ""
echo "📊 Test Results Summary"
echo "---------------------"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo -e "Total: $((PASSED + FAILED))"

if [ $FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 All tests passed! System is ready to start.${NC}"
    echo ""
    echo -e "${BLUE}Next Steps:${NC}"
    echo "1. Start the backend services:"
    echo "   ${YELLOW}./start-backend.sh${NC}"
    echo ""
    echo "2. Start the frontend:"
    echo "   ${YELLOW}npm run dev${NC}"
    echo ""
    echo "3. Open your browser to:"
    echo "   ${YELLOW}http://localhost:3000${NC}"
else
    echo ""
    echo -e "${YELLOW}⚠️  Some tests failed. Please fix the issues above.${NC}"
    echo ""
    echo -e "${BLUE}Quick Fixes:${NC}"
    echo "• If Node modules missing: ${YELLOW}npm install${NC}"
    echo "• If gateway deps missing: ${YELLOW}cd gateway && npm install${NC}"
    echo "• If Python deps missing: ${YELLOW}pip install -r ai-processor/requirements.txt${NC}"
    echo "• If scripts not executable: ${YELLOW}chmod +x *.sh${NC}"
fi

echo ""
echo "🔍 Manual Testing Commands"
echo "------------------------"
echo "Test frontend:"
echo "  ${YELLOW}npm run build${NC}"
echo ""
echo "Test gateway:"
echo "  ${YELLOW}cd gateway && npm start${NC}"
echo ""
echo "Test AI service:"
echo "  ${YELLOW}cd ai-processor && python main.py${NC}"
echo ""
echo "Check system resources:"
echo "  ${YELLOW}./debug.sh${NC}"

exit $FAILED