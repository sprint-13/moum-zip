import type { Meta, StoryObj } from "@storybook/react";

import { Button, Toaster, toast } from "@ui/components";

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

const ToastPreview = () => {
  return (
    <>
      <Toaster />
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-foreground/70 p-6">
        <Button
          onClick={() =>
            toast({
              message: "이미지는 최대 2장까지 업로드할 수 있습니다.",
              size: "large",
            })
          }
          variant="secondary"
        >
          Show Large Toast
        </Button>
        <Button
          onClick={() =>
            toast({
              message: "이미지는 최대 2장까지 업로드할 수 있습니다.",
              size: "small",
            })
          }
          variant="secondary"
        >
          Show Small Toast
        </Button>
      </div>
    </>
  );
};

export const Playground: Story = {
  render: () => {
    return <ToastPreview />;
  },
};
