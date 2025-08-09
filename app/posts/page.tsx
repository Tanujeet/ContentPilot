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

  const handleEdit = (postId: string) => {
    console.log("Edit post", postId);
    // yaha edit ka logic ya navigation dalna hoga
  };

  const handleDelete = async (postId: string) => {
    console.log("Delete post", postId);
    try {
      const res = await axiosInstance.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (e) {
      console.error("Failed to delete post:", e);
      alert("Failed to delete post. Please try again.");
    }
  };

  const handlePublish = async (postId: string) => {
    console.log("Publish post", postId);
    // API call karke publish status update karo
  };
  return (
    <main className="p-10">
      <section>
        <h1 className="text-4xl font-bold mb-6">Post</h1>
        <Input placeholder="Search" className="text-white" />
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
            {posts.map((post, idx) => (
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
                      <DropdownMenuItem onClick={() => handleEdit(post.id)}>
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(post.id)}>
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePublish(post.id)}>
                        Publish
                      </DropdownMenuItem>
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
    </main>
  );
};

export default Page;
