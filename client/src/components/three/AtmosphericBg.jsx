import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';

function Shape({ position, rotSpeed, geoType }) {
  const ref = useRef();
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += rotSpeed[0] * delta;
    ref.current.rotation.y += rotSpeed[1] * delta;
    ref.current.rotation.z += rotSpeed[2] * delta;
  });

  const geo = geoType === 0 ? <octahedronGeometry args={[1]} />
            : geoType === 1 ? <icosahedronGeometry args={[1]} />
            : <dodecahedronGeometry args={[1]} />;

  return (
    <mesh ref={ref} position={position}>
      {geo}
      <meshBasicMaterial color="#C9A84C" wireframe opacity={0.25} transparent />
    </mesh>
  );
}

const shapes = Array.from({ length: 9 }, (_, i) => ({
  position: [MathUtils.randFloatSpread(20), MathUtils.randFloatSpread(14), MathUtils.randFloat(-15, -5)],
  rotSpeed: [MathUtils.randFloat(0.1, 0.4), MathUtils.randFloat(0.1, 0.5), MathUtils.randFloat(0.05, 0.3)],
  geoType:  i % 3,
  scale:    MathUtils.randFloat(0.6, 1.8),
}));

export default function AtmosphericBg({ className = 'absolute inset-0 -z-10' }) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }} gl={{ alpha: true }}>
        <fog attach="fog" args={['#050B1A', 10, 50]} />
        <ambientLight intensity={0.3} />
        {shapes.map((s, i) => (
          <group key={i} scale={s.scale}>
            <Shape position={s.position} rotSpeed={s.rotSpeed} geoType={s.geoType} />
          </group>
        ))}
      </Canvas>
    </div>
  );
}
