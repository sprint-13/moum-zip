import { beforeEach, describe, expect, it, vi } from "vitest";
import { getProfileImagePresignedUrl, putProfileImage } from "./upload-profile-image";

const mockFetch = vi.fn();

vi.stubGlobal("fetch", mockFetch);

describe("getProfileImagePresignedUrl", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("presigned URL 발급 요청을 보내고 응답을 반환한다", async () => {
    mockFetch.mockResolvedValue({
      json: async () => ({
        presignedUrl: "https://s3.example.com/presigned",
        publicUrl: "https://cdn.example.com/profile.png",
      }),
      ok: true,
    });

    const result = await getProfileImagePresignedUrl("profile.png", "image/png");

    expect(mockFetch).toHaveBeenCalledWith("/api/images/presigned", {
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
    expect(result).toEqual({
      presignedUrl: "https://s3.example.com/presigned",
      publicUrl: "https://cdn.example.com/profile.png",
    });
  });

  it("지원하지 않는 이미지 형식이면 에러를 던진다", async () => {
    await expect(getProfileImagePresignedUrl("profile.svg", "image/svg+xml")).rejects.toThrow(
      "JPG, PNG, WebP, GIF 형식의 이미지만 업로드할 수 있어요.",
    );

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("presigned URL 발급에 실패하면 에러를 던진다", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
    });

    await expect(getProfileImagePresignedUrl("profile.png", "image/png")).rejects.toThrow(
      "프로필 이미지 업로드 URL 발급에 실패했어요.",
    );
  });
});

describe("putProfileImage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("presigned URL로 이미지를 업로드한다", async () => {
    mockFetch.mockResolvedValue({ ok: true });
    const file = new File(["content"], "profile.png", { type: "image/png" });

    await putProfileImage("https://s3.example.com/presigned", file);

    expect(mockFetch).toHaveBeenCalledWith("https://s3.example.com/presigned", {
      body: file,
      headers: {
        "Content-Type": "image/png",
      },
      method: "PUT",
    });
  });

  it("지원하지 않는 이미지 형식이면 에러를 던진다", async () => {
    const file = new File(["content"], "profile.svg", { type: "image/svg+xml" });

    await expect(putProfileImage("https://s3.example.com/presigned", file)).rejects.toThrow(
      "JPG, PNG, WebP, GIF 형식의 이미지만 업로드할 수 있어요.",
    );

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("업로드에 실패하면 에러를 던진다", async () => {
    mockFetch.mockResolvedValue({ ok: false });
    const file = new File(["content"], "profile.png", { type: "image/png" });

    await expect(putProfileImage("https://s3.example.com/presigned", file)).rejects.toThrow(
      "프로필 이미지 업로드에 실패했어요.",
    );
  });
});
