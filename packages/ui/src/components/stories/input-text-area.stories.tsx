import type { Meta, StoryObj } from "@storybook/react-vite";

import { InputTextArea } from "../ui/input-text-area";

const meta: Meta<typeof InputTextArea> = {
  title: "Components/InputTextArea",
  component: InputTextArea,
  args: {
    label: "아이디",
    message: "텍스트를 입력해주세요.",
    placeholder: "이메일을 입력해주세요",
    required: true,
  },
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

type Story = StoryObj<typeof InputTextArea>;

export const Placeholder: Story = {};

export const Default: Story = {
  args: {
    defaultValue: "이메일을 입력해주세요",
  },
};

export const PlaceholderError: Story = {
  args: {
    isDestructive: true,
  },
};

export const DefaultError: Story = {
  args: {
    defaultValue: "이메일을 입력해주세요",
    isDestructive: true,
  },
};
