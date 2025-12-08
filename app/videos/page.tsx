"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
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
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function VideosPage() {
  const { currentUser: user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterResolution, setFilterResolution] = useState("all");

  useEffect(() => {
    const fetchVideos = async () => {
      if (authLoading) return;
      if (!user) {
        router.push('/auth/login');
        return;
      }

      try {
        setLoading(true);
        const q = query(
          collection(db, "videos"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const fetchedVideos = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setVideos(fetchedVideos);
      } catch (error) {
        console.error("Error fetching videos:", error);
        toast.error("Failed to load videos");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [user, authLoading, router]);

  // Filter videos based on search query and filters
  const filteredVideos = videos.filter(video => {
    const titleMatch = video.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const statusMatch = filterStatus === "all" || video.status === filterStatus;
    const resolutionMatch = filterResolution === "all" || video.resolution === filterResolution;

    return titleMatch && statusMatch && resolutionMatch;
  });

  const handleDownloadVideo = (videoId: string, url: string) => {
    // In a real app, this would trigger a download of the URL
    if (url) {
      window.open(url, "_blank");
    } else {
      toast.error("Video URL not available");
    }
  };

  const handleShareVideo = (videoId: string) => {
    toast.info("Sharing options coming soon");
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      await deleteDoc(doc(db, "videos", videoId));
      setVideos(prev => prev.filter(v => v.id !== videoId));
      toast.success("Video deleted successfully");
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Failed to delete video");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
              <div className="relative aspect-video bg-muted">
                {video.thumbnail ? (
                  <Image
                    src={video.thumbnail}
                    alt={video.title || "Video thumbnail"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <Video className="h-10 w-10" />
                  </div>
                )}
                <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm text-xs px-2 py-1 rounded">
                  {video.duration || "--:--"}
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
                  <CardTitle className="text-lg truncate pr-2">{video.title || "Untitled Video"}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="-mt-2 -mr-2">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDownloadVideo(video.id, video.url)} disabled={!video.url}>
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
                      style={{ width: `${video.progress || 0}%` }}
                    ></div>
                    <p className="text-xs text-muted-foreground mt-1 text-right">{video.progress || 0}%</p>
                  </div>
                )}
                {video.status !== "processing" && (
                  <div className="text-xs text-muted-foreground">
                    {video.resolution && <span className="mr-2">{video.resolution}</span>}
                    {video.size && <span>{video.size}</span>}
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
                  onClick={() => handleDownloadVideo(video.id, video.url)}
                  disabled={video.status === "processing" || !video.url}
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