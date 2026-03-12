# Web Application

이 디렉토리는 `moim-space` 모노레포의 메인 웹 애플리케이션(`apps/web`)입니다. Next.js App Router를 기반으로 작성되었습니다.

## 📦 모노레포 내 패키지 사용법

본 프로젝트는 `pnpm` workspace와 `turborepo`를 활용하여 모노레포로 구성되어 있습니다. `apps/web` 앱은 `packages/` 폴더 내의 공유 패키지들을 의존성으로 가져와 사용합니다.

### 1. 공유 패키지 연결하기 (설치하기)

다른 내부 워크스페이스 패키지(예: `@moim/ui`, `@moim/api`)를 웹 애플리케이션에 명시적으로 추가하여 사용하려면 프로젝트 루트 디렉토리에서 아래 명령어를 사용합니다:

```bash
# 기본 형태
pnpm --filter <설치할 타겟 앱> add <설치할 패키지 이름>

# 예시: web 앱에 @moim/ui 패키지 설치
pnpm --filter ./apps/web add @moim/ui
```

_(위 명령어를 실행하면 `apps/web/package.json`의 `dependencies`에 `"@moim/ui": "workspace:_"` 형태로 자동 추가됩니다.)\*

### 2. 내부 패키지 불러오기 (Import)

연결된 내부 패키지는 일반 npm 패키지를 사용하듯 간편하게 `import` 할 수 있습니다.

```tsx
// @moim/ui 패키지에서 버튼 컴포넌트 가져오기
import { Button } from "@moim/ui/components";

export default function Page() {
  return <Button variant='outline'>조회하기</Button>;
}
```

### 3. 외부 라이브러리 설치하기

공통이 아닌 **해당 웹 애플리케이션에만** 필요한 외부 오픈소스 패키지 (`vitest`, `@tanstack/react-query` 등)를 설치할 때도 `--filter` 옵션을 사용합니다.

```bash
# 프로덕션 의존성 (dependencies) 추가
pnpm --filter ./apps/web add @tanstack/react-query 유효한패키지명

# 개발용 의존성 (devDependencies) 추가
pnpm --filter ./apps/web add -D @testing-library/react @vitejs/plugin-react
```

## 🛠️ 주요 스크립트 명령어

모든 스크립트 실행은 일관성을 위해 루트 디렉토리에서 실행하는 것을 권장합니다 (터보레포를 거쳐 실행됨).

- `pnpm run dev:web`: веб 애플리케이션을 개발(dev) 모드로 실행합니다. (`http://localhost:3000`)
- `pnpm run build`: 전체 앱 또는 변경된 패키지들을 캐시 기반으로 초고속 빌드합니다. (turborepo 캐싱 적용)
- `pnpm --filter ./apps/web run test`: 웹 프로젝트 내 `vitest` 기반 유닛 테스트를 1회 실행합니다.
- `pnpm --filter ./apps/web run test:watch`: 파일 변경 사항을 감지하여 실시간으로 유닛 테스트를 실행합니다.

---

> **💡 개발 환경 참고사항**
>
> - **린팅 및 포맷팅 (Biome)**: 프로젝트 전역에서 ESLint와 Prettier 대신 Biome을 사용합니다. `packages/`나 `apps/`에서 코드를 수정하면 `pre-commit` 훅을 통해 일괄 검사됩니다.
> - **에셋 (SVGR)**: `public/` 안의 SVG 파일을 단순 파일 경로가 아닌 `<FileIcon />` 와 같이 React 컴포넌트로도 불러올 수 있도록 설정되어 있습니다.
