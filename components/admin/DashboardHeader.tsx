"use client"

import { Menu, PanelLeftClose, PanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface DashboardHeaderProps {
  onMenuClick: () => void
  onToggleCollapse?: () => void
  collapsed?: boolean
  title: string
}

export function DashboardHeader({ onMenuClick, onToggleCollapse, collapsed, title }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-zinc-200/85 bg-white/80 backdrop-blur-xl px-4 lg:px-6 shadow-sm shadow-zinc-100/40">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="text-zinc-500 hover:text-zinc-900 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {onToggleCollapse && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="text-zinc-500 hover:text-zinc-900 hidden lg:flex"
          title={collapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {collapsed ? (
            <PanelLeft className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </Button>
      )}

      <div className="flex items-center gap-3 lg:hidden">
        <Image
          src="/logo-exa.png"
          alt="EXA Contable"
          width={90}
          height={27}
          className="h-7 w-auto"
        />
      </div>

      <h1 className="text-md font-heading font-bold text-zinc-950 lg:ml-0">
        {title}
      </h1>

      <div className="ml-auto flex items-center gap-3">
        <a
          href="/"
          className="text-xs font-semibold text-zinc-600 hover:text-red-600 transition-colors"
        >
          Ver Sitio →
        </a>
      </div>
    </header>
  )
}
