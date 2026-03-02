import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const CTASection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          className="relative glass-card p-12 md:p-16 text-center overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
          
          {/* Floating elements */}
          <motion.div
            className="absolute top-10 left-10 w-20 h-20 rounded-full bg-primary/10 blur-2xl"
            animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-secondary/10 blur-2xl"
            animate={{ y: [10, -10, 10], x: [5, -5, 5] }}
            transition={{ duration: 6, repeat: Infinity }}
          />

          <div className="relative z-10">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary">Start Your Journey</span>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-5xl font-display font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Ready to <span className="gradient-text">Connect</span>?
            </motion.h2>

            <motion.p
              className="text-muted-foreground text-lg max-w-xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Join thousands of students building meaningful connections. 
              Your tribe is waiting for you.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <Link to="/profile">
                <Button size="lg" className="btn-glow group">
                  Create Your Profile
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/communities">
                <Button size="lg" variant="outline" className="btn-glow">
                  Browse Communities
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
