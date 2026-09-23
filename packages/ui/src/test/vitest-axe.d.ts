/**
 * vitest-axe ships matchers but no ambient types for them, so `expect(...)
 * .toHaveNoViolations()` typechecks as a missing property. Declaring it here
 * keeps the a11y suite inside `npm run typecheck` rather than excluded from it.
 */
import "vitest";

interface AxeMatchers<R = unknown> {
  toHaveNoViolations(): R;
}

declare module "vitest" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Assertion<T = any> extends AxeMatchers<T> {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}
