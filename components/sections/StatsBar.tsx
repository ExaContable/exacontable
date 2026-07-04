"use client";

import { motion } from "framer-motion";
import { Users, Clock, ShieldCheck, BarChart3 } from "lucide-react";

const stats = [
  { icon: Users, value: "+250", label: "Empresas activas" },
  { icon: Clock, value: "+15", label: "Años de experiencia" },
  { icon: ShieldCheck, value: "99.9%", label: "Automatizado" },
  { icon: BarChart3, value: "+50", label: "Modulos" },
];

export function StatsBar() {
  return (
    <section className="relative border-y border-border/40 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-px md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="flex items-center justify-center gap-3 py-8 px-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground whitespace-nowrap">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
