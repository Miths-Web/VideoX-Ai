"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
    {
        question: "Is VideoX AI free to use?",
        answer: "Yes! We offer a generous free tier that allows you to enhance videos up to 1080p. For 4K upscaling and faster processing, you can upgrade to our Pro plan.",
    },
    {
        question: "How long does it take to enhance a video?",
        answer: "It depends on the video length and your internet connection. Typically, a 1-minute video takes about 2-3 minutes to process. Our AI analyzes every frame to ensure the best quality.",
    },
    {
        question: "What video formats do you support?",
        answer: "We support all major video formats including MP4, MOV, AVI, and MKV. You can upload videos up to 500MB in size.",
    },
    {
        question: "Is my data safe?",
        answer: "Absolutely. Your videos are processed securely on our encrypted servers and are automatically deleted after 24 hours. We never share your content with third parties.",
    },
    {
        question: "Can I use this on my phone?",
        answer: "Yes! VideoX AI is fully responsive and works great on both iOS and Android browsers. No app download required.",
    },
];

export default function FAQSection() {
    return (
        <section className="py-24 bg-background">
            <div className="container px-4 md:px-6 mx-auto"> {/* ⭐ CENTER FIX */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center text-center space-y-4 mb-16"
                >
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-muted-foreground md:text-xl text-center">
                        Everything you need to know about VideoX AI.
                    </p>
                </motion.div>

                <div className="max-w-3xl mx-auto">
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <AccordionItem value={`item-${index}`}>
                                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            </motion.div>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
}
