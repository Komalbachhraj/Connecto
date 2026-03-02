import { motion } from "framer-motion";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  MapPin, 
  MessageCircle, 
  Train, 
  Car, 
  Plane,
  Users,
  Filter
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Buddy {
  id: number;
  name: string;
  avatar: string;
  hometown: string;
  state: string;
  course: string;
  year: string;
  interests: string[];
  travelMode: string;
  online: boolean;
}

const buddies: Buddy[] = [
  { id: 1, name: "Rahul Verma", avatar: "R", hometown: "Gurgaon", state: "Haryana", course: "B.Tech CSE", year: "3rd Year", interests: ["Travel", "DSA"], travelMode: "train", online: true },
  { id: 2, name: "Sneha Patel", avatar: "S", hometown: "Gurgaon", state: "Haryana", course: "B.Tech ECE", year: "2nd Year", interests: ["Gym", "Startup"], travelMode: "car", online: true },
  { id: 3, name: "Vikram Singh", avatar: "V", hometown: "Delhi", state: "Delhi", course: "B.Tech ME", year: "4th Year", interests: ["Gym", "Travel"], travelMode: "train", online: false },
  { id: 4, name: "Priya Sharma", avatar: "P", hometown: "Noida", state: "UP", course: "B.Tech CSE", year: "3rd Year", interests: ["DSA", "Wellness"], travelMode: "car", online: true },
  { id: 5, name: "Amit Kumar", avatar: "A", hometown: "Faridabad", state: "Haryana", course: "B.Tech IT", year: "2nd Year", interests: ["Travel", "Startup"], travelMode: "train", online: false },
  { id: 6, name: "Neha Gupta", avatar: "N", hometown: "Gurgaon", state: "Haryana", course: "B.Tech CSE", year: "3rd Year", interests: ["Wellness", "Travel"], travelMode: "flight", online: true },
  { id: 7, name: "Karan Malhotra", avatar: "K", hometown: "Delhi", state: "Delhi", course: "B.Tech CSE", year: "4th Year", interests: ["DSA", "Startup"], travelMode: "car", online: true },
  { id: 8, name: "Anjali Roy", avatar: "A", hometown: "Chandigarh", state: "Punjab", course: "B.Tech ECE", year: "2nd Year", interests: ["Gym", "Travel"], travelMode: "train", online: false },
];

const cities = ["All Cities", "Gurgaon", "Delhi", "Noida", "Faridabad", "Chandigarh"];

const FindBuddies = () => {
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");

  const filteredBuddies = buddies.filter(buddy => {
    const matchesSearch = buddy.name.toLowerCase().includes(search.toLowerCase()) ||
                         buddy.hometown.toLowerCase().includes(search.toLowerCase());
    const matchesCity = selectedCity === "All Cities" || buddy.hometown === selectedCity;
    return matchesSearch && matchesCity;
  });

  const getTravelIcon = (mode: string) => {
    switch (mode) {
      case "train": return Train;
      case "car": return Car;
      case "flight": return Plane;
      default: return Train;
    }
  };

  const groupedBuddies = filteredBuddies.reduce((acc, buddy) => {
    if (!acc[buddy.hometown]) {
      acc[buddy.hometown] = [];
    }
    acc[buddy.hometown].push(buddy);
    return acc;
  }, {} as Record<string, Buddy[]>);

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
              Find <span className="gradient-text">Hometown Buddies</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Connect with students from your city. Plan trips home together, 
              share cabs, and save on travel costs!
            </p>

            {/* Search & Filter */}
            <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search by name or city..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {[
              { icon: Users, value: buddies.length, label: "Students Available" },
              { icon: MapPin, value: new Set(buddies.map(b => b.hometown)).size, label: "Cities Covered" },
              { icon: Train, value: "50%", label: "Average Savings" },
            ].map((stat, index) => (
              <div key={index} className="glass-card p-6 text-center">
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-3xl font-display font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Buddies by City */}
          <div className="space-y-8">
            {Object.entries(groupedBuddies).map(([city, cityBuddies], groupIndex) => (
              <motion.div
                key={city}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIndex * 0.1 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-display font-semibold">{city}</h2>
                  <span className="text-sm text-muted-foreground">({cityBuddies.length} students)</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cityBuddies.map((buddy, index) => {
                    const TravelIcon = getTravelIcon(buddy.travelMode);
                    return (
                      <motion.div
                        key={buddy.id}
                        className="glass-card p-6 hover:border-primary/50 transition-all"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xl font-medium text-primary-foreground">
                              {buddy.avatar}
                            </div>
                            {buddy.online && (
                              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="font-semibold">{buddy.name}</h3>
                            <p className="text-sm text-muted-foreground">{buddy.course} • {buddy.year}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <TravelIcon className="w-4 h-4 text-primary" />
                              <span className="text-xs text-muted-foreground capitalize">
                                Prefers {buddy.travelMode}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Interests */}
                        <div className="flex flex-wrap gap-2 mt-4">
                          {buddy.interests.map(interest => (
                            <span
                              key={interest}
                              className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>

                        {/* Action */}
                        <div className="mt-4 pt-4 border-t border-border/50">
                          <Button 
                            variant="outline" 
                            className="w-full btn-glow"
                            asChild
                          >
                            <a href="/messages">
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Connect
                            </a>
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {filteredBuddies.length === 0 && (
            <motion.div
              className="text-center py-12 glass-card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-display font-semibold mb-2">No buddies found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter to find students from other cities.
              </p>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FindBuddies;
