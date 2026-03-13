import type { Meta, StoryObj } from "@storybook/react-vite";

import { InputField } from "../ui/input-field";

const meta: Meta<typeof InputField> = {
  title: "Components/InputField",
  component: InputField,
  args: {
    label: "아이디",
    placeholder: "이메일을 입력해주세요",
    message: "텍스트를 입력해주세요.",
    required: true,
  },
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-[1080px] bg-[#4A4A4A] p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof InputField>;

export const Placeholder: Story = {};

export const Selected: Story = {
  args: {
    defaultValue: "이메일을 입력해주세요",
  },
};

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
