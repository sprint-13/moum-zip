import { cn } from "@ui/lib/utils";
import type { ButtonProps } from "./button.types";
import { buttonVariants } from "./button-variants";

const sizeWidth = {
  small: 83,
  medium: 311,
  large: 474,
};

export function Button({
  variant = "primary",
  size = "medium",
  width = "fit",
  className,
  icon,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      style={width === "fit" ? { width: sizeWidth[size] } : undefined}
      className={cn(buttonVariants({ variant, size, width }), className)}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
