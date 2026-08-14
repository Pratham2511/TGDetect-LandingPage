'use client';

/**
 * GraphCanvas — WebGL 3D Temporal Graph Network
 *
 * Forest-green color palette matching the deep-forest scheme.
 * 24 stable node positions (deterministic), 28 hand-picked edges.
 * Slow group rotation around Y, plus X-axis oscillation.
 * Per-node pulse scale based on threat/active state.
 * 300 ambient background particles drifting around Y axis.
 */

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Original V1 dark navy + electric blue/cyan palette
const COLORS = {
  nodeNormal: 0x1A6FFF,
  nodeThreat: 0xFF4444,
  nodeActive: 0x00D4FF,
  edgeInactive: 0x1A3060,
  edgeActive: 0x1A6FFF,
  edgeThreat: 0xFF4444,
  particles: 0x0A1E40,
  ambient: 0x1A6FFF,
  accent: 0x00D4FF,
};

// Stable node positions (same every render) — 24 nodes
const NODE_POSITIONS: [number, number, number][] = [
  [0, 1.5, 0],
  [-2.5, 0.5, -1],
  [2.5, 0.8, -0.5],
  [-1.5, -1.2, 0.5],
  [1.8, -0.8, 1],
  [0.5, 2.2, 1],
  [-3, 1.5, 0.5],
  [3, -0.2, -1],
  [-0.8, -2, 0],
  [2.2, 1.8, 0.5],
  [-2, -1.8, 1],
  [0.5, 0.5, 2],
  [-1, 2.5, -1],
  [2.5, -1.5, 0],
  [-2.5, -0.5, 0.5],
  [0, -2.5, 1],
  [1.5, 0, 2],
  [-1.5, 0.8, 2],
  [3, 1, 1],
  [-3, 0, -0.5],
  [0.8, -1.5, -1],
  [-1.8, 1.2, -0.8],
  [2, -0.5, -1.5],
  [-0.5, -1, 2],
];

// Edges: pairs of node indices
const EDGES: [number, number][] = [
  [0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 6], [5, 7], [6, 8],
  [7, 9], [8, 10], [9, 11], [10, 12], [11, 13], [0, 5], [2, 9],
  [1, 6], [4, 11], [3, 12], [7, 14], [13, 15], [14, 16], [15, 17],
  [16, 18], [17, 19], [18, 20], [19, 21], [20, 22], [21, 23],
];

// Threat and active nodes
const THREAT_NODES = new Set([4, 11, 17]);
const ACTIVE_NODES = new Set([0, 5, 9, 13, 20]);

function GraphNodes() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    // Slow group rotation
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.04;
      groupRef.current.rotation.x = Math.sin(t * 0.02) * 0.15;
    }
    // Pulse each node
    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const isThreat = THREAT_NODES.has(i);
      const isActive = ACTIVE_NODES.has(i);
      const freq = isThreat ? 3 : isActive ? 2 : 1.2;
      const amp = isThreat ? 0.25 : isActive ? 0.18 : 0.1;
      const s = 1 + Math.sin(t * freq + i * 0.7) * amp;
      mesh.scale.setScalar(s);
    });
  });

  return (
    <group ref={groupRef}>
      {/* Render nodes */}
      {NODE_POSITIONS.map((pos, i) => {
        const isThreat = THREAT_NODES.has(i);
        const isActive = ACTIVE_NODES.has(i);
        const color = isThreat ? COLORS.nodeThreat : isActive ? COLORS.nodeActive : COLORS.nodeNormal;
        const size = isThreat ? 0.09 : isActive ? 0.075 : 0.055;
        return (
          <mesh
            key={i}
            position={pos}
            ref={(el) => {
              meshRefs.current[i] = el;
            }}
          >
            <sphereGeometry args={[size, 16, 16]} />
            <meshBasicMaterial color={color} />
          </mesh>
        );
      })}
      {/* Render edges as line segments */}
      {EDGES.map(([a, b], i) => {
        const posA = new THREE.Vector3(...NODE_POSITIONS[a]);
        const posB = new THREE.Vector3(...NODE_POSITIONS[b]);
        const isThreatEdge = THREAT_NODES.has(a) || THREAT_NODES.has(b);
        const isActiveEdge = ACTIVE_NODES.has(a) || ACTIVE_NODES.has(b);
        const color = isThreatEdge ? COLORS.edgeThreat : isActiveEdge ? COLORS.edgeActive : COLORS.edgeInactive;
        const geo = new THREE.BufferGeometry().setFromPoints([posA, posB]);
        const mat = new THREE.LineBasicMaterial({
          color,
          opacity: isThreatEdge ? 0.8 : isActiveEdge ? 0.6 : 0.25,
          transparent: true,
        });
        const lineSeg = new THREE.LineSegments(geo, mat);
        return <primitive key={i} object={lineSeg} />;
      })}
    </group>
  );
}

function AmbientParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 300;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    // Use seeded random for deterministic particle positions
    let seed = 7777;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (rand() - 0.5) * 12;
      arr[i * 3 + 1] = (rand() - 0.5) * 12;
      arr[i * 3 + 2] = (rand() - 0.5) * 8;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.elapsedTime * 0.015;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={COLORS.particles}
        size={0.018}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export default function GraphCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 60 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 4, 4]} color={COLORS.ambient} intensity={1.5} />
      <pointLight position={[-4, -2, -4]} color={COLORS.accent} intensity={0.6} />
      <AmbientParticles />
      <GraphNodes />
    </Canvas>
  );
}
