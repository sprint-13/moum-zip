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
    label: "아직 만든 모임이 없어요.\n새 모임을 만들어보세요",
    size: "large",
  },
} satisfies Meta<typeof Empty>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllVariants: Story = {
  render: () => {
    return (
      <div className="flex flex-wrap items-end gap-8 rounded-2xl bg-foreground p-6">
        <Empty label="아직 만든 모임이 없어요.\n새 모임을 만들어보세요" size="large" />
        <Empty label="검색 결과가 없어요.\n다른 조건으로 다시 시도해주세요" size="small" />
      </div>
    );
  },
};
