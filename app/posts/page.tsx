"use client";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";

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
              <Card key={idx} className="bg-[#1A1325] text-white">
                <CardHeader>
                  <p>{post.status}</p>
                  <CardTitle>{post.title}</CardTitle>
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
