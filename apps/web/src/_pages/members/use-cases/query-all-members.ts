import { memberQueries } from "@/entities/member";

export const queryAllMembersUseCase = (spaceId: string) => {
  return memberQueries.findAllBySpaceId(spaceId);
};
