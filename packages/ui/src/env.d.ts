/**
 * Just enough of `process.env` to guard a development-only warning.
 *
 * Not @types/node: this library runs in a browser, and pulling the Node globals
 * in would let `Buffer`, `__dirname` and `setImmediate` typecheck inside a
 * component, which is exactly the mistake the types are there to prevent.
 *
 * `process.env.NODE_ENV` is the one exception, and it is the convention React
 * itself uses. Webpack and Vite both substitute it at build time, so the
 * warning and the branch around it are removed from a production bundle.
 */
declare const process: {
  env: {
    NODE_ENV?: string;
  };
};
