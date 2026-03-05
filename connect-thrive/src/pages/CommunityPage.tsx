import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useCommunity } from "@/context/CommunityContext";
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
  Check,
  UserMinus,
} from "lucide-react";

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
  icon: React.ElementType;
  gradient: string;
  color: string;
  members: number;
  resources: {
    title: string;
    icon: React.ElementType;
    description: string;
  }[];
}

const communityData: Record<string, Community> = {
  travel: {
    name: "Travel & Explore",
    description: "Discover nearby campus places, cafes, weekend getaways, and find travel buddies.",
    icon: Plane,
    gradient: "bg-gradient-to-br from-cyan-500 to-blue-600",
    color: "text-travel",
    members: 234,
    resources: [
      { title: "Nearby Cafes", icon: Coffee, description: "Best cafes near campus for study sessions" },
      { title: "Weekend Getaways", icon: Mountain, description: "Popular spots within 100km" },
      { title: "Food Spots", icon: Utensils, description: "Must-try restaurants and street food" },
      { title: "Campus Places", icon: MapPin, description: "Hidden gems around campus" },
    ],
  },
  dsa: {
    name: "DSA & Coding",
    description: "Master Data Structures & Algorithms together. Share resources and crack placements!",
    icon: Code,
    gradient: "bg-gradient-to-br from-purple-500 to-pink-600",
    color: "text-dsa",
    members: 456,
    resources: [
      { title: "LeetCode Roadmap", icon: Target, description: "Curated problem sets by topic" },
      { title: "Interview Prep", icon: BookOpen, description: "Company-wise question banks" },
      { title: "Study Resources", icon: BookOpen, description: "Best tutorials and courses" },
      { title: "Contest Calendar", icon: Target, description: "Upcoming coding competitions" },
    ],
  },
  "mental-wellness": {
    name: "Mental Wellness",
    description: "Your safe space for mental health. Join meditation sessions and support each other.",
    icon: Brain,
    gradient: "bg-gradient-to-br from-green-500 to-emerald-600",
    color: "text-wellness",
    members: 189,
    resources: [
      { title: "Guided Meditation", icon: Brain, description: "Daily meditation sessions" },
      { title: "Wellness Articles", icon: BookOpen, description: "Mental health resources" },
      { title: "Support Circle", icon: Users, description: "Peer support groups" },
      { title: "Self-Care Tips", icon: Heart, description: "Daily wellness practices" },
    ],
  },
  startup: {
    name: "Startup Hub",
    description: "Connect with aspiring entrepreneurs, share ideas, and find co-founders.",
    icon: Rocket,
    gradient: "bg-gradient-to-br from-orange-500 to-amber-600",
    color: "text-startup",
    members: 312,
    resources: [
      { title: "Startup Ideas", icon: Lightbulb, description: "Pitch and validate ideas" },
      { title: "Find Co-founders", icon: Users, description: "Connect with potential partners" },
      { title: "Funding Resources", icon: Target, description: "Grants and investor info" },
      { title: "Success Stories", icon: BookOpen, description: "Learn from alumni startups" },
    ],
  },
  gym: {
    name: "Fitness & Gym",
    description: "Find gym buddies, share routines, and stay motivated on your fitness journey!",
    icon: Dumbbell,
    gradient: "bg-gradient-to-br from-red-500 to-rose-600",
    color: "text-gym",
    members: 278,
    resources: [
      { title: "Workout Plans", icon: Dumbbell, description: "Beginner to advanced routines" },
      { title: "Nutrition Guide", icon: Utensils, description: "Meal plans and diet tips" },
      { title: "Gym Buddies", icon: Users, description: "Find workout partners" },
      { title: "Progress Tracker", icon: Target, description: "Track your fitness goals" },
    ],
  },
};

const CommunityPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { joinedCommunities, joinCommunity, leaveCommunity } = useCommunity();

  const community = communityData[id || "travel"] || communityData.travel;
  const Icon = community.icon;

  // Check if user has joined this community
  const isJoined = joinedCommunities.includes(id || "");

  // Dynamic member count: initialize correctly based on current join state
  const [memberCount, setMemberCount] = useState(
    isJoined ? community.members + 1 : community.members
  );

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
  const [comments, setComments] = useState<Record<number, Comment[]>>({});

  // Update member count when join state changes
  useEffect(() => {
    setMemberCount(isJoined ? community.members + 1 : community.members);
  }, [isJoined, community.members]);

  const handleJoin = () => {
    joinCommunity(id || "");
    toast({
      title: `Joined ${community.name}! 🎉`,
      description: "You can now post and interact with the community.",
      className: "border border-primary/30 bg-background/95 backdrop-blur",
    });
  };

  const handleLeave = () => {
    leaveCommunity(id || "");
    toast({
      title: `Left ${community.name}`,
      description: "You have left this community.",
      variant: "destructive",
    });
  };

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const response = await axios.get(`http://localhost:5000/api/posts/${id}`, {
        headers: { Authorization: token },
      });
      setPosts(response.data);
    } catch (error) {
      if (error.response?.status === 401) navigate("/login");
      toast({ variant: "destructive", title: "Error", description: "Failed to load posts." });
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [id]);

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/posts/create",
        { community_id: id, content: newPost },
        { headers: { Authorization: token } }
      );
      toast({ title: "Success!", description: "Post shared with community." });
      setNewPost("");
      fetchPosts();
    } catch (error) {
      toast({ variant: "destructive", title: "Post Failed", description: "Something went wrong" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (postId: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/posts/${postId}/like`,
        {},
        { headers: { Authorization: token } }
      );
      fetchPosts();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not like the post." });
    }
  };

  const handleFetchComments = async (postId: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/posts/${postId}/comments`, {
        headers: { Authorization: token },
      });
      setComments((prev) => ({ ...prev, [postId]: res.data }));
      setActiveCommentBox(postId);
    } catch (err) {
      console.error("Failed to fetch comments");
    }
  };

  const handlePostComment = async (postId: number) => {
    if (!commentText.trim()) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/posts/${postId}/comments`,
        { content: commentText },
        { headers: { Authorization: token } }
      );
      setCommentText("");
      handleFetchComments(postId);
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

          {/* Header */}
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
                <h1 className="text-3xl font-display font-bold mb-2">{community.name}</h1>
                <p className="text-muted-foreground mb-4">{community.description}</p>
                <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                  {/* Dynamic member count */}
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <motion.span
                      key={memberCount}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {memberCount} members
                    </motion.span>
                  </span>
                  <span className="flex items-center gap-1 text-primary">
                    <div className="w-2 h-2 rounded-full bg-green-500" /> Active now
                  </span>
                  {/* Joined badge */}
                  {isJoined && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-0.5 rounded-full text-xs border border-primary/20"
                    >
                      <Check className="w-3 h-3" /> Member
                    </motion.span>
                  )}
                </div>
              </div>

              {/* Join / Leave Button */}
              <AnimatePresence mode="wait">
                {isJoined ? (
                  <motion.div
                    key="leave"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Button
                      variant="outline"
                      onClick={handleLeave}
                      className="border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive gap-2"
                    >
                      <UserMinus className="w-4 h-4" />
                      Leave Community
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="join"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Button onClick={handleJoin} className="btn-glow">
                      Join Community
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Tabs */}
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

            {/* Posts Tab */}
            <TabsContent value="posts">
              <div className="space-y-6">

                {/* Create Post Box — only visible when joined */}
                <AnimatePresence>
                  {isJoined ? (
                    <motion.div
                      key="post-box"
                      className="glass-card p-6"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <Textarea
                        placeholder={`What's happening in ${community.name}?`}
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        className="mb-4"
                      />
                      <div className="flex justify-between items-center">
                        <Button variant="ghost" size="icon" className="text-muted-foreground">
                          <ImageIcon className="w-5 h-5" />
                        </Button>
                        <Button onClick={handleCreatePost} disabled={isLoading} className="btn-glow">
                          {isLoading ? "Posting..." : <><Plus className="w-4 h-4 mr-2" /> Post</>}
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="join-prompt"
                      className="glass-card p-8 text-center border border-dashed border-border/50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Users className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-40" />
                      <p className="text-muted-foreground mb-4">
                        Join this community to post and interact with members.
                      </p>
                      <Button onClick={handleJoin} className="btn-glow">
                        Join Community
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Posts List — visible to everyone */}
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
                      <div className="flex gap-4 mt-4 pt-4 border-t border-border/40">
                        <button
                          onClick={() => handleLike(post.id)}
                          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <Heart className={`w-4 h-4 ${post.likes > 0 ? "fill-red-500 text-red-500" : ""}`} />
                          {post.likes}
                        </button>
                        <button
                          onClick={() => toggleComments(post.id)}
                          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          {comments[post.id]?.length || 0} Comments
                        </button>

                        <AnimatePresence>
                          {activeCommentBox === post.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="mt-4 pt-4 border-t border-border/20 overflow-hidden w-full"
                            >
                              <div className="space-y-3 mb-4 max-h-40 overflow-y-auto pr-2">
                                {comments[post.id]?.map((c, i) => (
                                  <div key={i} className="bg-muted/30 p-2 rounded-lg text-sm">
                                    <span className="font-bold text-primary mr-2">{c.username}:</span>
                                    <span className="text-foreground/80">{c.content}</span>
                                  </div>
                                ))}
                              </div>
                              {/* Only show comment input if joined */}
                              {isJoined ? (
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="Write a comment..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    className="h-8 text-sm"
                                  />
                                  <Button size="sm" onClick={() => handlePostComment(post.id)}>
                                    <Send className="w-3 h-3" />
                                  </Button>
                                </div>
                              ) : (
                                <p className="text-xs text-muted-foreground text-center">
                                  Join this community to leave comments.
                                </p>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </TabsContent>

            {/* Resources Tab */}
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
                      <div className={`w-12 h-12 rounded-lg ${community.gradient} flex items-center justify-center mb-4`}>
                        <ResIcon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-display font-semibold mb-2">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            {/* Chat Tab */}
            <TabsContent value="chat">
              <div className="glass-card p-12 text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                <h3 className="text-xl font-medium mb-2">Live Chat is coming soon!</h3>
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
};

export default CommunityPage;