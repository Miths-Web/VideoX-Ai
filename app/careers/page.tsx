"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  ArrowRight, 
  Briefcase, 
  Users, 
  Heart, 
  Zap, 
  Globe, 
  Code, 
  CheckCircle2 
} from "lucide-react";

export default function CareersPage() {
  const [activeTab, setActiveTab] = useState("all");
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const openPositions = [
    {
      id: "ai-engineer",
      title: "AI Research Engineer",
      department: "Engineering",
      location: "San Francisco, CA (Remote)",
      type: "Full-time",
      description: "Join our AI research team to develop cutting-edge video enhancement algorithms and neural network architectures.",
      requirements: [
        "PhD or MS in Computer Science, Machine Learning, or related field",
        "3+ years of experience in deep learning research",
        "Strong background in computer vision and video processing",
        "Experience with PyTorch or TensorFlow",
        "Publications in top-tier conferences (CVPR, ICCV, NeurIPS) is a plus"
      ]
    },
    {
      id: "frontend-dev",
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Help build our web application with a focus on creating intuitive, responsive interfaces for our video enhancement platform.",
      requirements: [
        "5+ years of experience with React and modern JavaScript",
        "Strong TypeScript skills",
        "Experience with Next.js and server components",
        "Knowledge of state management solutions",
        "Eye for design and attention to detail"
      ]
    },
    {
      id: "backend-dev",
      title: "Backend Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Develop and maintain our scalable backend services that power our AI video enhancement platform.",
      requirements: [
        "4+ years of experience in backend development",
        "Strong knowledge of Node.js and TypeScript",
        "Experience with cloud services (AWS, GCP, or Azure)",
        "Familiarity with containerization and orchestration",
        "Understanding of high-performance computing is a plus"
      ]
    },
    {
      id: "product-manager",
      title: "Product Manager",
      department: "Product",
      location: "San Francisco, CA",
      type: "Full-time",
      description: "Lead the product development lifecycle for our video enhancement solutions, from conception to launch.",
      requirements: [
        "3+ years of product management experience",
        "Background in video technology or AI products",
        "Strong analytical and problem-solving skills",
        "Excellent communication and stakeholder management",
        "Technical background is a plus"
      ]
    },
    {
      id: "marketing-specialist",
      title: "Growth Marketing Specialist",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      description: "Drive user acquisition and retention strategies for our AI video enhancement platform.",
      requirements: [
        "3+ years of experience in growth marketing",
        "Data-driven approach to marketing",
        "Experience with SaaS or B2C tech products",
        "Strong analytical skills and familiarity with marketing tools",
        "Creative mindset with ability to execute campaigns"
      ]
    },
    {
      id: "customer-success",
      title: "Customer Success Manager",
      department: "Operations",
      location: "Remote",
      type: "Full-time",
      description: "Ensure our customers get the most value from our video enhancement platform and drive retention and expansion.",
      requirements: [
        "3+ years in customer success or account management",
        "Experience with SaaS products",
        "Strong communication and relationship-building skills",
        "Problem-solving mindset",
        "Technical aptitude to understand our product"
      ]
    }
  ];

  const filteredPositions = activeTab === "all" 
    ? openPositions 
    : openPositions.filter(position => position.department.toLowerCase() === activeTab);

  return (
    <div className="container mx-auto px-4 py-24 max-w-7xl">
      <div className="text-center mb-16">
        <motion.h1 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          Join Our Team
        </motion.h1>
        <motion.p 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          Help us revolutionize video enhancement with AI technology
        </motion.p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <div className="lg:col-span-2">
          <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
              alt="Our team collaborating"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h2 className="text-2xl font-bold mb-2 text-white">Work With Purpose</h2>
              <p className="text-white/80 mb-4 max-w-lg">
                Join a team that's passionate about using AI to democratize professional-quality video for everyone.
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Why Join VidioX AI?</h2>
            <p className="text-muted-foreground">
              At VidioX AI, we're building the future of video enhancement technology. Our team is composed of passionate individuals who are excited about pushing the boundaries of what's possible with AI and computer vision.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {[
                {
                  icon: <Zap className="h-8 w-8 text-chart-1" />,
                  title: "Cutting-Edge Technology",
                  description: "Work with the latest AI and machine learning technologies to solve complex video enhancement challenges."
                },
                {
                  icon: <Users className="h-8 w-8 text-chart-2" />,
                  title: "Collaborative Culture",
                  description: "Join a supportive team that values collaboration, knowledge sharing, and mutual growth."
                },
                {
                  icon: <Globe className="h-8 w-8 text-chart-3" />,
                  title: "Remote-First",
                  description: "Enjoy the flexibility of working remotely with teammates from around the world."
                },
                {
                  icon: <Heart className="h-8 w-8 text-chart-4" />,
                  title: "Comprehensive Benefits",
                  description: "Competitive salary, equity, health insurance, unlimited PTO, and professional development budget."
                }
              ].map((benefit, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="mb-2">{benefit.icon}</div>
                    <CardTitle>{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Our Values</CardTitle>
              <CardDescription>
                The principles that guide our work and culture
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  title: "Innovation",
                  description: "We're constantly pushing the boundaries of what's possible with AI-powered video enhancement."
                },
                {
                  title: "Quality",
                  description: "We're obsessed with delivering the highest quality video enhancement possible."
                },
                {
                  title: "Accessibility",
                  description: "We believe everyone should have access to professional-quality video, regardless of their technical skills or equipment."
                },
                {
                  title: "Transparency",
                  description: "We believe in open communication, both within our team and with our users."
                },
                {
                  title: "Impact",
                  description: "We measure our success by the positive impact we have on our users and the broader community."
                }
              ].map((value, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Our Interview Process</CardTitle>
              <CardDescription>
                What to expect when applying to VidioX AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">1</div>
                  <div>
                    <h3 className="font-medium">Application Review</h3>
                    <p className="text-sm text-muted-foreground">Our team reviews your application and resume.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">2</div>
                  <div>
                    <h3 className="font-medium">Initial Screening</h3>
                    <p className="text-sm text-muted-foreground">30-minute call with a recruiter to discuss your background and the role.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">3</div>
                  <div>
                    <h3 className="font-medium">Technical Assessment</h3>
                    <p className="text-sm text-muted-foreground">A take-home assignment or live coding session, depending on the role.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">4</div>
                  <div>
                    <h3 className="font-medium">Team Interviews</h3>
                    <p className="text-sm text-muted-foreground">Meet with potential teammates and cross-functional partners.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">5</div>
                  <div>
                    <h3 className="font-medium">Final Interview</h3>
                    <p className="text-sm text-muted-foreground">Meet with a founder or executive team member.</p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Open Positions</h2>
          <div className="flex space-x-2">
            <Button 
              variant={activeTab === "all" ? "default" : "outline"} 
              size="sm"
              onClick={() => setActiveTab("all")}
            >
              All
            </Button>
            <Button 
              variant={activeTab === "engineering" ? "default" : "outline"} 
              size="sm"
              onClick={() => setActiveTab("engineering")}
            >
              Engineering
            </Button>
            <Button 
              variant={activeTab === "product" ? "default" : "outline"} 
              size="sm"
              onClick={() => setActiveTab("product")}
            >
              Product
            </Button>
            <Button 
              variant={activeTab === "marketing" ? "default" : "outline"} 
              size="sm"
              onClick={() => setActiveTab("marketing")}
            >
              Marketing
            </Button>
            <Button 
              variant={activeTab === "operations" ? "default" : "outline"} 
              size="sm"
              onClick={() => setActiveTab("operations")}
            >
              Operations
            </Button>
          </div>
        </div>
        
        {filteredPositions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPositions.map((position) => (
              <Card key={position.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{position.title}</CardTitle>
                      <CardDescription>{position.department} • {position.location}</CardDescription>
                    </div>
                    <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                      {position.type}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{position.description}</p>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Requirements:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {position.requirements.map((req, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href={`/careers/${position.id}`}>
                      Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/50 rounded-lg">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No positions found</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              We don't have any open positions in this department right now. Please check back later or explore other departments.
            </p>
            <Button onClick={() => setActiveTab("all")}>View All Positions</Button>
          </div>
        )}
      </div>
      
      <div className="bg-muted/50 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Don't see a role that fits?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          We're always looking for talented individuals to join our team. If you don't see a role that matches your skills, send us your resume anyway!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/contact?subject=General Application">
              Submit General Application
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/contact">
              Contact Recruiting
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}