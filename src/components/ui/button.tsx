import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium touch-manipulation ring-offset-background transition-all duration-300 ease-boutique focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] hover:shadow-soft",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent/10 hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent/10 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Varnika boutique variants
        artisan: "bg-foreground text-primary-foreground font-body tracking-wide hover:bg-gold hover:text-foreground hover:scale-[1.05] hover:shadow-elevated",
        reserve: "bg-gradient-to-r from-gold to-gold-light text-foreground font-body tracking-wide hover:shadow-glow hover:scale-[1.05]",
        gallery: "bg-transparent border-2 border-foreground text-foreground font-body tracking-wider hover:bg-foreground hover:text-primary-foreground hover:scale-[1.02]",
        whisper: "bg-cream-dark text-muted-foreground hover:bg-card hover:text-foreground font-body tracking-wide",
      },
      size: {
        default: "h-11 px-4 py-2 sm:h-10",
        sm: "h-10 rounded-xl px-3 sm:h-9",
        lg: "h-12 rounded-xl px-8 sm:h-11",
        xl: "h-14 rounded-xl px-10 text-base",
        icon: "h-11 w-11 sm:h-10 sm:w-10",
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
