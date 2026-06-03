import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MathUtils, AdditiveBlending, DoubleSide } from 'three';

/* ── Gold dust particles ─────────────────────────────────── */
function GoldDust({ count = 500 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = MathUtils.randFloatSpread(24);
      arr[i * 3 + 1] = MathUtils.randFloat(-6, 8);
      arr[i * 3 + 2] = MathUtils.randFloat(-14, 2);
    }
    return arr;
  }, [count]);

  useFrame(() => {
    const pos = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += 0.003 + Math.random() * 0.003;
      if (pos[i * 3 + 1] > 9) pos[i * 3 + 1] = -7;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#FFD700" transparent opacity={0.85} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/* ── Marble column ───────────────────────────────────────── */
function Column({ position }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    ref.current.rotation.z = Math.sin(clock.elapsedTime * 0.25 + position[0] * 0.5) * 0.003;
  });
  return (
    <group ref={ref} position={position}>
      {/* base plinth */}
      <mesh position={[0, -4.4, 0]}>
        <boxGeometry args={[0.9, 0.5, 0.9]} />
        <meshStandardMaterial color="#d8cfc0" roughness={0.85} metalness={0.05} />
      </mesh>
      {/* shaft */}
      <mesh>
        <cylinderGeometry args={[0.28, 0.32, 8.5, 24]} />
        <meshStandardMaterial color="#e8e0d2" roughness={0.75} metalness={0.08} />
      </mesh>
      {/* flutes (decorative rings) */}
      {[-3, -1, 1, 3].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <torusGeometry args={[0.29, 0.02, 8, 24]} />
          <meshStandardMaterial color="#c8bfb0" roughness={0.8} />
        </mesh>
      ))}
      {/* capital */}
      <mesh position={[0, 4.6, 0]}>
        <boxGeometry args={[0.95, 0.5, 0.95]} />
        <meshStandardMaterial color="#f0eadc" roughness={0.7} />
      </mesh>
      <mesh position={[0, 4.25, 0]}>
        <cylinderGeometry args={[0.42, 0.3, 0.4, 16]} />
        <meshStandardMaterial color="#e4dece" roughness={0.7} />
      </mesh>
    </group>
  );
}

/* ── Grand staircase ─────────────────────────────────────── */
function Staircase() {
  const steps = [
    { y: -5.4, scale: [14, 0.3, 4] },
    { y: -5.1, scale: [12, 0.3, 3.5] },
    { y: -4.8, scale: [10, 0.3, 3] },
    { y: -4.5, scale: [8.5, 0.3, 2.5] },
  ];
  return (
    <>
      {steps.map((s, i) => (
        <mesh key={i} position={[0, s.y, 1]}>
          <boxGeometry args={s.scale} />
          <meshStandardMaterial color="#ddd4c4" roughness={0.9} metalness={0.05} />
        </mesh>
      ))}
      {/* platform */}
      <mesh position={[0, -4.25, -0.5]}>
        <boxGeometry args={[16, 0.4, 6]} />
        <meshStandardMaterial color="#cec5b5" roughness={0.88} />
      </mesh>
    </>
  );
}

/* ── Pediment / triangle roof ────────────────────────────── */
function Pediment() {
  return (
    <group position={[0, 6.5, -2]}>
      {/* horizontal entablature */}
      <mesh position={[0, -0.8, 0]}>
        <boxGeometry args={[14, 0.5, 1.2]} />
        <meshStandardMaterial color="#e0d8c8" roughness={0.8} />
      </mesh>
      {/* left slope */}
      <mesh position={[-3.5, 0.6, 0]} rotation={[0, 0, Math.PI / 5.5]}>
        <boxGeometry args={[8.4, 0.35, 1.1]} />
        <meshStandardMaterial color="#ece4d4" roughness={0.75} />
      </mesh>
      {/* right slope */}
      <mesh position={[3.5, 0.6, 0]} rotation={[0, 0, -Math.PI / 5.5]}>
        <boxGeometry args={[8.4, 0.35, 1.1]} />
        <meshStandardMaterial color="#ece4d4" roughness={0.75} />
      </mesh>
    </group>
  );
}

