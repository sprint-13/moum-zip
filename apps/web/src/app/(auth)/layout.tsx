import { Gnb } from "@ui/components";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <header className="bg-background-secondary px-5">
        <Gnb>
          <Gnb.List>
            <Gnb.Item>
              <Gnb.Link>모임 찾기</Gnb.Link>
            </Gnb.Item>
            <Gnb.Item>
              <Gnb.Link>찜한 모임</Gnb.Link>
            </Gnb.Item>
            <Gnb.Item>
              <Gnb.Link>모든 리뷰</Gnb.Link>
            </Gnb.Item>
            <Gnb.Item>
              <Gnb.Link>달램토크</Gnb.Link>
            </Gnb.Item>
          </Gnb.List>
          <Gnb.List>
            <Gnb.Item>
              <Gnb.Link variant="sm">로그인</Gnb.Link>
            </Gnb.Item>
          </Gnb.List>
        </Gnb>
      </header>
      <main className="bg-background-secondary">{children}</main>
    </>
  );
}
