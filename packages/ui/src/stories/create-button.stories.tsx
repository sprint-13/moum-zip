import type { Meta, StoryObj } from "@storybook/react";
import { CreateButton } from "../components/ui/create-button";

const meta: Meta<typeof CreateButton> = {
  title: "UI/CreateButton",
  component: CreateButton,
};

export default meta;

type Story = StoryObj<typeof CreateButton>;

export const Full: Story = {
  render: () => <CreateButton variant="full">모임 만들기</CreateButton>,
};

export const IconOnly: Story = {
  render: () => <CreateButton variant="icon" aria-label="모임 만들기" />,
};
