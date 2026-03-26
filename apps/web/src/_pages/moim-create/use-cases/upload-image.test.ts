import { beforeEach, describe, expect, it, vi } from "vitest";
import * as actions from "@/_pages/moim-create/use-cases/get-image-presigned-url";
import { uploadImage } from "@/_pages/moim-create/use-cases/upload-image";

// shared/db를 빈 객체로 대체해 neon() 실행 차단
vi.mock("@/shared/db", () => ({
  db: {},
}));

vi.mock("@/_pages/moim-create/use-cases/get-image-presigned-url");

const MOCK_IMAGE_URL =
  "https://mblogthumb-phinf.pstatic.net/MjAyMjEwMjRfMTcw/MDAxNjY2NTQxNTAyMjE4.9uNxvgbMgHopY4EJqfCOwQiUbqEKWfbT7nE_QsdUcHgg.QliuYZbmrW_QBO0yl6fotLA7jgmjHq0486UGbvNxPpUg.JPEG.gogoa25/IMG_7088.JPG?type=w800";
const mockGetImagePresignedUrl = vi.mocked(actions.getImagePresignedUrl);
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("uploadImage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetImagePresignedUrl.mockResolvedValue({
      presignedUrl: "https://s3.example.com/presigned",
      publicUrl: MOCK_IMAGE_URL,
    });
    mockFetch.mockResolvedValue({ ok: true });
  });

  it("presigned URL로 S3에 업로드 후 publicUrl을 반환", async () => {
    const file = new File(["content"], "test.jpg", { type: "image/jpeg" });
    const result = await uploadImage(file);

    expect(mockGetImagePresignedUrl).toHaveBeenCalledWith("test.jpg", "image/jpeg");
    expect(mockFetch).toHaveBeenCalledWith(
      "https://s3.example.com/presigned",
      expect.objectContaining({ method: "PUT" }),
    );
    expect(result).toBe(MOCK_IMAGE_URL);
  });

  it("getImagePresignedUrl 실패 시 에러를 던진다", async () => {
    mockGetImagePresignedUrl.mockRejectedValue(new Error("이미지 업로드에 실패했습니다."));

    const file = new File(["content"], "test.jpg", { type: "image/jpeg" });
    await expect(uploadImage(file)).rejects.toThrow("이미지 업로드에 실패했습니다.");
  });

  it("S3 업로드 실패 시 에러를 던진다", async () => {
    mockFetch.mockResolvedValue({ ok: false });
    const file = new File(["content"], "test.jpg", { type: "image/jpeg" });
    await expect(uploadImage(file)).rejects.toThrow("이미지 업로드에 실패했습니다.");
  });
});
