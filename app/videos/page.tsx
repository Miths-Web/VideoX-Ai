"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Video, 
  Search, 
  Filter, 
  Download, 
  Share2, 
  Trash2, 
  MoreVertical, 
  Plus,
  CheckCircle2,
  Loader2
} from "lucide-react";

export default function VideosPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterResolution, setFilterResolution] = useState("all");
  
  // Mock data for videos
  const videos = [
    {
      id: "vid-001",
      title: "Mountain Landscape Timelapse",
      thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop",
      date: "2 hours ago",
      duration: "1:24",
      status: "completed",
      resolution: "4K",
      size: "128MB"
    },
    {
      id: "vid-002",
      title: "Urban Cityscape Night View",
      thumbnail: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2144&auto=format&fit=crop",
      date: "Yesterday",
      duration: "2:15",
      status: "completed",
      resolution: "4K",
      size: "245MB"
    },
    {
      id: "vid-003",
      title: "Wildlife Documentary Clip",
      thumbnail: "https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=2070&auto=format&fit=crop",
      date: "3 days ago",
      duration: "3:42",
      status: "completed",
      resolution: "4K",
      size: "312MB"
    },
    {
      id: "vid-004",
      title: "Beach Sunset Compilation",
      thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
      date: "Just now",
      duration: "4:10",
      status: "processing",
      progress: 65,
      resolution: "4K",
      size: "280MB"
    },
    {
      id: "vid-005",
      title: "Drone Footage of Forest",
      thumbnail: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2074&auto=format&fit=crop",
      date: "1 week ago",
      duration: "2:48",
      status: "completed",
      resolution: "1080p",
      size: "156MB"
    },
    {
      id: "vid-006",
      title: "City Traffic Timelapse",
      thumbnail: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=2070&auto=format&fit=crop",
      date: "2 weeks ago",
      duration: "1:35",
      status: "completed",
      resolution: "1080p",
      size: "98MB"
    }
  ];
  
  // Filter videos based on search query and filters
  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || video.status === filterStatus;
    const matchesResolution = filterResolution === "all" || video.resolution === filterResolution;
    
    return matchesSearch && matchesStatus && matchesResolution;
  });
  
  const handleDownloadVideo = (videoId: string) => {
    toast.success(`Download started for video ${videoId}`);
  };
  
  const handleShareVideo = (videoId: string) => {
    toast("Sharing options", {
      description: "This would open sharing options in a real app"
    });
  };
  
  const handleDeleteVideo = (videoId: string) => {
    toast.success(`Video ${videoId} deleted successfully`);
  };

  return (
    <div className="container mx-auto px-4 py-24 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Videos</h1>
          <p className="text-muted-foreground">Manage all your enhanced videos</p>
        </div>
        <Button asChild>
          <Link href="/enhance">
            <Plus className="mr-2 h-4 w-4" />
            Enhance New Video
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search videos..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <div className="w-40">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <span>Status</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-40">
            <Select value={filterResolution} onValueChange={setFilterResolution}>
              <SelectTrigger>
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <span>Resolution</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Resolutions</SelectItem>
                <SelectItem value="4K">4K</SelectItem>
                <SelectItem value="1080p">1080p</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <Card key={video.id} className="overflow-hidden">
              <div className="relative aspect-video">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
                {video.status === "processing" ? (
                  <div className="absolute top-2 right-2 bg-amber-500/80 backdrop-blur-sm text-xs px-2 py-1 rounded text-white flex items-center">
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Processing
                  </div>
                ) : (
                  <div className="absolute top-2 right-2 bg-green-500/80 backdrop-blur-sm text-xs px-2 py-1 rounded text-white flex items-center">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Enhanced
                  </div>
                )}
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{video.title}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="-mt-2 -mr-2">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDownloadVideo(video.id)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShareVideo(video.id)}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDeleteVideo(video.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {video.status === "processing" && (
                  <div className="w-full bg-muted rounded-full h-1.5 mb-2">
                    <div 
                      className="bg-primary h-1.5 rounded-full" 
                      style={{ width: `${video.progress}%` }}
                    ></div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/videos/${video.id}`}>
                    <Video className="h-4 w-4 mr-2" />
                    Preview
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDownloadVideo(video.id)}
                  disabled={video.status === "processing"}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Video className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No videos found</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            {searchQuery || filterStatus !== "all" || filterResolution !== "all"
              ? "No videos match your search criteria. Try adjusting your filters."
              : "You haven't enhanced any videos yet. Start by enhancing your first video."}
          </p>
          <Button asChild>
            <Link href="/enhance">
              <Plus className="mr-2 h-4 w-4" />
              Enhance New Video
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}