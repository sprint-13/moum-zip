"use client";

import * as ToastPrimitive from "@radix-ui/react-toast";
import { cn } from "@ui/lib/utils";
import * as React from "react";

const ToastProvider = ToastPrimitive.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => {
  return (
    <ToastPrimitive.Viewport
      className={cn(
        "fixed top-6 left-1/2 z-50 flex w-fit max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-col gap-2 outline-none",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

ToastViewport.displayName = ToastPrimitive.Viewport.displayName;

const ToastRoot = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root>
>(({ className, ...props }, ref) => {
  return <ToastPrimitive.Root className={cn("pointer-events-auto", className)} ref={ref} {...props} />;
});

ToastRoot.displayName = ToastPrimitive.Root.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => {
  return <ToastPrimitive.Description className={className} ref={ref} {...props} />;
});

ToastDescription.displayName = ToastPrimitive.Description.displayName;

export { ToastDescription, ToastProvider, ToastRoot, ToastViewport };
