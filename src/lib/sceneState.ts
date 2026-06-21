/**
 * sceneState.ts — the single activeScene AUTHORITY.
 *
 * A plain object (a ref, never React state). Written by ScrollTrigger
 * callbacks, read by `useFrame` inside the orb. Routing per-frame scroll
 * through React state defeats the render loop (r3f pitfalls / DESIGN_SYSTEM §6.1).
 *
 * Created once, shared by import.
 */
export const sceneState = {
  index: 0, // active scene integer (0-based)
  progress: 0, // 0→1 within the active scene
  global: 0, // 0→1 across the whole page
  transitioning: 0, // 0→1 transition energy (brightens the sphere during cuts)
}

export type SceneState = typeof sceneState
