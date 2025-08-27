"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Video, 
  Upload, 
  Clock, 
  Settings, 
  Download, 
  BarChart3, 
  Zap, 
  Plus, 
  ArrowRight,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { VideoService, VideoData } from "@/lib/videoService";
import { db } from "@/lib/firebase";

export default function DashboardPage() {
  const { currentUser, getUserData } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("recent");
  const [userData, setUserData] = useState<any>(null);
  const [recentVideos, setRecentVideos] = useState<any[]>([]);
  const [inProgressVideos, setInProgressVideos] = useState<any[]>([]);
  
useEffect(() => {  
  const fetchData = async () => {
    if (!currentUser) return;

    try {
      // Get user data
      const data = await getUserData();
      setUserData(data);

      // Get completed videos
      const completedVideos = await VideoService.getUserVideos(currentUser.uid, "completed");
      setRecentVideos(completedVideos.slice(0, 3)); // Show only last 3
      
      // Get processing videos
      const processingVideos = await VideoService.getUserVideos(currentUser.uid, "processing");
      setInProgressVideos(processingVideos);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [currentUser, getUserData]);
  
  // Mock usage stats - in a real app, this would come from the user's data
  const usageStats = userData ? {
    videosProcessed: userData.enhancedVideos || 14,
    totalDuration: userData.totalDuration || "42:18",
    storageUsed: userData.storageUsed ? `${(userData.storageUsed / (1024 * 1024 * 1024)).toFixed(1)}GB` : "1.2GB",
    storageLimit: userData.plan === "free" ? "5GB" : userData.plan === "pro" ? "50GB" : "100GB",
    creditsUsed: userData.creditsUsed || 280,
    creditsTotal: userData.plan === "free" ? 500 : userData.plan === "pro" ? 2000 : 5000
  } : {
    videosProcessed: 14,
    totalDuration: "42:18",
    storageUsed: "1.2GB",
    storageLimit: "5GB",
    creditsUsed: 280,
    creditsTotal: 500
  };

  return (
    <div className="container mx-auto px-4 py-24 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Manage your enhanced videos and account</p>
        </div>
        <Button asChild>
          <Link href="/enhance">
            <Plus className="mr-2 h-4 w-4" />
            Enhance New Video
          </Link>
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>Your Videos</CardTitle>
                  <Link href="/videos" className="text-sm text-primary hover:underline">
                    View all
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="recent">Recent</TabsTrigger>
                    <TabsTrigger value="processing">Processing</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="recent" className="space-y-4">
                    {recentVideos.length > 0 ? (
                      recentVideos.map((video) => (
                        <div key={video.id} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="relative aspect-video w-40 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={video.thumbnail}
                              alt={video.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute bottom-1 right-1 bg-background/80 backdrop-blur-sm text-xs px-1.5 py-0.5 rounded">
                              {video.duration}
                            </div>
                          </div>
                          <div className="flex-grow min-w-0">
                            <h3 className="font-medium truncate">{video.title}</h3>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <span>{video.date}</span>
                              <span className="mx-1.5">•</span>
                              <span>{video.resolution}</span>
                              <span className="mx-1.5">•</span>
                              <span>{video.size}</span>
                            </div>
                            <div className="flex mt-2 space-x-2">
                              <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                                <Download className="h-3 w-3 mr-1" />
                                Download
                              </Button>
                              <Button size="sm" variant="outline" className="h-7 px-2 text-xs" asChild>
                                <Link href={`/videos/${video.id}`}>
                                  <Video className="h-3 w-3 mr-1" />
                                  Preview
                                </Link>
                              </Button>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <div className="flex items-center text-xs font-medium text-green-500">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Enhanced
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Video className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No enhanced videos yet</p>
                        <Button variant="outline" className="mt-4" asChild>
                          <Link href="/enhance">
                            Enhance Your First Video
                          </Link>
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="processing" className="space-y-4">
                    {inProgressVideos.length > 0 ? (
                      inProgressVideos.map((video) => (
                        <div key={video.id} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="relative aspect-video w-40 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={video.thumbnail}
                              alt={video.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute bottom-1 right-1 bg-background/80 backdrop-blur-sm text-xs px-1.5 py-0.5 rounded">
                              {video.duration}
                            </div>
                          </div>
                          <div className="flex-grow min-w-0">
                            <h3 className="font-medium truncate">{video.title}</h3>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <span>{video.date}</span>
                              <span className="mx-1.5">•</span>
                              <span>{video.resolution}</span>
                              <span className="mx-1.5">•</span>
                              <span>{video.size}</span>
                            </div>
                            <div className="mt-2 space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Processing</span>
                                <span>{video.progress}%</span>
                              </div>
                              <Progress value={video.progress} className="h-1.5" />
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <div className="flex items-center text-xs font-medium text-amber-500">
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              Processing
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Video className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No videos currently processing</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/enhance">
                    Enhance Another Video
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest actions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      icon: <Upload className="h-4 w-4 text-blue-500" />,
                      title: "Video uploaded",
                      description: "You uploaded 'Beach Sunset Compilation'",
                      time: "2 hours ago"
                    },
                    {
                      icon: <Zap className="h-4 w-4 text-amber-500" />,
                      title: "Enhancement completed",
                      description: "Mountain Landscape Timelapse was enhanced to 4K",
                      time: "2 hours ago"
                    },
                    {
                      icon: <Download className="h-4 w-4 text-green-500" />,
                      title: "Video downloaded",
                      description: "You downloaded 'Urban Cityscape Night View'",
                      time: "Yesterday"
                    },
                    {
                      icon: <Settings className="h-4 w-4 text-purple-500" />,
                      title: "Settings updated",
                      description: "You changed your default enhancement settings",
                      time: "3 days ago"
                    }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="bg-muted rounded-full p-1.5 mt-0.5">
                        {activity.icon}
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium text-sm">{activity.title}</p>
                        <p className="text-muted-foreground text-xs">{activity.description}</p>
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {activity.time}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Usage Summary</CardTitle>
                <CardDescription>Your current plan usage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Storage</span>
                    <span className="font-medium">{usageStats.storageUsed} / {usageStats.storageLimit}</span>
                  </div>
                  <Progress 
                    value={(parseFloat(usageStats.storageUsed) / parseFloat(usageStats.storageLimit)) * 100} 
                    className="h-2" 
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Enhancement Credits</span>
                    <span className="font-medium">{usageStats.creditsUsed} / {usageStats.creditsTotal}</span>
                  </div>
                  <Progress value={(usageStats.creditsUsed / usageStats.creditsTotal) * 100} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground">Videos Enhanced</p>
                    <p className="text-2xl font-bold">{usageStats.videosProcessed}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground">Total Duration</p>
                    <p className="text-2xl font-bold">{usageStats.totalDuration}</p>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/pricing">
                    Upgrade Plan
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Tips</CardTitle>
                <CardDescription>Get the most out of VidioX AI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    title: "Optimize your videos",
                    description: "For best results, upload videos with good lighting and minimal camera shake."
                  },
                  {
                    title: "Save storage space",
                    description: "Download your enhanced videos within 7 days to avoid automatic deletion."
                  },
                  {
                    title: "Batch processing",
                    description: "Upgrade to Pro to enhance multiple videos simultaneously."
                  }
                ].map((tip, index) => (
                  <div key={index} className="space-y-1">
                    <h3 className="text-sm font-medium">{tip.title}</h3>
                    <p className="text-xs text-muted-foreground">{tip.description}</p>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="link" className="w-full p-0" asChild>
                  <Link href="/docs">
                    View all tips
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}