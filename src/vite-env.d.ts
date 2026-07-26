/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

declare module "*.css";
declare module "*.scss";
declare module "*.sass";

declare module "*.svg" {
  const content: string;
  export default content;
}
