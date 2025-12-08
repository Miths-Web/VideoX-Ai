"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface BeforeAfterSliderProps {
    beforeVideo?: string | string[];
    afterVideo?: string | string[];
    beforeImage?: string;
    afterImage?: string;
    beforeLabel?: string;
    afterLabel?: string;
    className?: string;
    isBeforeBlur?: boolean;
    poster?: string;
}

export function BeforeAfterSlider({
    beforeVideo,
    afterVideo,
    beforeImage,
    afterImage,
    beforeLabel = "Original",
    afterLabel = "Enhanced",
    className,
    isBeforeBlur = false,
    poster,
}: BeforeAfterSliderProps) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const beforeVideoRef = useRef<HTMLVideoElement>(null);
    const afterVideoRef = useRef<HTMLVideoElement>(null);

    const beforeVideos = Array.isArray(beforeVideo) ? beforeVideo : beforeVideo ? [beforeVideo] : [];
    const afterVideos = Array.isArray(afterVideo) ? afterVideo : afterVideo ? [afterVideo] : [];

    const handleVideoEnded = useCallback(() => {
        if (beforeVideos.length > 1) {
            setCurrentVideoIndex((prev) => (prev + 1) % beforeVideos.length);
        }
    }, [beforeVideos.length]);

    const handleMove = useCallback(
        (event: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
            if (!containerRef.current) return;

            const containerRect = containerRef.current.getBoundingClientRect();
            const clientX =
                "touches" in event ? event.touches[0].clientX : (event as MouseEvent).clientX;

            const relativeX = clientX - containerRect.left;
            const percentage = (relativeX / containerRect.width) * 100;

            setSliderPosition(Math.min(Math.max(percentage, 0), 100));
        },
        []
    );

    const handleMouseDown = useCallback(() => {
        setIsDragging(true);
    }, []);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener("mousemove", handleMove);
            window.addEventListener("mouseup", handleMouseUp);
            window.addEventListener("touchmove", handleMove);
            window.addEventListener("touchend", handleMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("touchmove", handleMove);
            window.removeEventListener("touchend", handleMouseUp);
        };
    }, [isDragging, handleMove, handleMouseUp]);

    // Sync videos
    useEffect(() => {
        if (beforeVideos.length === 0 || afterVideos.length === 0) return;

        const before = beforeVideoRef.current;
        const after = afterVideoRef.current;

        if (!before || !after) return;

        const syncVideos = () => {
            if (Math.abs(before.currentTime - after.currentTime) > 0.1) {
                after.currentTime = before.currentTime;
            }
        };

        const playBoth = () => {
            before.play().catch(() => { });
            after.play().catch(() => { });
        };

        const pauseBoth = () => {
            before.pause();
            after.pause();
        };

        before.addEventListener("timeupdate", syncVideos);
        before.addEventListener("play", playBoth);
        before.addEventListener("pause", pauseBoth);
        before.addEventListener("ended", handleVideoEnded);

        // Initial play
        playBoth();

        return () => {
            before.removeEventListener("timeupdate", syncVideos);
            before.removeEventListener("play", playBoth);
            before.removeEventListener("pause", pauseBoth);
            before.removeEventListener("ended", handleVideoEnded);
        };
    }, [beforeVideos, afterVideos, currentVideoIndex, handleVideoEnded]);

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative w-full aspect-video overflow-hidden rounded-xl border shadow-xl select-none cursor-ew-resize bg-black",
                className
            )}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
        >
            {/* Before Content (Background) */}
            <div className="absolute inset-0">
                {beforeImage ? (
                    <Image
                        src={beforeImage}
                        alt="Before"
                        fill
                        className={cn(
                            "object-cover",
                            isBeforeBlur && "blur-sm scale-[1.01]"
                        )}
                        draggable={false}
                        priority
                    />
                ) : (
                    <video
                        ref={beforeVideoRef}
                        src={beforeVideos[currentVideoIndex]}
                        className={cn(
                            "w-full h-full object-cover",
                            isBeforeBlur && "blur-sm scale-[1.01]"
                        )}
                        muted
                        playsInline
                        autoPlay
                        poster={poster}
                    />
                )}
                {beforeLabel && (
                    <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-md text-sm font-medium backdrop-blur-sm z-10">
                        {beforeLabel}
                    </div>
                )}
            </div>

            {/* After Content (Foreground - Clipped) */}
            <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                {afterImage ? (
                    <Image
                        src={afterImage}
                        alt="After"
                        fill
                        className="object-cover"
                        draggable={false}
                        priority
                    />
                ) : (
                    <video
                        ref={afterVideoRef}
                        src={afterVideos[currentVideoIndex]}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                        autoPlay
                        poster={poster}
                    />
                )}
                {afterLabel && (
                    <div className="absolute top-4 right-4 bg-primary/80 text-primary-foreground px-3 py-1 rounded-md text-sm font-medium backdrop-blur-sm z-10">
                        {afterLabel}
                    </div>
                )}
            </div>

            {/* Slider Handle */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20"
                style={{ left: `${sliderPosition}%` }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <GripVertical className="h-4 w-4 text-gray-600" />
                </div>
            </div>
        </div>
    );
}
