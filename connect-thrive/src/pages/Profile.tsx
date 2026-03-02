import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import ProfilePhotoEditor from "../components/ProfilePhotoEditor";
import {
  User,
  MapPin,
  Mail,
  Phone,
  Edit3,
  Camera,
  Plane,
  Code,
  Brain,
  Rocket,
  Dumbbell,
  MessageCircle,
  Settings,
  LogOut,
} from "lucide-react";
import axios from "axios";
import { useState, useEffect } from "react";

const Profile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    hometown: "",
    bio: "",
    profile_photo: "", // ← add this
  });
  const [tempProfile, setTempProfile] = useState(profile);
  // --- 1. Fetch Profile Data on Load ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5001/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Backend data ko state ke sath merge karein aur default values dein
        const fetchedProfile = {
          name: res.data.username || res.data.name || "User",
          email: res.data.email || "",
          phone: res.data.phone || "",
          hometown: res.data.hometown || "",
          bio: res.data.bio || "",
          profile_photo: res.data.profile_photo
            ? res.data.profile_photo.startsWith("http")
              ? res.data.profile_photo
              : `http://localhost:5001${res.data.profile_photo}`
            : "",
        };
        setProfile(fetchedProfile);
        setTempProfile(fetchedProfile);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, []);

  // --- 2. Save Data to Backend ---
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5001/api/users/profile/update",
        tempProfile,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProfile(tempProfile); // Sirf success par main state update karein
      setIsEditing(false);
      toast({ title: "Success", description: "Profile updated!" });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Update failed",
      });
    }
  };

  const handleCancel = () => {
    setTempProfile(profile); // Changes discard karke wapas original data set karein
    setIsEditing(false);
  };
  const handleLogout = () => {
    // 1. Token hatao
    localStorage.removeItem("token");

    // 2. Success message (Optional)
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });

    // 3. Page ko redirect karo (Navigate use karke ya window reload se)
    // Sabse aasan tarika window.location hai taki state fresh ho jaye
    window.location.href = "/";
  };
  const communities = [
    {
      id: "travel",
      name: "Travel",
      icon: Plane,
      color: "text-travel",
      bgColor: "bg-travel/10",
    },
    {
      id: "dsa",
      name: "DSA",
      icon: Code,
      color: "text-dsa",
      bgColor: "bg-dsa/10",
    },
    {
      id: "mental-wellness",
      name: "Wellness",
      icon: Brain,
      color: "text-wellness",
      bgColor: "bg-wellness/10",
    },
    {
      id: "startup",
      name: "Startup",
      icon: Rocket,
      color: "text-startup",
      bgColor: "bg-startup/10",
    },
    {
      id: "gym",
      name: "Gym",
      icon: Dumbbell,
      color: "text-gym",
      bgColor: "bg-gym/10",
    },
  ];

  // const Profile = () => {
  //   const [isEditing, setIsEditing] = useState(false);
  //   const [profile, setProfile] = useState({
  //     name: "Ananya Sharma",
  //     email: "ananya@nit.edu",
  //     phone: "+91 98765 43210",
  //     hometown: "Gurgaon",
  //     bio: "Computer Science student passionate about building products that make a difference. Love traveling, coding, and staying fit!",
  //     interests: ["Travel", "DSA", "Startup"],
  //   });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Profile Header */}
          <motion.div
            className="glass-card p-8 mb-8 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <ProfilePhotoEditor // using email as unique ID since you don't expose userId
                  userName={profile.name}
                  currentPhoto={profile.profile_photo || null}
                  onPhotoUpdated={(newUrl) => {
                    setProfile((prev) => ({ ...prev, profile_photo: newUrl }));
                  }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-display font-bold mb-2">
                  {profile.name}
                </h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {profile.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-primary" />
                    {profile.hometown}
                  </span>
                </div>
                <p className="text-muted-foreground">{profile.bio}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setTempProfile(profile); // Purana data copy karein
                    setIsEditing(true);
                  }}
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Edit Form or Stats */}
            <motion.div
              className="md:col-span-2 space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {isEditing ? (
                <div className="glass-card p-6">
                  <h2 className="text-xl font-display font-semibold mb-6">
                    Edit Profile
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={tempProfile.name}
                          onChange={(e) =>
                            setTempProfile({
                              ...tempProfile,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="hometown">Hometown / City</Label>
                        <Input
                          id="hometown"
                          value={tempProfile.hometown}
                          onChange={(e) =>
                            setTempProfile({
                              ...tempProfile,
                              hometown: e.target.value,
                            })
                          }
                          placeholder="e.g., Gurgaon, Delhi"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={tempProfile.phone}
                        onChange={(e) =>
                          setTempProfile({
                            ...tempProfile,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={tempProfile.bio}
                        placeholder="Tell us more about yourself!"
                        onChange={(e) =>
                          setTempProfile({
                            ...tempProfile,
                            bio: e.target.value,
                          })
                        }
                        rows={4}
                      />
                    </div>
                    <div className="flex gap-4">
                      <Button onClick={handleSave} className="btn-glow">
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* My Communities */}
                  <div className="glass-card p-6">
                    <h2 className="text-xl font-display font-semibold mb-4">
                      My Communities
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {communities.map((community, index) => (
                        <motion.a
                          key={community.id}
                          href={`/community/${community.id}`}
                          className={`glass-card p-4 flex flex-col items-center gap-2 hover:border-primary/50 transition-colors`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <div
                            className={`w-12 h-12 rounded-lg ${community.bgColor} flex items-center justify-center`}
                          >
                            <community.icon
                              className={`w-6 h-6 ${community.color}`}
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {community.name}
                          </span>
                        </motion.a>
                      ))}
                    </div>
                  </div>

                  {/* Activity Stats */}
                  <div className="glass-card p-6">
                    <h2 className="text-xl font-display font-semibold mb-4">
                      Activity
                    </h2>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: "Posts", value: "24" },
                        { label: "Connections", value: "156" },
                        { label: "Messages", value: "89" },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="text-center p-4 bg-muted/30 rounded-lg"
                        >
                          <div className="text-2xl font-display font-bold gradient-text">
                            {stat.value}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </motion.div>

            {/* Right Column - Quick Actions */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* Hometown Badge */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Hometown</h3>
                    <p className="text-primary font-semibold">
                      {profile.hometown}
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/find-buddies">Find Hometown Buddies</a>
                </Button>
              </div>

              {/* Quick Links */}
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold mb-4">Quick Links</h3>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <a href="/messages">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Messages
                    </a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="w-4 h-4 mr-2" />
                    My Posts
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
