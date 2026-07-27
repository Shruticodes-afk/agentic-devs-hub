"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addResource, type ResourceType } from "./actions";
import { Plus, Loader2 } from "lucide-react";

export function AddResourceDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<ResourceType | "">("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    // Explicitly add the type since Select doesn't naturally populate FormData easily without a hidden input
    if (type) formData.append("type", type);
    
    const result = await addResource(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setOpen(false);
      // Reset form
      setType("");
    }
    
    setIsLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
        <Plus className="mr-2 h-4 w-4" /> Add Resource
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#1a1a1a] border-white/[0.08] text-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add a New Resource</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Share a guide, template, deck, or link with the community.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required placeholder="e.g. Next.js App Router Guide" className="bg-white/[0.03] border-white/[0.08]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input id="url" name="url" type="url" required placeholder="https://..." className="bg-white/[0.03] border-white/[0.08]" />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={type} onValueChange={(val) => setType(val as ResourceType)} required>
              <SelectTrigger className="bg-white/[0.03] border-white/[0.08]">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-white/[0.08]">
                <SelectItem value="guide">Guide</SelectItem>
                <SelectItem value="template">Template</SelectItem>
                <SelectItem value="deck">Deck</SelectItem>
                <SelectItem value="link">Link</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input id="tags" name="tags" placeholder="react, typescript, ui" className="bg-white/[0.03] border-white/[0.08]" />
          </div>
          
          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
          
          <div className="pt-2 flex justify-end">
            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : "Save Resource"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
