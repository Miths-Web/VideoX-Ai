"use client";

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
  BookOpen, 
  Code, 
  Video, 
  FileText, 
  HelpCircle, 
  ArrowRight, 
  Search,
  Zap,
  Layers,
  Palette
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function DocsPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-6xl">
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Documentation</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Learn how to use VidioX AI to enhance your videos
        </p>
        
        <div className="relative max-w-xl mx-auto mt-8">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search documentation..." 
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {[
          {
            icon: <BookOpen className="h-8 w-8 text-chart-1" />,
            title: "Getting Started",
            description: "Learn the basics of VidioX AI and how to enhance your first video",
            href: "/docs/getting-started"
          },
          {
            icon: <Video className="h-8 w-8 text-chart-2" />,
            title: "Video Enhancement",
            description: "Detailed guides on all video enhancement features and options",
            href: "/docs/enhancement"
          },
          {
            icon: <Code className="h-8 w-8 text-chart-3" />,
            title: "API Reference",
            description: "Integrate VidioX AI into your applications with our API",
            href: "/api"
          },
          {
            icon: <FileText className="h-8 w-8 text-chart-4" />,
            title: "Tutorials",
            description: "Step-by-step tutorials for common use cases",
            href: "/docs/tutorials"
          },
          {
            icon: <HelpCircle className="h-8 w-8 text-chart-5" />,
            title: "FAQs",
            description: "Answers to frequently asked questions",
            href: "/docs/faqs"
          },
          {
            icon: <Zap className="h-8 w-8 text-chart-1" />,
            title: "Best Practices",
            description: "Tips and tricks for getting the best results",
            href: "/docs/best-practices"
          }
        ].map((item, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="mb-2">{item.icon}</div>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href={item.href}>
                  View Documentation <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Featured Guides</h2>
        
        <Tabs defaultValue="resolution" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="resolution">Resolution Enhancement</TabsTrigger>
            <TabsTrigger value="framerate">Frame Rate Conversion</TabsTrigger>
            <TabsTrigger value="color">Color Enhancement</TabsTrigger>
          </TabsList>
          
          <TabsContent value="resolution" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Layers className="h-5 w-5 mr-2 text-chart-1" />
                  Resolution Enhancement
                </CardTitle>
                <CardDescription>
                  Transform low-resolution videos into stunning HD, 4K, or 8K
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  VidioX AI uses advanced neural networks to intelligently upscale your videos to higher resolutions while preserving and enhancing details. Our AI can analyze the content of each frame to reconstruct details that were lost in the original low-resolution video.
                </p>
                
                <h3 className="text-lg font-semibold mt-4">Available Resolution Options</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>HD (1080p)</strong> - 1920×1080 pixels, ideal for standard online viewing</li>
                  <li><strong>2K (1440p)</strong> - 2560×1440 pixels, great for high-quality online content</li>
                  <li><strong>4K (2160p)</strong> - 3840×2160 pixels, perfect for professional content and large displays</li>
                  <li><strong>8K (4320p)</strong> - 7680×4320 pixels, ultra-high definition for maximum detail (Enterprise plan only)</li>
                </ul>
                
                <h3 className="text-lg font-semibold mt-4">Best Practices</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>For best results, use videos with minimal compression artifacts</li>
                  <li>Videos with good lighting will produce better enhancement results</li>
                  <li>Consider enabling noise reduction for older or lower quality source videos</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href="/docs/enhancement/resolution">
                    Read Full Guide <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="framerate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-chart-2" />
                  Frame Rate Conversion
                </CardTitle>
                <CardDescription>
                  Convert standard videos to smooth 60fps or even 120fps
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Our AI-powered frame interpolation technology can increase the frame rate of your videos, creating new intermediate frames for smoother motion. This is especially useful for action sequences, sports videos, or any content where smooth motion is desired.
                </p>
                
                <h3 className="text-lg font-semibold mt-4">Available Frame Rate Options</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>24 FPS</strong> - Film-like motion, ideal for cinematic content</li>
                  <li><strong>30 FPS</strong> - Standard frame rate for most video content</li>
                  <li><strong>60 FPS</strong> - Smooth motion, great for action and sports</li>
                  <li><strong>120 FPS</strong> - Ultra-smooth motion for maximum fluidity (Pro and Enterprise plans only)</li>
                </ul>
                
                <h3 className="text-lg font-semibold mt-4">How It Works</h3>
                <p>
                  Our AI analyzes the motion between existing frames and generates new intermediate frames by predicting how objects move. This creates a smoother viewing experience without the artifacts commonly seen in traditional frame interpolation methods.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href="/docs/enhancement/framerate">
                    Read Full Guide <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="color" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="h-5 w-5 mr-2 text-chart-3" />
                  Color Enhancement
                </CardTitle>
                <CardDescription>
                  Improve color vibrancy, contrast, and overall visual appeal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  VidioX AI can analyze and enhance the colors in your videos, improving vibrancy, contrast, and overall visual appeal. Our AI can correct white balance issues, enhance specific colors, and even simulate HDR-like effects on standard videos.
                </p>
                
                <h3 className="text-lg font-semibold mt-4">Color Enhancement Features</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Color Vibrancy</strong> - Enhance color saturation and vibrancy without oversaturation</li>
                  <li><strong>Contrast Enhancement</strong> - Improve dynamic range for more impactful visuals</li>
                  <li><strong>White Balance Correction</strong> - Fix color temperature issues in poorly lit videos</li>
                  <li><strong>HDR Simulation</strong> - Create HDR-like effects on standard videos (Pro and Enterprise plans only)</li>
                </ul>
                
                <h3 className="text-lg font-semibold mt-4">Best Practices</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>For best results, use videos with decent original color quality</li>
                  <li>Color enhancement works best when combined with resolution enhancement</li>
                  <li>Consider your target platform when choosing color enhancement settings</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href="/docs/enhancement/color">
                    Read Full Guide <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="bg-muted/50 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Need more help?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Can't find what you're looking for in our documentation? Our support team is here to help.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/contact">
              Contact Support
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/docs/faqs">
              View FAQs
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}