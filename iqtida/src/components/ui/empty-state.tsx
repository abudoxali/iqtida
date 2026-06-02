import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, actionHref, onAction }: EmptyStateProps) {
  return (
    <Card className="glass-card border-border/50">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <Icon className="h-16 w-16 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground/60 max-w-md mb-6">{description}</p>
        {actionLabel && (actionHref || onAction) && (
          <Button variant="secondary" asChild={!!actionHref} onClick={onAction}>
            {actionHref ? <a href={actionHref}>{actionLabel}</a> : actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
