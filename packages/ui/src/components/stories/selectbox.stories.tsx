import type { Meta, StoryObj } from "@storybook/react";
import { SelectBox } from "@ui/components/ui/selectbox";

const meta = {
  title: "components/select-box",
  component: SelectBox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    placeholder: {
      control: "text",
    },
  },
  args: {
    placeholder: "지역을 선택하세요",
  },
} satisfies Meta<typeof SelectBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <SelectBox {...args}>
      <SelectBox.Item value="all">지역 전체</SelectBox.Item>
      <SelectBox.Item value="konkuk">건대입구</SelectBox.Item>
      <SelectBox.Item value="euljiro">을지로 3가</SelectBox.Item>
      <SelectBox.Item value="sillim">신림</SelectBox.Item>
      <SelectBox.Item value="hongdae">홍대입구</SelectBox.Item>
    </SelectBox>
  ),
};

export const WithDefaultValue: Story = {
  render: () => (
    <SelectBox placeholder="지역을 선택하세요" defaultValue="konkuk">
      <SelectBox.Item value="all">지역 전체</SelectBox.Item>
      <SelectBox.Item value="konkuk">건대입구</SelectBox.Item>
      <SelectBox.Item value="euljiro">을지로 3가</SelectBox.Item>
    </SelectBox>
  ),
};

export const AllCases: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <SelectBox placeholder="지역을 선택하세요">
        <SelectBox.Item value="all">지역 전체</SelectBox.Item>
        <SelectBox.Item value="konkuk">건대입구</SelectBox.Item>
        <SelectBox.Item value="hongdae">홍대입구</SelectBox.Item>
      </SelectBox>

      <SelectBox placeholder="카테고리 선택" triggerClassName="max-w-60">
        <SelectBox.Item value="study">스터디</SelectBox.Item>
        <SelectBox.Item value="project">프로젝트</SelectBox.Item>
      </SelectBox>
    </div>
  ),
};
