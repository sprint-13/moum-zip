import type { Meta, StoryObj } from "@storybook/react";

import {
  Badge,
  CompletedBadge,
  CompletedGradientBadge,
  ConfirmedBadge,
  ScheduledBadge,
  StatusLabel,
  WaitingBadge,
} from "@ui/components";

const meta = {
  title: "Components/Badges",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    children: "이용 예정",
    variant: "scheduled",
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllVariants: Story = {
  render: () => {
    return (
      <div className="flex max-w-105 flex-wrap gap-4 rounded-2xl bg-[#3b3b3b] p-4">
        <ScheduledBadge />
        <WaitingBadge />
        <CompletedBadge />
        <ConfirmedBadge />
        <CompletedGradientBadge />
      </div>
    );
  },
};

export const StatusLabels: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-4 rounded-2xl bg-[#3b3b3b] p-4">
        <StatusLabel size="large">개설확정</StatusLabel>
        <StatusLabel size="small">개설확정</StatusLabel>
      </div>
    );
  },
};
