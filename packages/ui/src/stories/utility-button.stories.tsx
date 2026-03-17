import type { Meta, StoryObj } from "@storybook/react";
import { Heart } from "lucide-react";
import { UtilityButton } from "../components/ui/utility-button";

const meta: Meta<typeof UtilityButton> = {
  title: "UI/UtilityButton",
  component: UtilityButton,
};

export default meta;

type Story = StoryObj<typeof UtilityButton>;

export const Small: Story = {
  render: () => <UtilityButton size="sm" aria-label="좋아요" icon={(size) => <Heart size={size} />} />,
};

export const Medium: Story = {
  render: () => <UtilityButton size="md" aria-label="좋아요" icon={(size) => <Heart size={size} />} />,
};

export const Large: Story = {
  render: () => <UtilityButton size="lg" aria-label="좋아요" icon={(size) => <Heart size={size} />} />,
};

export const ActiveSmall: Story = {
  render: () => (
    <UtilityButton
      size="sm"
      active
      aria-label="좋아요 취소"
      icon={(size) => <Heart size={size} fill="url(#icon-gradient)" stroke="url(#icon-gradient)" />}
    />
  ),
};

export const ActiveMedium: Story = {
  render: () => (
    <UtilityButton
      size="md"
      active
      aria-label="좋아요 취소"
      icon={(size) => <Heart size={size} fill="url(#icon-gradient)" stroke="url(#icon-gradient)" />}
    />
  ),
};

export const ActiveLarge: Story = {
  render: () => (
    <UtilityButton
      size="lg"
      active
      aria-label="좋아요 취소"
      icon={(size) => <Heart size={size} fill="url(#icon-gradient)" stroke="url(#icon-gradient)" />}
    />
  ),
};
