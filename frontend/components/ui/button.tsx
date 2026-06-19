"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold outline-none transition-all duration-200 ease-out focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/35 disabled:pointer-events-none disabled:opacity-55 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border border-primary/80 bg-primary text-primary-foreground shadow-[0_12px_28px_rgba(212,175,55,0.18)] hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-[0_16px_36px_rgba(212,175,55,0.22)] active:translate-y-0",
        secondary:
          "border border-border bg-secondary text-secondary-foreground hover:-translate-y-0.5 hover:border-primary/35 hover:bg-accent/10 hover:text-foreground active:translate-y-0",
        outline:
          "border border-border bg-transparent text-foreground hover:-translate-y-0.5 hover:border-primary/35 hover:bg-accent/10 active:translate-y-0",
        ghost:
          "border border-transparent bg-transparent text-muted-foreground hover:bg-accent/10 hover:text-foreground",
        destructive:
          "border border-destructive/30 bg-destructive/12 text-red-100 hover:-translate-y-0.5 hover:bg-destructive/20 active:translate-y-0",
        link: "h-auto rounded-none border-0 bg-transparent p-0 text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "size-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: boolean;
    loadingText?: string;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  isLoading = false,
  loadingText,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  if (asChild) {
    return (
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        aria-busy={isLoading || undefined}
        {...props}
      >
        {children}
      </Comp>
    );
  }

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
      {isLoading && loadingText ? loadingText : children}
    </Comp>
  );
}

export { Button, buttonVariants };
