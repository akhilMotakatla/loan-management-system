import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { MathUtils } from 'three';

function Donut({ principalPct, total }) {
  const principalRef = useRef();
  const interestRef  = useRef();

  useFrame((_, delta) => {
    if (principalRef.current) principalRef.current.rotation.z += 0.003;
    if (interestRef.current)  interestRef.current.rotation.z  -= 0.002;
  });

  return (
    <group>
      <mesh ref={principalRef}>
        <torusGeometry args={[1.5, 0.4, 16, 100, principalPct * Math.PI * 2]} />
        <meshStandardMaterial color="#C9A84C" metalness={0.7} roughness={0.2} />
      </mesh>
      <mesh ref={interestRef} rotation={[0, 0, principalPct * Math.PI * 2]}>
        <torusGeometry args={[1.5, 0.4, 16, 100, (1 - principalPct) * Math.PI * 2]} />
        <meshStandardMaterial color="#1A4B8B" metalness={0.5} roughness={0.3} />
      </mesh>
      <Text position={[0, 0.2, 0]} fontSize={0.3} color="#E8E8F0" anchorX="center">
        {`$${(total || 0).toLocaleString()}`}
      </Text>
      <Text position={[0, -0.2, 0]} fontSize={0.18} color="#A8A8C0" anchorX="center">
        Total Payment
      </Text>
    </group>
  );
}

export default function DonutChart3D({ principal = 100000, totalPayment = 120000, className = 'w-full h-72' }) {
  const principalPct = totalPayment > 0 ? principal / totalPayment : 0.8;
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[3, 3, 3]} intensity={1.5} color="#C9A84C" />
        <Donut principalPct={principalPct} total={totalPayment} />
      </Canvas>
    </div>
  );
}
