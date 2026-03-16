import type { Meta, StoryObj } from "@storybook/react-vite";

import { FileInput } from "../ui/input-image";

const meta: Meta<typeof FileInput> = {
  title: "Components/FileInput",
  component: FileInput,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof FileInput>;

export const Empty: Story = {};

export const WithPreview: Story = {
  args: {
    previewClassName:
      "bg-[linear-gradient(45deg,var(--color-border)_25%,transparent_25%),linear-gradient(-45deg,var(--color-border)_25%,transparent_25%),linear-gradient(45deg,transparent_75%,var(--color-border)_75%),linear-gradient(-45deg,transparent_75%,var(--color-border)_75%)] bg-[length:12px_12px] bg-[position:0_0,0_6px,6px_-6px,-6px_0]",
    previewItems: [{ id: "preview-placeholder" }],
  },
};
