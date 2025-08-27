"use client";

import { useState } from "react";
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
  ArrowRight, 
  Zap, 
  Layers, 
  Gauge, 
  Sparkles, 
  Shield, 
  Palette, 
  BarChart3, 
  Share2, 
  Code, 
  CheckCircle2 
} from "lucide-react";

export default function FeaturesPage() {
  const [activeTab, setActiveTab] = useState("enhancement");
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const features = {
    enhancement: [
      {
        icon: <Zap className="h-10 w-10 text-chart-1" />,
        title: "Super Resolution",
        description: "Transform low-resolution videos into stunning HD, 4K, or even 8K with our advanced AI upscaling technology."
      },
      {
        icon: <Layers className="h-10 w-10 text-chart-2" />,
        title: "Noise Reduction",
        description: "Eliminate digital noise, grain, and compression artifacts for cleaner, more professional-looking videos."
      },
      {
        icon: <Gauge className="h-10 w-10 text-chart-3" />,
        title: "Frame Rate Conversion",
        description: "Convert standard videos to smooth 60fps or even 120fps with AI-powered frame interpolation."
      },
      {
        icon: <Sparkles className="h-10 w-10 text-chart-4" />,
        title: "Video Stabilization",
        description: "Remove camera shake and jitter for perfectly smooth, professional-quality footage."
      }
    ],
    color: [
      {
        icon: <Palette className="h-10 w-10 text-chart-1" />,
        title: "Color Enhancement",
        description: "Automatically improve color vibrancy, contrast, and saturation for more visually appealing videos."
      },
      {
        icon: <Sparkles className="h-10 w-10 text-chart-2" />,
        title: "HDR Conversion",
        description: "Transform standard videos into HDR-like quality with improved dynamic range and color depth."
      },
      {
        icon: <Layers className="h-10 w-10 text-chart-3" />,
        title: "Color Grading",
        description: "Apply professional color grading presets or create custom looks for your videos."
      },
      {
        icon: <Zap className="h-10 w-10 text-chart-4" />,
        title: "White Balance Correction",
        description: "Automatically fix incorrect white balance for more natural-looking colors."
      }
    ],
    platform: [
      {
        icon: <Shield className="h-10 w-10 text-chart-1" />,
        title: "Secure Processing",
        description: "Your videos are processed securely with enterprise-grade encryption and automatically deleted after download."
      },
      {
        icon: <BarChart3 className="h-10 w-10 text-chart-2" />,
        title: "Real-Time Progress",
        description: "Track your video processing in real-time with our intuitive progress dashboard."
      },
      {
        icon: <Share2 className="h-10 w-10 text-chart-3" />,
        title: "Easy Sharing",
        description: "Download in multiple formats and share your enhanced videos directly to social media."
      },
      {
        icon: <Code className="h-10 w-10 text-chart-4" />,
        title: "API Access",
        description: "Integrate our video enhancement technology into your own applications with our developer-friendly API."
      }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-24 max-w-7xl">
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Powerful AI Video Enhancement</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover all the ways our cutting-edge AI technology can transform your videos
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-16">
        <div className="flex justify-center">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="enhancement">Enhancement</TabsTrigger>
            <TabsTrigger value="color">Color</TabsTrigger>
            <TabsTrigger value="platform">Platform</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="enhancement" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.enhancement.map((feature, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="bg-background/50 backdrop-blur-sm border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 relative overflow-hidden rounded-xl border">
            <div className="aspect-video relative">
              <Image
                src="https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=2069&auto=format&fit=crop"
                alt="Video Enhancement"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-2xl font-bold mb-2 text-white">See the Difference</h3>
                <p className="text-white/80 mb-4 max-w-lg">
                  Our AI enhancement technology can transform even the lowest quality videos into stunning, professional-quality content.
                </p>
                <Button asChild>
                  <Link href="/demo">
                    Watch Demo <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="color" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.color.map((feature, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="bg-background/50 backdrop-blur-sm border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 relative overflow-hidden rounded-xl border">
            <div className="aspect-video relative">
              <Image
                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop"
                alt="Color Enhancement"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-2xl font-bold mb-2 text-white">Vibrant, Natural Colors</h3>
                <p className="text-white/80 mb-4 max-w-lg">
                  Transform dull, washed-out footage into vibrant, cinematic videos with our AI color enhancement.
                </p>
                <Button asChild>
                  <Link href="/demo">
                    See Examples <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="platform" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.platform.map((feature, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="bg-background/50 backdrop-blur-sm border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 relative overflow-hidden rounded-xl border">
            <div className="aspect-video relative">
              <Image
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop"
                alt="Platform Features"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-2xl font-bold mb-2 text-white">Built for Professionals</h3>
                <p className="text-white/80 mb-4 max-w-lg">
                  Our platform is designed for content creators, filmmakers, and businesses who demand the highest quality video enhancement.
                </p>
                <Button asChild>
                  <Link href="/enhance">
                    Try It Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Technical Specifications</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our AI video enhancement technology supports a wide range of formats and resolutions
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Input Formats</CardTitle>
              <CardDescription>Supported video formats for processing</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[
                  "MP4 (H.264, H.265)",
                  "MOV (QuickTime)",
                  "AVI",
                  "WMV",
                  "MKV",
                  "WebM",
                  "FLV",
                  "MPEG-2",
                  "MPEG-4"
                ].map((format, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span>{format}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Output Options</CardTitle>
              <CardDescription>Available export settings</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[
                  "Resolution: 720p, 1080p, 1440p, 4K, 8K",
                  "Frame Rate: 24fps, 30fps, 60fps, 120fps",
                  "Codec: H.264, H.265 (HEVC), ProRes",
                  "Bit Rate: Adjustable (up to 100Mbps)",
                  "Color Depth: 8-bit, 10-bit",
                  "HDR: HDR10, HLG",
                  "Audio: Pass-through or enhanced",
                  "Format: MP4, MOV, MKV"
                ].map((option, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span>{option}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-20 bg-muted/50 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to transform your videos?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Join thousands of content creators, filmmakers, and businesses who are already using VidioX AI to enhance their videos.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/enhance">
              Start Enhancing Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/pricing">
              View Pricing
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}