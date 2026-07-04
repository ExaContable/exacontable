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
import { motion } from "framer-motion"

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
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-zinc-200/80 transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className={cn(
          "flex h-16 items-center border-b border-zinc-200/80",
          collapsed ? "justify-center px-0" : "justify-between px-5"
        )}>
          {collapsed ? (
            <button
              onClick={onToggleCollapse}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all"
              title="Expandir menú"
            >
              <PanelLeft className="h-5 w-5" />
            </button>
          ) : (
            <>
              <Link href="/admin" className="flex items-center gap-3">
                <Image
                  src="/logo-exa.png"
                  alt="EXA Contable"
                  width={120}
                  height={36}
                  className="h-8 w-auto"
                />
              </Link>
              <div className="flex items-center gap-1">
                <button
                  onClick={onToggleCollapse}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all hidden lg:flex"
                  title="Colapsar menú"
                >
                  <PanelLeftClose className="h-4 w-4" />
                </button>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all lg:hidden"
                  title="Cerrar menú"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </>
          )}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
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
                    ? "bg-red-50 text-red-600 font-bold"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className={cn(
                  "h-4 w-4 shrink-0",
                  isActive ? "text-red-600" : "text-zinc-400 group-hover:text-zinc-600"
                )} />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
                {isActive && !collapsed && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="ml-auto h-2 w-2 rounded-full bg-red-600"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        <div className={cn(
          "border-t border-zinc-200/80 p-2",
          collapsed && "flex justify-center"
        )}>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              "text-zinc-600 hover:text-red-600 hover:bg-red-50/50",
              collapsed
                ? "w-10 h-10 p-0 justify-center rounded-lg"
                : "w-full justify-start gap-3"
            )}
            title={collapsed ? "Cerrar Sesión" : undefined}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="text-sm">Cerrar Sesión</span>}
          </Button>
        </div>
      </aside>
    </>
  )
}
