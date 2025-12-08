import { FeatureLayout } from "@/components/features/feature-layout";
import { Sparkles } from "lucide-react";

export default function AIEnhancementPage() {
    return (
        <FeatureLayout
            title="AI Enhancement"
            description="Experience the future of video quality. Our general-purpose AI enhancement engine analyzes your footage frame-by-frame to intelligently improve clarity, color, and detail."
            icon={Sparkles}
            features={[
                "Automatic quality analysis and improvement",
                "Intelligent color correction and grading",
                "detail recovery in low-light footage",
                "Artifact removal and cleaner edges"
            ]}
        />
    );
}
