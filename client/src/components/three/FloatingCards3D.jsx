import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import { LOAN_TYPES } from '../../config/constants.js';

function LoanCard({ position, loanType, index }) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.6 + index) * 0.15;
    ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.3 + index * 0.5) * 0.15;
    ref.current.scale.setScalar(hovered ? 1.1 : 1);
  });

  const color = loanType.color;

  return (
    <group ref={ref} position={position} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <RoundedBox args={[1.4, 2, 0.08]} radius={0.05}>
        <meshPhysicalMaterial
          color="#0D1B3E" metalness={0.3} roughness={0.1}
          transmission={hovered ? 0.3 : 0.15} thickness={0.5}
          emissive={color} emissiveIntensity={hovered ? 0.3 : 0.05}
        />
      </RoundedBox>
      <Text position={[0, 0.55, 0.1]} fontSize={0.18} color="#C9A84C" anchorX="center" anchorY="middle" font="/fonts/Inter_Regular.json">
        {loanType.label}
      </Text>
      <Text position={[0, 0.15, 0.1]} fontSize={0.12} color="#A8A8C0" anchorX="center" anchorY="middle" maxWidth={1.1} textAlign="center">
        {`${loanType.minRate}% - ${loanType.maxRate}% p.a.`}
      </Text>
    </group>
  );
}

export default function FloatingCards3D({ className = 'w-full h-96' }) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#C9A84C" />
        <pointLight position={[-5, -5, 5]} intensity={0.8} color="#1A4B8B" />
        {LOAN_TYPES.map((lt, i) => (
          <LoanCard
            key={lt.value}
            loanType={lt}
            index={i}
            position={[(i - 1.5) * 1.7, 0, 0]}
          />
        ))}
      </Canvas>
    </div>
  );
}
