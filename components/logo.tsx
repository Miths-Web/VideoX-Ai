"use client";

import Link from "next/link";
import { Video } from "lucide-react";
import { motion } from "framer-motion";

export const Logo = () => {
    return (
        <Link href="/" className="flex items-center space-x-2">
            <motion.div
                initial={{ rotate: -10, scale: 0.9 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Video className="h-8 w-8 text-primary" />
            </motion.div>
            <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600"
            >
                VidioX AI
            </motion.span>
        </Link>
    );
};
