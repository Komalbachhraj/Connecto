import { motion } from "framer-motion";
import { 
  MessageCircle, 
  MapPin, 
  Shield, 
  Users, 
  Zap, 
  Heart 
} from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "Real-time Chat",
    description: "Connect instantly with community members through our seamless real-time messaging system.",
  },
  {
    icon: MapPin,
    title: "Find Hometown Buddies",
    description: "Discover students from your city or hometown. Plan trips home together and save on travel!",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Anonymous profiles until approved. Your data stays secure with college-only verification.",
  },
  {
    icon: Users,
    title: "Micro-Communities",
    description: "Small, focused groups (8-20 members) for meaningful connections, not crowded chaos.",
  },
  {
    icon: Zap,
    title: "Direct Messages",
    description: "Connect personally with members you vibe with. Build lasting friendships beyond groups.",
  },
  {
    icon: Heart,
    title: "Support System",
    description: "Mental wellness resources, peer support, and a community that cares about your well-being.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, hsl(var(--primary) / 0.05) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Why <span className="gradient-text">Connecto</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            More than just another social platform. We're building meaningful connections that matter.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="glass-card p-6 group hover:border-primary/50 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <motion.div
                className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <feature.icon className="w-6 h-6 text-primary" />
              </motion.div>
              <h3 className="text-lg font-display font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
