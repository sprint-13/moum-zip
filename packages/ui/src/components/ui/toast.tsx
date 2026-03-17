"use client";

import { ToastDescription, ToastProvider, ToastRoot, ToastViewport } from "@ui/components/shadcn/toast";
import { cn } from "@ui/lib/utils";
import { cva } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";
import { useEffect, useState } from "react";

type ToastSize = "large" | "small";

interface ToastProps extends Omit<ComponentPropsWithoutRef<typeof ToastRoot>, "children"> {
  message: string;
  size?: ToastSize;
}

interface ToastOptions {
  duration?: number;
  id?: string;
  message: string;
  size?: ToastSize;
}

interface UpdateToastOptions extends Partial<Omit<ToastOptions, "id">> {}

interface ToastItem extends Required<Pick<ToastOptions, "message" | "size">> {
  duration?: number;
  id: string;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

interface ToastState {
  toasts: ToastItem[];
}

interface ToasterProps {
  viewportClassName?: string;
}

const TOAST_LIMIT = 3;
const TOAST_REMOVE_DELAY = 200;

const toastVariants = cva(
  [
    "inline-flex w-fit max-w-[calc(100vw-2rem)] items-center justify-center overflow-hidden",
    "bg-black/80 text-primary-foreground",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
    "data-[state=open]:slide-in-from-top-2 data-[state=closed]:slide-out-to-top-2",
    "data-[swipe=move]:translate-y-[var(--radix-toast-swipe-move-y)] data-[swipe=cancel]:translate-y-0",
    "data-[swipe=end]:animate-out data-[swipe=end]:slide-out-to-top-2",
  ],
  {
    variants: {
      size: {
        large: "rounded-xl px-8 py-4",
        small: "rounded-[10px] px-6 py-3",
      },
    },
    defaultVariants: {
      size: "large",
    },
  },
);

const toastMessageClassNames = {
  large: "break-keep text-base leading-6 font-semibold tracking-[-0.02em] text-primary-foreground",
  small: "break-keep text-xs leading-4 font-semibold text-primary-foreground",
} satisfies Record<ToastSize, string>;

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();
const toastListeners = new Set<(state: ToastState) => void>();

let toastCount = 0;
let toastState: ToastState = { toasts: [] };

const getToastId = () => {
  toastCount += 1;

  return `toast-${toastCount}`;
};

const notifyToastListeners = () => {
  toastListeners.forEach((listener) => {
    listener(toastState);
  });
};

const setToastState = (nextState: ToastState) => {
  toastState = nextState;
  notifyToastListeners();
};

const clearToastTimeout = (toastId: string) => {
  const timeout = toastTimeouts.get(toastId);

  if (!timeout) {
    return;
  }

  clearTimeout(timeout);
  toastTimeouts.delete(toastId);
};

const removeToast = (toastId: string) => {
  clearToastTimeout(toastId);
  setToastState({
    toasts: toastState.toasts.filter((toast) => toast.id !== toastId),
  });
};

const scheduleToastRemoval = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  toastTimeouts.set(
    toastId,
    setTimeout(() => {
      removeToast(toastId);
    }, TOAST_REMOVE_DELAY),
  );
};

const dismissToast = (toastId?: string) => {
  const nextToasts = toastState.toasts.map((toast) => {
    if (toastId !== undefined && toast.id !== toastId) {
      return toast;
    }

    scheduleToastRemoval(toast.id);

    return {
      ...toast,
      open: false,
    };
  });

  setToastState({ toasts: nextToasts });
};

const updateToast = (toastId: string, options: UpdateToastOptions) => {
  setToastState({
    toasts: toastState.toasts.map((toast) => {
      if (toast.id !== toastId) {
        return toast;
      }

      return {
        ...toast,
        duration: options.duration ?? toast.duration,
        message: options.message ?? toast.message,
        size: options.size ?? toast.size,
      };
    }),
  });
};

const toast = ({ duration, id, message, size = "large" }: ToastOptions) => {
  const toastId = id ?? getToastId();

  clearToastTimeout(toastId);

  const nextToast: ToastItem = {
    duration,
    id: toastId,
    message,
    onOpenChange: (open) => {
      if (!open) {
        dismissToast(toastId);
      }
    },
    open: true,
    size,
  };

  setToastState({
    toasts: [nextToast, ...toastState.toasts.filter((toast) => toast.id !== toastId)].slice(0, TOAST_LIMIT),
  });

  return {
    dismiss: () => dismissToast(toastId),
    id: toastId,
    update: (options: UpdateToastOptions) => updateToast(toastId, options),
  };
};

const useToast = () => {
  const [state, setState] = useState<ToastState>(toastState);

  useEffect(() => {
    toastListeners.add(setState);

    return () => {
      toastListeners.delete(setState);
    };
  }, []);

  return {
    ...state,
    dismiss: dismissToast,
    toast,
  };
};

const Toast = ({ className, message, size = "large", ...props }: ToastProps) => {
  return (
    <ToastRoot className={cn(toastVariants({ size }), className)} {...props}>
      <ToastDescription className={toastMessageClassNames[size]}>{message}</ToastDescription>
    </ToastRoot>
  );
};

const Toaster = ({ viewportClassName }: ToasterProps) => {
  const { toasts } = useToast();

  return (
    <ToastProvider swipeDirection="up">
      {toasts.map(({ id, message, size, ...toastProps }) => {
        return <Toast key={id} message={message} size={size} {...toastProps} />;
      })}
      <ToastViewport className={viewportClassName} />
    </ToastProvider>
  );
};

export { Toast, Toaster, toast, ToastProvider, ToastViewport, useToast };
export type { ToastOptions, ToastProps, ToastSize, ToasterProps, UpdateToastOptions };
