import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const links = {
    platform: [
      { name: "Communities", path: "/communities" },
      { name: "Find Buddies", path: "/find-buddies" },
      { name: "Messages", path: "/messages" },
      { name: "Profile", path: "/profile" },
    ],
    communities: [
      { name: "Travel", path: "/community/travel" },
      { name: "DSA", path: "/community/dsa" },
      { name: "Mental Wellness", path: "/community/mental-wellness" },
      { name: "Startup", path: "/community/startup" },
      { name: "Gym", path: "/community/gym" },
    ],
    support: [
      { name: "Help Center", path: "#" },
      { name: "Privacy Policy", path: "#" },
      { name: "Terms of Service", path: "#" },
      { name: "Contact Us", path: "#" },
    ],
  };

  return (
    <footer className="border-t border-border/50 bg-card/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-display font-bold gradient-text">
                Connecto
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mb-4">
              Building meaningful connections on campus. Find your people, 
              join communities, and make college life better together.
            </p>
            <div className="flex gap-4">
              {[Github, Twitter, Linkedin, Mail].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              {links.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Communities</h4>
            <ul className="space-y-2">
              {links.communities.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              {links.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-12 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Connecto. Made with ❤️ for campus communities.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
