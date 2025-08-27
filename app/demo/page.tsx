"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Play, 
  Pause, 
  ArrowRight, 
  Download, 
  CheckCircle2,
  Info
} from "lucide-react";

// Demo video examples
const demoVideos = [
  {
    id: "landscape",
    title: "Landscape Enhancement",
    description: "Mountain scenery enhanced from 720p to 4K with improved colors",
    before: "https://assets.mixkit.co/videos/preview/mixkit-mountain-range-seen-from-the-distance-4K-4097-large.mp4",
    after: "https://assets.mixkit.co/videos/preview/mixkit-mountain-range-seen-from-the-distance-4K-4097-large.mp4", // Same video for demo purposes
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop",
    improvements: ["Resolution: 720p → 4K", "Color enhancement", "Noise reduction", "Sharpness improvement"]
  },
  {
    id: "cityscape",
    title: "Urban Cityscape",
    description: "City timelapse enhanced with stabilization and frame interpolation",
    before: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-11-large.mp4",
    after: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-11-large.mp4", // Same video for demo purposes
    thumbnail: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2144&auto=format&fit=crop",
    improvements: ["Resolution: 1080p → 4K", "Frame rate: 30fps → 60fps", "Stabilization", "Light enhancement"]
  },
  {
    id: "wildlife",
    title: "Wildlife Footage",
    description: "Nature documentary footage with enhanced details and colors",
    before: "https://assets.mixkit.co/videos/preview/mixkit-white-tiger-lying-down-in-the-snow-4K-13126-large.mp4",
    after: "https://assets.mixkit.co/videos/preview/mixkit-white-tiger-lying-down-in-the-snow-4K-13126-large.mp4", // Same video for demo purposes
    thumbnail: "https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=2070&auto=format&fit=crop",
    improvements: ["Resolution: 1080p → 4K", "Detail enhancement", "Color correction", "Noise reduction"]
  }
];

