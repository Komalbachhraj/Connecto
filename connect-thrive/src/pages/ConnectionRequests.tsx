import { motion } from "framer-motion";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle2,
  X,
  UserPlus,
  ArrowLeft,
  MapPin,
  Inbox,
} from "lucide-react";
import { useConnectionStore } from "@/stores/connectionStore";
import { Link } from "react-router-dom";

const ConnectionRequests = () => {
  // Store se data aur functions fetch karna
  const {
    buddies,
    fetchBuddies,
    fetchConnections,
    getIncomingRequests,
    respondToRequest,
  } = useConnectionStore();

  const { toast } = useToast();

  // Page load hote hi data sync karo
  useEffect(() => {
    fetchBuddies();
    fetchConnections();
  }, []);

  // Sirf wo buddies nikalo jinhone mujhe request bheji hai
  const incomingIds = getIncomingRequests();
  const incomingBuddies = buddies.filter((b) => incomingIds.includes(b.id));

  const handleResponse = async (
    buddyId: number,
    buddyName: string,
    action: "accepted" | "rejected",
  ) => {
    const success = await respondToRequest(buddyId, action);

    if (success) {
      toast({
        title: action === "accepted" ? "Connected! 🎉" : "Request Removed",
        description:
          action === "accepted"
            ? `You are now connected with ${buddyName}`
            : `Connection request from ${buddyName} has been removed`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link to="/find-buddies">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Find Buddies
              </Button>
            </Link>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              Connection <span className="gradient-text">Requests</span>
            </h1>
            <p className="text-muted-foreground">
              People who want to connect with you. Accept or decline their
              requests.
            </p>
          </motion.div>

          {/* Requests List */}
          {incomingBuddies.length > 0 ? (
            <div className="space-y-4">
              {incomingBuddies.map((buddy, index) => (
                <motion.div
                  key={buddy.id}
                  className="glass-card p-6 hover:border-primary/50 transition-all"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xl font-medium text-primary-foreground">
                        {buddy.avatar || (buddy.name ? buddy.name[0] : "?")}
                      </div>
                      {buddy.online && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{buddy.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {buddy.course} • {buddy.year}
                      </p>
                      <div className="flex items-center justify-center sm:justify-start gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-primary" />
                        <span className="text-xs text-muted-foreground">
                          {buddy.hometown}
                        </span>
                      </div>

                      {/* Interests */}
                      <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mt-2">
                        {Array.isArray(buddy.interests) &&
                          buddy.interests.map((interest) => (
                            <span
                              key={interest}
                              className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                            >
                              {interest}
                            </span>
                          ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0 mt-4 sm:mt-0">
                      <Button
                        onClick={() =>
                          handleResponse(buddy.id, buddy.name, "accepted")
                        }
                        size="sm"
                        className="btn-glow"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleResponse(buddy.id, buddy.name, "rejected")
                        }
                        className="border-destructive/50 text-destructive hover:bg-destructive/10"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              className="text-center py-16 glass-card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Inbox className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-display font-semibold mb-2">
                No pending requests
              </h3>
              <p className="text-muted-foreground mb-6">
                You're all caught up! No one has sent you a connection request
                yet.
              </p>
              <Link to="/find-buddies">
                <Button variant="outline">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Find Buddies to Connect
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ConnectionRequests;
