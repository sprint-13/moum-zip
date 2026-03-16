import type { Meta, StoryObj } from "@storybook/react";

import { CategoryTab } from "@ui/components";
import { BookOpen, Building2, Dumbbell, House, MoreHorizontal, Palette } from "@ui/icons";

interface CategoryTabIllustrationProps {
  icon: React.ComponentType<React.ComponentProps<"svg">>;
}

const CategoryTabIllustration = ({ icon: Icon }: CategoryTabIllustrationProps) => {
  return (
    <span className="inline-flex size-20 items-center justify-center rounded-full ">
      <Icon className="size-10 text-primary" strokeWidth={1.75} />
    </span>
  );
};

const meta = {
  title: "Components/CategoryTab",
  component: CategoryTab,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    illustration: <CategoryTabIllustration icon={Palette} />,
    label: "서비스",
    selected: false,
  },
} satisfies Meta<typeof CategoryTab>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllVariants: Story = {
  render: () => {
    const categoryTabs = [
      { icon: Palette, label: "취미/여가", selected: true },
      { icon: BookOpen, label: "스터디" },
      { icon: Building2, label: "비즈니스" },
      { icon: Dumbbell, label: "운동/건강" },
      { icon: House, label: "가족/육아" },
      { icon: MoreHorizontal, label: "기타" },
    ];

    return (
      <div className="grid grid-cols-3 gap-5 rounded-4xl bg-background p-6">
        {categoryTabs.map(({ icon, label, selected }) => (
          <CategoryTab
            key={label}
            illustration={<CategoryTabIllustration icon={icon} />}
            label={label}
            selected={selected}
          />
        ))}
      </div>
    );
  },
};
