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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400/10 rounded-full blur-2xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={fadeIn}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm border border-blue-200/50 rounded-full px-4 py-2"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">🚀 Next-Gen AI Technology</span>
              </motion.div>

              <motion.h1
                variants={fadeIn}
                className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
              >
                <span className="bg-gradient-to-br from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  Transform Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Videos to 4K
                </span>
              </motion.h1>

              <motion.p
                variants={fadeIn}
                className="text-xl md:text-2xl text-slate-600 max-w-2xl leading-relaxed"
              >
                Experience the power of AI video enhancement. Upscale, denoise, and restore your footage with cutting-edge technology.
              </motion.p>

              <motion.div
                variants={fadeIn}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button size="lg" asChild className="group relative overflow-hidden">
                  <Link href="/enhance" className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-md group-hover:blur-lg transition-all"></div>
                    <span className="relative flex items-center text-lg font-semibold">
                      Start Enhancing Now
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-slate-200 hover:bg-slate-50">
                  <Link href="/enhance">
                    <Video className="mr-2 h-5 w-5" />
                    Try Demo Video
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                variants={fadeIn}
                className="flex flex-wrap items-center gap-6 text-sm text-slate-600"
              >
                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-full">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="font-medium">No Watermarks</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-full">
                  <Zap className="h-4 w-4" />
                  <span className="font-medium">Lightning Fast</span>
                </div>
                <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-2 rounded-full">
                  <Shield className="h-4 w-4" />
                  <span className="font-medium">Secure Processing</span>
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
      <section className="py-24 bg-gradient-to-br from-white via-slate-50 to-blue-50/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center max-w-4xl mx-auto mb-20"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm border border-blue-200/50 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">AI-Powered Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-br from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Why Choose VideoX AI?
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              Experience the future of video enhancement with our cutting-edge AI technology
            </p>
          </motion.div>

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
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl transform group-hover:scale-105 transition-transform duration-300"></div>
                <div className="relative bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-800">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
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