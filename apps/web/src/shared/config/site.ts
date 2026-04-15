import { SITE_URL } from "./env";

const DEFAULT_SITE_URL = "https://moum-zip-web.vercel.app/";

const createMetadataBase = (value: string) => {
  try {
    return new URL(value);
  } catch {
    return new URL(DEFAULT_SITE_URL);
  }
};

export const SITE_NAME = "모음.zip";
export const DEFAULT_SITE_TITLE = SITE_NAME;
export const DEFAULT_SITE_DESCRIPTION =
  "스터디와 프로젝트 팀원을 모집하고, 전용 스페이스에서 소통하며 함께 성장하는 모임 관리 플랫폼, 모음.zip입니다.";
export const METADATA_BASE = createMetadataBase(SITE_URL);
export const RESOLVED_SITE_URL = METADATA_BASE.toString();
