import type { Meta, StoryObj } from "@storybook/react";
import { SelectBox } from "@ui/components/ui/selectbox";

const meta = {
  title: "components/select-box",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <SelectBox>
      <SelectBox.Trigger placeholder="지역을 선택하세요" />
      <SelectBox.Content>
        <SelectBox.Item value="all">지역 전체</SelectBox.Item>
        <SelectBox.Item value="konkuk">건대입구</SelectBox.Item>
        <SelectBox.Item value="euljiro">을지로 3가</SelectBox.Item>
        <SelectBox.Item value="sillim">신림</SelectBox.Item>
        <SelectBox.Item value="hongdae">홍대입구</SelectBox.Item>
      </SelectBox.Content>
    </SelectBox>
  ),
};

export const WithDefaultValue: Story = {
  render: () => (
    <SelectBox defaultValue="konkuk">
      <SelectBox.Trigger placeholder="지역을 선택하세요" />
      <SelectBox.Content>
        <SelectBox.Item value="all">지역 전체</SelectBox.Item>
        <SelectBox.Item value="konkuk">건대입구</SelectBox.Item>
        <SelectBox.Item value="euljiro">을지로 3가</SelectBox.Item>
      </SelectBox.Content>
    </SelectBox>
  ),
};

export const AllCases: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <SelectBox>
        <SelectBox.Trigger placeholder="지역을 선택하세요" />
        <SelectBox.Content>
          <SelectBox.Item value="all">지역 전체</SelectBox.Item>
          <SelectBox.Item value="konkuk">건대입구</SelectBox.Item>
          <SelectBox.Item value="hongdae">홍대입구</SelectBox.Item>
        </SelectBox.Content>
      </SelectBox>

      <SelectBox defaultValue="konkuk">
        <SelectBox.Trigger placeholder="지역을 선택하세요" />
        <SelectBox.Content>
          <SelectBox.Item value="all">지역 전체</SelectBox.Item>
          <SelectBox.Item value="konkuk">건대입구</SelectBox.Item>
          <SelectBox.Item value="euljiro">을지로 3가</SelectBox.Item>
        </SelectBox.Content>
      </SelectBox>
    </div>
  ),
};
