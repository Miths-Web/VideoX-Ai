import { FeatureLayout } from "@/components/features/feature-layout";
import { Waves } from "lucide-react";

export default function NoiseReducerPage() {
    return (
        <FeatureLayout
            title="Noise Remover"
            description="Automatically detect and clean up background noise from your videos. Whether it's wind, rain, static, breathing, or traffic, our AI removes them in seconds for crystal-clear audio."
            icon={Waves}
            features={[
                "Advanced denoising for low-light video",
                "Removes compression artifacts and blockiness",
                "Preserves fine textures like skin and fabric",
                "Adjustable noise reduction strength"
            ]}
        />
    );
}
