/**
 * morphShapes.ts — the per-scene morph target geometry (the heart of Phase 2).
 *
 * One persistent particle system transforms between four NAMED shapes as the
 * story advances. All shapes are built at the SAME particle count and share the
 * same index ordering as the base Fibonacci sphere, so `mix(aMorphA, aMorphB, u)`
 * in the vertex shader moves each individual particle 1:1 from its old place to
 * its new one — the viewer literally sees the orb become a brain, then streams.
 *
 *   sphere   — the resting intelligence (= the base Fibonacci positions)
 *   mesh     — neural network: clustered nodes + dense connecting strands (a brain)
 *   streams  — directed outward currents (the orb "working")
 *   scatter  — a diffuse cloud that re-forms into the sphere (intelligence assembling)
 *
 * Deterministic (seeded PRNG) so the shapes are identical every mount.
 */
import * as THREE from 'three'

export type MorphKey = 'sphere' | 'mesh' | 'streams' | 'scatter'

export interface MorphShapes {
  sphere: Float32Array
  mesh: Float32Array
  streams: Float32Array
  scatter: Float32Array
}

/** mulberry32 — tiny deterministic PRNG (stable shapes, no Math.random drift). */
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Fibonacci-lattice points on a unit sphere — even directions for nodes/streams. */
function fibPoints(n: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / Math.max(1, n - 1)) * 2
    const r = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = golden * i
    pts.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r))
  }
  return pts
}

/** A stable perpendicular to v (for tangential curl). */
function perp(v: THREE.Vector3): THREE.Vector3 {
  const ref = Math.abs(v.y) < 0.92 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0)
  return new THREE.Vector3().crossVectors(v, ref).normalize()
}

/**
 * Build all four shape buffers. `sphere` is supplied (the geometry's base
 * positions) so the sphere target is bit-identical to `position`.
 */
export function buildMorphShapes(count: number, radius: number, sphere: Float32Array): MorphShapes {
  const rand = mulberry32(0xc0ffee)
  const gauss = () => (rand() + rand() + rand() - 1.5) // ~N(0, .5), cheap

  // ---- mesh (neural brain): ~16 nodes near the surface + connecting strands ----
  const NODES = 16
  const nodes = fibPoints(NODES).map((d) => d.clone().multiplyScalar(radius * (0.78 + rand() * 0.16)))
  // each node's 3 nearest neighbours → the bridges
  const neighbors: number[][] = nodes.map((n, a) =>
    nodes
      .map((m, b) => ({ b, d: a === b ? Infinity : n.distanceTo(m) }))
      .sort((x, y) => x.d - y.d)
      .slice(0, 3)
      .map((o) => o.b),
  )

  const mesh = new Float32Array(count * 3)
  const v = new THREE.Vector3()
  for (let i = 0; i < count; i++) {
    const a = i % NODES
    if (rand() < 0.6) {
      // cluster cloud around a node (the "grey matter")
      v.copy(nodes[a]).add(new THREE.Vector3(gauss(), gauss(), gauss()).multiplyScalar(0.34))
    } else {
      // strand along a node→neighbour bridge (the "white matter")
      const b = neighbors[a][i % 3]
      const t = rand()
      v.copy(nodes[a]).lerp(nodes[b], t)
      v.add(new THREE.Vector3(gauss(), gauss(), gauss()).multiplyScalar(0.055))
    }
    mesh[i * 3] = v.x
    mesh[i * 3 + 1] = v.y
    mesh[i * 3 + 2] = v.z
  }

  // ---- streams (directed outward currents): ~7 currents fanning + curling out ----
  const STREAMS = 7
  const dirs = fibPoints(STREAMS)
  const tans = dirs.map((d) => perp(d))
  const perStream = count / STREAMS
  const streams = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const s = i % STREAMS
    const along = Math.floor(i / STREAMS) / perStream // 0 → ~1, distance along the current
    const rad = radius * (0.18 + along * 1.35)
    const phase = s * 1.3
    const curl = Math.sin(along * Math.PI * 1.6 + phase) * along * radius * 0.5
    v.copy(dirs[s]).multiplyScalar(rad).addScaledVector(tans[s], curl)
    v.x += gauss() * 0.09
    v.y += gauss() * 0.09
    v.z += gauss() * 0.09
    streams[i * 3] = v.x
    streams[i * 3 + 1] = v.y
    streams[i * 3 + 2] = v.z
  }

  // ---- scatter (diffuse cloud, uniform in a ball) → re-forms into the sphere ----
  const scatter = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const u = rand() * 2 - 1
    const phi = rand() * Math.PI * 2
    const r = Math.cbrt(rand()) * radius * 1.85
    const sq = Math.sqrt(Math.max(0, 1 - u * u))
    scatter[i * 3] = Math.cos(phi) * sq * r
    scatter[i * 3 + 1] = u * r
    scatter[i * 3 + 2] = Math.sin(phi) * sq * r
  }

  return { sphere, mesh, streams, scatter }
}
