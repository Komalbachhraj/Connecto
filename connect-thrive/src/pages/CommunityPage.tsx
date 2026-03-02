import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Input } from "@/components/ui/input";

import {
  Send,
  Heart,
  MessageCircle,
  Image as ImageIcon,
  Users,
  MapPin,
  BookOpen,
  Coffee,
  Utensils,
  Mountain,
  Target,
  Lightbulb,
  Dumbbell,
  Brain,
  Plus,
  Plane,
  Code,
  Rocket,
} from "lucide-react";

// --- Types ---
interface Post {
  id: number;
  username: string;
  avatar_url?: string;
  content: string;
  image_url?: string;
  likes: number;
  created_at: string;
  user_id: number;
}
interface Community {
  name: string;
  description: string;
  icon: React.ElementType; // Lucide icons ke liye ye zaroori hai
  gradient: string;
  color: string;
  members: number;
  resources: {
    title: string;
    icon: React.ElementType;
    description: string;
  }[];
}

// --- Community Configuration ---
const communityData: Record<string, Community> = {
  travel: {
    name: "Travel & Explore",

    description:
      "Discover nearby campus places, cafes, weekend getaways, and find travel buddies.",

    icon: Plane,

    gradient: "bg-gradient-to-br from-cyan-500 to-blue-600",

    color: "text-travel",

    members: 234,

    resources: [
      {
        title: "Nearby Cafes",
        icon: Coffee,
        description: "Best cafes near campus for study sessions",
      },

      {
        title: "Weekend Getaways",
        icon: Mountain,
        description: "Popular spots within 100km",
      },

      {
        title: "Food Spots",
        icon: Utensils,
        description: "Must-try restaurants and street food",
      },

      {
        title: "Campus Places",
        icon: MapPin,
        description: "Hidden gems around campus",
      },
    ],
  },

  dsa: {
    name: "DSA & Coding",

    description:
      "Master Data Structures & Algorithms together. Share resources and crack placements!",

    icon: Code,

    gradient: "bg-gradient-to-br from-purple-500 to-pink-600",

    color: "text-dsa",

    members: 456,

    resources: [
      {
        title: "LeetCode Roadmap",
        icon: Target,
        description: "Curated problem sets by topic",
      },

      {
        title: "Interview Prep",
        icon: BookOpen,
        description: "Company-wise question banks",
      },

      {
        title: "Study Resources",
        icon: BookOpen,
        description: "Best tutorials and courses",
      },

      {
        title: "Contest Calendar",
        icon: Target,
        description: "Upcoming coding competitions",
      },
    ],
  },

  "mental-wellness": {
    name: "Mental Wellness",

    description:
      "Your safe space for mental health. Join meditation sessions and support each other.",

    icon: Brain,

    gradient: "bg-gradient-to-br from-green-500 to-emerald-600",

    color: "text-wellness",

    members: 189,

    resources: [
      {
        title: "Guided Meditation",
        icon: Brain,
        description: "Daily meditation sessions",
      },

      {
        title: "Wellness Articles",
        icon: BookOpen,
        description: "Mental health resources",
      },

      {
        title: "Support Circle",
        icon: Users,
        description: "Peer support groups",
      },

      {
        title: "Self-Care Tips",
        icon: Heart,
        description: "Daily wellness practices",
      },
    ],
  },

  startup: {
    name: "Startup Hub",

    description:
      "Connect with aspiring entrepreneurs, share ideas, and find co-founders.",

    icon: Rocket,

    gradient: "bg-gradient-to-br from-orange-500 to-amber-600",

    color: "text-startup",

    members: 312,

    resources: [
      {
        title: "Startup Ideas",
        icon: Lightbulb,
        description: "Pitch and validate ideas",
      },

      {
        title: "Find Co-founders",
        icon: Users,
        description: "Connect with potential partners",
      },

      {
        title: "Funding Resources",
        icon: Target,
        description: "Grants and investor info",
      },

      {
        title: "Success Stories",
        icon: BookOpen,
        description: "Learn from alumni startups",
      },
    ],
  },

  gym: {
    name: "Fitness & Gym",

    description:
      "Find gym buddies, share routines, and stay motivated on your fitness journey!",

    icon: Dumbbell,

    gradient: "bg-gradient-to-br from-red-500 to-rose-600",

    color: "text-gym",

    members: 278,

    resources: [
      {
        title: "Workout Plans",
        icon: Dumbbell,
        description: "Beginner to advanced routines",
      },

      {
        title: "Nutrition Guide",
        icon: Utensils,
        description: "Meal plans and diet tips",
      },

      {
        title: "Gym Buddies",
        icon: Users,
        description: "Find workout partners",
      },

      {
        title: "Progress Tracker",
        icon: Target,
        description: "Track your fitness goals",
      },
    ],
  },
};

const CommunityPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const community = communityData[id || "travel"] || communityData.travel;
  const Icon = community.icon;

  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeCommentBox, setActiveCommentBox] = useState<number | null>(null);
  const [commentText, setCommentText] = useState("");
  interface Comment {
  username: string;
  content: string;
  created_at: string;
}

// State hooks (Aapke code mein already hain, bas type update)
const [comments, setComments] = useState<Record<number, Comment[]>>({});
  // 1. Fetch Posts Logic
  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const response = await axios.get(
        `http://localhost:5001/api/posts/${id}`,
        {
          headers: { Authorization: token },
        },
      );
      setPosts(response.data);
    } catch (error) {
      if (error.response?.status === 401) navigate("/login");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load posts.",
      });
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [id]);

  // 2. Create Post Logic
  const handleCreatePost = async () => {
    if (!newPost.trim()) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5001/api/posts/create",
        { community_id: id, content: newPost },
        { headers: { Authorization: token } },
      );
      toast({ title: "Success!", description: "Post shared with community." });
      setNewPost("");
      fetchPosts();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Post Failed",
        description: "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };
  // CommunityPage.tsx ke andar

  // 1. Like Function
  const handleLike = async (postId: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5001/api/posts/${postId}/like`,
        {},
        { headers: { Authorization: token } },
      );
      // UI update karne ke liye posts dubara fetch karein
      fetchPosts();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not like the post.",
      });
    }
  };

  // // 2. Reply Function (Abhi ke liye sirf alert ya placeholder)
  // const handleReply = (postId: number) => {
  //   toast({
  //     title: "Coming Soon",
  //     description: "Reply system is under development!",
  //   });
  // };
  const handleFetchComments = async (postId: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5001/api/posts/${postId}/comments`,
        {
          headers: { Authorization: token },
        },
      );
      setComments((prev) => ({ ...prev, [postId]: res.data }));
      setActiveCommentBox(postId); // Box khol do
    } catch (err) {
      console.error("Failed to fetch comments");
    }
  };

  const handlePostComment = async (postId: number) => {
    if (!commentText.trim()) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5001/api/posts/${postId}/comments`,
        { content: commentText },
        { headers: { Authorization: token } },
      );
      setCommentText("");
      handleFetchComments(postId); // Refresh comments
      toast({ title: "Comment added!" });
    } catch (err) {
      toast({ variant: "destructive", title: "Failed to comment" });
    }
  };
  const toggleComments = (postId: number) => {
    if (activeCommentBox === postId) {
      setActiveCommentBox(null);
    } else {
      handleFetchComments(postId);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* --- Header Section (Enhanced UI) --- */}
          <motion.div
            className="glass-card p-8 mb-8 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              <motion.div
                className={`w-20 h-20 rounded-2xl ${community.gradient} flex items-center justify-center`}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Icon className="w-10 h-10 text-white" />
              </motion.div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-display font-bold mb-2">
                  {community.name}
                </h1>
                <p className="text-muted-foreground mb-4">
                  {community.description}
                </p>
                <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" /> {community.members} members
                  </span>
                  <span className="flex items-center gap-1 text-primary">
                    <div className="w-2 h-2 rounded-full bg-green-500" /> Active
                    now
                  </span>
                </div>
              </div>
              <Button className="btn-glow">Join Community</Button>
            </div>
          </motion.div>

          {/* --- Tabs --- */}
          <Tabs defaultValue="posts" className="space-y-6">
            <TabsList className="glass-card p-1">
              <TabsTrigger value="posts">
                <ImageIcon className="w-4 h-4 mr-2" /> Posts
              </TabsTrigger>
              <TabsTrigger value="chat">
                <MessageCircle className="w-4 h-4 mr-2" /> Chat
              </TabsTrigger>
              <TabsTrigger value="resources">
                <BookOpen className="w-4 h-4 mr-2" /> Resources
              </TabsTrigger>
            </TabsList>

            {/* --- Posts Tab --- */}
            <TabsContent value="posts">
              <div className="space-y-6">
                <motion.div className="glass-card p-6">
                  <Textarea
                    placeholder={`What's happening in ${community.name}?`}
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="mb-4"
                  />
                  <div className="flex justify-between items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground"
                    >
                      <ImageIcon className="w-5 h-5" />
                    </Button>
                    <Button
                      onClick={handleCreatePost}
                      disabled={isLoading}
                      className="btn-glow"
                    >
                      {isLoading ? (
                        "Posting..."
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" /> Post
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>

                <AnimatePresence>
                  {posts.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card p-6"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                          {post.username[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{post.username}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(post.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-foreground/90">{post.content}</p>
                      {/* Post Loop ke andar */}
                      <div className="flex gap-4 mt-4 pt-4 border-t border-border/40">
                        <button
                          onClick={() => handleLike(post.id)} // Like function connect kiya
                          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <Heart
                            className={`w-4 h-4 ${post.likes > 0 ? "fill-red-500 text-red-500" : ""}`}
                          />
                          {post.likes}
                        </button>

                        {/* ... baaki post content ... */}

                        <button
                          onClick={() => toggleComments(post.id)} // Ise use karein toggle ke liye
                          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          {/* Yahan || 0 lagayein taaki empty na dikhe */}
                          {comments[post.id]?.length || 0} Comments
                        </button>

                        {/* Comment Section (Accordion Style) */}
                        <AnimatePresence>
                          {activeCommentBox === post.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="mt-4 pt-4 border-t border-border/20 overflow-hidden"
                            >
                              {/* Existing Comments List */}
                              <div className="space-y-3 mb-4 max-h-40 overflow-y-auto pr-2">
                                {comments[post.id]?.map((c, i) => (
                                  <div
                                    key={i}
                                    className="bg-muted/30 p-2 rounded-lg text-sm"
                                  >
                                    <span className="font-bold text-primary mr-2">
                                      {c.username}:
                                    </span>
                                    <span className="text-foreground/80">
                                      {c.content}
                                    </span>
                                  </div>
                                ))}
                              </div>

                              {/* Input Field */}
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Write a comment..."
                                  value={commentText}
                                  onChange={(e) =>
                                    setCommentText(e.target.value)
                                  }
                                  className="h-8 text-sm"
                                />
                                <Button
                                  size="sm"
                                  onClick={() => handlePostComment(post.id)}
                                >
                                  <Send className="w-3 h-3" />
                                </Button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </TabsContent>

            {/* --- Resources Tab (Original UI) --- */}
            <TabsContent value="resources">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {community.resources.map((resource, index: number) => {
                  const ResIcon = resource.icon;
                  return (
                    <motion.div
                      key={index}
                      className="glass-card p-6 hover:border-primary/50 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div
                        className={`w-12 h-12 rounded-lg ${community.gradient} flex items-center justify-center mb-4`}
                      >
                        <ResIcon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-display font-semibold mb-2">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {resource.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            {/* --- Chat Tab Placeholder --- */}
            <TabsContent value="chat">
              <div className="glass-card p-12 text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                <h3 className="text-xl font-medium mb-2">
                  Live Chat is coming soon!
                </h3>
                <p className="text-muted-foreground">
                  We're setting up the real-time servers for {community.name}.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};;

export default CommunityPage;
