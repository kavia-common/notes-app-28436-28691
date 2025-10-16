/**
 * Bridge file for JS consumers to use the TS implementation.
 * - Default export: axios instance `api`
 * - Also re-export all named functions from api.ts
 */
export { api as default } from "./api.ts";
export * from "./api.ts";
