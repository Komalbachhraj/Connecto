import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  User,
  MessageCircle,
  Search,
  Bell,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
<<<<<<< HEAD
import { useConnectionStore } from "@/stores/connectionStore";
=======
import axios from  "axios";
>>>>>>> bf28f36ce587daf8c27745ba27af19fa1edebc16

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Zustand Store se notification count lo
  const { getIncomingRequests, fetchConnections } = useConnectionStore();
  const incomingCount = getIncomingRequests().length;

  // Local states
  const [profileName, setProfileName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("username"); // Login ke waqt save kiya tha humne

    if (token) {
      setIsLoggedIn(true);
      setProfileName(storedName || "User");
      // App load hote hi connections fetch karo notifications ke liye
      fetchConnections();
    }
  }, [fetchConnections]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login");
  };

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/communities", icon: Users, label: "Communities" },
    { path: "/messages", icon: MessageCircle, label: "Messages" },
    { path: "/find-buddies", icon: Search, label: "Find Buddies" },
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50 bg-background/80 backdrop-blur-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 1. Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.span
              className="text-2xl font-display font-bold gradient-text"
              whileHover={{ scale: 1.05 }}
            >
              Connecto
            </motion.span>
          </Link>

          {/* 2. Desktop Navigation */}
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

          {/* 3. Right Side - Notifications, Profile & Logout */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Notification Bell */}
            <Link to="/connection-requests">
              <motion.button
                className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Bell size={20} />
                {incomingCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-background">
                    {incomingCount}
                  </span>
                )}
              </motion.button>
            </Link>

            <div className="h-6 w-[1px] bg-border mx-2" />

            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <Link to="/profile" className="flex items-center space-x-2">
                  <motion.div
                    className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center border border-white/10"
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="text-sm font-bold text-primary-foreground uppercase">
                      {profileName.charAt(0)}
                    </span>
                  </motion.div>
                  <span className="text-sm font-medium hidden lg:inline-block">
                    {profileName}
                  </span>
                </Link>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <LogOut size={18} />
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button size="sm" className="btn-glow">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* 4. Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/connection-requests" className="relative p-2">
              <Bell size={20} className="text-muted-foreground" />
              {incomingCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full" />
              )}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* 5. Mobile Navigation Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="md:hidden py-4 space-y-2 border-t border-border/50"
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
                          : "text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      <item.icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                  </Link>
                );
              })}
              <div className="pt-2 border-t border-border/50">
                {isLoggedIn ? (
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:bg-destructive/10"
                    onClick={handleLogout}
                  >
                    <LogOut size={20} className="mr-3" />
                    Logout
                  </Button>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">Login</Button>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
// import { motion } from "framer-motion";
// import { Link, useLocation } from "react-router-dom";
// import {
//   Home,
//   Users,
//   User,
//   MessageCircle,
//   Search,
//   Bell,
//   Menu,
//   X,
// } from "lucide-react";
// import { useState, useEffect } from "react";
// import { Button } from "./ui/button";
// import axios from "axios";
// const Navbar = () => {
//   const location = useLocation();
//   const [isOpen, setIsOpen] = useState(false);

//   const [profileName, setProfileName] = useState("");
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [profilePhoto, setProfilePhoto] = useState("");

//   useEffect(() => {
//     const fetchUser = async () => {
//       const token = localStorage.getItem("token");
//       if (token) {
//         try {
//           const res = await axios.get(
//             "http://localhost:5000/api/users/profile",
//             {
//               headers: { Authorization: `Bearer ${token}` },
//             }
//           );
//           setProfileName(res.data.username || res.data.name);
//           setIsLoggedIn(true);
//           setProfilePhoto(res.data.profile_photo || "");
//         } catch (err) {
//           console.error("Not logged in or token expired");
//           setIsLoggedIn(false);
//         }
//       }
//     };
//     fetchUser();
//   }, []);

//   const navItems = [
//     { path: "/", icon: Home, label: "Home" },
//     { path: "/communities", icon: Users, label: "Communities" },
//     { path: "/messages", icon: MessageCircle, label: "Messages" },
//     { path: "/find-buddies", icon: Search, label: "Find Buddies" },
//     { path: "/profile", icon: User, label: "Profile" },
//   ];

//   return (
//     <motion.nav
//       className="fixed top-0 left-0 right-0 z-40 glass-card border-b border-border/50"
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <Link to="/" className="flex items-center space-x-2">
//             <motion.span
//               className="text-2xl font-display font-bold gradient-text"
//               whileHover={{ scale: 1.05 }}
//             >
//               Connecto
//             </motion.span>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-1">
//             {navItems.map((item) => {
//               const isActive = location.pathname === item.path;
//               return (
//                 <Link key={item.path} to={item.path}>
//                   <motion.div
//                     className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
//                       isActive
//                         ? "bg-primary/20 text-primary"
//                         : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
//                     }`}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <item.icon size={18} />
//                     <span className="text-sm font-medium">{item.label}</span>
//                   </motion.div>
//                 </Link>
//               );
//             })}
//           </div>

//           {/* Right side - Notifications & Profile */}

//           {/* Right side - Notifications & Profile */}
//           <div className="hidden md:flex items-center space-x-4">
//             <motion.button
//               className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//             >
//               <Bell size={20} />
//               <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
//             </motion.button>

//             <Link to="/profile">
//               <motion.div
//                 className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center cursor-pointer overflow-hidden border border-white/10"
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//               >
//                 {/* ✅ Show photo if exists, else initial, else icon */}
//                 {profilePhoto ? (
//                   <img
//                     src={profilePhoto}
//                     alt="Profile"
//                     className="w-full h-full object-cover"
//                   />
//                 ) : isLoggedIn && profileName ? (
//                   <span className="text-sm font-bold text-primary-foreground uppercase">
//                     {profileName.charAt(0)}
//                   </span>
//                 ) : (
//                   <User size={18} className="text-primary-foreground" />
//                 )}
//               </motion.div>
//             </Link>
//           </div>

//           {/* Mobile menu button */}
//           <Button
//             variant="ghost"
//             size="icon"
//             className="md:hidden"
//             onClick={() => setIsOpen(!isOpen)}
//           >
//             {isOpen ? <X size={24} /> : <Menu size={24} />}
//           </Button>
//         </div>

//         {/* Mobile Navigation */}
//         {isOpen && (
//           <motion.div
//             className="md:hidden py-4 border-t border-border/50"
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//           >
//             {navItems.map((item) => {
//               const isActive = location.pathname === item.path;
//               return (
//                 <Link
//                   key={item.path}
//                   to={item.path}
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <div
//                     className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
//                       isActive
//                         ? "bg-primary/20 text-primary"
//                         : "text-muted-foreground"
//                     }`}
//                   >
//                     <item.icon size={20} />
//                     <span className="font-medium">{item.label}</span>
//                   </div>
//                 </Link>
//               );
//             })}
//           </motion.div>
//         )}
//       </div>
//     </motion.nav>
//   );
// };

// export default Navbar;
