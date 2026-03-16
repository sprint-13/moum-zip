import type { Meta, StoryObj } from "@storybook/react";
import byeSvg from "../../icons/bye.svg";
import { SendButton } from "../ui/send-button";

const meta: Meta<typeof SendButton> = {
  title: "UI/SendButton",
  component: SendButton,
};

export default meta;

type Story = StoryObj<typeof SendButton>;

export const Default: Story = {
  render: () => <SendButton icon={<img src={byeSvg} alt="bye icon" />} />,
};
