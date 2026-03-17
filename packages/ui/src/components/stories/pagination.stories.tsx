import type { Meta, StoryObj } from "@storybook/react";
import { Pagination } from "@ui/components";
import { useState } from "react";

const paginationLabels = {
  ariaLabel: "페이지네이션",
  nextAriaLabel: "다음 페이지",
  previousAriaLabel: "이전 페이지",
} as const;

const PaginationPreview = ({ size }: { size?: "large" | "responsive" | "small" }) => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <Pagination
      {...paginationLabels}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      size={size}
      totalPages={9}
    />
  );
};

const meta = {
  title: "Components/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    ...paginationLabels,
    currentPage: 1,
    size: "responsive",
    totalPages: 9,
  },
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllVariants: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-6 rounded-2xl border bg-background p-6">
        <Pagination {...paginationLabels} currentPage={1} totalPages={9} />
        <Pagination {...paginationLabels} currentPage={1} size="large" totalPages={9} />
        <Pagination {...paginationLabels} currentPage={1} size="small" totalPages={9} />
      </div>
    );
  },
};

export const Interactive: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-6 rounded-2xl border bg-background p-6">
        <PaginationPreview />
        <PaginationPreview size="large" />
        <PaginationPreview size="small" />
      </div>
    );
  },
};
