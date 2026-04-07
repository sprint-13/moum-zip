"use client";

import { SelectBox } from "@ui/components/ui/selectbox";
import { THEME_COLORS } from "@/entities/moim";

interface ThemeColorSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
}

export const ThemeColorSelect = ({ value, onValueChange }: ThemeColorSelectProps) => {
  return (
    <SelectBox value={value} onValueChange={onValueChange}>
      <SelectBox.Trigger placeholder="테마를 선택하세요" />

      <SelectBox.Content>
        {THEME_COLORS.map(({ label, value: colorValue, color }) => (
          <SelectBox.Item key={colorValue} value={colorValue}>
            <div className="flex items-center gap-2">
              <span className="inline-block size-4 rounded-full" style={{ backgroundColor: color }} />
              <span>{label}</span>
            </div>
          </SelectBox.Item>
        ))}
      </SelectBox.Content>
    </SelectBox>
  );
};
