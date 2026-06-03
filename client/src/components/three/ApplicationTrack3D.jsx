import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Text } from '@react-three/drei';
import { MathUtils } from 'three';

const STATIONS = ['Submitted', 'Under Review', 'Approved', 'Disbursed'];

function Track({ currentStep }) {
  const capsuleRef = useRef();
  const targetY = -1.5 + currentStep * 1;

  useFrame(() => {
    if (capsuleRef.current) {
      capsuleRef.current.position.y = MathUtils.lerp(capsuleRef.current.position.y, targetY, 0.05);
    }
  });

  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 4.5, 8]} />
        <meshStandardMaterial color="#1A2D5A" />
      </mesh>
      {STATIONS.map((name, i) => {
        const y = -1.5 + i * 1;
        const done = i <= currentStep;
        return (
          <group key={name} position={[0, y, 0]}>
            <Sphere args={[0.15, 16, 16]}>
              <meshStandardMaterial color={done ? '#C9A84C' : '#1A2D5A'} emissive={done ? '#C9A84C' : '#000'} emissiveIntensity={done ? 0.5 : 0} />
            </Sphere>
            <Text position={[0.35, 0, 0]} fontSize={0.12} color={done ? '#C9A84C' : '#5A5A7A'} anchorX="left">
              {name}
            </Text>
            {done && <pointLight position={[0, 0, 0.2]} intensity={0.5} color="#C9A84C" distance={1} />}
          </group>
        );
      })}
      <mesh ref={capsuleRef} position={[0, targetY, 0.2]}>
        <sphereGeometry args={[0.08]} />
        <meshStandardMaterial color="#F0C040" emissive="#F0C040" emissiveIntensity={1} />
      </mesh>
    </group>
  );
}

export default function ApplicationTrack3D({ currentStep = 0, className = 'w-full h-80' }) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [1, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <Track currentStep={currentStep} />
      </Canvas>
    </div>
  );
}
