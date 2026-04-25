import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Unified pill button styling — matches the Explore tab look:
// rounded-full, foreground/background active state, soft hover.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary "active pill" — foreground bg, background text (Explore active tab)
        default: "bg-foreground text-background shadow-sm hover:bg-foreground/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        // Inactive pill — bordered chip used by Explore category strip
        outline:
          "bg-background text-foreground border border-foreground/15 hover:border-foreground/40 hover:bg-background",
        secondary:
          "bg-muted text-foreground/70 border border-foreground/10 hover:text-foreground hover:bg-muted",
        ghost: "text-foreground/60 hover:text-foreground hover:bg-foreground/5",
        link: "text-primary underline-offset-4 hover:underline rounded-none",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
