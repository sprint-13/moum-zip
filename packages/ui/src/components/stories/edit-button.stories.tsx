import type { Meta, StoryObj } from "@storybook/react";
import { Pencil } from "lucide-react";
import { EditButton } from "../ui/edit-button";

const meta: Meta<typeof EditButton> = {
  title: "UI/EditButton",
  component: EditButton,
};

export default meta;

type Story = StoryObj<typeof EditButton>;

export const Default: Story = {
  render: () => <EditButton icon={<Pencil />} />,
};
