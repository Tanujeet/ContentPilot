"use client";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
const Page = () => {
  const content = [
    { status: "Published", Title: "Tips and tricks", date: "30" },
    { status: "Published", Title: "Tips and tricks", date: "30" },
    { status: "Published", Title: "Tips and tricks", date: "30" },
    { status: "Published", Title: "Tips and tricks", date: "30" },
    { status: "Published", Title: "Tips and tricks", date: "30" },
  ];
  const [posts, setposts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/posts");
        setposts(res.data);
      } catch (e) {
        console.error("Failed to fetch content details :", e);
      } finally {
        setLoading(false);
      }
    };
    fetchContent;
  }, []);
  return (
    <main className="p-10">
      <section>
        <h1 className="text-4xl font-bold mb-6">Post</h1>
        <Input placeholder="Search" className="text-white" />
      </section>
      <section className="mt-10">
        <div className="grid grid-cols-3 gap-6 mt-10">
          {content.map((contents, idx) => (
            <Card key={idx} className="bg-[#1A1325] text-white">
              <CardHeader>
                your are handsome<p>{contents.status}</p>
                <CardTitle>{contents.Title}</CardTitle>
              </CardHeader>

              <CardContent>
                <p>{contents.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Page;
