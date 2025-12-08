"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Video, Download, CheckCircle2, Sparkles } from "lucide-react";
import { BeforeAfterSlider } from "@/components/ui/before-after-slider";


export function HeroSection() {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const videos = [
        "https://downloads.topazlabs.com/web-assets/HalfReveal-HomeHero-5-opt.mp4",
        "https://downloads.topazlabs.com/web-assets/HalfReveal-HomeHero-1-opt.mp4",
        "https://downloads.topazlabs.com/web-assets/HalfReveal-HomeHero-2_1-opt.mp4",
    ];
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    useEffect(() => {
        // Play the current video
        const currentVideo = videoRefs.current[currentVideoIndex];
        if (currentVideo) {
            currentVideo.currentTime = 0;
            currentVideo.play().catch(console.error);
        }
    }, [currentVideoIndex]);

    return (
        <section className="relative overflow-hidden py-20 md:py-32">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background z-0" />

            {/* Animated Grid Pattern */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 z-0"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        className="space-y-8"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm"
                        >
                            <Sparkles className="mr-2 h-3.5 w-3.5" />
                            AI-Powered Video Enhancement
                        </motion.div>

                        <motion.h1
                            variants={fadeIn}
                            className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]"
                        >
                            Revitalize Your Videos with <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500 animate-gradient-x">
                                AI Magic
                            </span>
                        </motion.h1>

                        <motion.p
                            variants={fadeIn}
                            className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed"
                        >
                            Instantly upscale low-resolution footage to stunning 4K. Restore details, remove noise, and stabilize shaky video with our enterprise-grade AI engine.
                        </motion.p>

                        <motion.div
                            variants={fadeIn}
                            className="flex flex-col sm:flex-row gap-4 pt-2"
                        >
                            <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300" asChild>
                                <Link href="/enhance" className="group">
                                    Start Enhancing
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="h-12 px-8 text-base border-primary/20 hover:bg-primary/5" asChild>
                                <Link href="/demo">
                                    View Gallery
                                </Link>
                            </Button>
                        </motion.div>

                        <motion.div
                            variants={fadeIn}
                            className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground"
                        >
                            <div className="flex items-center">
                                <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                                <span>No watermarks</span>
                            </div>
                            <div className="flex items-center">
                                <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                                <span>Free starter plan</span>
                            </div>
                            <div className="flex items-center">
                                <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                                <span>Secure processing</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative aspect-video rounded-2xl shadow-2xl overflow-hidden bg-black/50 border border-white/10 backdrop-blur-sm group">
                            {videos.map((src, index) => (
                                <video
                                    key={index}
                                    ref={(el) => {
                                        videoRefs.current[index] = el;
                                    }}
                                    src={src}
                                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentVideoIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                                        }`}
                                    muted
                                    playsInline
                                    onEnded={() => {
                                        setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
                                    }}
                                />
                            ))}

                            {/* Glass overlay/reflection for premium look */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none z-20" />
                        </div>

                        {/* Floating ambient glow effects */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl -z-10 animate-pulse delay-700" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
