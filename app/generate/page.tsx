import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

import { Lightbulb, Sparkles } from "lucide-react";
import { Spinner } from "@/components/Spinner";

const Page = () => {
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
            placeholder="Describe the post you want to create or ask for suggestions..."
            className="h-40 w-full resize-none text-base"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="type-select" className="font-medium">
              Content Type
            </Label>
            <Select defaultValue="blog">
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
            <Select defaultValue="professional">
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
            <Input id="tags-input" placeholder="e.g., AI, productivity" />
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-base font-semibold"
            >
              <Sparkles className="w-5 h-5 mr-1" />
              Generate Content
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Your Dialog Title</DialogTitle>
              <DialogDescription>
                <Spinner />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
};

export default Page;
