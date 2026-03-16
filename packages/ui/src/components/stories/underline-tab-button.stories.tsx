import type { Meta, StoryObj } from "@storybook/react";
import { UnderlineTabButton } from "../ui/tabs/underline-tab-button";

const meta = {
  title: "components/underline-tab-button",
  component: UnderlineTabButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "active"],
    },
    size: {
      control: "select",
      options: ["small", "large"],
    },
    children: {
      control: "text",
    },
  },
  args: {
    children: "나의 모임",
    variant: "default",
    size: "small",
  },
} satisfies Meta<typeof UnderlineTabButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Active: Story = {
  args: {
    variant: "active",
  },
};

export const Small: Story = {
  args: {
    size: "small",
    children: "나의 모임",
  },
};

export const Large: Story = {
  args: {
    size: "large",
    children: "나의 모임",
  },
};

export const AllCases: Story = {
  render: () => {
    return (
      <>
        <div className="flex flex-col gap-8 p-8">
          <div className="flex items-end gap-8">
            <UnderlineTabButton variant="default" size="large">
              나의 모임
            </UnderlineTabButton>
            <UnderlineTabButton variant="default" size="small">
              나의 모임
            </UnderlineTabButton>
          </div>

          <div className="flex items-end gap-8">
            <UnderlineTabButton variant="active" size="large">
              나의 모임
            </UnderlineTabButton>
            <UnderlineTabButton variant="active" size="small">
              나의 모임
            </UnderlineTabButton>
          </div>
        </div>
      </>
    );
  },
};
