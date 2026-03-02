import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Users, MessageCircle, ArrowRight } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface CommunityCardProps {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  members: number;
  color: string;
  gradient: string;
  index: number;
}

const CommunityCard = ({
  id,
  name,
  description,
  icon: Icon,
  members,
  color,
  gradient,
  index,
}: CommunityCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/community/${id}`}>
        <motion.div
          className="community-card glass-card p-6 h-full group cursor-pointer relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
        >
          {/* Gradient glow effect on hover */}
          <div
            className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${gradient}`}
          />

          {/* Icon */}
          <motion.div
            className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${gradient}`}
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Icon className="w-7 h-7 text-white" />
          </motion.div>

          {/* Content */}
          <h3 className="text-xl font-display font-semibold mb-2 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
            {description}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{members}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MessageCircle className="w-4 h-4" />
                <span>Active</span>
              </div>
            </div>
            <motion.div
              className={`text-sm font-medium flex items-center gap-1 ${color}`}
              whileHover={{ x: 5 }}
            >
              Join
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default CommunityCard;
