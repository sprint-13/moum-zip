"use client";

import { toast } from "@ui/components";

const AUTH_REQUIRED_TOAST_ID = "auth-required-toast";
const AUTH_REQUIRED_TOAST_DURATION = 1000;
const AUTH_REQUIRED_TOAST_LOCK_DURATION = AUTH_REQUIRED_TOAST_DURATION + 200;

let isToastVisible = false;
let toastDismissTimeout: ReturnType<typeof setTimeout> | null = null;
let toastLockTimeout: ReturnType<typeof setTimeout> | null = null;

export const showAuthRequiredToast = () => {
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
    id: AUTH_REQUIRED_TOAST_ID,
    message: "로그인 후 이용할 수 있어요.",
    size: "small",
  });

  toastDismissTimeout = setTimeout(() => {
    dismiss();
    toastDismissTimeout = null;
  }, AUTH_REQUIRED_TOAST_DURATION);

  toastLockTimeout = setTimeout(() => {
    isToastVisible = false;
    toastLockTimeout = null;
  }, AUTH_REQUIRED_TOAST_LOCK_DURATION);
};
