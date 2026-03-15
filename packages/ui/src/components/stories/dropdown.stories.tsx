import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@ui/components/ui/button";
import { Dropdown } from "@ui/components/ui/dropdown";
import { EllipsisIcon, ListFilterIcon } from "lucide-react";

const meta = {
  title: "components/dropdown",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dropdown
      trigger={
        <Button variant="ghost" type="button">
          <ListFilterIcon />
          마감임박
        </Button>
      }
    >
      <Dropdown.Item onSelect={() => console.log("마감임박")}>마감임박</Dropdown.Item>
      <Dropdown.Item onSelect={() => console.log("참여인원순")}>참여인원순</Dropdown.Item>
    </Dropdown>
  ),
};

export const IconOnly: Story = {
  render: () => (
    <Dropdown
      trigger={
        <Button variant="ghost" size="icon-lg" type="button" aria-label="메뉴">
          <EllipsisIcon />
        </Button>
      }
    >
      <Dropdown.Item onSelect={() => console.log("수정")}>수정하기</Dropdown.Item>
      <Dropdown.Item onSelect={() => console.log("삭제")}>삭제하기</Dropdown.Item>
    </Dropdown>
  ),
};

export const AllCases: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <Dropdown
        trigger={
          <Button variant="ghost" type="button">
            <ListFilterIcon />
            마감임박
          </Button>
        }
      >
        <Dropdown.Item>마감임박</Dropdown.Item>
        <Dropdown.Item>참여인원순</Dropdown.Item>
      </Dropdown>

      <Dropdown
        trigger={
          <Button variant="ghost" size="icon-lg" type="button" aria-label="메뉴">
            <EllipsisIcon />
          </Button>
        }
      >
        <Dropdown.Item>수정하기</Dropdown.Item>
        <Dropdown.Item>삭제하기</Dropdown.Item>
      </Dropdown>
    </div>
  ),
};
