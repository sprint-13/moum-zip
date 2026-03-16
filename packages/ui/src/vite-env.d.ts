// SVG 파일을 TypeScript에서 import할 수 있도록 모듈 선언
declare module "*.svg" {
  const src: string;
  export default src;
}
