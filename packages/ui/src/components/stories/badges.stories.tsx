import type { Meta, StoryObj } from "@storybook/react";

import { Badge, CheckCircleIcon } from "@ui/components";
import { Clock3 } from "@ui/icons";

const meta = {
  title: "Components/Badges",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    children: "이용 예정",
    container: "default",
    variant: "scheduled",
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllVariants: Story = {
  render: () => {
    return (
      <div className="flex max-w-105 flex-wrap gap-4 rounded-2xl bg-foreground p-4">
        <Badge variant="scheduled">이용 예정</Badge>
        <Badge variant="waiting">개설 대기</Badge>
        <Badge variant="completed">이용 완료</Badge>
        <Badge variant="confirmed">
          <CheckCircleIcon />
          개설 확정
        </Badge>
        <Badge variant="completedGradient">이용 완료</Badge>
      </div>
    );
  },
};

export const Containerless: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-4 rounded-2xl bg-foreground p-4">
        <Badge container="none" variant="confirmed">
          <CheckCircleIcon />
          개설 확정
        </Badge>
        <Badge variant="waiting">
          <Clock3 className="size-4 shrink-0" strokeWidth={1.75} />
          이용 예정
        </Badge>
      </div>
    );
  },
};
