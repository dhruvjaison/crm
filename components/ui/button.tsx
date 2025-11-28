import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: 
          "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-600 active:scale-[0.98] active:shadow-sm dark:from-blue-500 dark:to-blue-400",
        destructive:
          "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md hover:shadow-lg hover:from-red-700 hover:to-red-600 active:scale-[0.98] active:shadow-sm",
        outline:
          "border-2 border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:shadow-md active:scale-[0.98] dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:border-slate-600",
        secondary:
          "bg-slate-100 text-slate-900 shadow-sm hover:bg-slate-200 hover:shadow-md active:scale-[0.98] dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
        ghost:
          "text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100",
        link: 
          "text-blue-600 underline-offset-4 hover:underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300",
        success:
          "bg-gradient-to-r from-green-600 to-green-500 text-white shadow-md hover:shadow-lg hover:from-green-700 hover:to-green-600 active:scale-[0.98] active:shadow-sm",
      },
      size: {
        default: "h-10 px-5 py-2.5 has-[>svg]:px-4",
        sm: "h-9 rounded-lg gap-1.5 px-4 text-xs has-[>svg]:px-3",
        lg: "h-12 rounded-lg px-8 text-base has-[>svg]:px-6",
        icon: "size-10",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
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
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
