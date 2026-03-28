import { beforeEach, describe, expect, it, vi } from "vitest";
import type { getAuthenticatedApi } from "@/shared/api/auth-client";
import { getImagePresignedUrl } from "./get-image-presigned-url";

const mockCreate = vi.fn();

beforeEach(() => {
  mockCreate.mockReset();
});

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

  it("허용되지 않는 MIME 타입이면 에러를 던짐", async () => {
    await expect(
      getImagePresignedUrl("test.svg", "image/svg+xml", {
        getAuthApi: () => Promise.resolve(mockAuthedApi),
      }),
    ).rejects.toThrow("허용되지 않는 파일 형식입니다: image/svg+xml");
  });

  it("Response body가 JSON이 아닐 때 status를 포함한 에러를 던짐", async () => {
    const mockResponse = new Response("not json", { status: 400 });
    mockCreate.mockRejectedValue(mockResponse);

    await expect(
      getImagePresignedUrl("test.jpg", "image/jpeg", {
        getAuthApi: () => Promise.resolve(mockAuthedApi),
      }),
    ).rejects.toThrow("이미지 업로드 실패: HTTP 400");
  });

  it("Response body가 JSON일 때 message를 포함한 에러를 던짐", async () => {
    const mockResponse = new Response(
      JSON.stringify({ code: "INVALID_FILE_TYPE", message: "지원하지 않는 파일 형식입니다." }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
    mockCreate.mockRejectedValue(mockResponse);

    await expect(
      getImagePresignedUrl("test.jpg", "image/jpeg", {
        getAuthApi: () => Promise.resolve(mockAuthedApi),
      }),
    ).rejects.toThrow("이미지 업로드 실패: 지원하지 않는 파일 형식입니다.");
  });
});
