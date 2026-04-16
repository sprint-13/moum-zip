import { notFound, redirect } from "next/navigation";
import { ERROR_CODES } from "./error";
import { isAppError } from "./errors/is-app-error";

/**
 * AppError를 Next.js 네비게이션으로 변환하는 에러 핸들러.
 * 최종 소비자(layout, page)에서 .catch(handleAppError)로 사용한다.
 *
 * @example
 * const { space, membership } = await getSpaceContext(slug).catch(handleAppError);
 */
export const handleAppError = (error: unknown): never => {
  if (isAppError(error)) {
    switch (error.code) {
      case ERROR_CODES.UNAUTHENTICATED:
        redirect("/login");
        break;
      case ERROR_CODES.NOT_FOUND:
        notFound();
        break;
      case ERROR_CODES.SPACE_NOT_FOUND:
        notFound();
        break;
      case ERROR_CODES.SPACE_ACCESS_DENIED:
        notFound();
        break;
      case ERROR_CODES.POST_NOT_FOUND:
        notFound();
        break;
      case ERROR_CODES.COMMENT_NOT_FOUND:
        notFound();
    }
  }
  throw error;
};
