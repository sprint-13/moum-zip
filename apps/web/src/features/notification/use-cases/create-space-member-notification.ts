import { memberQueries } from "@/entities/member/queries";
import type { NotificationData, NotificationType } from "@/entities/notification/model/types";
import { createNotification } from "./create-notification";

type CreateSpaceMemberNotificationsParams = {
  spaceId: string;
  actorId: number;
  type: NotificationType;
  message: string;
  data?: NotificationData;
};

export async function createSpaceMemberNotifications({
  spaceId,
  actorId,
  type,
  message,
  data = {},
}: CreateSpaceMemberNotificationsParams) {
  const members = await memberQueries.findUserIdsBySpaceId(spaceId);

  const targetUserIds = members.map((member) => member.userId).filter((userId) => userId !== actorId);

  await Promise.allSettled(
    targetUserIds.map((userId) =>
      createNotification({
        teamId: spaceId,
        userId,
        type,
        message,
        data,
      }),
    ),
  );
}