/* ── Volumetric light beams ─────────────────────────────── */
function LightBeam({ position, rotZ = 0 }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    ref.current.material.opacity = 0.04 + Math.sin(clock.elapsedTime * 0.7 + rotZ) * 0.015;
  });
  return (
    <mesh ref={ref} position={position} rotation={[0.15, 0, rotZ]}>
      <coneGeometry args={[2.2, 16, 6, 1, true]} />
      <meshBasicMaterial
        color="#FFD700" transparent opacity={0.05}
        side={DoubleSide} depthWrite={false} blending={AdditiveBlending}
      />
    </mesh>
  );
}

/* ── Floating gold coins ─────────────────────────────────── */
function FloatingCoin({ position, speed, phase }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed + phase;
    ref.current.position.y = position[1] + Math.sin(t) * 0.4;
    ref.current.rotation.y += 0.02;
    ref.current.rotation.x = Math.sin(t * 0.5) * 0.3;
  });
  return (
    <mesh ref={ref} position={position}>
      <cylinderGeometry args={[0.22, 0.22, 0.04, 32]} />
      <meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.08} emissive="#B8860B" emissiveIntensity={0.3} />
    </mesh>
  );
}

/* ── Camera cinematic entrance zoom ─────────────────────── */
function CameraRig() {
  const { camera } = useThree();
  const startRef = useRef(false);
  useFrame(({ clock }) => {
    if (!startRef.current) { camera.position.set(0, 1, 13); startRef.current = true; }
    const t = Math.min(clock.elapsedTime / 5, 1);
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    camera.position.z = 13 - ease * 4;     // zooms from z=13 → z=9 (entering effect)
    camera.position.y = 1 - ease * 0.3;
    camera.lookAt(0, 0.5, 0);
  });
  return null;
}

/* ── Full scene ──────────────────────────────────────────── */
function Scene() {
  const columnPositions = [
    [-5, 0, -1], [-2.8, 0, -1], [2.8, 0, -1], [5, 0, -1],
    [-6.2, 0, -3], [6.2, 0, -3],
  ];
  const coins = [
    { position: [-2.5, 1, 1],   speed: 0.6, phase: 0 },
    { position: [2.5,  0.5, 1], speed: 0.5, phase: 2.1 },
    { position: [0,    2, 0.5], speed: 0.7, phase: 1.1 },
    { position: [-4,   0, -0.5], speed: 0.4, phase: 3.2 },
    { position: [4,    1.2, -0.5], speed: 0.55, phase: 0.8 },
  ];

  return (
    <>
      <CameraRig />

      {/* Ambient + directional warm lighting */}
      <ambientLight intensity={0.35} color="#fff5e4" />
      <directionalLight position={[0, 12, 4]} intensity={1.8} color="#FFF8DC" castShadow />
      <directionalLight position={[-8, 6, 2]} intensity={0.6} color="#FFD700" />
      <directionalLight position={[8, 6, 2]}  intensity={0.6} color="#FFD700" />
      <pointLight position={[0, 8, 2]} intensity={2.5} color="#FFD700" distance={25} />
      <pointLight position={[-5, 3, 3]} intensity={1.2} color="#FF9500" distance={15} />
      <pointLight position={[5, 3, 3]}  intensity={1.2} color="#FF9500" distance={15} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.6, 0]}>
        <planeGeometry args={[40, 30]} />
        <meshStandardMaterial color="#b8ae9e" roughness={0.95} metalness={0.02} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 2, -7]}>
        <planeGeometry args={[26, 20]} />
        <meshStandardMaterial color="#d0c8b8" roughness={0.9} />
      </mesh>

      {/* Columns */}
      {columnPositions.map((pos, i) => <Column key={i} position={pos} />)}

      {/* Architecture */}
      <Staircase />
      <Pediment />

      {/* Light beams from above */}
      <LightBeam position={[-3, 8, -2]}   rotZ={-0.15} />
      <LightBeam position={[0,  9, -1.5]} rotZ={0} />
      <LightBeam position={[3,  8, -2]}   rotZ={0.15} />

      {/* Gold dust */}
      <GoldDust count={600} />

      {/* Floating coins */}
      {coins.map((c, i) => <FloatingCoin key={i} {...c} />)}

      {/* Fog for depth */}
      <fog attach="fog" args={['#080414', 18, 35]} />
    </>
  );
}

export default function BankEntranceScene({ className = 'w-full h-full' }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 1, 13], fov: 52 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        shadows
      >
        <Scene />
      </Canvas>
    </div>
  );
}
