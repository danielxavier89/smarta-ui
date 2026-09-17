import { addons } from "storybook/manager-api";
import {
  GLOBALS_UPDATED,
  SET_GLOBALS,
  UPDATE_GLOBALS,
  STORY_RENDERED,
} from "storybook/internal/core-events";
import { smartaTheme } from "./theme";

addons.setConfig({
  theme: smartaTheme,
  sidebar: {
    showRoots: true,
  },
});

/**
 * The sidebar follows the Product toolbar.
 *
 * The manager and the preview are two separate bundles: the toolbars set
 * `globals` in the preview, and the manager's own chrome knows nothing about
 * them. So the sidebar sat in webapp plum while a backoffice story rendered
 * beside it, which reads as though plum were the library's colour and grey
 * were a variant of it. It is the other way round — neither is the library's
 * colour, which is the whole point of the token layer.
 *
 * `setConfig` cannot be usefully re-run to swap the theme after boot, so the
 * product is stamped on the manager's own <html> instead and the chrome is
 * painted from it in manager-head.html — the same `data-product` contract the
 * components use, applied to the one surface that is not a component.
 *
 * Four events, because no one of them covers every way the value moves, and
 * the wrong one covers none of them. `updateGlobals` is the manager telling
 * the preview to change — that is what the toolbar raises, and listening only
 * for `globalsUpdated` (the preview announcing a change) missed it entirely,
 * because on a toolbar click the manager is the one doing the announcing.
 * `setGlobals` is the preview reporting what it booted with, `storyRendered`
 * catches a story that carries its own. They are idempotent; re-stamping the
 * same value costs nothing.
 *
 * The first paint is handled earlier still, in manager-head.html, so there is
 * no plum flash before any of this runs.
 */
addons.register("smarta/product-chrome", (api) => {
  const apply = (payload?: { globals?: Record<string, unknown> }) => {
    // The payload when there is one — on `updateGlobals` the store has not
    // necessarily caught up yet — and the API's own answer otherwise.
    const product = payload?.globals?.product ?? api.getGlobals?.()?.product;
    if (product === "webapp" || product === "backoffice") {
      document.documentElement.dataset.product = product;
    }
  };

  for (const event of [UPDATE_GLOBALS, GLOBALS_UPDATED, SET_GLOBALS, STORY_RENDERED]) {
    api.on(event, apply);
  }

  apply();
});
