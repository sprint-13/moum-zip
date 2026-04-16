"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@ui/components/shadcn/popover";
import { CalendarIcon } from "@ui/icons";
import dynamic from "next/dynamic";
import { useState } from "react";
import { cn } from "@/shared/lib/cn";
import { formatDate, parseDateString } from "@/shared/lib/form-date-time";

interface DatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
}
const Calendar = dynamic(() => import("@ui/components/shadcn/calendar").then((m) => m.Calendar), { ssr: false });

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
          aria-label={value ? `날짜 선택, 현재 값 ${value}` : "날짜 선택"}
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
