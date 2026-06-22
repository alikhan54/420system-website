import type { OmegaScene } from '../../../design/scenePalette'

export interface SceneProps {
  scene: OmegaScene
  onActivate: (s: OmegaScene) => void
}
