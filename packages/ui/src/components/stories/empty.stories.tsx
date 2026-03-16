import type { Meta, StoryObj } from "@storybook/react";

import { Empty } from "@ui/components";

const meta = {
  title: "Components/Empty",
  component: Empty,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    label: "아직 만든 모임이 없어요",
    size: "large",
  },
} satisfies Meta<typeof Empty>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllVariants: Story = {
  render: () => {
    return (
      <div className="flex flex-wrap items-end gap-8 rounded-2xl bg-[#3b3b3b] p-6">
        <Empty size="large" />
        <Empty size="small" />
      </div>
    );
  },
};
