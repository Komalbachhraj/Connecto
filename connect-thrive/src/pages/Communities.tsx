import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CommunityCard from "@/components/CommunityCard";
import { Plane, Code, Brain, Rocket, Dumbbell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const allCommunities = [
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

const Communities = () => {
  const [search, setSearch] = useState("");

  const filteredCommunities = allCommunities.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Explore <span className="gradient-text">Communities</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Join micro-communities that match your interests. Connect with like-minded 
              students, share experiences, and grow together.
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search communities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </motion.div>

          {/* Communities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCommunities.map((community, index) => (
              <CommunityCard key={community.id} {...community} index={index} />
            ))}
          </div>

          {filteredCommunities.length === 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-muted-foreground">No communities found matching "{search}"</p>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Communities;
