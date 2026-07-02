"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type Period = "mensual" | "anual" | "compra-total";
const periods: { value: Period; label: string; discount?: boolean; discountLabel?: string }[] = [
  { value: "mensual", label: "Mensual" },
  { value: "anual", label: "Anual", discount: true, discountLabel: "Ahorra 20%" },
  { value: "compra-total", label: "Compra Total" },
];

interface PlanToggleProps {
  value: Period;
  onChange: (period: Period) => void;
}

export function PlanToggle({ value, onChange }: PlanToggleProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-card p-1.5 shadow-3">
      {periods.map((period) => (
        <button
          key={period.value}
          onClick={() => onChange(period.value)}
          className={cn(
            "relative rounded-md px-4 py-2.5 text-sm font-semibold capitalize transition-colors",
            value === period.value
              ? "text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {value === period.value && (
            <motion.span
              layoutId="activeTab"
              className="absolute inset-0 rounded-md bg-primary shadow-1"
              transition={{ type: "spring", duration: 0.4 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            {period.label}
            {period.discount && (
              <Badge
                className={cn(
                  "text-[10px] whitespace-nowrap shadow-none font-semibold",
                  value === period.value
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-primary/10 text-primary",
                )}
              >
                {period.discountLabel}
              </Badge>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}
