import type { Meta, StoryObj } from "@storybook/react";

import { Toaster, toast } from "@ui/components";

const meta = {
  title: "Components/Toast",
  component: Toaster,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Toaster>;

export default meta;

type Story = StoryObj<typeof meta>;

const toastButtonClassName =
  "inline-flex h-8 items-center justify-center rounded-lg bg-secondary px-2.5 font-medium text-secondary-foreground text-sm transition-colors hover:bg-secondary/80";

const ToastPreview = () => {
  return (
    <>
      <Toaster />
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-foreground/70 p-6">
        <button
          className={toastButtonClassName}
          onClick={() =>
            toast({
              message: "이미지는 최대 2장까지 업로드할 수 있습니다.",
              size: "large",
            })
          }
          type="button"
        >
          Show Large Toast
        </button>
        <button
          className={toastButtonClassName}
          onClick={() =>
            toast({
              message: "이미지는 최대 2장까지 업로드할 수 있습니다.",
              size: "small",
            })
          }
          type="button"
        >
          Show Small Toast
        </button>
      </div>
    </>
  );
};

export const Playground: Story = {
  render: () => {
    return <ToastPreview />;
  },
};
