"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Video, 
  Zap, 
  BarChart3, 
  Share2, 
  Shield, 
  Download, 
  CheckCircle2
} from "lucide-react";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const features = [
    {
      icon: <Zap className="h-10 w-10 text-chart-1" />,
      title: "AI-Powered Enhancement",
      description: "Transform low-quality videos into stunning HD and 4K with our advanced AI super-resolution technology."
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
      icon: <Shield className="h-10 w-10 text-chart-4" />,
      title: "Secure Processing",
      description: "Your videos are processed securely with enterprise-grade encryption and automatically deleted after download."
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 z-0" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={fadeIn}
              className="space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
              >
                AI-Powered Video Enhancement
              </motion.div>
              <motion.h1 
                variants={fadeIn}
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
              >
                Transform Your Videos with <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">AI Magic</span>
              </motion.h1>
              <motion.p 
                variants={fadeIn}
                className="text-lg md:text-xl text-muted-foreground max-w-xl"
              >
                Enhance low-quality videos to stunning HD and 4K with our AI-powered super-resolution technology. No technical skills required.
              </motion.p>
              <motion.div 
                variants={fadeIn}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button size="lg" asChild>
                  <Link href="/enhance" className="group">
                    Enhance Your Video
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/demo">
                    Watch Demo
                  </Link>
                </Button>
              </motion.div>
              <motion.div 
                variants={fadeIn}
                className="flex items-center space-x-4 text-sm text-muted-foreground"
              >
                <div className="flex items-center">
                  <CheckCircle2 className="mr-1 h-4 w-4 text-green-500" />
                  <span>No watermarks</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="mr-1 h-4 w-4 text-green-500" />
                  <span>Free trial available</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="mr-1 h-4 w-4 text-green-500" />
                  <span>No credit card</span>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-video overflow-hidden rounded-xl border shadow-xl bg-gradient-to-br from-background to-muted">
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Video className="h-16 w-16 mx-auto text-primary/50" />
                    <p className="text-muted-foreground">Video preview will appear here</p>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />
              
              {/* Glass card */}
              <div className="absolute -bottom-6 -right-6 bg-background/80 backdrop-blur-md border rounded-lg p-4 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Download className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Processing Complete</p>
                    <p className="text-xs text-muted-foreground">4K • 60fps • Enhanced</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful AI Video Enhancement</h2>
            <p className="text-lg text-muted-foreground">
              Our cutting-edge AI technology transforms your videos with these powerful features
            </p>
          </div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-background/50 backdrop-blur-sm border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">
              Enhance your videos in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload Your Video",
                description: "Upload any video file. We support all major formats including MP4, AVI, MOV, and more.",
                image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1964&auto=format&fit=crop"
              },
              {
                step: "02",
                title: "AI Enhancement",
                description: "Our AI automatically enhances your video, improving resolution, removing noise, and increasing frame rate.",
                image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
              },
              {
                step: "03",
                title: "Download & Share",
                description: "Download your enhanced video in your preferred format or share it directly to social media.",
                image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=1964&auto=format&fit=crop"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative group"
              >
                <div className="relative overflow-hidden rounded-xl aspect-[4/3]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute top-4 left-4 bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold">
                    {item.step}
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold">Ready to Transform Your Videos?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of content creators, filmmakers, and businesses who are already using VidioX AI to enhance their videos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/enhance">
                    Start Enhancing Now
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/pricing">
                    View Pricing
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}