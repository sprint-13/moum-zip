import { notFound, redirect } from "next/navigation";
import { AppError } from "./error";

/**
 * AppError를 Next.js 네비게이션으로 변환하는 에러 핸들러.
 * 최종 소비자(layout, page)에서 .catch(handleAppError)로 사용한다.
 *
 * @example
 * const { space, membership } = await getSpaceContext(slug).catch(handleAppError);
 */
export function handleAppError(error: unknown): never {
  if (error instanceof AppError) {
    switch (error.code) {
      case "UNAUTHENTICATED":
        redirect("/login");
        break;
      case "SPACE_NOT_FOUND":
        notFound();
        break;
      case "SPACE_ACCESS_DENIED":
        notFound();
    }
  }
  throw error;
}
