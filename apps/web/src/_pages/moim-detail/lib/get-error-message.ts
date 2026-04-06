export const getErrorMessage = async (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  if (error instanceof Response) {
    try {
      const data = await error.clone().json();

      if (typeof data === "object" && data !== null && "message" in data && typeof data.message === "string") {
        return data.message;
      }

      if (typeof data === "object" && data !== null && "error" in data && typeof data.error === "string") {
        return data.error;
      }
    } catch {
      try {
        const text = await error.clone().text();

        if (text) {
          return text;
        }
      } catch {}
    }

    return `${error.status} ${error.statusText}`;
  }

  if (typeof error === "object" && error !== null && "error" in error && typeof error.error === "string") {
    return error.error;
  }

  return "요청 처리 중 오류가 발생했습니다.";
};
