"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  CreditCard,
  ShoppingBag,
  MessageSquare,
  Settings,
  LogOut,
  X,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/planes", label: "Planes", icon: Package },
  { href: "/admin/metodos-pago", label: "Métodos de Pago", icon: CreditCard },
  { href: "/admin/ordenes", label: "Órdenes", icon: ShoppingBag },
  { href: "/admin/whatsapp", label: "WhatsApp", icon: MessageSquare },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
]

interface SidebarProps {
  open: boolean
  collapsed: boolean
  onClose: () => void
  onToggleCollapse: () => void
}

export function Sidebar({ open, collapsed, onClose, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/admin/login")
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 overflow-hidden",
          collapsed ? "w-16" : "w-64",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className={cn(
          "flex h-14 items-center border-b border-sidebar-border shrink-0",
          collapsed ? "justify-center px-0" : "justify-between px-5"
        )}>
          {collapsed ? (
            <button
              onClick={onToggleCollapse}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground/50 hover:text-heading hover:bg-accent/50 transition-all"
              title="Expandir menú"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          ) : (
            <>
              <Link href="/admin" className="flex items-center gap-3">
                <Image
                  src="/logo-exa.png"
                  alt="EXA Contable"
                  width={120}
                  height={36}
                  className="h-7 w-auto"
                />
              </Link>
              <button
                onClick={onToggleCollapse}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground/40 hover:text-heading hover:bg-accent/50 transition-all hidden lg:flex"
                title="Colapsar menú"
              >
                <PanelLeftClose className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={onClose}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground/40 hover:text-heading hover:bg-accent/50 transition-all lg:hidden"
                title="Cerrar menú"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-2 min-h-0 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center rounded-lg transition-all duration-200 group",
                  collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
                  isActive
                    ? "bg-primary/8 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-heading"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground/60 group-hover:text-heading"
                )} />
                {!collapsed && (
                  <span className="text-sm">{item.label}</span>
                )}
                {isActive && !collapsed && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className={cn(
          "border-t border-sidebar-border p-2 shrink-0",
          collapsed && "flex justify-center"
        )}>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              "text-muted-foreground/60 hover:text-destructive hover:bg-destructive/5",
              collapsed
                ? "w-9 h-9 p-0 justify-center rounded-lg"
                : "w-full justify-start gap-3 text-sm"
            )}
            title={collapsed ? "Cerrar Sesión" : undefined}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Cerrar Sesión</span>}
          </Button>
        </div>
      </aside>
    </>
  )
}
