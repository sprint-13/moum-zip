import type { Meta, StoryObj } from "@storybook/react";
import { SocialButton } from "../components/ui/social-button";

const meta: Meta<typeof SocialButton> = {
  title: "UI/SocialButton",
  component: SocialButton,
};

export default meta;

type Story = StoryObj<typeof SocialButton>;

export const Google: Story = {
  args: {
    provider: "google",
  },
};

export const Kakao: Story = {
  args: {
    provider: "kakao",
  },
};
