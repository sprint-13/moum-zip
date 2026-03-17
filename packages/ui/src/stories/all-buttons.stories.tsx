import type { Meta, StoryObj } from "@storybook/react";
import { Heart, Pencil, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { CreateButton } from "../components/ui/create-button";
import { IconButton } from "../components/ui/icon-button";
import { SocialButton } from "../components/ui/social-button";
import { UtilityButton } from "../components/ui/utility-button";
import { ByeIcon } from "../icons/bye-icon";

const meta = {
  title: "UI/AllButtons",
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllCases: Story = {
  render: () => (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex items-center gap-4">
        <IconButton variant="send" size="icon-lg" icon={<ByeIcon />} aria-label="전송" />
        <IconButton variant="edit" size="icon-md" icon={<Pencil size={20} />} aria-label="수정" />
        <IconButton variant="delete" size="icon-sm" icon={<X size={8} />} aria-label="삭제" />
      </div>
      <div className="flex items-center gap-4">
        <UtilityButton size="sm" aria-label="좋아요" icon={(size) => <Heart size={size} />} />
        <UtilityButton size="md" aria-label="좋아요" icon={(size) => <Heart size={size} />} />
        <UtilityButton size="lg" aria-label="좋아요" icon={(size) => <Heart size={size} />} />
        <UtilityButton
          size="sm"
          active
          aria-label="좋아요 취소"
          icon={(size) => <Heart size={size} fill="url(#icon-gradient)" stroke="url(#icon-gradient)" />}
        />
        <UtilityButton
          size="md"
          active
          aria-label="좋아요 취소"
          icon={(size) => <Heart size={size} fill="url(#icon-gradient)" stroke="url(#icon-gradient)" />}
        />
        <UtilityButton
          size="lg"
          active
          aria-label="좋아요 취소"
          icon={(size) => <Heart size={size} fill="url(#icon-gradient)" stroke="url(#icon-gradient)" />}
        />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="primary" size="large">
          참여하기
        </Button>
        <Button variant="secondary" size="medium">
          회원가입
        </Button>
        <Button variant="tertiary" size="small">
          참여하기
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <CreateButton variant="full">모임 만들기</CreateButton>
        <CreateButton variant="icon" aria-label="모임 만들기" />
      </div>
      <div className="flex items-center gap-4">
        <SocialButton provider="google" />
        <SocialButton provider="kakao" />
      </div>
    </div>
  ),
};
