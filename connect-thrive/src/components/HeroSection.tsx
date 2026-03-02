import { motion } from "framer-motion";
import { ArrowRight, Users, MessageCircle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import heroBg from "@/assets/hero-bg.jpg";
import { useState,useEffect } from "react";
import axios from "axios"

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.4,
        }}
      />
      
      {/* Animated background overlay */}
      <div className="absolute inset-0 animated-gradient opacity-80" />
      
      {/* Glowing orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, hsl(187 100% 50% / 0.15) 0%, transparent 70%)" }}
        animate={{
          scale: [1, 1.2, 1],
          x: [-20, 20, -20],
          y: [-10, 10, -10],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, hsl(270 60% 50% / 0.2) 0%, transparent 70%)" }}
        animate={{
          scale: [1.2, 1, 1.2],
          x: [20, -20, 20],
          y: [10, -10, 10],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Campus Community Platform for NIT Students</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            className="text-5xl md:text-7xl font-display font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Find Your{" "}
            <span className="gradient-text text-glow">Tribe</span>
            <br />
            Build Your{" "}
            <span className="gradient-text text-glow">Network</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Connect with like-minded students, join micro-communities, share experiences, 
            and find people from your hometown. Because campus life is better together.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link to="/communities">
              <Button size="lg" className="group">
                Explore Communities
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/find-buddies">
              <Button size="lg" variant="outline">
                Find Hometown Buddies
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-3 gap-8 max-w-lg mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {[
              { icon: Users, value: "5+", label: "Communities" },
              { icon: MessageCircle, value: "Real-time", label: "Chat" },
              { icon: Sparkles, value: "100%", label: "Privacy" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center glass-card p-4 rounded-xl"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-display font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      
      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 1.5 }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-primary"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
