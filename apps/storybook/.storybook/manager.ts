import { addons } from "storybook/manager-api";
import { smartaTheme } from "./theme";

addons.setConfig({
  theme: smartaTheme,
  sidebar: {
    showRoots: true,
  },
});
