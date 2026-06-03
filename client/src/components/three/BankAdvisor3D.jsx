import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import { MathUtils, AdditiveBlending } from 'three';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Gold particle halo ───────────────────────────────────── */
function Particles({ count = 120 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r     = 1.2 + Math.random() * 0.8;
      arr[i * 3]     = Math.cos(angle) * r;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 3;
      arr[i * 3 + 2] = Math.sin(angle) * r;
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * 0.2;
    const pos = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += 0.004;
      if (pos[i * 3 + 1] > 1.8) pos[i * 3 + 1] = -1.8;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#FFD700" transparent opacity={0.7}
        sizeAttenuation depthWrite={false} blending={AdditiveBlending} />
    </points>
  );
}

/* ── Eyes with blink ─────────────────────────────────────── */
function Eye({ x }) {
  const ref = useRef();
  const blinkTimer = useRef(Math.random() * 4);

  useFrame(({ clock }) => {
    blinkTimer.current -= 0.016;
    if (blinkTimer.current <= 0) {
      const elapsed = -blinkTimer.current;
      ref.current.scale.y = elapsed < 0.08 ? 0.05 : 1;
      if (elapsed > 0.15) blinkTimer.current = 3 + Math.random() * 3;
    }
  });

  return (
    <group>
      <mesh ref={ref} position={[x, 0.1, 0.44]}>
        <sphereGeometry args={[0.072, 16, 16]} />
        <meshStandardMaterial color="#1a1040" />
      </mesh>
      {/* shine */}
      <mesh position={[x + 0.025, 0.13, 0.49]}>
        <sphereGeometry args={[0.018, 8, 8]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  );
}

/* ── Eyebrow ─────────────────────────────────────────────── */
function Eyebrow({ x, mood }) {
  const rotZ = mood === 'concerned' ? (x < 0 ? 0.3 : -0.3)
             : mood === 'happy'     ? (x < 0 ? -0.2 : 0.2)
             : 0;
  return (
    <mesh position={[x, 0.26, 0.43]} rotation={[0, 0, rotZ]}>
      <boxGeometry args={[0.15, 0.025, 0.025]} />
      <meshStandardMaterial color="#5a3010" />
    </mesh>
  );
}

/* ── Talking mouth ───────────────────────────────────────── */
function Mouth({ talking, mood }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    if (talking) {
      ref.current.scale.y = 0.6 + Math.abs(Math.sin(clock.elapsedTime * 10)) * 1.2;
    } else {
      ref.current.scale.y = MathUtils.lerp(ref.current.scale.y, 1, 0.1);
    }
    // Smile vs frown
    const targetZ = mood === 'happy' ? 0.06 : mood === 'concerned' ? -0.05 : 0;
    ref.current.position.y = MathUtils.lerp(ref.current.position.y, targetZ - 0.14, 0.05);
  });
  return (
    <mesh ref={ref} position={[0, -0.14, 0.46]}>
      <torusGeometry args={[0.1, 0.022, 8, 20, Math.PI]} />
      <meshStandardMaterial color="#c05060" />
    </mesh>
  );
}

