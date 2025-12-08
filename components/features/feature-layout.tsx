import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface FeaturePageProps {
    title: string;
    description: string;
    heroImage?: string;
    features: string[];
    icon: React.ElementType;
}

export function FeatureLayout({ title, description, heroImage, features, icon: Icon }: FeaturePageProps) {
    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
                    <div className="space-y-8">
                        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                            <Icon className="mr-2 h-4 w-4" />
                            Feature Highlights
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                            {title}
                        </h1>

                        <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                            {description}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button size="lg" className="h-12 px-8 text-base" asChild>
                                <Link href="/enhance">
                                    Try It Now
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
                                <Link href="/pricing">
                                    View Pricing
                                </Link>
                            </Button>
                        </div>

                        <div className="space-y-4 pt-4">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-center text-muted-foreground">
                                    <CheckCircle2 className="mr-3 h-5 w-5 text-primary" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-muted/20">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-purple-500/10" />
                            {/* Abstract representation if no image provided */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Icon className="h-32 w-32 text-primary/20" />
                            </div>
                        </div>

                        {/* Decor elements */}
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
                        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10" />
                    </div>
                </div>
            </div>
        </div>
    );
}
