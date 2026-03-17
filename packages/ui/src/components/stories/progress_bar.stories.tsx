import type { Meta, StoryObj } from "@storybook/react";

import { LabeledProgressBar, ProgressBar } from "@ui/components";

const meta = {
  title: "Components/ProgressBar",
  component: LabeledProgressBar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    "aria-label": "참여 진행도",
    maxValue: 20,
    value: 4,
    width: "16rem",
  },
} satisfies Meta<typeof LabeledProgressBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const LabeledVariants: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-6 rounded-2xl bg-foreground/70 p-6">
        <LabeledProgressBar aria-label="참여 진행도" maxValue={20} value={4} width="16rem" />
        <LabeledProgressBar aria-label="참여 진행도" maxValue={20} value={12} width="16rem" />
        <LabeledProgressBar aria-label="참여 진행도" maxValue={20} value={19} width="12rem" />
      </div>
    );
  },
};

export const PrimitiveVariants: Story = {
  render: () => {
    return (
      <div className="flex w-full max-w-xl flex-col gap-6 rounded-2xl bg-foreground/70 p-6">
        <ProgressBar aria-label="참여 진행도" maxValue={20} value={4} width="16rem" />
        <ProgressBar aria-label="참여 진행도" maxValue={20} value={12} width="12rem" />
        <ProgressBar aria-label="참여 진행도" className="w-full" maxValue={20} value={19} />
        <div className="flex items-center gap-3">
          <span className="shrink-0 text-background text-sm" id="progress-bar-participation-label">
            Participation
          </span>
          <div className="min-w-0 flex-1">
            <ProgressBar aria-labelledby="progress-bar-participation-label" maxValue={20} value={12} />
          </div>
        </div>
      </div>
    );
  },
};
