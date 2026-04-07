export const getErrorMessage = async (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  if (error instanceof Response) {
    let parsedMessage: string | null = null;

    try {
      const data = await error.clone().json();

      if (typeof data === "object" && data !== null && "message" in data && typeof data.message === "string") {
        parsedMessage = data.message;
      } else if (typeof data === "object" && data !== null && "error" in data && typeof data.error === "string") {
        parsedMessage = data.error;
      }
    } catch {}

    if (parsedMessage) {
      return parsedMessage;
    }

    try {
      const text = await error.clone().text();

      if (text) {
        return text;
      }
    } catch {}

    return `${error.status} ${error.statusText}`;
  }

  if (typeof error === "object" && error !== null) {
    if ("error" in error && typeof error.error === "string") {
      return error.error;
    }

    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
  }

  return "요청 처리 중 오류가 발생했습니다.";
};
