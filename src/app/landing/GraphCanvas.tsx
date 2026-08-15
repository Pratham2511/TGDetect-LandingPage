'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const NODE_POS: [number, number, number][] = [
  [0,1.5,0],[-2.5,0.5,-1],[2.5,0.8,-0.5],[-1.5,-1.2,0.5],[1.8,-0.8,1],
  [0.5,2.2,1],[-3,1.5,0.5],[3,-0.2,-1],[-0.8,-2,0],[2.2,1.8,0.5],
  [-2,-1.8,1],[0.5,0.5,2],[-1,2.5,-1],[2.5,-1.5,0],[-2.5,-0.5,0.5],
  [0,-2.5,1],[1.5,0,2],[-1.5,0.8,2],[3,1,1],[-3,0,-0.5],
  [0.8,-1.5,-1],[-1.8,1.2,-0.8],[2,-0.5,-1.5],[-0.5,-1,2],
];

const EDGES: [number, number][] = [
  [0,1],[0,2],[1,3],[2,4],[3,5],[4,6],[5,7],[6,8],[7,9],[8,10],
  [9,11],[10,12],[11,13],[0,5],[2,9],[1,6],[4,11],[3,12],
  [7,14],[13,15],[14,16],[15,17],[16,18],[17,19],[18,20],[19,21],[20,22],[21,23],
];

const THREAT = new Set([4, 11, 17]);
const ACTIVE = new Set([0, 5, 9, 13, 20]);

function Scene() {
  const groupRef = useRef<THREE.Group>(null!);
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const ringRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock, mouse }) => {
    const t = clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y, mouse.x * 0.4, 0.04
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mouse.y * 0.2 + Math.sin(t * 0.02) * 0.1,
        0.04
      );
    }
    meshRefs.current.forEach((m, i) => {
      if (!m) return;
      const freq = THREAT.has(i) ? 2.5 : ACTIVE.has(i) ? 1.8 : 1.0;
      const amp = THREAT.has(i) ? 0.22 : 0.08;
      const s = 1 + Math.sin(t * freq + i * 0.7) * amp;
      m.scale.setScalar(s);
    });
    ringRefs.current.forEach((r, i) => {
      if (!r) return;
      const s = 1 + ((t * 0.8 + i) % 1) * 3;
      const o = 1 - ((t * 0.8 + i) % 1);
      r.scale.setScalar(s);
      (r.material as THREE.MeshBasicMaterial).opacity = o * 0.5;
    });
  });

  const edgeObjects = useMemo(() => EDGES.map(([a, b]) => {
    const pA = new THREE.Vector3(...NODE_POS[a]);
    const pB = new THREE.Vector3(...NODE_POS[b]);
    const isThreat = THREAT.has(a) || THREAT.has(b);
    const isActive = ACTIVE.has(a) || ACTIVE.has(b);
    const color = isThreat ? 0xFF6B35 : isActive ? 0x6C63FF : 0x1A1640;
    const opacity = isThreat ? 0.8 : isActive ? 0.55 : 0.2;
    const geo = new THREE.BufferGeometry().setFromPoints([pA, pB]);
    const mat = new THREE.LineBasicMaterial({ color, opacity, transparent: true });
    return new THREE.LineSegments(geo, mat);
  }), []);

  const particlePositions = useMemo(() => {
    const arr = new Float32Array(400 * 3);
    for (let i = 0; i < 400; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, []);

  return (
    <group ref={groupRef}>
      {NODE_POS.map((pos, i) => {
        const color = THREAT.has(i) ? 0xFF6B35 : ACTIVE.has(i) ? 0x00F5FF : 0x6C63FF;
        const size = THREAT.has(i) ? 0.1 : ACTIVE.has(i) ? 0.08 : 0.06;
        return (
          <group key={i} position={pos}>
            <mesh ref={(el) => { meshRefs.current[i] = el; }}>
              <sphereGeometry args={[size, 16, 16]} />
              <meshBasicMaterial color={color} />
            </mesh>
            {THREAT.has(i) && (
              <mesh ref={(el) => { ringRefs.current[i] = el; }}>
                <ringGeometry args={[0.12, 0.15, 32]} />
                <meshBasicMaterial color={0xFF6B35} transparent opacity={0.5} side={THREE.DoubleSide} />
              </mesh>
            )}
          </group>
        );
      })}
      {edgeObjects.map((obj, i) => <primitive key={i} object={obj} />)}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={particlePositions} count={400} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color={0x1A1640} size={0.014} transparent opacity={0.5} />
      </points>
    </group>
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
      <ambientLight intensity={0.3} />
      <pointLight position={[4, 4, 4]} color={0x6C63FF} intensity={1.8} />
      <pointLight position={[-4, -2, -4]} color={0x00F5FF} intensity={0.8} />
      <pointLight position={[0, 0, 6]} color={0xB84DFF} intensity={0.5} />
      <Scene />
    </Canvas>
  );
}
