import type { Meta, StoryObj } from "@storybook/react";

import { Badge } from "@ui/components";
import { Clock3 } from "@ui/icons";

const meta = {
  title: "Components/Badges",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    container: "default",
    icon: false,
    label: "이용 예정",
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
        <Badge label="이용 예정" variant="scheduled" />
        <Badge label="개설 대기" variant="waiting" />
        <Badge label="이용 완료" variant="completed" />
        <Badge icon label="개설 확정" variant="confirmed" />
        <Badge label="이용 완료" variant="completedGradient" />
      </div>
    );
  },
};

export const Containerless: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-4 rounded-2xl bg-[#3b3b3b] p-4">
        <Badge container="none" icon label="개설 확정" variant="confirmed" />
        <Badge icon={<Clock3 className="size-4" strokeWidth={1.75} />} label="이용 예정" variant="waiting" />
      </div>
    );
  },
};
