"use client";
import { ImagePlus, X } from "@ui/icons";
import { cn } from "@ui/lib/utils";

interface FileInputPreviewItem {
  id: string;
  imageUrl?: string;
}

interface FileInputProps {
  className?: string;
  disabled?: boolean;
  helperText?: string;
  previewClassName?: string;
  previewItems?: FileInputPreviewItem[];
  onPreviewRemove?: (previewId: string) => void;
  onUploadClick?: () => void;
  showUploadButton?: boolean;
}

const FileInput = ({
  className,
  disabled,
  helperText = "파일 첨부",
  previewClassName,
  previewItems = [],
  onPreviewRemove,
  onUploadClick,
  showUploadButton = true,
}: FileInputProps) => {
  const handleUploadClick = () => {
    if (disabled) return;
    onUploadClick?.();
  };

  const handlePreviewRemove = (previewId: string) => {
    onPreviewRemove?.(previewId);
  };

  return (
    <div className={cn("flex flex-wrap gap-4", className)}>
      {showUploadButton && (
        <button
          className="flex max-h-[147px] min-h-[147px] min-w-[147px] max-w-[147px] flex-col items-center justify-center gap-2 rounded-[16px] border border-input bg-background text-muted-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-60 max-md:max-h-[114px] max-md:min-h-[114px] max-md:min-w-[114px] max-md:max-w-[114px]"
          disabled={disabled}
          type="button"
          onClick={handleUploadClick}
        >
          <ImagePlus className="size-8" strokeWidth={1.5} />
          <span className="font-medium text-base leading-[1.2]">{helperText}</span>
        </button>
      )}

      {previewItems.map(({ id, imageUrl }, previewIndex) => (
        <div
          key={id}
          className={cn(
            "relative max-h-[147px] min-h-[147px] min-w-[147px] max-w-[147px] overflow-hidden rounded-[16px] border border-input bg-background max-md:max-h-[114px] max-md:min-h-[114px] max-md:min-w-[114px] max-md:max-w-[114px]",
            previewClassName,
          )}
        >
          {imageUrl ? (
            <img alt={`업로드 파일 ${previewIndex + 1}`} className="h-full w-full object-cover" src={imageUrl} />
          ) : null}
          <button
            aria-label={`업로드 파일 ${previewIndex + 1} 삭제`}
            className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-foreground text-background"
            type="button"
            onClick={() => handlePreviewRemove(id)}
          >
            <X className="size-4" strokeWidth={2} />
          </button>
        </div>
      ))}
    </div>
  );
};

export { FileInput };
export type { FileInputPreviewItem };
export type { FileInputProps };
