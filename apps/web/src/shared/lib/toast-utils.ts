"use client";

import { toast } from "@ui/components";

const TOAST_ID = "required-toast";
const TOAST_DURATION = 1500;
const TOAST_LOCK_DURATION = TOAST_DURATION + 200;

let isToastVisible = false;
let toastDismissTimeout: ReturnType<typeof setTimeout> | null = null;
let toastLockTimeout: ReturnType<typeof setTimeout> | null = null;

export const showRequiredToast = (message: string) => {
  if (isToastVisible) {
    return;
  }

  isToastVisible = true;

  if (toastLockTimeout) {
    clearTimeout(toastLockTimeout);
  }

  if (toastDismissTimeout) {
    clearTimeout(toastDismissTimeout);
  }

  const { dismiss } = toast({
    id: TOAST_ID,
    message,
    size: "small",
  });

  toastDismissTimeout = setTimeout(() => {
    dismiss();
    toastDismissTimeout = null;
  }, TOAST_DURATION);

  toastLockTimeout = setTimeout(() => {
    isToastVisible = false;
    toastLockTimeout = null;
  }, TOAST_LOCK_DURATION);
};
