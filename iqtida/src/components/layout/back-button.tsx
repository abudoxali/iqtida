"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface BackButtonProps {
  label?: string;
  href?: string;
}

export function BackButton({ label = "رجوع", href }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => (href ? router.push(href) : router.back())}
      className="mb-2 text-muted-foreground hover:text-foreground"
    >
      <ChevronRight className="ml-1 h-4 w-4" />
      {label}
    </Button>
  );
}
