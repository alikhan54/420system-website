/** registry.ts — the 11 scene components in story order (index-aligned to OMEGA_SCENES). */
import type { ComponentType } from 'react'
import type { SceneProps } from './types'
import Scene01Meet from './Scene01Meet'
import Scene02Origin from './Scene02Origin'
import Scene03Mirror from './Scene03Mirror'
import Scene04Shift from './Scene04Shift'
import Scene05FourBrains from './Scene05FourBrains'
import Scene06LiveFeed from './Scene06LiveFeed'
import Scene07ADay from './Scene07ADay'
import Scene08Proof from './Scene08Proof'
import Scene09Exhale from './Scene09Exhale'
import Scene10Choice from './Scene10Choice'
import Scene11Door from './Scene11Door'

export const SCENE_COMPONENTS: ComponentType<SceneProps>[] = [
  Scene01Meet,
  Scene02Origin,
  Scene03Mirror,
  Scene04Shift,
  Scene05FourBrains,
  Scene06LiveFeed,
  Scene07ADay,
  Scene08Proof,
  Scene09Exhale,
  Scene10Choice,
  Scene11Door,
]
