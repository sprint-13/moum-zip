import type { Meta, StoryObj } from "@storybook/react";
import { Pencil, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { IconButton } from "../components/ui/icon-button";
import { ByeIcon } from "../icons/bye-icon";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Small: Story = {
  render: () => <Button size="small">참여하기</Button>,
};

export const Medium: Story = {
  render: () => <Button size="medium">참여하기</Button>,
};

export const Large: Story = {
  render: () => <Button size="large">참여하기</Button>,
};

export const Disabled: Story = {
  render: () => (
    <Button variant="primary" size="large" disabled>
      참여하기
    </Button>
  ),
};

// Secondary/Tertiary variant 추가
export const Secondary: Story = {
  render: () => <Button variant="secondary">회원가입</Button>,
};

export const Tertiary: Story = {
  render: () => <Button variant="tertiary">자세히 보기</Button>,
};

export const SendIcon: Story = {
  render: () => <IconButton variant="send" size="icon-lg" icon={<ByeIcon />} aria-label="전송" />,
};

export const EditIcon: Story = {
  render: () => <IconButton variant="edit" size="icon-md" icon={<Pencil size={20} />} aria-label="수정" />,
};

export const DeleteIcon: Story = {
  render: () => <IconButton variant="delete" size="icon-sm" icon={<X size={8} />} aria-label="삭제" />,
};
