"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type CountdownProps = {
  expiresAt: string;
  onExpire?: () => void;
};

function formatTime(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function Countdown({ expiresAt, onExpire }: CountdownProps) {
  const [remaining, setRemaining] = useState(() => {
    return new Date(expiresAt).getTime() - Date.now();
  });

  useEffect(() => {
    const tick = () => {
      const next = new Date(expiresAt).getTime() - Date.now();
      setRemaining(next);
      if (next <= 0) {
        onExpire?.();
      }
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [expiresAt, onExpire]);

  const expired = remaining <= 0;
  const urgent = remaining > 0 && remaining <= 60_000;

  return (
    <div className="text-center">
      {expired ? (
        <p className="text-base font-medium text-error">Reservation expired</p>
      ) : (
        <div
          className={cn(
            "rounded-lg border p-6 transition-colors",
            urgent
              ? "border-warning/50 bg-warning/5"
              : "border-border bg-secondary-bg/50",
          )}
        >
          <p
            className={cn(
              "font-mono text-4xl font-semibold tabular-nums tracking-tight md:text-5xl",
              urgent ? "text-warning" : "text-foreground",
            )}
          >
            {formatTime(remaining)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Complete your purchase before time runs out
          </p>
        </div>
      )}
    </div>
  );
}
