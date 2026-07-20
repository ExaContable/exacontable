"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  accentColor?: string
  gradientFrom?: string
  gradientTo?: string
  className?: string
}

const cardColors: Record<string, { accent: string; from: string; to: string; iconBg: string }> = {
  red: {
    accent: "bg-[oklch(0.50_0.18_25)]",
    from: "from-[oklch(0.50_0.18_25)]",
    to: "to-[oklch(0.55_0.15_15)]",
    iconBg: "bg-[oklch(0.50_0.18_25/8%)] text-[oklch(0.50_0.18_25)]",
  },
  blue: {
    accent: "bg-[oklch(0.55_0.12_250)]",
    from: "from-[oklch(0.55_0.12_250)]",
    to: "to-[oklch(0.50_0.10_220)]",
    iconBg: "bg-[oklch(0.55_0.12_250/8%)] text-[oklch(0.55_0.12_250)]",
  },
  gold: {
    accent: "bg-[oklch(0.65_0.15_75)]",
    from: "from-[oklch(0.65_0.15_75)]",
    to: "to-[oklch(0.60_0.12_55)]",
    iconBg: "bg-[oklch(0.65_0.15_75/8%)] text-[oklch(0.65_0.15_75)]",
  },
  amber: {
    accent: "bg-[oklch(0.65_0.15_85)]",
    from: "from-[oklch(0.65_0.15_85)]",
    to: "to-[oklch(0.60_0.12_65)]",
    iconBg: "bg-[oklch(0.65_0.15_85/8%)] text-[oklch(0.65_0.15_85)]",
  },
  purple: {
    accent: "bg-[oklch(0.55_0.15_300)]",
    from: "from-[oklch(0.55_0.15_300)]",
    to: "to-[oklch(0.50_0.12_280)]",
    iconBg: "bg-[oklch(0.55_0.15_300/8%)] text-[oklch(0.55_0.15_300)]",
  },
  emerald: {
    accent: "bg-[oklch(0.55_0.15_160)]",
    from: "from-[oklch(0.55_0.15_160)]",
    to: "to-[oklch(0.50_0.12_140)]",
    iconBg: "bg-[oklch(0.55_0.15_160/8%)] text-[oklch(0.55_0.15_160)]",
  },
}

function AnimatedNumber({ value, format }: { value: number; format?: "integer" | "currency" }) {
  const nodeRef = useRef<HTMLSpanElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const node = nodeRef.current
    if (!node || hasAnimated) return

    const duration = 1200
    const startTime = performance.now()

    function update(currentTime: number) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = eased * value

      if (format === "currency") {
        node!.textContent = `$${current.toFixed(2)}`
      } else {
        node!.textContent = Math.round(current).toLocaleString()
      }

      if (progress < 1) {
        requestAnimationFrame(update)
      } else {
        if (format === "currency") {
          node!.textContent = `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        } else {
          node!.textContent = value.toLocaleString()
        }
        setHasAnimated(true)
      }
    }

    requestAnimationFrame(update)
  }, [value, format, hasAnimated])

  return (
    <span ref={nodeRef} className="tabular-nums">
      {format === "currency"
        ? `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : Number(value).toLocaleString()}
    </span>
  )
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  accentColor = "red",
  className,
}: StatsCardProps) {
  const colors = cardColors[accentColor] || cardColors.red
  const numericValue = typeof value === "string" ? parseFloat(value.replace(/[^0-9.-]/g, "")) : value
  const isCurrency = typeof value === "string" && value.startsWith("$")
  const isNumeric = typeof numericValue === "number" && !isNaN(numericValue)

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border/40 bg-card shadow-xs shadow-zinc-900/2.5 transition-all duration-300 hover:shadow-md hover:shadow-zinc-900/5 hover:border-border/60 hover:-translate-y-0.5",
        className
      )}
    >
      <div className={cn("absolute left-0 top-0 h-full w-0.5", colors.accent)} />
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/80 truncate">
              {title}
            </p>
            <p className="text-xl sm:text-2xl font-bold font-heading text-heading truncate">
              {isNumeric ? (
                <AnimatedNumber value={numericValue} format={isCurrency ? "currency" : "integer"} />
              ) : (
                value
              )}
            </p>
          </div>
          <div className={cn(
            "shrink-0 rounded-lg p-2.5 transition-colors duration-300",
            colors.iconBg,
            "group-hover:scale-105 group-hover:[&>svg]:scale-110"
          )}>
            <Icon className="h-4 w-4 transition-transform duration-300" />
          </div>
        </div>
        {description && (
          <div className="mt-2">
            <p className="text-[11px] text-muted-foreground/70 leading-relaxed">
              {description}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
