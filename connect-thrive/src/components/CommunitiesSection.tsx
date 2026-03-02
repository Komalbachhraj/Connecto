import { motion } from "framer-motion";
import { Plane, Code, Brain, Rocket, Dumbbell } from "lucide-react";
import CommunityCard from "./CommunityCard";

const communities = [
  {
    id: "travel",
    name: "Travel & Explore",
    description: "Discover nearby campus places, cafes, weekend getaways, and find travel buddies. Share your adventures and plan trips together!",
    icon: Plane,
    members: 234,
    color: "text-travel",
    gradient: "bg-gradient-to-br from-cyan-500 to-blue-600",
  },
  {
    id: "dsa",
    name: "DSA & Coding",
    description: "Master Data Structures & Algorithms together. Share resources, solve problems, participate in coding contests, and crack placements!",
    icon: Code,
    members: 456,
    color: "text-dsa",
    gradient: "bg-gradient-to-br from-purple-500 to-pink-600",
  },
  {
    id: "mental-wellness",
    name: "Mental Wellness",
    description: "Your safe space for mental health. Join meditation sessions, share experiences, access wellness resources, and support each other.",
    icon: Brain,
    members: 189,
    color: "text-wellness",
    gradient: "bg-gradient-to-br from-green-500 to-emerald-600",
  },
  {
    id: "startup",
    name: "Startup Hub",
    description: "Connect with aspiring entrepreneurs, share startup ideas, find co-founders, get mentorship, and turn your ideas into reality!",
    icon: Rocket,
    members: 312,
    color: "text-startup",
    gradient: "bg-gradient-to-br from-orange-500 to-amber-600",
  },
  {
    id: "gym",
    name: "Fitness & Gym",
    description: "Find gym buddies, share workout routines, nutrition tips, track progress together, and stay motivated on your fitness journey!",
    icon: Dumbbell,
    members: 278,
    color: "text-gym",
    gradient: "bg-gradient-to-br from-red-500 to-rose-600",
  },
];

const CommunitiesSection = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Explore <span className="gradient-text">Communities</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join micro-communities that match your interests. Connect, chat, share, and grow together.
          </p>
        </motion.div>

        {/* Communities grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community, index) => (
            <CommunityCard key={community.id} {...community} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunitiesSection;
