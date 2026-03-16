import type { Meta, StoryObj } from "@storybook/react";
import { Heart } from "lucide-react";
import { UtilityButton } from "../ui/utility-button";

const meta: Meta<typeof UtilityButton> = {
  title: "UI/UtilityButton",
  component: UtilityButton,
};

export default meta;

type Story = StoryObj<typeof UtilityButton>;

export const Small: Story = {
  render: () => <UtilityButton size="sm" icon={<Heart />} />,
};

export const Medium: Story = {
  render: () => <UtilityButton size="md" icon={<Heart />} />,
};

export const Large: Story = {
  render: () => <UtilityButton size="lg" icon={<Heart />} />,
};

export const ActiveSmall: Story = {
  render: () => <UtilityButton size="sm" active icon={<Heart />} />,
};

export const ActiveMedium: Story = {
  render: () => <UtilityButton size="md" active icon={<Heart />} />,
};

export const ActiveLarge: Story = {
  render: () => <UtilityButton size="lg" active icon={<Heart />} />,
};
