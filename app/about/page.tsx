"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Users, 
  Lightbulb, 
  Target, 
  Award, 
  Zap, 
  Github, 
  Twitter, 
  Linkedin 
} from "lucide-react";

export default function AboutPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };
const teamMembers = [
  {
    name: "Mithilesh Yadav",
    role: "Project Lead",
    bio: "Computer Science student passionate about AI and software development. Leads the team in building innovative solutions.",
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop"
  },
  {
    name: "Vansh Patel",
    role: "Backend Developer",
    bio: "Aspiring backend engineer with a strong interest in databases, APIs, and cloud computing. Works on server-side architecture.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop"
  },
  {
    name: "Ayush Prajapati",
    role: "AI & Video Processing Engineer",
    bio: "Exploring machine learning and video processing. Focused on developing video enhancement models for better visual quality.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop"
  },
  {
    name: "Vishal Patel",
    role: "Frontend Developer",
    bio: "Frontend enthusiast skilled in React, UI/UX design, and creating seamless user experiences for web applications.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop"
  }
];


  return (
    <div className="container mx-auto px-4 py-24 max-w-7xl">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <motion.h1 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          About VidioX AI
        </motion.h1>
        <motion.p 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          We're on a mission to democratize high-quality video production through the power of artificial intelligence.
        </motion.p>
      </div>
      
      {/* Our Story Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="relative aspect-square rounded-xl overflow-hidden"
        >
          <Image
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
            alt="Our team working together"
            fill
            className="object-cover"
          />
        </motion.div>
        
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Our Story</h2>
          <p className="text-muted-foreground">
            VidioX AI was founded in 2023 by a team of AI researchers and video production professionals who saw the potential of deep learning to revolutionize video enhancement.
          </p>
          <p className="text-muted-foreground">
            What started as a research project at a leading AI lab quickly evolved into a mission to make professional-quality video accessible to everyone, regardless of their technical skills or equipment.
          </p>
          <p className="text-muted-foreground">
            Today, VidioX AI is used by thousands of content creators, filmmakers, and businesses around the world to transform their low-quality videos into stunning high-definition content.
          </p>
          <p className="text-muted-foreground">
            Our team has grown to include experts in machine learning, computer vision, video processing, and user experience design, all united by a passion for pushing the boundaries of what's possible with AI-powered video enhancement.
          </p>
        </div>
      </div>
      
      {/* Our Values Section */}
      <div className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Values</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            These core principles guide everything we do at VidioX AI
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Lightbulb className="h-10 w-10 text-chart-1" />,
              title: "Innovation",
              description: "We're constantly pushing the boundaries of what's possible with AI-powered video enhancement."
            },
            {
              icon: <Users className="h-10 w-10 text-chart-2" />,
              title: "Accessibility",
              description: "We believe everyone should have access to professional-quality video, regardless of their technical skills or equipment."
            },
            {
              icon: <Target className="h-10 w-10 text-chart-3" />,
              title: "Quality",
              description: "We're obsessed with delivering the highest quality video enhancement possible, with results that exceed expectations."
            }
          ].map((value, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="bg-background/50 backdrop-blur-sm border rounded-xl p-6 shadow-sm"
            >
              <div className="mb-4">{value.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-muted-foreground">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Our Team Section */}
      <div className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The talented people behind VidioX AI
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="group"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-primary font-medium">{member.role}</p>
              <p className="text-muted-foreground mt-2">{member.bio}</p>
              <div className="flex space-x-3 mt-3">
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Linkedin className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Github className="h-5 w-5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Achievements Section */}
      <div className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Achievements</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Milestones we've reached along our journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <Users className="h-10 w-10 text-chart-1" />,
              number: "50,000+",
              label: "Active Users"
            },
            {
              icon: <Zap className="h-10 w-10 text-chart-2" />,
              number: "1M+",
              label: "Videos Enhanced"
            },
            {
              icon: <Award className="h-10 w-10 text-chart-3" />,
              number: "5",
              label: "Industry Awards"
            },
            {
              icon: <Target className="h-10 w-10 text-chart-4" />,
              number: "99.8%",
              label: "Customer Satisfaction"
            }
          ].map((achievement, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="bg-background/50 backdrop-blur-sm border rounded-xl p-6 shadow-sm text-center"
            >
              <div className="flex justify-center mb-4">{achievement.icon}</div>
              <h3 className="text-3xl font-bold mb-1">{achievement.number}</h3>
              <p className="text-muted-foreground">{achievement.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-muted/50 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Join us on our mission</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Be part of the video enhancement revolution. Try VidioX AI today and see the difference for yourself.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/enhance">
              Try VidioX AI <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/careers">
              Join Our Team
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}