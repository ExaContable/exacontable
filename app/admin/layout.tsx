"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/admin/Sidebar"
import { DashboardHeader } from "@/components/admin/DashboardHeader"
import { usePathname } from "next/navigation"

const titles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/planes": "Planes",
  "/admin/metodos-pago": "Métodos de Pago",
  "/admin/ordenes": "Órdenes",
  "/admin/whatsapp": "WhatsApp",
  "/admin/configuracion": "Configuración",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const saved = localStorage.getItem("admin_sidebar_collapsed")
    if (saved === "true") {
      setSidebarCollapsed(true)
    }
  }, [])

  function handleToggleCollapse() {
    setSidebarCollapsed((prev) => {
      const next = !prev
      localStorage.setItem("admin_sidebar_collapsed", String(next))
      return next
    })
  }

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  const title = Object.entries(titles).find(([key]) =>
    pathname.startsWith(key)
  )?.[1] || "Dashboard"

  return (
    <div className="flex min-h-screen bg-zinc-50 text-zinc-900">
      <Sidebar
        open={sidebarOpen}
        collapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={handleToggleCollapse}
      />
      <div className={cn(
        "flex flex-1 flex-col transition-all duration-300",
        sidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
      )}>
        <DashboardHeader
          title={title}
          collapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleCollapse}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 p-4 lg:p-6 bg-zinc-50">{children}</main>
      </div>
    </div>
  )
}

import { cn } from "@/lib/utils"
