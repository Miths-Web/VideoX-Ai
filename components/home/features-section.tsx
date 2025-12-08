"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Zap, BarChart3, Share2, Shield, Image as ImageIcon, Wand2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BeforeAfterSlider } from "@/components/ui/before-after-slider";
import { useRef } from "react";

function ParallaxImage({ children }: { children: React.ReactNode }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });
    const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

    return (
        <motion.div ref={ref} style={{ y }}>
            {children}
        </motion.div>
    );
}

export default function FeaturesSection() {
    const features = [
        {
            icon: <Zap className="h-6 w-6 text-primary" />,
            title: "AI Video Enhancer",
            description: "Transform low-quality footage into stunning 4K resolution. Our definition-aware models restore lost details and sharpen edges instantly, breathing new life into every frame.",
            image: "https://images.unsplash.com/photo-1535016120720-40c6874c3b1c?q=80&w=2664&auto=format&fit=crop",
            href: "/features/ai-video-enhancer"
        },
        {
            icon: <ImageIcon className="h-6 w-6 text-primary" />,
            title: "AI Image Enhancer",
            description: "Restore old, blurry, or low-resolution photos with a single click. Recover facial details, fix compression artifacts, and upscale your memories to print-ready quality.",
            image: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=2000&auto=format&fit=crop",
            href: "/features/ai-image-enhancer"
        },
        {
            icon: <Wand2 className="h-6 w-6 text-primary" />,
            title: "Intelligent Noise Remover",
            description: "Automatically detect and clean up background noise from your videos. Whether it's wind, rain, static, breathing, or traffic, our AI removes them in seconds for crystal-clear audio.",
            image: "https://resource.flexclip.com/pages/builder/remove-background-noise-from-video/feature1.webp",
            href: "/features/noise-reducer"
        }
    ];

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-muted/30" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-3xl mx-auto mb-24"
                >
                    <div className="inline-flex items-center justify-center p-2 bg-primary/5 rounded-full mb-4">
                        <span className="text-sm font-medium text-primary px-2">Features</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Powerful AI Video Enhancement</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Our cutting-edge AI technology transforms your videos with these powerful features, designed for both creators and professionals.
                    </p>
                </motion.div>

                <div className="space-y-32">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-24`}
                        >
                            {/* Text Content */}
                            <div className="flex-1 space-y-8 text-center lg:text-left">
                                <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-2xl w-fit mx-auto lg:mx-0 shadow-inner">
                                    {feature.icon}
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-3xl md:text-4xl font-bold tracking-tight">{feature.title}</h3>
                                    <p className="text-lg text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                    <Button asChild>
                                        <Link href={feature.href || "#"}>
                                            Try It Now
                                        </Link>
                                    </Button>
                                </div>
                                <div className="pt-4">
                                    <div className="h-1 w-20 bg-gradient-to-r from-primary to-transparent rounded-full mx-auto lg:mx-0" />
                                </div>
                            </div>

                            {/* Visual Content */}
                            <div className="flex-1 w-full">
                                {index === 0 ? (
                                    <ParallaxImage>
                                        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-background/50 backdrop-blur-sm group">
                                            <video
                                                src="https://downloads.topazlabs.com/web-assets/HalfReveal-HomeHero-3-opt.mp4"
                                                className="w-full h-full object-cover"
                                                autoPlay
                                                muted
                                                loop
                                                playsInline
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none z-20" />
                                        </div>
                                    </ParallaxImage>
                                ) : index === 1 ? (
                                    <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                                        <BeforeAfterSlider
                                            beforeImage={`${feature.image}&blur=10`}
                                            afterImage={feature.image}
                                            beforeLabel="Original"
                                            afterLabel="Enhanced"
                                        />
                                    </div>
                                ) : (
                                    <ParallaxImage>
                                        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-background/50 backdrop-blur-sm group">
                                            <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors duration-500 z-10" />
                                            <img
                                                src={feature.image}
                                                alt={feature.title}
                                                className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none z-20" />
                                        </div>
                                    </ParallaxImage>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
