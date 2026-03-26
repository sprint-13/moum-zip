import { describe, expect, it, vi } from "vitest";
import type { getAuthenticatedApi } from "@/shared/api/auth-client";
import { getImagePresignedUrl } from "./get-image-presigned-url";

const mockCreate = vi.fn();

type AuthedApi = Awaited<ReturnType<typeof getAuthenticatedApi>>;

const mockAuthedApi = {
  images: {
    create: mockCreate,
  },
} as unknown as AuthedApi;

const MOCK_IMAGE_URL =
  "https://mblogthumb-phinf.pstatic.net/MjAyMjEwMjRfMTcw/MDAxNjY2NTQxNTAyMjE4.9uNxvgbMgHopY4EJqfCOwQiUbqEKWfbT7nE_QsdUcHgg.QliuYZbmrW_QBO0yl6fotLA7jgmjHq0486UGbvNxPpUg.JPEG.gogoa25/IMG_7088.JPG?type=w800";

describe("getImagePresignedUrl", () => {
  it("presigned URL과 publicUrl을 반환한다", async () => {
    mockCreate.mockResolvedValue({
      data: {
        presignedUrl: "https://s3.example.com/presigned",
        publicUrl: MOCK_IMAGE_URL,
      },
    });

    const result = await getImagePresignedUrl("test.jpg", "image/jpeg", {
      getAuthApi: () => Promise.resolve(mockAuthedApi),
    });

    expect(result.presignedUrl).toBe("https://s3.example.com/presigned");
    expect(result.publicUrl).toBe(MOCK_IMAGE_URL);
  });

  it("API 실패 시 에러를 던짐", async () => {
    mockCreate.mockRejectedValue(new Error("이미지 업로드에 실패했습니다."));

    await expect(
      getImagePresignedUrl("test.jpg", "image/jpeg", {
        getAuthApi: () => Promise.resolve(mockAuthedApi),
      }),
    ).rejects.toThrow("이미지 업로드에 실패했습니다.");
  });
});
