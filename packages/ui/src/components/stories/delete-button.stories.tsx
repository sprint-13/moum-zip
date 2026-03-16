import type { Meta, StoryObj } from "@storybook/react";
import { X } from "lucide-react";
import { DeleteButton } from "../ui/delete-button";

const meta: Meta<typeof DeleteButton> = {
  title: "UI/DeleteButton",
  component: DeleteButton,
};

export default meta;

type Story = StoryObj<typeof DeleteButton>;

export const Default: Story = {
  render: () => <DeleteButton icon={<X />} />,
};
