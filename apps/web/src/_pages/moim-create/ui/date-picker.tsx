"use client";

import { Calendar } from "@ui/components/shadcn/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/components/shadcn/popover";
import { CalendarIcon } from "@ui/icons";
import { useState } from "react";
import { formatDate, parseDateString } from "@/_pages/moim-create/lib/date-time";
import { cn } from "@/shared/lib/cn";

interface DatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
}

export const DatePicker = ({ value, onChange }: DatePickerProps) => {
  const [open, setOpen] = useState(false);
  const selected = parseDateString(value);

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    onChange?.(formatDate(date));
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="날짜 선택"
          className="flex items-center gap-2 rounded-md border border-input p-3"
        >
          <CalendarIcon className="size-4 text-muted-foreground" />
          <span className={cn("text-sm leading-[22px]", value ? "text-foreground" : "text-muted-foreground")}>
            {value || "YYYY-MM-DD"}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto">
        <Calendar mode="single" selected={selected} onSelect={handleSelect} disabled={{ before: new Date() }} />
      </PopoverContent>
    </Popover>
  );
};
