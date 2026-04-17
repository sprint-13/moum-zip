import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { AmplitudeInit } from "@/amplitude";
import {
  DEFAULT_SITE_DESCRIPTION,
  DEFAULT_SITE_TITLE,
  METADATA_BASE,
  RESOLVED_SITE_URL,
  SITE_NAME,
} from "@/shared/config/site";

export const metadata: Metadata = {
  metadataBase: METADATA_BASE,
  title: {
    default: DEFAULT_SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_SITE_DESCRIPTION,
  verification: {
    google: "IfFsfKLBvllcItI_4GIp9tNalW6C9ZS-87uKZs9cxGU",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: RESOLVED_SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_SITE_TITLE,
    description: DEFAULT_SITE_DESCRIPTION,
    images: [
      {
        url: "/og/landing.png",
        width: 1200,
        height: 630,
        alt: "모음.zip 랜딩 페이지",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link
          rel="stylesheet"
          crossOrigin=""
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="bg-background-secondary antialiased">
        <Script src="https://accounts.google.com/gsi/client" strategy="beforeInteractive" />
        <AmplitudeInit />
        {children}
      </body>
    </html>
  );
}
