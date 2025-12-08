import { FeatureLayout } from "@/components/features/feature-layout";
import { MoveUp } from "lucide-react";

export default function VideoUpscalerPage() {
    return (
        <FeatureLayout
            title="Video Upscaler"
            description="Upscale your videos from SD to HD, or HD to 4K/8K. Our AI doesn't just stretch pixels—it hallucinates new realistic details for true high-resolution results."
            icon={MoveUp}
            features={[
                "Upscale 480p/720p content to 4K",
                "Crisp edges without pixelation",
                "Preserves natural textures",
                "Ideal for modern high-DPI displays"
            ]}
        />
    );
}
