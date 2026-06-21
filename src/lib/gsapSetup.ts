/**
 * gsapSetup.ts — single GSAP registration point, imported once by the app root.
 *
 * ⚠ useGSAP is itself registered as a plugin; ScrollTrigger must be registered
 * too, or the #1 bug appears: "scrollTrigger config silently ignored".
 *
 * GSAP 3.13+ ships ScrollTrigger / Flip / CustomEase for FREE. We only register
 * ScrollTrigger + useGSAP here (the scaffold needs nothing else). Lenis and
 * ScrollSmoother are intentionally NOT used (scroll-jacking is banned).
 *
 * Vite SPA → no 'use client' / SSR guards needed.
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export { gsap, ScrollTrigger, useGSAP }
