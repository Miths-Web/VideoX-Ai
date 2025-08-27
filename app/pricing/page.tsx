"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, HelpCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      name: "Free",
      description: "For casual users and beginners",
      price: {
        monthly: 0,
        yearly: 0,
      },
      features: [
        "720p to 1080p enhancement",
        "Up to 5 minutes video length",
        "500MB file size limit",
        "3 videos per month",
        "Basic noise reduction",
        "Standard processing speed",
        "Email support",
      ],
      limitations: [
        "No color enhancement",
        "No stabilization",
        "No frame rate conversion",
        "Watermarked output",
      ],
      cta: "Start Free",
      href: "/enhance",
      popular: false,
    },
    {
      name: "Pro",
      description: "For content creators and professionals",
      price: {
        monthly: 19.99,
        yearly: 14.99,
      },
      features: [
        "Up to 4K enhancement",
        "Up to 30 minutes video length",
        "2GB file size limit",
        "Unlimited videos",
        "Advanced noise reduction",
        "Color enhancement",
        "Video stabilization",
        "Frame rate conversion (up to 60fps)",
        "Priority processing",
        "No watermarks",
        "Priority email support",
      ],
      limitations: [],
      cta: "Get Pro",
      href: "/enhance",
      popular: true,
    },
    {
      name: "Enterprise",
      description: "For businesses and production studios",
      price: {
        monthly: 49.99,
        yearly: 39.99,
      },
      features: [
        "Up to 8K enhancement",
        "Unlimited video length",
        "5GB file size limit",
        "Unlimited videos",
        "Premium noise reduction",
        "Advanced color grading",
        "Professional stabilization",
        "Frame rate conversion (up to 120fps)",
        "Fastest processing speed",
        "API access",
        "Custom output formats",
        "Dedicated account manager",
        "24/7 priority support",
      ],
      limitations: [],
      cta: "Contact Sales",
      href: "/contact",
      popular: false,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-24 max-w-7xl">
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the perfect plan for your video enhancement needs. All plans include our core AI enhancement technology.
        </p>
        
        <div className="flex items-center justify-center mt-8">
          <Label htmlFor="billing-toggle" className={`mr-2 ${billingCycle === "monthly" ? "font-medium" : "text-muted-foreground"}`}>
            Monthly
          </Label>
          <Switch
            id="billing-toggle"
            checked={billingCycle === "yearly"}
            onCheckedChange={(checked) => setBillingCycle(checked ? "yearly" : "monthly")}
          />
          <Label htmlFor="billing-toggle" className={`ml-2 ${billingCycle === "yearly" ? "font-medium" : "text-muted-foreground"}`}>
            Yearly <span className="text-xs text-green-500 font-medium ml-1">Save 25%</span>
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`flex flex-col ${
              plan.popular ? "border-primary shadow-lg relative" : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                <div className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium">
                  Most Popular
                </div>
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">
                  ${plan.price[billingCycle].toFixed(2)}
                </span>
                <span className="text-muted-foreground ml-2">
                  / {billingCycle === "monthly" ? "month" : "month, billed annually"}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
                {plan.limitations.map((limitation, index) => (
                  <li key={`limit-${index}`} className="flex items-start text-muted-foreground">
                    <span className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0 mt-0.5">✕</span>
                    <span>{limitation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className={`w-full ${plan.popular ? "" : "variant-outline"}`}
                variant={plan.popular ? "default" : "outline"}
                asChild
              >
                <Link href={plan.href}>
                  {plan.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-20">
        <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            {
              question: "Can I upgrade or downgrade my plan?",
              answer: "Yes, you can upgrade or downgrade your plan at any time. If you upgrade, you'll be charged the prorated difference. If you downgrade, you'll receive credit towards your next billing cycle."
            },
            {
              question: "Is there a free trial for paid plans?",
              answer: "Yes, we offer a 7-day free trial for our Pro plan. You can cancel anytime during the trial period and won't be charged."
            },
            {
              question: "What payment methods do you accept?",
              answer: "We accept all major credit cards, PayPal, and Apple Pay. For Enterprise plans, we also offer invoice-based payments."
            },
            {
              question: "How secure is my data?",
              answer: "Your videos are processed securely with enterprise-grade encryption. We automatically delete your original and enhanced videos after 7 days unless you choose to save them to your account."
            },
            {
              question: "Can I cancel my subscription anytime?",
              answer: "Yes, you can cancel your subscription at any time. Your plan will remain active until the end of your current billing cycle."
            },
            {
              question: "Do you offer refunds?",
              answer: "We offer a 30-day money-back guarantee if you're not satisfied with our service. Contact our support team to request a refund."
            }
          ].map((faq, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-20 bg-muted/50 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Need a custom solution?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Contact our sales team to discuss custom pricing for high-volume needs, special integrations, or enterprise requirements.
        </p>
        <Button size="lg" asChild>
          <Link href="/contact">Contact Sales</Link>
        </Button>
      </div>
    </div>
  );
}