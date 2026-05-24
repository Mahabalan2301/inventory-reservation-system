"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
        <p className="text-lg md:text-xl font-bold text-error">Reservation expired</p>
      ) : (
        <motion.div
          className={cn(
            "rounded-3xl border-2 p-4 md:p-8 transition-all",
            urgent
              ? "border-warning/60 bg-warning/10"
              : "border-primary/40 bg-primary/10",
          )}
          animate={urgent ? { scale: [1, 1.02, 1] } : { scale: 1 }}
          transition={
            urgent
              ? { duration: 1, repeat: Infinity, ease: "easeInOut" }
              : undefined
          }
        >
          <p
            className={cn(
              "font-mono text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight",
              urgent ? "text-warning" : "text-primary",
            )}
          >
            {formatTime(remaining)}
          </p>
          <p className={cn(
            "mt-2 md:mt-3 text-xs md:text-sm font-medium",
            urgent ? "text-warning" : "text-secondary-text"
          )}>
            Complete your purchase before time runs out
          </p>
        </motion.div>
      )}
    </div>
  );
}
