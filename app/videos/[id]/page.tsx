"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Play, 
  Pause, 
  Download, 
  Share2, 
  ArrowLeft, 
  Info, 
  Clock, 
  CheckCircle2,
  Layers,
  Zap
} from "lucide-react";

export default function VideoDetailPage() {
  const params = useParams();
  const videoId = params?.id as string || "";
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const enhancedVideoRef = useRef<HTMLVideoElement>(null);
  
  // Mock video data - in a real app, this would be fetched from an API
  const videoData = {
    id: videoId,
    title: "Mountain Landscape Timelapse",
    description: "Beautiful mountain scenery enhanced from 720p to 4K with improved colors",
    originalUrl: "https://assets.mixkit.co/videos/preview/mixkit-mountain-range-seen-from-the-distance-4K-4097-large.mp4",
    enhancedUrl: "https://assets.mixkit.co/videos/preview/mixkit-mountain-range-seen-from-the-distance-4K-4097-large.mp4", // Same for demo
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop",
    date: "March 15, 2025",
    duration: "1:24",
    status: "completed",
    resolution: "4K",
    size: "128MB",
    originalSize: "45MB",
    enhancements: [
      "Resolution: 720p → 4K",
      "Frame rate: 30fps → 60fps",
      "Color enhancement",
      "Noise reduction"
    ],
    metadata: {
      codec: "H.264",
      bitrate: "25 Mbps",
      audioCodec: "AAC",
      audioChannels: "Stereo"
    }
  };
  
  // Clean up videos when component unmounts
  useEffect(() => {
    return () => {
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
      }
      if (enhancedVideoRef.current && !enhancedVideoRef.current.paused) {
        enhancedVideoRef.current.pause();
      }
    };
  }, []);
  
  const togglePlay = (videoElement: HTMLVideoElement | null) => {
    if (!videoElement) return;
    
    try {
      if (videoElement.paused) {
        const playPromise = videoElement.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(error => {
              console.error("Error playing video:", error);
              setIsPlaying(false);
            });
        }
      } else {
        videoElement.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("Error toggling video playback:", error);
      setIsPlaying(false);
    }
  };
  
  const handleDownload = () => {
    toast.success("Download started");
    // In a real app, this would trigger the download of the enhanced video
  };
  
  const handleShare = () => {
    toast("Sharing options", {
      description: "This would open sharing options in a real app"
    });
  };

  return (
    <div className="container mx-auto px-4 py-24 max-w-6xl">
      <Button variant="ghost" className="mb-6" asChild>
        <Link href="/videos" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Videos
        </Link>
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <div className="relative aspect-video bg-black">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                <TabsContent value="preview" className="m-0 h-full">
                  <video
                    ref={enhancedVideoRef}
                    src={videoData.enhancedUrl}
                    className="w-full h-full object-contain"
                    controls={false}
                    playsInline
                  />
                  <div className="absolute top-4 left-4 bg-primary/80 backdrop-blur-sm text-xs px-3 py-1 rounded-md text-primary-foreground">
                    Enhanced
                  </div>
                </TabsContent>
                <TabsContent value="compare" className="m-0 h-full">
                  <div className="grid grid-cols-2 h-full">
                    <div className="relative h-full border-r border-background/20">
                      <video
                        ref={videoRef}
                        src={videoData.originalUrl}
                        className="w-full h-full object-contain"
                        controls={false}
                        playsInline
                      />
                      <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm text-xs px-2 py-1 rounded-md">
                        Original
                      </div>
                    </div>
                    <div className="relative h-full">
                      <video
                        src={videoData.enhancedUrl}
                        className="w-full h-full object-contain"
                        controls={false}
                        playsInline
                      />
                      <div className="absolute top-2 left-2 bg-primary/80 backdrop-blur-sm text-xs px-2 py-1 rounded-md text-primary-foreground">
                        Enhanced
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
                    onClick={() => togglePlay(activeTab === "preview" ? enhancedVideoRef.current : videoRef.current)}
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                
                <TabsList className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="compare">Compare</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <CardHeader>
              <CardTitle>{videoData.title}</CardTitle>
              <CardDescription>{videoData.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {videoData.enhancements.map((enhancement, index) => (
                  <div key={index} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                    {enhancement}
                  </div>
                ))}
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                <span>Enhanced on {videoData.date}</span>
                <span className="mx-2">•</span>
                <span>{videoData.duration}</span>
                <span className="mx-2">•</span>
                <span>{videoData.resolution}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-3">
              <Button onClick={handleDownload} className="flex items-center">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button variant="outline" onClick={handleShare} className="flex items-center">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enhancement Details</CardTitle>
              <CardDescription>Technical information about your enhanced video</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <p className="text-sm font-medium">Status</p>
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span className="font-medium">Enhancement Complete</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">File Size</p>
                <div className="flex items-center justify-between">
                  <span>Original</span>
                  <span>{videoData.originalSize}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Enhanced</span>
                  <span>{videoData.size}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Technical Specs</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Codec</p>
                    <p>{videoData.metadata.codec}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Bitrate</p>
                    <p>{videoData.metadata.bitrate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Audio</p>
                    <p>{videoData.metadata.audioCodec}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Channels</p>
                    <p>{videoData.metadata.audioChannels}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Enhancement Process</CardTitle>
              <CardDescription>How your video was enhanced</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 rounded-full p-1.5 mt-0.5">
                  <Layers className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Super Resolution</p>
                  <p className="text-muted-foreground text-xs">AI upscaling to increase resolution while preserving details</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 rounded-full p-1.5 mt-0.5">
                  <Zap className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Frame Interpolation</p>
                  <p className="text-muted-foreground text-xs">AI-generated intermediate frames for smoother motion</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 rounded-full p-1.5 mt-0.5">
                  <Info className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    For demonstration purposes, we're showing the same video for before/after. In real usage, the enhanced version would show significant improvements in quality.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}