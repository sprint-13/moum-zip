"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@ui/components/shadcn/popover";
import { ClockIcon } from "@ui/icons";
import { useState } from "react";
import { cn } from "@/shared/lib/cn";
import { formatTime, parseTimeString } from "@/shared/lib/form-date-time";

interface TimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
}

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const minutes = Array.from({ length: 6 }, (_, i) => String(i * 10).padStart(2, "0"));

export const TimePicker = ({ value, onChange }: TimePickerProps) => {
  const [open, setOpen] = useState(false);
  const { hour, minute } = parseTimeString(value);

  const handleHourSelect = (h: string) => {
    onChange?.(formatTime(h, minute));
    if (minute) setOpen(false);
  };

  const handleMinuteSelect = (m: string) => {
    onChange?.(formatTime(hour, m));
    if (hour) setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="시간 선택"
          className="flex items-center gap-2 rounded-md border border-input p-3"
        >
          <ClockIcon className="size-4 text-muted-foreground" />
          <span className={cn("text-sm leading-[22px]", value ? "text-foreground" : "text-muted-foreground")}>
            {value ? value.replace(":", " : ") : "HH : MM"}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="flex w-auto flex-row gap-2 p-2">
        {/* hour 컬럼 */}
        <ul className="no-scrollbar h-[184px] overflow-y-scroll">
          {hours.map((h) => (
            <li key={h}>
              <button
                type="button"
                className={cn(
                  "w-12 rounded px-2 py-1 text-sm hover:bg-accent hover:text-foreground",
                  h === hour && "bg-primary text-white",
                )}
                onClick={() => handleHourSelect(h)}
              >
                {h}
              </button>
            </li>
          ))}
        </ul>
        {/* minute 컬럼 */}
        <ul className="no-scrollbar h-[184px] overflow-y-scroll">
          {minutes.map((m) => (
            <li key={m}>
              <button
                type="button"
                className={cn(
                  "w-12 rounded px-2 py-1 text-sm hover:bg-accent hover:text-foreground",
                  m === minute && "bg-primary text-white",
                )}
                onClick={() => handleMinuteSelect(m)}
              >
                {m}
              </button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
};
