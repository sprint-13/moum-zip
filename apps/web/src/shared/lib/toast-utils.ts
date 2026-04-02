"use client";

import { toast } from "@ui/components";

const TOAST_REQUIRED_ID = "required-toast";
const TOAST_DURATION = 1500;
const TOAST_LOCK_BUFFER_DURATION = 200;
const TOAST_LOCK_DURATION = TOAST_DURATION + TOAST_LOCK_BUFFER_DURATION;

let isToastVisible = false;
let toastDismissTimeout: ReturnType<typeof setTimeout> | null = null;
let toastLockTimeout: ReturnType<typeof setTimeout> | null = null;

const clearToastTimers = () => {
  if (toastLockTimeout) {
    clearTimeout(toastLockTimeout);
    toastLockTimeout = null;
  }

  if (toastDismissTimeout) {
    clearTimeout(toastDismissTimeout);
    toastDismissTimeout = null;
  }
};

export const showRequiredToast = (message: string) => {
  if (isToastVisible) {
    return;
  }

  isToastVisible = true;
  clearToastTimers();

  const { dismiss } = toast({
    id: TOAST_REQUIRED_ID,
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
