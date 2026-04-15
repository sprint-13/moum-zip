import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AmplitudeInit } from "@/amplitude";
import {
  DEFAULT_SITE_DESCRIPTION,
  DEFAULT_SITE_TITLE,
  METADATA_BASE,
  RESOLVED_SITE_URL,
  SITE_NAME,
} from "@/shared/config/site";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  metadataBase: METADATA_BASE,
  title: {
    default: DEFAULT_SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: RESOLVED_SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_SITE_TITLE,
    description: DEFAULT_SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${pretendard.className} ${pretendard.variable} bg-background-secondary antialiased`}>
        <AmplitudeInit />
        {children}
      </body>
    </html>
  );
}
