import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Text3D, Center } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function VaultDoor() {
  const doorRef  = useRef();
  const dialRef  = useRef();

  useFrame((_, delta) => {
    if (dialRef.current) dialRef.current.rotation.z -= 0.5 * delta;
  });

  useEffect(() => {
    if (!doorRef.current) return;
    gsap.to(doorRef.current.rotation, {
      y: Math.PI / 2,
      scrollTrigger: { trigger: '#hero-section', start: 'top top', end: 'bottom center', scrub: 1.5 },
    });
  }, []);

  return (
    <group>
      <mesh ref={doorRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[1.8, 1.8, 0.4, 32]} />
        <meshStandardMaterial color="#C9A84C" metalness={0.95} roughness={0.05} />
      </mesh>
      <mesh ref={dialRef} position={[0, 0, 0.22]}>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 16]} />
        <meshStandardMaterial color="#F0C040" metalness={1} roughness={0.02} />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[Math.cos((i * Math.PI) / 2) * 1.2, Math.sin((i * Math.PI) / 2) * 1.2, 0.22]}>
          <cylinderGeometry args={[0.12, 0.12, 0.5, 8]} />
          <meshStandardMaterial color="#8B6914" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

function CurrencyParticle({ position }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + ((clock.elapsedTime * 0.5 + position[0]) % 6) - 3;
    ref.current.rotation.y += 0.02;
  });
  const symbols = ['$', '€', '£', '¥'];
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.05]} />
      <meshBasicMaterial color="#C9A84C" opacity={0.6} transparent />
    </mesh>
  );
}

const particles = Array.from({ length: 20 }, (_, i) => [
  (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4,
]);

export default function VaultScene({ className = 'w-full h-screen' }) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} shadows>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={2} color="#C9A84C" castShadow />
        <pointLight position={[-5, 3, 3]} intensity={1} color="#1A4B8B" />
        <Environment preset="city" />
        <VaultDoor />
        {particles.map((p, i) => <CurrencyParticle key={i} position={p} />)}
      </Canvas>
    </div>
  );
}
