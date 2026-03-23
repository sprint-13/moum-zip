"use client";

import { Calendar } from "@ui/components/shadcn/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/components/shadcn/popover";
import { CalendarIcon } from "@ui/icons";
import { formatDate, parseDateString } from "@/_pages/moim-create/lib/date-time";

interface DatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
}

export const DatePicker = ({ value, onChange }: DatePickerProps) => {
  const selected = parseDateString(value);
  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    onChange?.(formatDate(date));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="날짜 선택"
          className="flex items-center gap-2 rounded-md border border-input p-3"
        >
          <CalendarIcon className="size-4 text-muted-foreground" />
          <span className="text-sm leading-[22px]">{value || "YYYY-MM-DD"}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar mode="single" selected={selected} onSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  );
};
