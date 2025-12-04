import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Heart,
  MessageCircle,
  Share2,
  Eye,
  ArrowLeft,
  Send,
  MoreHorizontal,
  Maximize2,
  Download,
  Copy,
  Twitter,
  Facebook,
  Linkedin,
  Link2,
  Reply,
  ChevronDown,
  ChevronUp,
  Bookmark,
} from "lucide-react";
import { webieStorage, type Webie, type WebieComment, type WebieReply } from "@/lib/webieStorage";
import { userStorage } from "@/lib/storage";
import { savedWebieStorage } from "@/lib/followStorage";
import { toast } from "sonner";

const WebieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [webie, setWebie] = useState<Webie | null>(null);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const commentsRef = useRef<HTMLDivElement>(null);
  const currentUser = userStorage.getCurrentUser();

  useEffect(() => {
    if (id) {
      const found = webieStorage.getById(id);
      if (found) {
        setWebie(found);
        webieStorage.incrementViews(id);
        if (currentUser) {
          setIsSaved(savedWebieStorage.isSaved(currentUser.id, id));
        }
      } else {
        toast.error("Webie not found");
        navigate("/webies");
      }
    }
  }, [id, navigate, currentUser]);

  useEffect(() => {
    if (webie && iframeRef.current) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        let html = webie.htmlContent;
        
        if (webie.cssFiles) {
          const cssInjects = Object.values(webie.cssFiles)
            .map(content => `<style>${content}</style>`)
            .join('\n');
          html = html.replace('</head>', `${cssInjects}\n</head>`);
        }
        
        if (webie.jsFiles) {
          const jsInjects = Object.values(webie.jsFiles)
            .map(content => `<script>${content}</script>`)
            .join('\n');
          html = html.replace('</body>', `${jsInjects}\n</body>`);
        }
        
        if (webie.assets) {
          Object.entries(webie.assets).forEach(([filename, dataUrl]) => {
            const patterns = [
              new RegExp(`src=["'].*${filename}["']`, 'g'),
              new RegExp(`href=["'].*${filename}["']`, 'g'),
              new RegExp(`url\\(['"].*${filename}['"]\\)`, 'g'),
            ];
            patterns.forEach(pattern => {
              html = html.replace(pattern, (match) => {
                if (match.includes('src=')) return `src="${dataUrl}"`;
                if (match.includes('href=')) return `href="${dataUrl}"`;
                return `url('${dataUrl}')`;
              });
            });
          });
        }
        
        doc.write(html);
        doc.close();
      }
    }
  }, [webie]);

  useEffect(() => {
    if (window.location.hash === "#comments" && commentsRef.current) {
      commentsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [webie]);

  const handleLike = () => {
    if (!currentUser) {
      toast.error("Please login to like");
      navigate("/auth");
      return;
    }
    if (webie) {
      webieStorage.toggleLike(webie.id, currentUser.id);
      setWebie(webieStorage.getById(webie.id));
    }
  };

  const handleSave = () => {
    if (!currentUser) {
      toast.error("Please login to save");
      navigate("/auth");
      return;
    }
    if (webie) {
      if (isSaved) {
        savedWebieStorage.unsave(currentUser.id, webie.id);
        setIsSaved(false);
        toast.success("Removed from saved");
      } else {
        savedWebieStorage.save(currentUser.id, webie.id);
        setIsSaved(true);
        toast.success("Saved!");
      }
    }
  };

    if (!currentUser) {
      toast.error("Please login to like");
      return;
    }
    if (webie) {
      webieStorage.toggleCommentLike(webie.id, commentId, currentUser.id);
      setWebie(webieStorage.getById(webie.id));
    }
  };

  const handleAddComment = () => {
    if (!currentUser) {
      toast.error("Please login to comment");
      navigate("/auth");
      return;
    }
    if (!newComment.trim()) return;

    const comment: WebieComment = {
      id: `comment-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content: newComment.trim(),
      likes: [],
      replies: [],
      createdAt: new Date().toISOString(),
    };

    webieStorage.addComment(webie!.id, comment);
    setWebie(webieStorage.getById(webie!.id));
    setNewComment("");
    toast.success("Comment added");
  };

  const handleAddReply = (commentId: string) => {
    if (!currentUser) {
      toast.error("Please login to reply");
      return;
    }
    if (!replyContent.trim()) return;

    const reply: WebieReply = {
      id: `reply-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content: replyContent.trim(),
      createdAt: new Date().toISOString(),
    };

    webieStorage.addReply(webie!.id, commentId, reply);
    setWebie(webieStorage.getById(webie!.id));
    setReplyContent("");
    setReplyingTo(null);
    setExpandedReplies(prev => new Set(prev).add(commentId));
    toast.success("Reply added");
  };

  const handleShare = async (platform?: string) => {
    const url = `${window.location.origin}/webie/${webie?.id}`;
    const text = `Check out "${webie?.title}" on Webie`;

    if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
    } else if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
    } else if (platform === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }

    webieStorage.incrementShares(webie!.id);
    setWebie(webieStorage.getById(webie!.id));
    setShowShareDialog(false);
  };

  const handleDownload = () => {
    if (!webie) return;
    const blob = new Blob([webie.htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${webie.title}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded successfully");
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const timeAgo = (date: string): string => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return Math.floor(seconds / 60) + "m ago";
    if (seconds < 86400) return Math.floor(seconds / 3600) + "h ago";
    if (seconds < 604800) return Math.floor(seconds / 86400) + "d ago";
    return new Date(date).toLocaleDateString();
  };

  if (!webie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const isLiked = currentUser && webie.likes.includes(currentUser.id);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => navigate("/webies")}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Webies
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Preview */}
            <Card className="overflow-hidden">
              <div className="relative aspect-video bg-muted">
                <iframe
                  ref={iframeRef}
                  className="w-full h-full border-0"
                  title="Webie Preview"
                  sandbox="allow-same-origin"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-4 right-4"
                  onClick={() => setShowFullPreview(true)}
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>

            {/* Actions Bar */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant={isLiked ? "default" : "outline"}
                      className="gap-2"
                      onClick={handleLike}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                      {formatNumber(webie.likes.length)}
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => commentsRef.current?.scrollIntoView({ behavior: "smooth" })}
                    >
                      <MessageCircle className="w-4 h-4" />
                      {formatNumber(webie.comments.length)}
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => setShowShareDialog(true)}
                    >
                      <Share2 className="w-4 h-4" />
                      {formatNumber(webie.shares)}
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={isSaved ? "default" : "outline"}
                      size="icon"
                      onClick={handleSave}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                    </Button>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {formatNumber(webie.views)} views
                    </span>
                    <Button variant="outline" size="icon" onClick={handleDownload}>
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card ref={commentsRef} id="comments">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Comments ({webie.comments.length})
                </h3>

                {/* Add Comment */}
                <div className="flex gap-3 mb-6">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={currentUser?.avatar} />
                    <AvatarFallback>
                      {currentUser?.name?.charAt(0).toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Textarea
                      placeholder={currentUser ? "Add a comment..." : "Login to comment"}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      disabled={!currentUser}
                      rows={3}
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={handleAddComment}
                        disabled={!currentUser || !newComment.trim()}
                        className="gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Post
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator className="mb-6" />

                {/* Comments List */}
                {webie.comments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No comments yet. Be the first to comment!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {webie.comments.map((comment) => (
                      <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                      >
                        <div className="flex gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={comment.userAvatar} />
                            <AvatarFallback>
                              {comment.userName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="bg-muted rounded-lg p-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium">{comment.userName}</span>
                                <span className="text-xs text-muted-foreground">
                                  {timeAgo(comment.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm">{comment.content}</p>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <button
                                className={`flex items-center gap-1 hover:text-primary transition-colors ${
                                  currentUser && comment.likes.includes(currentUser.id)
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                }`}
                                onClick={() => handleCommentLike(comment.id)}
                              >
                                <Heart className={`w-4 h-4 ${
                                  currentUser && comment.likes.includes(currentUser.id)
                                    ? "fill-current"
                                    : ""
                                }`} />
                                {comment.likes.length > 0 && comment.likes.length}
                              </button>
                              <button
                                className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                              >
                                <Reply className="w-4 h-4" />
                                Reply
                              </button>
                              {comment.replies.length > 0 && (
                                <button
                                  className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                                  onClick={() => {
                                    const newExpanded = new Set(expandedReplies);
                                    if (newExpanded.has(comment.id)) {
                                      newExpanded.delete(comment.id);
                                    } else {
                                      newExpanded.add(comment.id);
                                    }
                                    setExpandedReplies(newExpanded);
                                  }}
                                >
                                  {expandedReplies.has(comment.id) ? (
                                    <ChevronUp className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                  {comment.replies.length} replies
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Reply Input */}
                        {replyingTo === comment.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="ml-12 flex gap-3"
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={currentUser?.avatar} />
                              <AvatarFallback>
                                {currentUser?.name?.charAt(0).toUpperCase() || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 flex gap-2">
                              <Textarea
                                placeholder="Write a reply..."
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                rows={2}
                                className="flex-1"
                              />
                              <Button
                                size="sm"
                                onClick={() => handleAddReply(comment.id)}
                                disabled={!replyContent.trim()}
                              >
                                <Send className="w-4 h-4" />
                              </Button>
                            </div>
                          </motion.div>
                        )}

                        {/* Replies */}
                        {expandedReplies.has(comment.id) && comment.replies.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="ml-12 space-y-3"
                          >
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={reply.userAvatar} />
                                  <AvatarFallback>
                                    {reply.userName.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="bg-muted/50 rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="font-medium text-sm">{reply.userName}</span>
                                      <span className="text-xs text-muted-foreground">
                                        {timeAgo(reply.createdAt)}
                                      </span>
                                    </div>
                                    <p className="text-sm">{reply.content}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Creator Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar 
                    className="h-14 w-14 cursor-pointer"
                    onClick={() => navigate(`/profile/user/${webie.userId}`)}
                  >
                    <AvatarImage src={webie.userAvatar} />
                    <AvatarFallback>{webie.userName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 
                      className="font-semibold cursor-pointer hover:text-primary"
                      onClick={() => navigate(`/profile/user/${webie.userId}`)}
                    >
                      {webie.userName}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {timeAgo(webie.createdAt)}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(`/profile/user/${webie.userId}`)}
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>

            {/* Webie Info */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-2">{webie.title}</h2>
                <p className="text-muted-foreground mb-4">{webie.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {webie.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Likes</p>
                    <p className="font-semibold">{formatNumber(webie.likes.length)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Comments</p>
                    <p className="font-semibold">{formatNumber(webie.comments.length)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Views</p>
                    <p className="font-semibold">{formatNumber(webie.views)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Shares</p>
                    <p className="font-semibold">{formatNumber(webie.shares)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share this Webie</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => handleShare("twitter")}
            >
              <Twitter className="w-4 h-4" />
              Twitter
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => handleShare("facebook")}
            >
              <Facebook className="w-4 h-4" />
              Facebook
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => handleShare("linkedin")}
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => handleShare()}
            >
              <Link2 className="w-4 h-4" />
              Copy Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Full Preview Dialog */}
      <Dialog open={showFullPreview} onOpenChange={setShowFullPreview}>
        <DialogContent className="max-w-6xl h-[90vh]">
          <iframe
            srcDoc={webie.htmlContent}
            className="w-full h-full border-0 rounded-lg"
            title="Full Preview"
            sandbox="allow-same-origin"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WebieDetail;
