import { motion } from "framer-motion";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send, Phone, Video, MoreVertical } from "lucide-react";

interface Conversation {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

interface Message {
  id: number;
  content: string;
  time: string;
  isMe: boolean;
}

const conversations: Conversation[] = [
  { id: 1, name: "Rahul Verma", avatar: "R", lastMessage: "Sure! Let's meet at 5pm", time: "2:30 PM", unread: 2, online: true },
  { id: 2, name: "Priya Sharma", avatar: "P", lastMessage: "That cafe was amazing!", time: "1:15 PM", unread: 0, online: true },
  { id: 3, name: "Amit Kumar", avatar: "A", lastMessage: "Check out this resource", time: "Yesterday", unread: 0, online: false },
  { id: 4, name: "Sneha Patel", avatar: "S", lastMessage: "How's the prep going?", time: "Yesterday", unread: 1, online: false },
  { id: 5, name: "Vikram Singh", avatar: "V", lastMessage: "See you at the gym!", time: "2 days ago", unread: 0, online: true },
];

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(conversations[0]);
  const [search, setSearch] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, content: "Hey! Are you coming to the trek this weekend?", time: "2:00 PM", isMe: false },
    { id: 2, content: "Yes! I'm so excited for it", time: "2:05 PM", isMe: true },
    { id: 3, content: "Great! We're planning to leave at 6am from Gate 1", time: "2:10 PM", isMe: false },
    { id: 4, content: "Should I bring anything specific?", time: "2:15 PM", isMe: true },
    { id: 5, content: "Just water, snacks, and a good pair of shoes. I'll handle the rest", time: "2:20 PM", isMe: false },
    { id: 6, content: "Perfect! Can't wait 🏔️", time: "2:25 PM", isMe: true },
    { id: 7, content: "Sure! Let's meet at 5pm", time: "2:30 PM", isMe: false },
  ]);

  const filteredConversations = conversations.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        content: newMessage,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isMe: true,
      },
    ]);
    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            className="glass-card overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ height: "calc(100vh - 200px)", minHeight: "600px" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 h-full">
              {/* Conversations List */}
              <div className="border-r border-border/50 flex flex-col">
                <div className="p-4 border-b border-border/50">
                  <h2 className="text-xl font-display font-semibold mb-4">Messages</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search conversations..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  {filteredConversations.map((convo) => (
                    <motion.div
                      key={convo.id}
                      className={`p-4 cursor-pointer border-b border-border/30 transition-colors ${
                        selectedChat?.id === convo.id ? "bg-primary/10" : "hover:bg-muted/30"
                      }`}
                      onClick={() => setSelectedChat(convo)}
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-medium">
                            {convo.avatar}
                          </div>
                          {convo.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate">{convo.name}</p>
                            <span className="text-xs text-muted-foreground">{convo.time}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                            {convo.unread > 0 && (
                              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                                {convo.unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Chat Window */}
              <div className="col-span-2 flex flex-col">
                {selectedChat ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-border/50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-medium">
                            {selectedChat.avatar}
                          </div>
                          {selectedChat.online && (
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{selectedChat.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {selectedChat.online ? "Online" : "Offline"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Phone className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Video className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`max-w-xs md:max-w-md ${message.isMe ? "text-right" : ""}`}>
                            <div className={`p-3 rounded-2xl ${
                              message.isMe 
                                ? "bg-primary text-primary-foreground rounded-br-md" 
                                : "bg-muted rounded-bl-md"
                            }`}>
                              {message.content}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{message.time}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-border/50">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                          className="flex-1"
                        />
                        <Button onClick={handleSendMessage} className="btn-glow">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    Select a conversation to start messaging
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Messages;
