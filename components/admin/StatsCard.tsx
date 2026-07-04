"use client"

import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: {
    value: number
    positive: boolean
  }
  className?: string
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-xl border border-zinc-200/80 bg-white p-4 sm:p-5 shadow-sm shadow-zinc-100/50",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-0.5 min-w-0">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-500 truncate">{title}</p>
          <p className="text-xl sm:text-2xl font-heading font-bold text-zinc-950 truncate">
            {value}
          </p>
        </div>
        <div className="shrink-0 rounded-lg bg-red-50 p-2 sm:p-2.5">
          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600" />
        </div>
      </div>
      {(description || trend) && (
        <div className="mt-2 flex items-center gap-2">
          {trend && (
            <span
              className={cn(
                "text-[10px] sm:text-xs font-bold",
                trend.positive ? "text-emerald-600" : "text-red-600"
              )}
            >
              {trend.positive ? "+" : ""}
              {trend.value}%
            </span>
          )}
          {description && (
            <span className="text-[10px] sm:text-xs text-zinc-500 truncate">{description}</span>
          )}
        </div>
      )}
    </motion.div>
  )
}
