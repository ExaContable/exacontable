"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingCart() {
  const { itemCount, toggleOpen, isOpen } = useCart();

  if (itemCount === 0 || isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <Button
          size="icon"
          onClick={toggleOpen}
          className="relative h-14 w-14 rounded-full bg-primary hover:bg-primary/95 text-primary-foreground shadow-[0_8px_32px_rgba(220,76,30,0.3)] hover:scale-105 active:scale-95 transition-all duration-300 border border-primary/20"
          aria-label="Abrir carrito"
        >
          <ShoppingCart className="h-6 w-6" />
          <Badge className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[11px] text-black font-extrabold shadow-md p-0 border border-border">
            {itemCount}
          </Badge>
        </Button>
      </motion.div>
    </AnimatePresence>
  );
}
