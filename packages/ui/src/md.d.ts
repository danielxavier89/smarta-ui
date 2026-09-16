/** Vite's ?raw suffix, so a .md rule file can be imported as a string. */
declare module "*.md?raw" {
  const content: string;
  export default content;
}
