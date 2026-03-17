import type { Meta, StoryObj } from "@storybook/react";

import { Filter } from "@ui/components";

const meta = {
  title: "Components/Filter",
  component: Filter,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    label: "지역 전체",
    size: "large",
    selected: false,
  },
} satisfies Meta<typeof Filter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllVariants: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-4 rounded-2xl border bg-background p-4">
        <div className="flex flex-wrap items-center gap-4">
          <Filter label="지역 전체" size="large" />
          <Filter label="지역 전체" size="large" selected />
          <Filter label="지역 전체" size="large" leftIcon={null} />
          <Filter label="지역 전체" size="large" rightIcon={null} />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Filter label="마감 임박" size="small" />
          <Filter label="마감 임박" size="small" selected />
          <Filter disabled={true} label="마감 임박" size="small" leftIcon={null} />
          <Filter label="마감 임박" size="small" rightIcon={null} />
        </div>
      </div>
    );
  },
};
