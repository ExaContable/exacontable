"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface DashboardHeaderProps {
  onMenuClick: () => void
  title: string
}

export function DashboardHeader({ onMenuClick, title }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/40 bg-background/80 backdrop-blur-lg px-4 lg:px-6 shadow-xs">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="text-muted-foreground hover:text-heading lg:hidden"
      >
        <Menu className="h-4 w-4" />
      </Button>

      <h1 className="text-sm font-bold font-heading text-heading">
        {title}
      </h1>

      <div className="ml-auto flex items-center gap-3">
        <Link
          href="/"
          className="text-xs font-semibold text-muted-foreground/70 hover:text-primary transition-colors"
        >
          Ver Sitio &rarr;
        </Link>
      </div>
    </header>
  )
}
