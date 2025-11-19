
'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { VideoService } from '@/lib/videoService';
import {
  Upload,
  Download,
  Settings,
  Sparkles,
  Zap,
  Film,
  Palette,
  Play,
  Pause,
  CheckCircle2,
  Loader2,
  FileVideo,
  Cpu,
  HD,
  Volume2,
  Activity,
  Clock
} from 'lucide-react';

const EnhancePage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [enhancementType, setEnhancementType] = useState<string>('super_resolution');
  const [settings, setSettings] = useState({
    resolution: '4K',
    fps: '30',
    denoising: true,
    color_enhancement: true,
    stabilization: false
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
        // Use taskId to download enhanced video
        setEnhancedVideoUrl(taskId);
        toast.success('Video enhancement completed successfully!');
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

  const handleDownload = async () => {
    if (enhancedVideoUrl && selectedFile) {
      try {
        setIsProcessing(true);
        const blob = await VideoService.downloadEnhancedVideo(enhancedVideoUrl);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `enhanced_${selectedFile.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success('Enhanced video downloaded successfully!');
      } catch (error) {
        console.error('Download error:', error);
        toast.error('Failed to download enhanced video');
      } finally {
        setIsProcessing(false);
      }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm border border-blue-200/50 rounded-full px-4 py-2 mb-6"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">AI-Powered Enhancement</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-br from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent"
          >
            Transform Your Videos
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              with AI Magic
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-slate-600 max-w-2xl mx-auto"
          >
            Enhance video quality, upscale resolution, and restore footage with cutting-edge AI technology
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Upload & Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* File Upload */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                        <FileVideo className="w-5 h-5 text-white" />
                      </div>
                      Upload Video
                    </CardTitle>
                    {selectedFile && (
                      <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Ready
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <motion.div
                    className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                      selectedFile
                        ? 'border-green-300 bg-green-50/30'
                        : 'border-slate-300 hover:border-blue-400 bg-slate-50/30 hover:bg-blue-50/30'
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    {!selectedFile ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                      >
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Upload className="w-16 h-16 mx-auto text-blue-500/60" />
                        </motion.div>
                        <div>
                          <p className="text-xl font-semibold text-slate-700 mb-2">
                            Click to upload your video
                          </p>
                          <p className="text-slate-500">
                            Supports MP4, AVI, MOV, MKV, WebM
                          </p>
                          <p className="text-sm text-slate-400 mt-2">
                            Maximum file size: 500MB
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-4"
                      >
                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center">
                          <CheckCircle2 className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-slate-800 mb-1">
                            {selectedFile.name}
                          </p>
                          <p className="text-sm text-slate-600">
                            {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enhancement Settings */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                      <Settings className="w-5 h-5 text-white" />
                    </div>
                    Enhancement Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Enhancement Type */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Enhancement Type</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { value: 'super_resolution', icon: Sparkles, label: 'Super Resolution', desc: '4x AI upscaling' },
                        { value: 'denoising', icon: Zap, label: 'AI Denoising', desc: 'Remove artifacts' },
                        { value: 'interpolation', icon: Film, label: 'Frame Interpolation', desc: 'Smooth motion' },
                        { value: 'restoration', icon: Palette, label: 'Video Restoration', desc: 'Complete restoration' }
                      ].map((type) => (
                        <motion.div key={type.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <button
                            onClick={() => setEnhancementType(type.value)}
                            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                              enhancementType === type.value
                                ? 'border-blue-500 bg-blue-50/50 shadow-lg'
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${
                                enhancementType === type.value
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                <type.icon className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{type.label}</p>
                                <p className="text-xs text-slate-500">{type.desc}</p>
                              </div>
                            </div>
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Output Settings */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Resolution */}
                    <div className="space-y-3">
                      <Label className="text-base font-medium flex items-center gap-2">
                        <HD className="w-4 h-4" />
                        Target Resolution
                      </Label>
                      <Select value={settings.resolution} onValueChange={(value) =>
                        setSettings(prev => ({ ...prev, resolution: value }))
                      }>
                        <SelectTrigger className="h-12 border-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="720p">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              HD (1280×720)
                            </div>
                          </SelectItem>
                          <SelectItem value="1080p">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              Full HD (1920×1080)
                            </div>
                          </SelectItem>
                          <SelectItem value="4K">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              4K (3840×2160)
                            </div>
                          </SelectItem>
                          <SelectItem value="8K">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              8K (7680×4320)
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* FPS */}
                    <div className="space-y-3">
                      <Label className="text-base font-medium flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Frame Rate
                      </Label>
                      <Select value={settings.fps} onValueChange={(value) =>
                        setSettings(prev => ({ ...prev, fps: value }))
                      }>
                        <SelectTrigger className="h-12 border-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24">24 FPS (Cinema)</SelectItem>
                          <SelectItem value="30">30 FPS (Standard)</SelectItem>
                          <SelectItem value="60">60 FPS (Smooth)</SelectItem>
                          <SelectItem value="120">120 FPS (Ultra)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Additional Options */}
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Additional Enhancements</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { id: 'denoise', label: 'AI Denoising', desc: 'Reduce noise', icon: Zap, checked: settings.denoising },
                        { id: 'color_enhance', label: 'Color Enhancement', desc: 'Boost colors', icon: Palette, checked: settings.color_enhancement },
                        { id: 'stabilize', label: 'Stabilization', desc: 'Reduce shake', icon: Activity, checked: settings.stabilization }
                      ].map((option) => (
                        <div key={option.id} className="flex items-center space-x-3 p-3 rounded-xl border border-slate-200 bg-white/50">
                          <Switch
                            id={option.id}
                            checked={option.checked}
                            onCheckedChange={(checked) =>
                              setSettings(prev => ({ ...prev, [option.id.replace('color_enhance', 'color_enhancement').replace('denoise', 'denoising')]: checked }))
                            }
                          />
                          <div className="flex-1">
                            <Label htmlFor={option.id} className="text-sm font-medium cursor-pointer">
                              {option.label}
                            </Label>
                            <p className="text-xs text-slate-500">{option.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enhancement Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button
                onClick={handleEnhance}
                disabled={!selectedFile || isProcessing}
                className="w-full relative group"
                whileHover={{ scale: !selectedFile || isProcessing ? 1 : 1.02 }}
                whileTap={{ scale: !selectedFile || isProcessing ? 1 : 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6 disabled:opacity-50">
                  <div className="flex items-center justify-center gap-3 text-lg font-semibold">
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing Enhancement...
                      </>
                    ) : (
                      <>
                        {getEnhancementIcon(enhancementType)}
                        Start AI Enhancement
                      </>
                    )}
                  </div>
                </div>
              </motion.button>
            </motion.div>
          </div>

          {/* Right Column - Processing Status & Preview */}
          <div className="space-y-6">
            {/* Processing Status */}
            <AnimatePresence>
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50/50 overflow-hidden">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-3">
                        <div className="p-2 bg-blue-500 rounded-xl animate-pulse">
                          <Cpu className="w-4 h-4 text-white" />
                        </div>
                        Processing Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 capitalize">{processingStatus}</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-3" />
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>Enhancement in progress...</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* AI Features */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">AI Capabilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { icon: Sparkles, label: 'Real-ESRGAN', desc: '4K upscaling' },
                      { icon: Zap, label: 'RIFE Model', desc: 'Smooth motion' },
                      { icon: Cpu, label: 'GPU Accelerated', desc: 'Fast processing' }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                          <feature.icon className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{feature.label}</p>
                          <p className="text-xs text-slate-500">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Results Preview */}
            <AnimatePresence>
              {enhancedVideoUrl && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50/50">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-3">
                        <div className="p-2 bg-green-500 rounded-xl">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                        Enhancement Complete!
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <motion.button
                        onClick={handleDownload}
                        className="w-full group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl p-4 flex items-center justify-center gap-3">
                          <Download className="w-5 h-5" />
                          <span className="font-medium">Download Enhanced Video</span>
                        </div>
                      </motion.button>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Quality improved by 400%</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>No watermark applied</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Video Comparison Section */}
        <AnimatePresence>
          {enhancedVideoUrl && selectedFile && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.5 }}
              className="mt-12"
            >
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Before & After</CardTitle>
                  <CardDescription>See the AI enhancement results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Original */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-slate-100">Original</Badge>
                        <span className="text-sm text-slate-600">
                          {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                        </span>
                      </div>
                      <div className="relative aspect-video bg-slate-100 rounded-xl overflow-hidden">
                        <video
                          controls
                          className="w-full h-full object-contain"
                          src={URL.createObjectURL(selectedFile)}
                        />
                      </div>
                    </div>

                    {/* Enhanced */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500">Enhanced</Badge>
                        <span className="text-sm text-slate-600">AI Processed</span>
                      </div>
                      <div className="relative aspect-video bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl overflow-hidden">
                        <video
                          controls
                          className="w-full h-full object-contain"
                          src={VideoService.getEnhancedVideoUrl(enhancedVideoUrl)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EnhancePage;
