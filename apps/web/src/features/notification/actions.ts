"use server";

import { getNotifications } from "@/features/notification/use-cases/get-notifications";

type GetNotificationsActionParams = {
  isRead?: boolean;
  cursor?: string;
  size?: number;
};

export async function getNotificationsAction(params: GetNotificationsActionParams = {}) {
  return getNotifications(params);
}
