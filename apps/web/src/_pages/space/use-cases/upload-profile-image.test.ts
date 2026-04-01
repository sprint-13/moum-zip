import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { uploadProfileImage } from "./upload-profile-image";

const mockFetch = vi.fn();

vi.stubGlobal("fetch", mockFetch);

describe("uploadProfileImage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it("presigned URL을 받아 이미지를 업로드하고 publicUrl을 반환한다", async () => {
    mockFetch
      .mockResolvedValueOnce({
        json: async () => ({
          presignedUrl: "https://s3.example.com/presigned",
          publicUrl: "https://cdn.example.com/profile.png",
        }),
        ok: true,
      })
      .mockResolvedValueOnce({
        ok: true,
      });

    const file = new File(["content"], "profile.png", { type: "image/png" });
    const result = await uploadProfileImage(file);

    expect(mockFetch).toHaveBeenNthCalledWith(1, "/api/images/presigned", {
      body: JSON.stringify({
        fileName: "profile.png",
        contentType: "image/png",
        folder: "users",
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    expect(mockFetch).toHaveBeenNthCalledWith(2, "https://s3.example.com/presigned", {
      body: file,
      headers: {
        "Content-Type": "image/png",
      },
      method: "PUT",
    });
    expect(result).toBe("https://cdn.example.com/profile.png");
  });

  it("지원하지 않는 이미지 형식이면 에러를 던진다", async () => {
    const file = new File(["content"], "profile.svg", { type: "image/svg+xml" });

    await expect(uploadProfileImage(file)).rejects.toThrow("JPG, PNG, WebP, GIF 형식의 이미지만 업로드할 수 있어요");

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("presigned URL 발급에 실패하면 에러를 던진다", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
    });

    const file = new File(["content"], "profile.png", { type: "image/png" });

    await expect(uploadProfileImage(file)).rejects.toThrow("프로필 이미지 업로드 URL 발급에 실패했어요");
  });

  it("presigned URL 응답이 올바르지 않으면 에러를 던진다", async () => {
    mockFetch.mockResolvedValue({
      json: async () => ({
        presignedUrl: "",
      }),
      ok: true,
    });

    const file = new File(["content"], "profile.png", { type: "image/png" });

    await expect(uploadProfileImage(file)).rejects.toThrow("프로필 이미지 업로드 URL 정보가 올바르지 않아요");
  });

  it("이미지 업로드에 실패하면 에러를 던진다", async () => {
    mockFetch
      .mockResolvedValueOnce({
        json: async () => ({
          presignedUrl: "https://s3.example.com/presigned",
          publicUrl: "https://cdn.example.com/profile.png",
        }),
        ok: true,
      })
      .mockResolvedValueOnce({
        ok: false,
      });

    const file = new File(["content"], "profile.png", { type: "image/png" });

    await expect(uploadProfileImage(file)).rejects.toThrow("프로필 이미지 업로드에 실패했어요");
  });
});
