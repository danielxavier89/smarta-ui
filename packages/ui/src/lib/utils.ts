import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge has to know about the prefix, or it treats `sui:px-4` and
 * `sui:px-2` as two unrelated classes and keeps both — and then the one that
 * wins is whichever Tailwind happened to emit later, which is not the one the
 * caller passed.
 */
const twMerge = extendTailwindMerge({ prefix: "sui" });

/**
 * Merge class names, letting the later of two conflicting utilities win.
 *
 * This is how the library composes itself: a variant's classes, then a size's,
 * then whatever one of our components passes to another. `sui:rounded-md` then
 * `sui:rounded-full` leaves only the second, rather than emitting both and
 * hoping about source order.
 *
 * What it is NOT, any more, is the way a product restyles a component. Every
 * utility here is `sui:`-prefixed and only the ones our own sources use are in
 * the stylesheet, so a product's own `rounded-full` is a different class from a
 * different stylesheet and tailwind-merge rightly leaves it alone. To restyle a
 * component, a product writes its own CSS — see "Overriding a component" in the
 * README for why that needs one more class of specificity than it used to.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
