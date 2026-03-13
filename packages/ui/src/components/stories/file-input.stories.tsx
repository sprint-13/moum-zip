import type { Meta, StoryObj } from "@storybook/react-vite";

import { FileInput } from "../ui/file-input";

const meta: Meta<typeof FileInput> = {
  title: "Components/FileInput",
  component: FileInput,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="bg-[#4A4A4A] p-8">
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
    defaultPreviewClassName:
      "bg-[linear-gradient(45deg,#ececec_25%,transparent_25%),linear-gradient(-45deg,#ececec_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ececec_75%),linear-gradient(-45deg,transparent_75%,#ececec_75%)] bg-[length:12px_12px] bg-[position:0_0,0_6px,6px_-6px,-6px_0]",
    defaultPreviewPlaceholderCount: 1,
  },
};
