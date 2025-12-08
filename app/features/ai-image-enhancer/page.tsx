import { FeatureLayout } from "@/components/features/feature-layout";
import { Image as ImageIcon } from "lucide-react";

export default function AIImageEnhancerPage() {
    return (
        <FeatureLayout
            title="AI Image Enhancer"
            description="Bring new life to your photos. Upscale images, remove noise, and recover lost details with our dedicated image enhancement neural networks."
            icon={ImageIcon}
            features={[
                "Up to 8x resolution upscaling for images",
                "Face recovery and detail enhancement",
                "Old photo restoration capabilities",
                "Batch processing for photo collections"
            ]}
        />
    );
}
