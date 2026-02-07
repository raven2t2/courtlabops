import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 transition-colors focus:outline-none focus:ring-2 focus:ring-hyper-blue/50 focus:ring-offset-2 focus:ring-offset-bg-secondary",
  {
    variants: {
      variant: {
        default: "border-transparent bg-velocity-orange text-white hover:bg-velocity-orange-hover",
        secondary: "border-transparent bg-border-subtle text-text-secondary hover:bg-border-default",
        destructive: "border-transparent bg-accent-red-muted text-accent-red hover:bg-accent-red/20",
        outline: "border-border-default text-text-secondary hover:bg-border-subtle hover:text-text-primary",
        success: "border-transparent bg-accent-green-muted text-accent-green hover:bg-accent-green/20",
        warning: "border-transparent bg-accent-amber-muted text-accent-amber hover:bg-accent-amber/20",
        new: "border-transparent bg-accent-blue-muted text-accent-blue hover:bg-accent-blue/20",
        emailed: "border-transparent bg-accent-orange-muted text-accent-orange hover:bg-accent-orange/20",
        meeting: "border-transparent bg-accent-green-muted text-accent-green hover:bg-accent-green/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
