
'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { VideoService } from '@/lib/videoService';
import { Upload, Play, Download, Settings, Sparkles, Zap, Film, Palette } from 'lucide-react';

const EnhancePage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [enhancementType, setEnhancementType] = useState<string>('super_resolution');
  const [settings, setSettings] = useState({
    resolution: '4k',
    fps: '30',
    denoise: true,
    color_enhance: true,
    stabilize: false
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [enhancedVideoUrl, setEnhancedVideoUrl] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
        setEnhancedVideoUrl(null);
        setProgress(0);
        toast.success('Video file selected successfully!');
      } else {
        toast.error('Please select a valid video file');
      }
    }
  };

  const pollEnhancementStatus = useCallback(async (taskId: string) => {
    try {
      const status = await VideoService.getEnhancementStatus(taskId);
      setProgress(status.progress);
      setProcessingStatus(status.status);

      if (status.status === 'completed') {
        setIsProcessing(false);
        if (status.download_url) {
          setEnhancedVideoUrl(status.download_url);
          toast.success('Video enhancement completed successfully!');
        }
      } else if (status.status === 'failed') {
        setIsProcessing(false);
        toast.error(`Enhancement failed: ${status.error || 'Unknown error'}`);
      } else if (status.status === 'processing') {
        // Continue polling
        setTimeout(() => pollEnhancementStatus(taskId), 2000);
      }
    } catch (error) {
      console.error('Error polling status:', error);
      toast.error('Error checking enhancement status');
    }
  }, []);

  const handleEnhance = async () => {
    if (!selectedFile) {
      toast.error('Please select a video file first');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setProcessingStatus('uploading');

    try {
      const result = await VideoService.enhanceVideoWithAI(
        selectedFile,
        enhancementType,
        settings
      );

      setTaskId(result.task_id);
      toast.success('Video enhancement started!');
      
      // Start polling for status
      pollEnhancementStatus(result.task_id);

    } catch (error) {
      console.error('Enhancement error:', error);
      toast.error('Failed to start video enhancement');
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (enhancedVideoUrl) {
      const link = document.createElement('a');
      link.href = VideoService.getEnhancedVideoUrl(enhancedVideoUrl.split('/').pop() || '');
      link.download = `enhanced_${selectedFile?.name || 'video.mp4'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getEnhancementIcon = (type: string) => {
    switch (type) {
      case 'super_resolution': return <Sparkles className="w-5 h-5" />;
      case 'denoising': return <Zap className="w-5 h-5" />;
      case 'interpolation': return <Film className="w-5 h-5" />;
      case 'restoration': return <Palette className="w-5 h-5" />;
      default: return <Settings className="w-5 h-5" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold gradient-text">AI Video Enhancement</h1>
          <p className="text-muted-foreground">
            Transform your videos with cutting-edge AI technology
          </p>
        </div>

        {/* File Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Video
            </CardTitle>
            <CardDescription>
              Select a video file to enhance with AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium">
                  {selectedFile ? selectedFile.name : 'Click to select video file'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports MP4, AVI, MOV, and other video formats
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhancement Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Enhancement Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Enhancement Type */}
            <div className="space-y-2">
              <Label>Enhancement Type</Label>
              <Select value={enhancementType} onValueChange={setEnhancementType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_resolution">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Super Resolution (4x upscale)
                    </div>
                  </SelectItem>
                  <SelectItem value="denoising">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      AI Denoising
                    </div>
                  </SelectItem>
                  <SelectItem value="interpolation">
                    <div className="flex items-center gap-2">
                      <Film className="w-4 h-4" />
                      Frame Interpolation
                    </div>
                  </SelectItem>
                  <SelectItem value="restoration">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      Video Restoration
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Resolution */}
            <div className="space-y-2">
              <Label>Target Resolution</Label>
              <Select value={settings.resolution} onValueChange={(value) => 
                setSettings(prev => ({ ...prev, resolution: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hd">HD (1920x1080)</SelectItem>
                  <SelectItem value="2k">2K (2560x1440)</SelectItem>
                  <SelectItem value="4k">4K (3840x2160)</SelectItem>
                  <SelectItem value="8k">8K (7680x4320)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* FPS */}
            <div className="space-y-2">
              <Label>Target FPS</Label>
              <Select value={settings.fps} onValueChange={(value) => 
                setSettings(prev => ({ ...prev, fps: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24">24 FPS</SelectItem>
                  <SelectItem value="30">30 FPS</SelectItem>
                  <SelectItem value="60">60 FPS</SelectItem>
                  <SelectItem value="120">120 FPS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Additional Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="denoise"
                  checked={settings.denoise}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, denoise: checked }))
                  }
                />
                <Label htmlFor="denoise">AI Denoising</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="color_enhance"
                  checked={settings.color_enhance}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, color_enhance: checked }))
                  }
                />
                <Label htmlFor="color_enhance">Color Enhancement</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="stabilize"
                  checked={settings.stabilize}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, stabilize: checked }))
                  }
                />
                <Label htmlFor="stabilize">Video Stabilization</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhancement Button */}
        <Card>
          <CardContent className="pt-6">
            <Button
              onClick={handleEnhance}
              disabled={!selectedFile || isProcessing}
              className="w-full h-12 text-lg"
              size="lg"
            >
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <>
                  {getEnhancementIcon(enhancementType)}
                  Start Enhancement
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Progress */}
        {isProcessing && (
          <Card>
            <CardHeader>
              <CardTitle>Processing Video</CardTitle>
              <CardDescription>
                Status: {processingStatus} - {progress}% complete
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="w-full" />
            </CardContent>
          </Card>
        )}

        {/* Download */}
        {enhancedVideoUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Enhancement Complete
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Original Video</h4>
                  <video
                    controls
                    className="w-full rounded-lg"
                    src={selectedFile ? URL.createObjectURL(selectedFile) : ''}
                  />
                </div>
                <div>
                  <h4 className="font-medium mb-2">Enhanced Video</h4>
                  <video
                    controls
                    className="w-full rounded-lg"
                    src={VideoService.getEnhancedVideoUrl(enhancedVideoUrl.split('/').pop() || '')}
                  />
                </div>
              </div>
              <Button onClick={handleDownload} className="w-full" size="lg">
                <Download className="w-5 h-5 mr-2" />
                Download Enhanced Video
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EnhancePage;
