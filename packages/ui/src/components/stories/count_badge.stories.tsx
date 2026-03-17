import type { Meta, StoryObj } from "@storybook/react";

import { CountBadge } from "@ui/components";

const meta = {
  title: "Components/CountBadge",
  component: CountBadge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    count: 1,
    size: "large",
  },
} satisfies Meta<typeof CountBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllVariants: Story = {
  render: () => {
    return (
      <div className="flex items-center gap-4 rounded-2xl bg-foreground p-4">
        <CountBadge count={1} size="large" />
        <CountBadge count={1} size="small" />
        <CountBadge count={12} size="large" />
      </div>
    );
  },
};