/* ── Full character ──────────────────────────────────────── */
function Banker({ talking, mood }) {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    groupRef.current.position.y = Math.sin(t * 0.7) * 0.06;
    groupRef.current.rotation.y = Math.sin(t * 0.25) * 0.08;
    groupRef.current.rotation.z = Math.sin(t * 0.4) * 0.02;
  });

  return (
    <group ref={groupRef}>
      {/* ── Head ──────────────────────── */}
      <group position={[0, 0.9, 0]}>
        {/* Face */}
        <mesh>
          <sphereGeometry args={[0.48, 32, 32]} />
          <meshStandardMaterial color="#F5C98A" roughness={0.5} metalness={0.05} />
        </mesh>
        {/* Hair */}
        <mesh position={[0, 0.3, -0.1]} scale={[1, 0.5, 1]}>
          <sphereGeometry args={[0.5, 32, 16]} />
          <meshStandardMaterial color="#2a1505" roughness={0.9} />
        </mesh>
        {/* Sideburns */}
        {[-0.43, 0.43].map((x, i) => (
          <mesh key={i} position={[x, -0.1, 0.1]} scale={[0.5, 0.8, 0.5]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#2a1505" roughness={0.9} />
          </mesh>
        ))}
        {/* Ears */}
        {[-0.48, 0.48].map((x, i) => (
          <mesh key={i} position={[x, 0.02, 0]} scale={[0.3, 0.45, 0.3]}>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshStandardMaterial color="#E8B070" roughness={0.5} />
          </mesh>
        ))}
        {/* Eyes */}
        <Eye x={-0.17} />
        <Eye x={0.17} />
        {/* Eyebrows */}
        <Eyebrow x={-0.17} mood={mood} />
        <Eyebrow x={0.17}  mood={mood} />
        {/* Nose */}
        <mesh position={[0, -0.02, 0.47]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color="#E0A060" roughness={0.6} />
        </mesh>
        {/* Mouth */}
        <Mouth talking={talking} mood={mood} />
      </group>

      {/* ── Neck ──────────────────────── */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.14, 0.16, 0.32, 16]} />
        <meshStandardMaterial color="#E8B070" roughness={0.5} />
      </mesh>

      {/* ── Shirt collar ──────────────── */}
      <mesh position={[0, 0.2, 0.1]}>
        <boxGeometry args={[0.5, 0.2, 0.3]} />
        <meshStandardMaterial color="#F8F8F8" roughness={0.6} />
      </mesh>

      {/* ── Suit body ─────────────────── */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.44, 0.5, 1.3, 20]} />
        <meshStandardMaterial color="#12184A" roughness={0.7} metalness={0.15} />
      </mesh>

      {/* ── Lapels ────────────────────── */}
      {[-0.18, 0.18].map((x, i) => (
        <mesh key={i} position={[x, 0.05, 0.42]} rotation={[0, 0, i === 0 ? 0.35 : -0.35]}>
          <boxGeometry args={[0.15, 0.4, 0.04]} />
          <meshStandardMaterial color="#1a2260" roughness={0.6} />
        </mesh>
      ))}

      {/* ── Gold tie ──────────────────── */}
      <mesh position={[0, -0.15, 0.44]}>
        <boxGeometry args={[0.08, 0.7, 0.02]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.5} roughness={0.3} emissive="#8B6914" emissiveIntensity={0.2} />
      </mesh>
      {/* Tie knot */}
      <mesh position={[0, 0.2, 0.45]}>
        <boxGeometry args={[0.1, 0.08, 0.04]} />
        <meshStandardMaterial color="#B8960A" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* ── Suit badge/pin ─────────────── */}
      <mesh position={[-0.28, 0.0, 0.43]}>
        <cylinderGeometry args={[0.03, 0.03, 0.02, 16]} />
        <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} emissive="#D4AF37" emissiveIntensity={0.4} />
      </mesh>

      {/* ── Shoulders ─────────────────── */}
      {[-0.5, 0.5].map((x, i) => (
        <mesh key={i} position={[x, 0.05, 0]} scale={[1, 0.7, 0.9]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#12184A" roughness={0.7} metalness={0.15} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Scene wrapper ───────────────────────────────────────── */
function Scene({ talking, mood }) {
  return (
    <>
      <ambientLight intensity={0.6} color="#fff5e4" />
      <directionalLight position={[2, 4, 3]} intensity={1.8} color="#FFF8DC" />
      <pointLight position={[-2, 2, 2]} intensity={1.0} color="#D4AF37" distance={8} />
      <pointLight position={[0, -1, 3]} intensity={0.5} color="#4060FF" distance={6} />
      <Particles />
      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
        <Banker talking={talking} mood={mood} />
      </Float>
    </>
  );
}

/* ── Speech bubble ───────────────────────────────────────── */
function SpeechBubble({ message, mood }) {
  const [displayed, setDisplayed] = useState('');
  const [typing,    setTyping]    = useState(false);

  useEffect(() => {
    setTyping(true);
    setDisplayed('');
    const delay  = setTimeout(() => {
      setTyping(false);
      setDisplayed(message);
    }, 900);
    return () => clearTimeout(delay);
  }, [message]);

  const borderColor = mood === 'happy' ? '#0F9B6E' : mood === 'concerned' ? '#D4AF37' : mood === 'warning' ? '#C87800' : '#1A5BAB';

  return (
    <div className="relative w-full max-w-[280px] mx-auto">
      <motion.div
        className="rounded-sm p-4 text-sm relative"
        style={{ background: 'rgba(14,16,53,0.9)', border: `1px solid ${borderColor}40`, backdropFilter: 'blur(12px)' }}
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0,  scale: 1 }}
        key={message}>
        {/* Mood indicator dot */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: borderColor }} />
          <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: borderColor }}>
            {mood === 'happy' ? 'Great News' : mood === 'concerned' ? 'Advisor Note' : mood === 'warning' ? 'Watch Out' : 'Analysis'}
          </span>
        </div>

        {typing ? (
          <div className="flex gap-1 py-1">
            {[0, 1, 2].map(i => (
              <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-gold-primary"
                animate={{ y: [0, -5, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }} />
            ))}
          </div>
        ) : (
          <AnimatePresence>
            <motion.p className="text-platinum text-xs leading-relaxed"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              {displayed}
            </motion.p>
          </AnimatePresence>
        )}

        {/* Tail pointing down toward character */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
          style={{ background: 'rgba(14,16,53,0.9)', borderRight: `1px solid ${borderColor}40`, borderBottom: `1px solid ${borderColor}40` }} />
      </motion.div>
    </div>
  );
}

/* ── Main export ─────────────────────────────────────────── */
export default function BankAdvisor3D({ message, mood = 'neutral' }) {
  const [talking, setTalking] = useState(false);

  useEffect(() => {
    setTalking(true);
    const timer = setTimeout(() => setTalking(false), 2800);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Speech bubble above character */}
      <SpeechBubble message={message} mood={mood} />

      {/* 3D Canvas */}
      <div className="w-full" style={{ height: 340 }}>
        <Canvas camera={{ position: [0, 0.3, 3.8], fov: 42 }} dpr={[1, 1.5]}>
          <Scene talking={talking} mood={mood} />
        </Canvas>
      </div>

      {/* Name plate */}
      <div className="text-center">
        <p className="text-gold-pale text-xs font-semibold tracking-wider">Alex — Financial Advisor</p>
        <p className="text-muted text-[10px] tracking-[0.2em]">PREMIER BANK</p>
      </div>
    </div>
  );
}
