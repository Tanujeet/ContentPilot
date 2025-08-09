"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";
import { Spinner } from "@/components/Spinner";
import { axiosInstance } from "@/lib/axios";

const Page = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [idea, setIdea] = useState("");
  const [contentType, setContentType] = useState("blog");
  const [tone, setTone] = useState("professional");
  const [tags, setTags] = useState("");
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setGeneratedContent(null);
      setOpen(true);

      const res = await axiosInstance.post("/generate", {
        idea,
        contentType,
        tone,
        tags,
      });

      setGeneratedContent(res.data.html || "<p>No content generated.</p>");
    } catch (e) {
      console.error("Failed to generate data:", e);
      setGeneratedContent(
        "<p>Failed to generate content. Please try again.</p>"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center mt-20 p-4">
      <div className="w-full max-w-2xl p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col space-y-6">
        <h1 className="text-2xl font-bold text-white">Your Idea</h1>

        <Textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Describe the post you want to create..."
          className="h-40 w-full resize-none text-base"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Content Type</Label>
            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger>
                <SelectValue placeholder="Select a content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blog">Blog</SelectItem>
                <SelectItem value="tweet">Tweet</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>

            <Label>Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger>
                <SelectValue placeholder="Select a tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tags / Keywords</Label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., AI, productivity"
            />
          </div>
        </div>

        <Button
          size="lg"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-base font-semibold"
          onClick={handleGenerate}
          disabled={loading}
        >
          <Sparkles className="w-5 h-5 mr-1" />
          Generate Content
        </Button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-black">
                {loading ? "Generating Content..." : "Your Generated Content"}
              </DialogTitle>
              <DialogDescription asChild>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Spinner />
                    <span>Please wait...</span>
                  </div>
                ) : (
                  <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: generatedContent || "",
                    }}
                  />
                )}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
};

export default Page;
