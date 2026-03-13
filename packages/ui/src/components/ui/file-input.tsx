import { ImagePlus, X } from "@ui/icons";
import { cn } from "@ui/lib/utils";
import * as React from "react";

interface FileInputProps extends Omit<React.ComponentProps<"input">, "type" | "value" | "defaultValue" | "onChange"> {
  defaultPreviewClassName?: string;
  defaultPreviewPlaceholderCount?: number;
  defaultPreviewUrls?: string[];
  onFilesChange?: (files: File[]) => void;
}

const FileInput = ({
  accept = "image/*",
  className,
  defaultPreviewClassName,
  defaultPreviewPlaceholderCount = 0,
  defaultPreviewUrls = [],
  disabled,
  multiple = true,
  onFilesChange,
  ...props
}: FileInputProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [previewUrls, setPreviewUrls] = React.useState<string[]>(defaultPreviewUrls);
  const previewPlaceholderIds = React.useMemo(
    () =>
      Array.from(
        { length: defaultPreviewPlaceholderCount },
        () => `placeholder-${Math.random().toString(36).slice(2, 11)}`,
      ),
    [defaultPreviewPlaceholderCount],
  );
  // 스토리북 placeholder 카드와 실제 업로드 preview를 같은 UI로 렌더링합니다.
  const previewItems = [
    ...previewUrls.map((previewUrl) => ({ previewId: previewUrl, previewUrl })),
    ...previewPlaceholderIds.map((previewId) => ({ previewId, previewUrl: "" })),
  ];

  // 선택한 파일을 preview URL로 바꿔 즉시 화면에 보여줍니다.
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    if (!files?.length) {
      return;
    }

    const nextFiles = Array.from(files);
    const nextPreviewUrls = nextFiles.map((file) => URL.createObjectURL(file));

    setPreviewUrls((previousPreviewUrls) => [...previousPreviewUrls, ...nextPreviewUrls]);
    onFilesChange?.(nextFiles);

    event.target.value = "";
  };

  const handleUploadClick = () => {
    if (disabled) {
      return;
    }

    fileInputRef.current?.click();
  };

  const handlePreviewRemove = (removeIndex: number) => {
    setPreviewUrls((previousPreviewUrls) =>
      previousPreviewUrls.filter((_, previewIndex) => previewIndex !== removeIndex),
    );
  };

  React.useEffect(() => {
    setPreviewUrls(defaultPreviewUrls);
  }, [defaultPreviewUrls]);

  React.useEffect(() => {
    // createObjectURL로 만든 임시 URL은 언마운트 시 정리합니다.
    return () => {
      previewUrls.forEach((previewUrl) => {
        if (previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(previewUrl);
        }
      });
    };
  }, [previewUrls]);

  return (
    <>
      <input
        ref={fileInputRef}
        accept={accept}
        className="hidden"
        disabled={disabled}
        multiple={multiple}
        type="file"
        onChange={handleFileSelect}
        {...props}
      />
      <div className={cn("flex flex-wrap gap-4", className)}>
        <button
          className="flex h-[147px] w-[147px] flex-col items-center justify-center gap-2 rounded-[16px] bg-[#F3F4F6] text-[#A4A4A4] transition-opacity disabled:cursor-not-allowed disabled:opacity-60 max-md:h-[114px] max-md:w-[114px]"
          disabled={disabled}
          type="button"
          onClick={handleUploadClick}
        >
          <ImagePlus className="size-8" strokeWidth={1.5} />
          <span className="text-[16px] leading-[1.2] font-medium">파일 첨부</span>
        </button>
        {previewItems.map(({ previewId, previewUrl }, previewIndex) => (
          <div
            key={previewId}
            className={cn(
              "relative h-[147px] w-[147px] overflow-hidden rounded-[16px] bg-[#F3F4F6] max-md:h-[114px] max-md:w-[114px]",
              defaultPreviewClassName,
            )}
          >
            {previewUrl ? (
              <img alt={`업로드 파일 ${previewIndex + 1}`} className="h-full w-full object-cover" src={previewUrl} />
            ) : null}
            <button
              aria-label={`업로드 파일 ${previewIndex + 1} 삭제`}
              className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-[#000000] text-white"
              type="button"
              onClick={() => handlePreviewRemove(previewIndex)}
            >
              <X className="size-4" strokeWidth={2} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export { FileInput };
export type { FileInputProps };
