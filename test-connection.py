#!/usr/bin/env python3
"""
Test Frontend-Backend Connection for VideoX-Ai
"""

import requests
import time
import json
import subprocess
import os
from pathlib import Path

class ConnectionTester:
    def __init__(self):
        self.gateway_url = "http://localhost:5000"
        self.ai_service_url = "http://localhost:8000"
        self.frontend_url = "http://localhost:3000"

    def test_gateway_health(self):
        """Test Gateway Health Endpoint"""
        print("🔧 Testing Gateway Health...")
        try:
            response = requests.get(f"{self.gateway_url}/health", timeout=5)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Gateway Healthy - Uptime: {data.get('uptime', 'N/A')}s")
                print(f"   Python Service URL: {data.get('python_service_url', 'N/A')}")
                return True
            else:
                print(f"❌ Gateway Error: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Gateway Connection Failed: {e}")
            return False

    def test_ai_service_health(self):
        """Test AI Service Health Endpoint"""
        print("\n🤖 Testing AI Service Health...")
        try:
            response = requests.get(f"{self.ai_service_url}/health", timeout=5)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ AI Service Healthy - Version: {data.get('version', 'N/A')}")
                print(f"   GPU Available: {data.get('gpu_available', False)}")
                print(f"   Active Tasks: {data.get('active_tasks', 0)}")
                return True
            else:
                print(f"❌ AI Service Error: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ AI Service Connection Failed: {e}")
            return False

    def test_status_endpoint(self):
        """Test Status Endpoint (Task Management)"""
        print("\n📊 Testing Status Endpoint...")
        try:
            response = requests.get(f"{self.gateway_url}/api/status/test_task_123", timeout=5)
            if response.status_code == 200:
                data = response.json()
                if not data.get('success', False) and "Task not found" in data.get('error', ''):
                    print("✅ Status Endpoint Working (Task not found is expected)")
                    return True
                else:
                    print("⚠️  Unexpected Status Response")
                    return False
            else:
                print(f"❌ Status Endpoint Error: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Status Endpoint Failed: {e}")
            return False

    def test_upload_validation(self):
        """Test Upload Endpoint with File Type Validation"""
        print("\n📤 Testing Upload Validation...")
        try:
            # Test with invalid file (text file)
            files = {'video': ('test.txt', 'This is a test file', 'text/plain')}
            data = {
                'enhancement_type': 'super_resolution',
                'resolution': '4K',
                'fps': '30',
                'denoising': 'true',
                'color_enhancement': 'true',
                'stabilization': 'false'
            }

            response = requests.post(f"{self.gateway_url}/api/upload", files=files, data=data, timeout=5)

            if response.status_code == 400:
                error_data = response.json()
                if "Invalid file type" in error_data.get('error', ''):
                    print("✅ Upload Validation Working (Correctly rejected invalid file)")
                    return True
                else:
                    print(f"⚠️  Unexpected Error: {error_data}")
                    return False
            else:
                print(f"⚠️  Unexpected Status: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Upload Validation Failed: {e}")
            return False

    def test_api_routing(self):
        """Test that Gateway properly routes to AI Service"""
        print("\n🔄 Testing API Routing...")
        try:
            # Test download endpoint (should return 404 for non-existent file)
            response = requests.get(f"{self.gateway_url}/api/download/test_file.mp4", timeout=5)

            if response.status_code == 404:
                print("✅ API Routing Working (Gateway routes to AI Service)")
                return True
            else:
                print(f"⚠️  Unexpected Download Status: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ API Routing Test Failed: {e}")
            return False

    def test_cors_headers(self):
        """Test CORS Headers"""
        print("\n🌐 Testing CORS Headers...")
        try:
            response = requests.get(f"{self.gateway_url}/health", timeout=5)

            cors_headers = response.headers.get('Access-Control-Allow-Origin', '')
            if cors_headers:
                print(f"✅ CORS Headers Present: {cors_headers}")
                return True
            else:
                print("⚠️  No CORS Headers Found")
                return False
        except Exception as e:
            print(f"❌ CORS Test Failed: {e}")
            return False

    def check_services_running(self):
        """Check if services are actually running"""
        print("\n🔍 Checking Service Processes...")

        # Check ports
        import socket

        def check_port(port, name):
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1)
            result = sock.connect_ex(('localhost', port))
            sock.close()
            return result == 0

        gateway_running = check_port(5000, "Gateway")
        ai_service_running = check_port(8000, "AI Service")

        print(f"🖥️  Gateway (Port 5000): {'✅ Running' if gateway_running else '❌ Not Running'}")
        print(f"🤖 AI Service (Port 8000): {'✅ Running' if ai_service_running else '❌ Not Running'}")

        return gateway_running, ai_service_running

    def run_full_test(self):
        """Run Complete Connection Test"""
        print("🧪 VideoX-Ai Connection Test Suite")
        print("=" * 50)

        # Check if services are running
        gateway_running, ai_running = self.check_services_running()

        if not gateway_running or not ai_running:
            print("\n❌ Services Not Running!")
            print("Start services with: ./start-backend.sh")
            return False

        # Run all tests
        tests = [
            self.test_gateway_health,
            self.test_ai_service_health,
            self.test_status_endpoint,
            self.test_upload_validation,
            self.test_api_routing,
            self.test_cors_headers
        ]

        results = []
        for test in tests:
            try:
                result = test()
                results.append(result)
            except Exception as e:
                print(f"❌ Test Failed: {e}")
                results.append(False)

        # Summary
        passed = sum(results)
        total = len(results)

        print("\n" + "=" * 50)
        print(f"📊 Test Results: {passed}/{total} Passed")

        if passed == total:
            print("🎉 All Tests Passed! Frontend-Backend Connection is Working!")
            print("\n🚀 Next Steps:")
            print("1. Start Frontend: npm run dev")
            print("2. Open Browser: http://localhost:3000")
            print("3. Test Video Upload Flow")
            return True
        else:
            print("⚠️  Some Tests Failed. Check the issues above.")
            return False

if __name__ == "__main__":
    tester = ConnectionTester()
    success = tester.run_full_test()
    exit(0 if success else 1)