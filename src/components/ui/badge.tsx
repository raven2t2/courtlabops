import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2 focus:ring-offset-[#0F0F11]",
  {
    variants: {
      variant: {
        default: "border-transparent bg-orange-500 text-white hover:bg-orange-600",
        secondary: "border-transparent bg-[#1E1E24] text-zinc-400 hover:bg-[#2E2E38]",
        destructive: "border-transparent bg-red-500/10 text-red-400 hover:bg-red-500/20",
        outline: "border-[#2E2E38] text-zinc-400 hover:bg-[#1E1E24] hover:text-white",
        success: "border-transparent bg-green-500/10 text-green-400 hover:bg-green-500/20",
        warning: "border-transparent bg-amber-500/10 text-amber-400 hover:bg-amber-500/20",
        new: "border-transparent bg-blue-500/10 text-blue-400 hover:bg-blue-500/20",
        emailed: "border-transparent bg-orange-500/10 text-orange-400 hover:bg-orange-500/20",
        meeting: "border-transparent bg-green-500/10 text-green-400 hover:bg-green-500/20",
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
