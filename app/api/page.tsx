"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Code, 
  Copy, 
  Check, 
  ArrowRight, 
  Terminal, 
  FileJson, 
  Server, 
  Key
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function ApiPage() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [copied, setCopied] = useState(false);
  
  // Mock API key - in a real app, this would be fetched from the user's account
  const apiKey = "vx_api_" + (currentUser ? currentUser.uid.substring(0, 16) : "demo_key_123456789");
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("API key copied to clipboard");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-24 max-w-6xl">
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">VidioX AI API</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Integrate our powerful video enhancement technology directly into your applications
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="authentication">Authentication</TabsTrigger>
              <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Getting Started</CardTitle>
                  <CardDescription>
                    Learn how to integrate VidioX AI into your applications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    The VidioX AI API allows you to enhance videos programmatically, giving you the power to integrate our advanced AI video enhancement technology directly into your applications, websites, or workflows.
                  </p>
                  
                  <h3 className="text-lg font-semibold mt-4">Key Features</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Enhance video resolution up to 8K</li>
                    <li>Increase frame rate up to 120fps</li>
                    <li>Reduce noise and improve video quality</li>
                    <li>Enhance colors and contrast</li>
                    <li>Stabilize shaky footage</li>
                    <li>Process videos asynchronously with webhook notifications</li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold mt-4">Base URL</h3>
                  <div className="bg-muted p-3 rounded-md font-mono text-sm">
                    https://api.vidiox.ai/v1
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={() => setActiveTab("authentication")}>
                    Next: Authentication <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="authentication" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Authentication</CardTitle>
                  <CardDescription>
                    How to authenticate your API requests
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    All API requests must be authenticated using an API key. You can find your API key in your account dashboard.
                  </p>
                  
                  <h3 className="text-lg font-semibold mt-4">API Key Authentication</h3>
                  <p>
                    Include your API key in the request headers:
                  </p>
                  
                  <div className="bg-muted p-3 rounded-md font-mono text-sm">
                    <pre>{`Authorization: Bearer ${apiKey}`}</pre>
                  </div>
                  
                  <div className="bg-yellow-100 dark:bg-yellow-900/20 p-4 rounded-md mt-4">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-300">Security Warning</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400">
                      Keep your API key secure and never expose it in client-side code. Always make API calls from your server.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={() => setActiveTab("endpoints")}>
                    Next: Endpoints <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="endpoints" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Endpoints</CardTitle>
                  <CardDescription>
                    Available endpoints and their parameters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold">POST /videos/enhance</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Submit a video for enhancement
                    </p>
                    
                    <div className="bg-muted p-3 rounded-md font-mono text-sm mb-4">
                      <pre>{`POST https://api.vidiox.ai/v1/videos/enhance`}</pre>
                    </div>
                    
                    <h4 className="font-medium mb-2">Request Body</h4>
                    <div className="bg-muted p-3 rounded-md font-mono text-sm mb-4">
                      <pre>{`{
  "video_url": "https://example.com/video.mp4",
  "resolution": "4k",  // Options: "hd", "2k", "4k", "8k"
  "fps": 60,           // Options: 24, 30, 60, 120
  "denoise": true,
  "color_enhance": true,
  "stabilize": false,
  "webhook_url": "https://your-app.com/webhook"
}`}</pre>
                    </div>
                    
                    <h4 className="font-medium mb-2">Response</h4>
                    <div className="bg-muted p-3 rounded-md font-mono text-sm">
                      <pre>{`{
  "id": "vid_123456789",
  "status": "processing",
  "created_at": "2025-03-15T12:00:00Z",
  "estimated_completion_time": "2025-03-15T12:10:00Z"
}`}</pre>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold">GET /videos/{"{id}"}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Get the status and details of an enhanced video
                    </p>
                    
                    <div className="bg-muted p-3 rounded-md font-mono text-sm mb-4">
                      <pre>{`GET https://api.vidiox.ai/v1/videos/vid_123456789`}</pre>
                    </div>
                    
                    <h4 className="font-medium mb-2">Response</h4>
                    <div className="bg-muted p-3 rounded-md font-mono text-sm">
                      <pre>{`{
  "id": "vid_123456789",
  "status": "completed",
  "created_at": "2025-03-15T12:00:00Z",
  "completed_at": "2025-03-15T12:08:32Z",
  "original_url": "https://example.com/video.mp4",
  "enhanced_url": "https://storage.vidiox.ai/enhanced/vid_123456789.mp4",
  "resolution": "4k",
  "fps": 60,
  "size": 128000000,
  "duration": 84
}`}</pre>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={() => setActiveTab("examples")}>
                    Next: Examples <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="examples" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Code Examples</CardTitle>
                  <CardDescription>
                    Example code snippets for common programming languages
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center">
                      <Terminal className="h-5 w-5 mr-2" />
                      Node.js
                    </h3>
                    <div className="bg-muted p-3 rounded-md font-mono text-sm mt-2">
                      <pre>{`const axios = require('axios');

async function enhanceVideo() {
  try {
    const response = await axios.post(
      'https://api.vidiox.ai/v1/videos/enhance',
      {
        video_url: 'https://example.com/video.mp4',
        resolution: '4k',
        fps: 60,
        denoise: true,
        color_enhance: true,
        stabilize: false,
        webhook_url: 'https://your-app.com/webhook'
      },
      {
        headers: {
          'Authorization': 'Bearer ${apiKey}',
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Video enhancement started:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error enhancing video:', error.response?.data || error.message);
    throw error;
  }
}`}</pre>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold flex items-center">
                      <FileJson className="h-5 w-5 mr-2" />
                      Python
                    </h3>
                    <div className="bg-muted p-3 rounded-md font-mono text-sm mt-2">
                      <pre>{`import requests

def enhance_video():
    url = "https://api.vidiox.ai/v1/videos/enhance"
    
    headers = {
        "Authorization": f"Bearer ${apiKey}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "video_url": "https://example.com/video.mp4",
        "resolution": "4k",
        "fps": 60,
        "denoise": True,
        "color_enhance": True,
        "stabilize": False,
        "webhook_url": "https://your-app.com/webhook"
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        print("Video enhancement started:", response.json())
        return response.json()
    except requests.exceptions.RequestException as e:
        print("Error enhancing video:", e)
        raise`}</pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your API Key</CardTitle>
              <CardDescription>
                Use this key to authenticate your API requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="bg-muted p-3 rounded-md font-mono text-sm flex-grow overflow-x-auto">
                  {apiKey}
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => copyToClipboard(apiKey)}
                  className="flex-shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground">
                {currentUser ? (
                  <p>This is your actual API key. Keep it secure and never share it publicly.</p>
                ) : (
                  <p>This is a demo API key. <Link href="/auth/login" className="text-primary hover:underline">Sign in</Link> to get your actual API key.</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Rate Limits</CardTitle>
              <CardDescription>
                API request limits based on your plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Free Plan</span>
                  <span>100 requests/day</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Pro Plan</span>
                  <span>1,000 requests/day</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Enterprise Plan</span>
                  <span>Custom limits</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>
                Resources to help you integrate our API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Code className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">API Documentation</h3>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive documentation with all endpoints and parameters
                  </p>
                  <Button variant="link" className="p-0 h-auto text-sm" asChild>
                    <Link href="/docs/api">View Documentation</Link>
                  </Button>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Server className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">SDKs & Libraries</h3>
                  <p className="text-sm text-muted-foreground">
                    Official client libraries for popular programming languages
                  </p>
                  <Button variant="link" className="p-0 h-auto text-sm" asChild>
                    <Link href="/docs/sdks">View SDKs</Link>
                  </Button>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Key className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">API Status</h3>
                  <p className="text-sm text-muted-foreground">
                    Check the current status of the API and any ongoing incidents
                  </p>
                  <Button variant="link" className="p-0 h-auto text-sm" asChild>
                    <Link href="/status">View Status</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="bg-muted/50 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to integrate VidioX AI?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Start enhancing videos programmatically with our powerful API. Upgrade to a Pro or Enterprise plan for higher rate limits and priority support.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/pricing">
              View API Pricing
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/contact">
              Contact Sales
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}