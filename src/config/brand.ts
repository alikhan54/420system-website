/**
 * brand.ts — single source of truth for the product name / URLs.
 *
 * A rename of "OMEGA" is planned. Every reference to the brand name, product
 * URL or phone number MUST read from here so the future rename is a one-file
 * change. Do NOT hard-code "OMEGA" / "heyomega.ai" anywhere else.
 */
export const BRAND = {
  name: 'OMEGA',
  url: 'https://heyomega.ai',
  phone: '+1 (404) 819-2917',
  // Convenience derivations (kept here so they rename in lockstep).
  get domain() {
    return this.url.replace(/^https?:\/\//, '')
  },
  tagline: 'The living system that thinks, acts, and reforms.',
} as const

export type Brand = typeof BRAND
