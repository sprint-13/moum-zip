import type { Preview } from "@storybook/react-vite";
// 스토리북에서 tailwind 적용을 위해 import 함
import "../src/global.css";
const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
