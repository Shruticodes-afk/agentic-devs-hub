"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { joinChapter } from "./actions";

export function JoinChapterButton({ chapterId }: { chapterId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleJoin = () => {
    startTransition(async () => {
      const res = await joinChapter(chapterId);
      if (res?.error) {
        alert(res.error);
      }
    });
  };

  return (
    <Button
      onClick={handleJoin}
      disabled={isPending}
      className="bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors duration-200"
    >
      {isPending ? "Joining..." : "Join Chapter"}
    </Button>
  );
}