export default function DemoPage() {
  const [activeVideo, setActiveVideo] = useState(demoVideos[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState("before");
  
  const beforeVideoRef = useRef<HTMLVideoElement>(null);
  const afterVideoRef = useRef<HTMLVideoElement>(null);
  
  // Reset video state when changing demo videos
  useEffect(() => {
    setIsPlaying(false);
    setActiveTab("before");
    
    if (beforeVideoRef.current) {
      beforeVideoRef.current.pause();
      beforeVideoRef.current.currentTime = 0;
    }
    
    if (afterVideoRef.current) {
      afterVideoRef.current.pause();
      afterVideoRef.current.currentTime = 0;
    }
  }, [activeVideo]);
  
  // Sync video playback between before/after videos
  useEffect(() => {
    const beforeVideo = beforeVideoRef.current;
    const afterVideo = afterVideoRef.current;
    
    if (!beforeVideo || !afterVideo) return;
    
    const handleTimeUpdate = () => {
      if (Math.abs(beforeVideo.currentTime - afterVideo.currentTime) > 0.5) {
        afterVideo.currentTime = beforeVideo.currentTime;
      }
    };
    
    beforeVideo.addEventListener('timeupdate', handleTimeUpdate);
    
    return () => {
      beforeVideo.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [activeVideo]);
  
  // Clean up videos when component unmounts
  useEffect(() => {
    return () => {
      if (beforeVideoRef.current && !beforeVideoRef.current.paused) {
        beforeVideoRef.current.pause();
      }
      if (afterVideoRef.current && !afterVideoRef.current.paused) {
        afterVideoRef.current.pause();
      }
    };
  }, []);
  
  const togglePlay = () => {
    const beforeVideo = beforeVideoRef.current;
    const afterVideo = afterVideoRef.current;
    
    if (!beforeVideo || !afterVideo) return;
    
    try {
      if (isPlaying) {
        // Pause both videos
        beforeVideo.pause();
        afterVideo.pause();
        setIsPlaying(false);
      } else {
        // Sync time before playing
        afterVideo.currentTime = beforeVideo.currentTime;
        
        // Play the active video
        if (activeTab === "before") {
          const playPromise = beforeVideo.play();
          
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error("Error playing video:", error);
              setIsPlaying(false);
            });
          }
        } else {
          const playPromise = afterVideo.play();
          
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error("Error playing video:", error);
              setIsPlaying(false);
            });
          }
        }
        
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error toggling video playback:", error);
      setIsPlaying(false);
    }
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Sync video state when switching tabs
    const beforeVideo = beforeVideoRef.current;
    const afterVideo = afterVideoRef.current;
    
    if (!beforeVideo || !afterVideo) return;
    
    try {
      // Pause both videos first
      beforeVideo.pause();
      afterVideo.pause();
      
      // Sync time
      if (value === "before") {
        afterVideo.currentTime = beforeVideo.currentTime;
      } else {
        beforeVideo.currentTime = afterVideo.currentTime;
      }
      
      // If was playing, play the new active video
      if (isPlaying) {
        if (value === "before") {
          const playPromise = beforeVideo.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error("Error playing video:", error);
              setIsPlaying(false);
            });
          }
        } else {
          const playPromise = afterVideo.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error("Error playing video:", error);
              setIsPlaying(false);
            });
          }
        }
      }
    } catch (error) {
      console.error("Error changing tabs:", error);
      setIsPlaying(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-24 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">See AI Enhancement in Action</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Watch how our AI technology transforms low-quality videos into stunning high-definition content.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="relative aspect-video bg-black">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="absolute inset-0">
                <TabsContent value="before" className="m-0 h-full">
                  <video
                    ref={beforeVideoRef}
                    src={activeVideo.before}
                    className="w-full h-full object-contain"
                    playsInline
                    loop
                    muted
                  />
                  <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm text-xs px-3 py-1 rounded-md">
                    Original
                  </div>
                </TabsContent>
                <TabsContent value="after" className="m-0 h-full">
                  <video
                    ref={afterVideoRef}
                    src={activeVideo.after}
                    className="w-full h-full object-contain"
                    playsInline
                    loop
                    muted
                  />
                  <div className="absolute top-4 left-4 bg-primary/80 backdrop-blur-sm text-xs px-3 py-1 rounded-md text-primary-foreground">
                    Enhanced
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>
              </div>
              
              <TabsList className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm">
                <TabsTrigger value="before">Before</TabsTrigger>
                <TabsTrigger value="after">After</TabsTrigger>
              </TabsList>
            </div>
            <CardHeader>
              <CardTitle>{activeVideo.title}</CardTitle>
              <CardDescription>{activeVideo.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {activeVideo.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{improvement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/enhance">
                  Try It Yourself <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">More Examples</h2>
          <div className="space-y-4">
            {demoVideos.map((video) => (
              <Card 
                key={video.id}
                className={`overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                  activeVideo.id === video.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setActiveVideo(video)}
              >
                <div className="relative aspect-video">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-medium text-sm">{video.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">{video.description}</p>
                  </div>
                  {activeVideo.id === video.id && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">
                      Active
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
          
          <div className="mt-6 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">How It Works</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <p>
                  Our AI uses advanced neural networks to analyze each frame of your video, identifying details, patterns, and features.
                </p>
                <p>
                  The system then enhances resolution, improves colors, reduces noise, and can even increase frame rate for smoother playback.
                </p>
                <div className="flex items-start space-x-2 pt-2">
                  <Info className="h-4 w-4 text-primary mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    For demonstration purposes, we're showing the same video for before/after. In real usage, the enhanced version would show significant improvements in quality.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <div className="bg-muted/50 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to enhance your videos?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Try our AI video enhancement technology today and transform your low-quality videos into stunning high-definition content.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/enhance">
              Enhance Your Video <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/pricing">
              View Pricing
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            {
              question: "What video formats are supported?",
              answer: "We support all major video formats including MP4, AVI, MOV, WMV, and more. If you have a specific format not listed, please contact our support team."
            },
            {
              question: "How long does enhancement take?",
              answer: "Processing time depends on the length and resolution of your video. Most videos under 5 minutes are processed within 10-15 minutes."
            },
            {
              question: "Is there a file size limit?",
              answer: "Free accounts can upload videos up to 500MB. Premium plans support larger files up to 5GB."
            },
            {
              question: "How much does it cost?",
              answer: "We offer a free tier with limited features and premium plans starting at $9.99/month. Check our pricing page for more details."
            }
          ].map((faq, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}