import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { MathUtils, BufferGeometry, Float32BufferAttribute, LineSegments, LineBasicMaterial } from 'three';

function Particles() {
  const ref = useRef();
  const count = 400;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) pos[i] = MathUtils.randFloatSpread(30);
    return pos;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += 0.02 * delta;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#C9A84C" transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

export default function ParticleNetwork({ className = 'absolute inset-0 -z-10 opacity-60' }) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 20], fov: 50 }}>
        <Particles />
      </Canvas>
    </div>
  );
}
