import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  MapPin,
  Train,
  Car,
  Plane,
  Users,
  Filter,
  UserPlus,
  Clock,
  CheckCircle2,
  Bell,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConnectionStore, type Buddy } from "@/stores/connectionStore";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const cities = [
  "All Cities",
  "Gurgaon",
  "Delhi",
  "Noida",
  "Faridabad",
  "Chandigarh",
];

const FindBuddies = () => {
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  
  // Zustand Store se data aur functions nikalna
  const { 
    buddies, 
    fetchBuddies, 
    fetchConnections, 
    getStatus, 
    sendRequest, 
    getIncomingRequests 
  } = useConnectionStore();
  
  const { toast } = useToast();
  
  const myId = Number(localStorage.getItem("userId")); 

// Ab filter logic khud-ba-khud tumhe results se gayab kar dega
 // Bhai yahan apni logged-in user ID pass karna (auth se le sakte ho)

  // Page load hote hi DB se data fetch karo
  useEffect(() => {
    fetchBuddies();
    fetchConnections(myId);
  }, [fetchBuddies, fetchConnections, myId]);

  const incomingCount = getIncomingRequests().length;

  // Search aur Filter logic
  const filteredBuddies = useMemo(() => {
    return buddies.filter((buddy) => {
      const matchesSearch =
        buddy.name.toLowerCase().includes(search.toLowerCase()) ||
        buddy.hometown.toLowerCase().includes(search.toLowerCase());
      const matchesCity =
        selectedCity === "All Cities" || buddy.hometown === selectedCity;
      // Khud ko list mein mat dikhao
      const isNotMe = buddy.id !== myId; 
      
      return matchesSearch && matchesCity && isNotMe;
    });
  }, [buddies, search, selectedCity, myId]);

  const getTravelIcon = (mode: string) => {
    switch (mode) {
      case "train": return Train;
      case "car": return Car;
      case "flight": return Plane;
      default: return Train;
    }
  };

  const handleConnectClick = async (buddyId: number, buddyName: string) => {
    const status = getStatus(buddyId);
    
    if (status === "connected") {
      toast({ title: "Already Connected ✅", description: `You are already connected with ${buddyName}` });
      return;
    }
    
    if (status === "pending_sent") {
      toast({ title: "Request Pending ⏳", description: `Request to ${buddyName} is already in progress` });
      return;
    }

    // Store wala async sendRequest call karo
    const success = await sendRequest(buddyId);
    if (success) {
      toast({ title: "Sent! 🎉", description: `Connection request sent to ${buddyName}` });
    } else {
      toast({ variant: "destructive", title: "Error", description: "Failed to send request" });
    }
  };

  const getButtonConfig = (buddyId: number) => {
    const status = getStatus(buddyId);
    switch (status) {
      case "pending_sent":
        return { label: "Pending", icon: Clock, variant: "secondary" as const, className: "cursor-default opacity-80" };
      case "pending_received":
        return { label: "Respond", icon: Bell, variant: "default" as const, className: "btn-glow" };
      case "connected":
        return { label: "Connected", icon: CheckCircle2, variant: "outline" as const, className: "border-green-500/50 text-green-500" };
      default:
        return { label: "Connect", icon: UserPlus, variant: "outline" as const, className: "btn-glow" };
    }
  };
  const groupedBuddies = filteredBuddies.reduce((acc, buddy) => {
    if (!acc[buddy.hometown]) acc[buddy.hometown] = [];
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
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Find <span className="gradient-text">Hometown Buddies</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
              Connect with students from your city. Plan trips home together, share cabs, and save!
            </p>

            <Link to="/connection-requests">
              <Button variant="outline" className="mb-6 relative">
                <Bell className="w-4 h-4 mr-2" />
                Connection Requests
                {incomingCount > 0 && (
                  <Badge className="ml-2 bg-destructive text-destructive-foreground">
                    {incomingCount}
                  </Badge>
                )}
              </Button>
            </Link>

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
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="glass-card p-6 text-center">
              <Users className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-3xl font-display font-bold gradient-text">{buddies.length}</div>
              <div className="text-sm text-muted-foreground">Students Online</div>
            </div>
            <div className="glass-card p-6 text-center">
              <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-3xl font-display font-bold gradient-text">
                {new Set(buddies.map(b => b.hometown)).size}
              </div>
              <div className="text-sm text-muted-foreground">Cities Covered</div>
            </div>
            <div className="glass-card p-6 text-center">
              <Train className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-3xl font-display font-bold gradient-text">50%</div>
              <div className="text-sm text-muted-foreground">Average Savings</div>
            </div>
          </div>

          {/* Buddies List */}
          <div className="space-y-8">
            {Object.entries(groupedBuddies).map(([city, cityBuddies], gIdx) => (
              <div key={city}>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-display font-semibold">{city}</h2>
                  <span className="text-sm text-muted-foreground">({cityBuddies.length} students)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cityBuddies.map((buddy, index) => {
                    const TravelIcon = getTravelIcon(buddy.travelMode);
                    const btn = getButtonConfig(buddy.id);
                    return (
                      <motion.div
                        key={buddy.id}
                        className="glass-card p-6 hover:border-primary/50 transition-all"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xl font-medium text-primary-foreground">
                              {buddy.avatar || buddy.name[0]}
                            </div>
                            {buddy.online && <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{buddy.name}</h3>
                            <p className="text-sm text-muted-foreground">{buddy.course} • {buddy.year}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <TravelIcon className="w-4 h-4 text-primary" />
                              <span className="text-xs text-muted-foreground capitalize">Prefers {buddy.travelMode}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                          {(Array.isArray(buddy.interests) ? buddy.interests : []).map((interest) => (
                            <span key={interest} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                              {interest}
                            </span>
                          ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-border/50">
                          <Button
                            variant={btn.variant}
                            className={`w-full ${btn.className}`}
                            onClick={() => handleConnectClick(buddy.id, buddy.name)}
                          >
                            <btn.icon className="w-4 h-4 mr-2" />
                            {btn.label}
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {filteredBuddies.length === 0 && (
            <div className="text-center py-12 glass-card">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-display font-semibold mb-2">No buddies found</h3>
              <p className="text-muted-foreground">Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FindBuddies;