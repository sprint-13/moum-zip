import type { Meta, StoryObj } from "@storybook/react";

import { ProgressBar } from "@ui/components";

const meta = {
  title: "Components/ProgressBar",
  component: ProgressBar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    maxValue: 20,
    value: 4,
    width: "16rem",
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllVariants: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-6 rounded-2xl bg-foreground/70 p-6">
        <div className="flex gap-8">
          <ProgressBar maxValue={20} value={14} width="16rem" />
          <ProgressBar maxValue={20} value={4} width="12rem" />
        </div>
        <div className="flex gap-8">
          <ProgressBar maxValue={20} value={12} width="16rem" />
          <ProgressBar maxValue={20} value={12} width="12rem" />
        </div>
        <div className="flex gap-8">
          <ProgressBar maxValue={20} value={19} width="16rem" />
          <ProgressBar maxValue={20} value={19} width="12rem" />
        </div>
      </div>
    );
  },
};

export const LayoutControlled: Story = {
  render: () => {
    return (
      <div className="flex w-full max-w-xl flex-col gap-6 rounded-2xl bg-foreground/70 p-6">
        <ProgressBar maxValue={20} value={12} width="16rem" />
        <ProgressBar maxValue={20} value={12} width="12rem" />
        <ProgressBar className="w-full" maxValue={20} value={12} />
        <div className="flex items-center gap-3">
          <span className="shrink-0 text-sm text-background">Participation</span>
          <div className="min-w-0 flex-1">
            <ProgressBar maxValue={20} value={12} />
          </div>
        </div>
      </div>
    );
  },
};
