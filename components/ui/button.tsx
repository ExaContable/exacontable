import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-all duration-200 outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_4px_16px_rgba(220,76,30,0.18)] hover:bg-primary/95 hover:shadow-[0_6px_24px_rgba(220,76,30,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]",
        outline:
          "border-border bg-card/30 backdrop-blur-sm hover:bg-muted/80 hover:text-foreground hover:border-primary/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] aria-expanded:bg-muted aria-expanded:text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground active:scale-[0.97] aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-10 gap-2 px-5 rounded-full",
        xs: "h-7 gap-1 px-3 text-xs rounded-full [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8.5 gap-1.5 px-4 text-xs rounded-full [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2 px-7 text-base rounded-full shadow-[0_8px_32px_rgba(220,76,30,0.2)]",
        icon: "size-10 rounded-full",
        "icon-xs":
          "size-7 rounded-full [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-8.5 rounded-full",
        "icon-lg": "size-12 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
