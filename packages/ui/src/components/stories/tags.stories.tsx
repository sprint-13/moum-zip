import type { Meta, StoryObj } from "@storybook/react";

import { Tag } from "@ui/components";

const meta = {
  title: "Components/Tags",
  component: Tag,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    children: "오늘 21시 마감",
    tone: "blue",
    size: "large",
    icon: true,
  },
} satisfies Meta<typeof Tag>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllVariants: Story = {
  render: () => {
    return (
      <div className="flex max-w-69 flex-col gap-4 rounded-2xl bg-foreground p-4">
        <div className="flex items-center gap-2">
          <Tag icon tone="blue">
            오늘 21시 마감
          </Tag>
          <Tag tone="white">17:30</Tag>
        </div>
        <div className="flex items-center gap-2">
          <Tag icon size="small" tone="blue">
            오늘 21시 마감
          </Tag>
          <Tag size="small" tone="white">
            17:30
          </Tag>
        </div>
      </div>
    );
  },
};
