"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Play,
  Pause,
  Download,
  Share2,
  Trash2,
  Info,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export default function EnhancePage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnhanced, setIsEnhanced] = useState(false);
  const [currentTab, setCurrentTab] = useState("upload");
  const [resolution, setResolution] = useState("4k");
  const [fps, setFps] = useState("60");
  const [denoise, setDenoise] = useState(true);
  const [colorEnhance, setColorEnhance] = useState(true);
  const [stabilize, setStabilize] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const enhancedVideoRef = useRef<HTMLVideoElement>(null);

  // Stop video playback when tab changes or component unmounts
  useEffect(() => {
    return () => {
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
      }
      if (enhancedVideoRef.current && !enhancedVideoRef.current.paused) {
        enhancedVideoRef.current.pause();
      }
      setIsPlaying(false);
    };
  }, [currentTab]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type.startsWith('video/')) {
        setFile(selectedFile);
        setCurrentTab("enhance");

        // Create object URL for the video preview
        const videoElement = videoRef.current;
        if (videoElement) {
          videoElement.src = URL.createObjectURL(selectedFile);
          videoElement.load();
        }
      } else {
        toast.error("Please select a valid video file");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('video/')) {
        setFile(droppedFile);
        setCurrentTab("enhance");

        // Create object URL for the video preview
        const videoElement = videoRef.current;
        if (videoElement) {
          videoElement.src = URL.createObjectURL(droppedFile);
          videoElement.load();
        }
      } else {
        toast.error("Please drop a valid video file");
      }
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleProcessVideo = () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);

    // Simulate processing with progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setIsEnhanced(true);
          setCurrentTab("preview");

          // In a real app, we would get the enhanced video URL from the backend
          // For demo, we'll just use the same video
          const enhancedVideoElement = enhancedVideoRef.current;
          if (enhancedVideoElement && videoRef.current) {
            enhancedVideoElement.src = videoRef.current.src;
            enhancedVideoElement.load();
          }

          toast.success("Video enhancement complete!");
          return 100;
        }
        return newProgress;
      });
    }, 500);
  };

  const togglePlay = (videoElement: HTMLVideoElement | null) => {
    if (!videoElement) return;

    try {
      if (videoElement.paused) {
        // First pause any other videos that might be playing
        if (videoRef.current && videoRef.current !== videoElement && !videoRef.current.paused) {
          videoRef.current.pause();
        }
        if (enhancedVideoRef.current && enhancedVideoRef.current !== videoElement && !enhancedVideoRef.current.paused) {
          enhancedVideoRef.current.pause();
        }

        // Then play the requested video
        const playPromise = videoElement.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(error => {
              // Ignore AbortError as it's just a result of quickly toggling play/pause
              if (error.name !== 'AbortError') {
                console.error("Error playing video:", error);
              }
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

  const handleRemoveVideo = () => {
    // Stop any playing videos first
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.src = "";
    }

    if (enhancedVideoRef.current) {
      enhancedVideoRef.current.pause();
      enhancedVideoRef.current.src = "";
    }

    setFile(null);
    setIsEnhanced(false);
    setCurrentTab("upload");
    setProgress(0);
    setIsPlaying(false);
  };

  return (
    <div className="container mx-auto px-4 py-24 max-w-6xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">AI Video Enhancement</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Transform your low-quality videos into stunning HD and 4K with our AI-powered enhancement technology.
        </p>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="upload" disabled={isProcessing}>Upload</TabsTrigger>
          <TabsTrigger value="enhance" disabled={!file || isProcessing}>Enhance</TabsTrigger>
          <TabsTrigger value="preview" disabled={!isEnhanced}>Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Your Video</CardTitle>
              <CardDescription>
                Drag and drop your video file or click to browse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-border"
                  }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleUploadClick}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="video/*"
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <Upload className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">
                      {isDragging ? "Drop your video here" : "Drag & drop your video here"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Supports MP4, AVI, MOV, and more (max 500MB)
                    </p>
                  </div>
                  <Button>Browse Files</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between text-sm text-muted-foreground">
              <div className="flex items-center">
                <Info className="h-4 w-4 mr-1" />
                <span>Your files are processed securely</span>
              </div>
              <div>Max file size: 500MB</div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="enhance" className="space-y-6">
          {file && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="overflow-hidden">
                  <div className="relative aspect-video bg-black">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-contain"
                      controls={false}
                      playsInline
                    />
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
                        onClick={() => togglePlay(videoRef.current)}
                      >
                        {isPlaying ? (
                          <Pause className="h-5 w-5" />
                        ) : (
                          <Play className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{file.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRemoveVideo}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • Original Quality
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Enhancement Settings</CardTitle>
                    <CardDescription>
                      Customize how you want to enhance your video
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="resolution">Target Resolution</Label>
                      <Select value={resolution} onValueChange={setResolution}>
                        <SelectTrigger id="resolution">
                          <SelectValue placeholder="Select resolution" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hd">HD (1080p)</SelectItem>
                          <SelectItem value="2k">2K (1440p)</SelectItem>
                          <SelectItem value="4k">4K (2160p)</SelectItem>
                          <SelectItem value="8k">8K (4320p)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fps">Frame Rate</Label>
                      <Select value={fps} onValueChange={setFps}>
                        <SelectTrigger id="fps">
                          <SelectValue placeholder="Select frame rate" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24">24 FPS (Film)</SelectItem>
                          <SelectItem value="30">30 FPS (Standard)</SelectItem>
                          <SelectItem value="60">60 FPS (Smooth)</SelectItem>
                          <SelectItem value="120">120 FPS (Ultra Smooth)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <Label>Enhancement Options</Label>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="denoise">Noise Reduction</Label>
                          <p className="text-sm text-muted-foreground">
                            Remove grain and digital noise
                          </p>
                        </div>
                        <Switch
                          id="denoise"
                          checked={denoise}
                          onCheckedChange={setDenoise}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="color">Color Enhancement</Label>
                          <p className="text-sm text-muted-foreground">
                            Improve color vibrancy and contrast
                          </p>
                        </div>
                        <Switch
                          id="color"
                          checked={colorEnhance}
                          onCheckedChange={setColorEnhance}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="stabilize">Video Stabilization</Label>
                          <p className="text-sm text-muted-foreground">
                            Reduce camera shake and jitter
                          </p>
                        </div>
                        <Switch
                          id="stabilize"
                          checked={stabilize}
                          onCheckedChange={setStabilize}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={handleProcessVideo}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Enhance Video"
                      )}
                    </Button>
                  </CardFooter>
                </Card>

                {isProcessing && (
                  <Card className="mt-4">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Processing Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />

                        <div className="space-y-2 pt-2">
                          {progress < 30 ? (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                              <span>Analyzing video...</span>
                            </div>
                          ) : progress < 60 ? (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                              <span>Enhancing resolution...</span>
                            </div>
                          ) : progress < 90 ? (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                              <span>Applying AI improvements...</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                              <span>Finalizing video...</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          {isEnhanced && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="overflow-hidden">
                  <div className="relative aspect-video bg-black">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-contain"
                      controls={false}
                      playsInline
                    />
                    <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm text-xs px-2 py-1 rounded-md">
                      Original
                    </div>
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
                        onClick={() => togglePlay(videoRef.current)}
                      >
                        {isPlaying ? (
                          <Pause className="h-5 w-5" />
                        ) : (
                          <Play className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle>Original Video</CardTitle>
                    <CardDescription>
                      Low resolution • Original quality
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="overflow-hidden">
                  <div className="relative aspect-video bg-black">
                    <video
                      ref={enhancedVideoRef}
                      className="w-full h-full object-contain"
                      controls={false}
                      playsInline
                    />
                    <div className="absolute top-2 left-2 bg-primary/80 backdrop-blur-sm text-xs px-2 py-1 rounded-md text-primary-foreground">
                      Enhanced
                    </div>
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
                        onClick={() => togglePlay(enhancedVideoRef.current)}
                      >
                        {isPlaying ? (
                          <Pause className="h-5 w-5" />
                        ) : (
                          <Play className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle>Enhanced Video</CardTitle>
                    <CardDescription>
                      {resolution === "4k" ? "4K (2160p)" :
                        resolution === "8k" ? "8K (4320p)" :
                          resolution === "2k" ? "2K (1440p)" : "HD (1080p)"} • {fps} FPS
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button size="lg" onClick={handleDownload} className="flex items-center">
                  <Download className="mr-2 h-5 w-5" />
                  Download Enhanced Video
                </Button>
                <Button size="lg" variant="outline" onClick={handleShare} className="flex items-center">
                  <Share2 className="mr-2 h-5 w-5" />
                  Share
                </Button>
                <Button size="lg" variant="secondary" onClick={handleRemoveVideo} className="flex items-center">
                  <Trash2 className="mr-2 h-5 w-5" />
                  Remove
                </Button>
              </div>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Enhancement Details</CardTitle>
                  <CardDescription>
                    Technical information about your enhanced video
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Resolution</p>
                      <p className="text-2xl font-bold">
                        {resolution === "4k" ? "4K (2160p)" :
                          resolution === "8k" ? "8K (4320p)" :
                            resolution === "2k" ? "2K (1440p)" : "HD (1080p)"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {resolution === "4k" ? "3840×2160 pixels" :
                          resolution === "8k" ? "7680×4320 pixels" :
                            resolution === "2k" ? "2560×1440 pixels" : "1920×1080 pixels"}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium">Frame Rate</p>
                      <p className="text-2xl font-bold">{fps} FPS</p>
                      <p className="text-sm text-muted-foreground">
                        {fps === "120" ? "Ultra smooth motion" :
                          fps === "60" ? "Smooth motion" :
                            fps === "30" ? "Standard motion" : "Film-like motion"}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium">Enhancements Applied</p>
                      <div className="flex flex-col gap-1 mt-2">
                        <div className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm">Super Resolution</span>
                        </div>
                        {denoise && (
                          <div className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-sm">Noise Reduction</span>
                          </div>
                        )}
                        {colorEnhance && (
                          <div className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-sm">Color Enhancement</span>
                          </div>
                        )}
                        {stabilize && (
                          <div className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-sm">Video Stabilization</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}