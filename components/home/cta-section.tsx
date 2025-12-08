"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function CTASection() {
    return (
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
    );
}
