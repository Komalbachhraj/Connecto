import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  User,
  MessageCircle,
  Search,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import axios from "axios";
const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const [profileName, setProfileName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await axios.get(
            "http://localhost:5001/api/users/profile",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setProfileName(res.data.username || res.data.name);
          setIsLoggedIn(true);
          setProfilePhoto(res.data.profile_photo || "");
        } catch (err) {
          console.error("Not logged in or token expired");
          setIsLoggedIn(false);
        }
      }
    };
    fetchUser();
  }, []);

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/communities", icon: Users, label: "Communities" },
    { path: "/messages", icon: MessageCircle, label: "Messages" },
    { path: "/find-buddies", icon: Search, label: "Find Buddies" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40 glass-card border-b border-border/50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.span
              className="text-2xl font-display font-bold gradient-text"
              whileHover={{ scale: 1.05 }}
            >
              Connecto
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      isActive
                        ? "bg-primary/20 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <item.icon size={18} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Right side - Notifications & Profile */}

          {/* Right side - Notifications & Profile */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.button
              className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </motion.button>

            <Link to="/profile">
              <motion.div
                className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center cursor-pointer overflow-hidden border border-white/10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {/* ✅ Show photo if exists, else initial, else icon */}
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : isLoggedIn && profileName ? (
                  <span className="text-sm font-bold text-primary-foreground uppercase">
                    {profileName.charAt(0)}
                  </span>
                ) : (
                  <User size={18} className="text-primary-foreground" />
                )}
              </motion.div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            className="md:hidden py-4 border-t border-border/50"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                >
                  <div
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-primary/20 text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
