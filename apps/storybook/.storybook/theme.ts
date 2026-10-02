import { create } from "storybook/theming";

/**
 * Storybook's own chrome, in the webapp's palette.
 *
 * This is the base, not the last word. `create()` is read once at boot and
 * cannot be swapped afterwards, so it stays webapp light; the sidebar is then
 * repainted per product from `data-product` in manager-head.html, which the
 * Product toolbar keeps current. What is left on these values is everything
 * outside the sidebar — the toolbar accents, the addon panel, buttons and
 * inputs — and that chrome is Storybook's own, not either product's.
 *
 * The values are the webapp's light tokens, copied rather than imported: the
 * manager bundle is built separately from the preview and never loads the
 * stylesheet, so var(--canvas) would resolve to nothing here.
 */

const WORDMARK = `<svg viewBox="0 0 69 15" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="currentColor" d="M 22.559 3.555 C 21.044 3.555 19.801 4.225 19.073 5.396 C 18.347 4.225 17.102 3.555 15.588 3.555 C 13.117 3.555 11.229 5.311 11.229 8.261 L 11.229 14.431 L 13.305 14.431 L 13.305 8.261 C 13.305 6.546 14.321 5.584 15.67 5.584 C 17.019 5.584 18.036 6.547 18.036 8.261 L 18.036 14.431 L 20.111 14.431 L 20.111 8.261 C 20.111 6.546 21.128 5.584 22.477 5.584 C 23.826 5.584 24.842 6.547 24.842 8.261 L 24.842 14.431 L 26.918 14.431 L 26.918 8.261 C 26.918 5.313 25.049 3.555 22.559 3.555 Z M 33.537 12.611 C 31.565 12.611 30.113 11.126 30.113 9.097 C 30.113 7.068 31.565 5.583 33.537 5.583 C 35.509 5.583 36.982 7.089 36.982 9.097 C 36.982 11.105 35.53 12.611 33.537 12.611 Z M 33.579 3.554 C 30.363 3.554 27.997 5.897 27.997 9.097 C 27.997 12.297 30.3 14.639 33.33 14.639 C 34.845 14.639 36.319 13.865 37.148 12.527 L 37.148 14.43 L 39.099 14.43 L 39.099 8.992 C 39.099 5.876 36.754 3.554 33.579 3.554 Z M 40.489 9.244 L 40.489 14.43 L 42.564 14.43 L 42.564 9.244 C 42.564 7.11 43.955 5.814 45.904 5.814 L 46.984 5.814 L 46.984 3.765 L 45.904 3.765 C 42.688 3.765 40.489 5.5 40.489 9.244 Z M 52.63 0 L 50.554 0 L 50.554 2.97 C 50.554 3.472 50.243 3.765 49.766 3.765 L 47.857 3.765 L 47.857 5.667 L 50.554 5.667 L 50.554 10.624 C 50.554 13.28 51.924 14.577 54.352 14.577 C 55.057 14.577 55.888 14.556 56.801 14.41 L 56.801 12.403 C 55.888 12.528 55.203 12.57 54.684 12.57 C 53.149 12.57 52.63 11.838 52.63 10.458 L 52.63 5.669 L 56.801 5.669 L 56.801 3.766 L 52.63 3.766 Z M 63.15 12.611 C 61.178 12.611 59.725 11.126 59.725 9.097 C 59.725 7.068 61.178 5.583 63.15 5.583 C 65.121 5.583 66.595 7.089 66.595 9.097 C 66.595 11.105 65.142 12.611 63.15 12.611 Z M 63.192 3.554 C 59.975 3.554 57.61 5.897 57.61 9.097 C 57.61 12.297 59.913 14.639 62.943 14.639 C 64.458 14.639 65.931 13.865 66.761 12.527 L 66.761 14.43 L 68.712 14.43 L 68.712 8.992 C 68.712 5.876 66.367 3.554 63.192 3.554 Z M 14.72 1.999 L 14.722 0 C 11.66 0 9.047 1.968 8.063 4.715 C 7.177 4.085 6.009 3.786 4.71 3.786 C 2.2 3.786 0.311 4.915 0.311 7.069 C 0.311 8.972 1.785 9.892 3.653 10.039 L 5.977 10.227 C 6.973 10.29 7.678 10.666 7.678 11.544 C 7.678 12.59 6.661 13.071 5.188 13.071 C 3.715 13.071 2.532 12.569 2.179 11.336 L 0 11.336 C 0.436 13.678 2.469 14.87 5.085 14.87 C 7.7 14.87 9.753 13.678 9.753 11.398 C 9.753 9.516 8.425 8.575 6.329 8.407 L 4.067 8.24 C 3.05 8.177 2.385 7.843 2.385 6.985 C 2.385 6.022 3.341 5.563 4.709 5.563 C 5.789 5.563 6.992 5.96 7.428 7.131 L 9.628 7.131 C 9.628 4.301 11.912 1.999 14.72 1.999 Z"/></svg>`;

export const smartaTheme = create({
  base: "light",

  brandTitle: `<span class="smarta-brand">${WORDMARK}<span>design system</span></span>`,
  brandUrl: "/",
  brandTarget: "_self",

  colorPrimary: "#9B3F92",   // --accent
  colorSecondary: "#9B3F92", // selection, active sidebar item

  appBg: "#FBF9FB",          // --canvas
  appContentBg: "#FFFFFF",   // --surface
  appPreviewBg: "#FFFFFF",
  appBorderColor: "#EEE7EF", // --border
  appBorderRadius: 10,       // --radius-md

  fontBase: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
  fontCode: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',

  textColor: "#432F4A",      // --fg
  textInverseColor: "#FFFFFF",
  textMutedColor: "#7A5D80", // --fg-subtle

  barTextColor: "#6B5271",   // --fg-muted
  barHoverColor: "#9B3F92",
  barSelectedColor: "#9B3F92",
  barBg: "#FFFFFF",

  buttonBg: "#FFFFFF",
  buttonBorder: "#EEE7EF",
  booleanBg: "#F5F0F6",      // --surface-sunken
  booleanSelectedBg: "#FFFFFF",

  inputBg: "#FFFFFF",
  inputBorder: "#EEE7EF",
  inputTextColor: "#432F4A",
  inputBorderRadius: 10,
});

export default smartaTheme;
