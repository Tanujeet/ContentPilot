"use client";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Post = {
  id: string;
  title: string;
  content: string;
  type: string;
  scheduledAt: string;
  status: string;
  generated: boolean;
  userId: string;
  createdAt: string;
  tone?: string;
  tags?: string;
};

const Page = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  // State for View dialog
  const [viewOpen, setViewOpen] = useState(false);
  const [viewPost, setViewPost] = useState<Post | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/posts");
        setPosts(res.data);
      } catch (e) {
        console.error("Failed to fetch content details :", e);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleView = async (postId: string) => {
    setViewOpen(true);
    setViewLoading(true);
    try {
      const res = await axiosInstance.get(`/posts/${postId}`);
      setViewPost(res.data);
    } catch (e) {
      setViewPost({
        id: "",
        title: "Error",
        content: "<p>Failed to load post content.</p>",
        type: "",
        scheduledAt: "",
        status: "",
        generated: false,
        userId: "",
        createdAt: "",
        tone: "",
        tags: "",
      });
    } finally {
      setViewLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await axiosInstance.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (e) {
      console.error("Failed to delete post:", e);
      alert("Failed to delete post. Please try again.");
    }
  };

  const handlePublish = async (postId: string) => {
    try {
      await axiosInstance.patch(`/posts/${postId}`);
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, status: "PUBLISHED" } : p))
      );
    } catch (e) {
      console.error("Failed to publish:", e);
      alert("Failed to publish post");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <main className="p-10">
      <section>
        <h1 className="text-4xl font-bold mb-6">Post</h1>
        <Input
          placeholder="Search"
          className="text-white"
          value={query}
          onChange={handleChange}
        />
      </section>
      <section className="mt-10">
        {loading ? (
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="text-center font-light border-b p-2">
            No recent posts
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6 mt-10">
            {filteredPosts.map((post, idx) => (
              <Card key={idx} className="bg-[#1A1325] text-white relative">
                {/* Top right button */}
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-white"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40">
                      <DropdownMenuItem onClick={() => handleView(post.id)}>
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(post.id)}>
                        Delete
                      </DropdownMenuItem>
                      {post.status === "DRAFT" && (
                        <DropdownMenuItem
                          onClick={() => handlePublish(post.id)}
                        >
                          Publish
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <CardHeader>
                  <p className="text-sm text-gray-400">{post.status}</p>
                  <CardTitle>{post.title}</CardTitle>
                  <p className="text-sm">Tone: {post.tone || "N/A"}</p>
                  <p className="text-sm">Platform: {post.type}</p>
                </CardHeader>

                <CardContent>
                  <p>{new Date(post.createdAt).toDateString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-black">
              {viewLoading ? "Loading..." : viewPost?.title}
            </DialogTitle>
            <DialogDescription>
              {viewLoading ? (
                <p>Loading post content...</p>
              ) : (
                <div
                  className="prose prose-lg max-w-none font-bold"
                  dangerouslySetInnerHTML={{ __html: viewPost?.content || "" }}
                />
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default Page;
