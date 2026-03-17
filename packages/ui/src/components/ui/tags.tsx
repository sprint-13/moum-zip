import { cn } from "@ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";

const tagVariants = cva("inline-flex items-center justify-center self-start whitespace-nowrap border", {
  variants: {
    tone: {
      blue: "border-transparent bg-secondary/20 text-secondary",
      white: "border-border bg-background text-muted-foreground",
    },
    size: {
      large: "",
      small: "",
    },
  },
  compoundVariants: [
    {
      tone: "blue",
      size: "large",
      className: "gap-1 rounded-[0.5rem] pr-[0.5rem] pl-[0.25rem]",
    },
    {
      tone: "blue",
      size: "small",
      className: "gap-1 rounded-[0.375rem] pr-[0.5rem] pl-[0.25rem]",
    },
    {
      tone: "white",
      size: "large",
      className: "gap-1 rounded-[0.5rem] pr-[0.5rem] pl-[0.25rem]",
    },
    {
      tone: "white",
      size: "small",
      className: "gap-1 rounded-[0.375rem] pr-[0.5rem] pl-[0.25rem]",
    },
  ],
  defaultVariants: {
    tone: "blue",
    size: "large",
  },
});

const tagTextVariants = cva("whitespace-nowrap", {
  variants: {
    tone: {
      blue: "font-semibold text-secondary",
      white: "font-medium text-muted-foreground",
    },
    size: {
      large: "text-sm leading-5",
      small: "text-xs leading-4",
    },
  },
  defaultVariants: {
    tone: "blue",
    size: "large",
  },
});

const alarmIconVariants = cva("shrink-0 text-secondary", {
  variants: {
    size: {
      large: "size-6",
      small: "size-5",
    },
  },
  defaultVariants: {
    size: "large",
  },
});

interface TagProps extends ComponentPropsWithoutRef<"span">, VariantProps<typeof tagVariants> {
  icon?: boolean;
}

interface AlarmIconProps {
  size?: "large" | "small";
}

const AlarmIcon = ({ size = "large" }: AlarmIconProps) => {
  if (size === "small") {
    return (
      <svg
        aria-hidden="true"
        className={alarmIconVariants({ size })}
        fill="none"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M5.55539 5L4.1665 6.38889" stroke="currentColor" strokeLinecap="round" strokeWidth="1.66667" />
        <path d="M15.2776 5L16.6665 6.38889" stroke="currentColor" strokeLinecap="round" strokeWidth="1.66667" />
        <path
          clipRule="evenodd"
          d="M10.416 5C13.4843 5 15.9717 7.48742 15.9717 10.5557C15.9716 13.6239 13.4842 16.1113 10.416 16.1113C7.34797 16.1111 4.86041 13.6237 4.86035 10.5557C4.86035 7.48754 7.34794 5.0002 10.416 5ZM12.3262 8.16895C11.9668 7.88165 11.4417 7.93952 11.1543 8.29883L10.2422 9.4375L8.79492 8.47363C8.41206 8.21863 7.89491 8.32139 7.63965 8.7041C7.38467 9.08692 7.48848 9.60506 7.87109 9.86035L9.79492 11.1426C10.2444 11.4422 10.8489 11.3484 11.1865 10.9268L12.4561 9.33984C12.7434 8.98059 12.6852 8.45649 12.3262 8.16895Z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className={alarmIconVariants({ size })}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6.66667 6L5 7.66667" stroke="currentColor" strokeLinecap="round" strokeWidth="1.66667" />
      <path d="M18.3333 6L20 7.66667" stroke="currentColor" strokeLinecap="round" strokeWidth="1.66667" />
      <path
        d="M12.5 6C16.1817 6.00018 19.166 8.9852 19.166 12.667C19.1658 16.3486 16.1816 19.3328 12.5 19.333C8.81821 19.333 5.83318 16.3487 5.83301 12.667C5.83301 8.98509 8.8181 6 12.5 6ZM14.6875 9.93262C14.3281 9.64525 13.8031 9.70317 13.5156 10.0625L12.3262 11.5488L10.4619 10.3066C10.0791 10.0516 9.56193 10.1544 9.30664 10.5371C9.05142 10.92 9.15529 11.438 9.53809 11.6934L11.8789 13.2539C12.3284 13.5535 12.933 13.4599 13.2705 13.0381L14.8174 11.1035C15.1048 10.7442 15.0466 10.2202 14.6875 9.93262Z"
        fill="currentColor"
      />
    </svg>
  );
};

const Tag = ({ className, tone = "blue", size = "large", icon = false, children, ...props }: TagProps) => {
  const alarmIconSize = size ?? "large";

  return (
    <span className={cn(tagVariants({ tone, size }), className)} {...props}>
      {icon ? <AlarmIcon size={alarmIconSize} /> : null}
      <span className={tagTextVariants({ tone, size })}>{children}</span>
    </span>
  );
};

export { Tag, tagVariants };
export type { TagProps };
