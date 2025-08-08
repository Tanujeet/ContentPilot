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

const Page = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [idea, setIdea] = useState("");
  const [contentType, setContentType] = useState("blog");
  const [tone, setTone] = useState("professional");
  const [tags, setTags] = useState("");

  const handleGenerate = async () => {
    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // ✅ Content generated, close dialog
      setOpen(false);
    } catch (err) {
      console.error("Error generating content", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center mt-20 p-4">
      <div className="w-full max-w-2xl p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Your Idea</h1>
        </div>

        <div>
          <Label htmlFor="prompt-input" className="sr-only">
            Your Idea
          </Label>
          <Textarea
            id="prompt-input"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Describe the post you want to create or ask for suggestions..."
            className="h-40 w-full resize-none text-base"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="type-select" className="font-medium">
              Content Type
            </Label>
            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger id="type-select">
                <SelectValue placeholder="Select a content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blog">Blog</SelectItem>
                <SelectItem value="tweet">Tweet</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>

            <Label htmlFor="tone-select" className="font-medium">
              Tone
            </Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger id="tone-select">
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
            <Label htmlFor="tags-input" className="font-medium">
              Tags / Keywords
            </Label>
            <Input
              id="tags-input"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., AI, productivity"
            />
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <Button
            size="lg"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-base font-semibold"
            onClick={() => {
              setOpen(true);
              handleGenerate();
            }}
            disabled={loading}
          >
            <Sparkles className="w-5 h-5 mr-1" />
            Generate Content
          </Button>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generating Content</DialogTitle>
              <DialogDescription>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Spinner />
                    Please wait while your AI content is being generated...
                  </div>
                ) : (
                  "Your content is ready!"
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
