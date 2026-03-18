import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Custom Float-like behavior using useFrame
function FloatingGroup({
  children,
  speed = 1,
  floatIntensity = 1,
}: {
  children: React.ReactNode;
  speed?: number;
  floatIntensity?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y += Math.sin(t * speed) * 0.002 * floatIntensity;
    ref.current.rotation.y += 0.001 * speed;
  });
  return <group ref={ref}>{children}</group>;
}

function GiftBox({
  position,
  size = 1,
  color,
  ribbonColor,
  speed = 1,
  floatIntensity = 1,
}: {
  position: [number, number, number];
  size?: number;
  color: string;
  ribbonColor: string;
  speed?: number;
  floatIntensity?: number;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.003 * speed;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5 * speed) * 0.05;
    const tiltX = pointer.y * 0.08;
    const tiltZ = -pointer.x * 0.08;
    meshRef.current.rotation.x += (tiltX - meshRef.current.rotation.x) * 0.02;
    meshRef.current.rotation.z += (tiltZ - meshRef.current.rotation.z) * 0.02;
  });

  const s = size * 0.5;

  return (
    <FloatingGroup speed={speed * 1.5} floatIntensity={floatIntensity}>
      <group ref={meshRef} position={position}>
        <mesh castShadow>
          <boxGeometry args={[s, s, s]} />
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
        </mesh>
        <mesh position={[0, s * 0.55, 0]} castShadow>
          <boxGeometry args={[s * 1.08, s * 0.15, s * 1.08]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.15} />
        </mesh>
        <mesh position={[0, s * 0.02, 0]}>
          <boxGeometry args={[s * 1.02, s * 0.08, s * 0.12]} />
          <meshStandardMaterial color={ribbonColor} roughness={0.2} metalness={0.3} />
        </mesh>
        <mesh position={[0, s * 0.02, 0]}>
          <boxGeometry args={[s * 0.12, s * 0.08, s * 1.02]} />
          <meshStandardMaterial color={ribbonColor} roughness={0.2} metalness={0.3} />
        </mesh>
        <mesh position={[0, s * 0.65, 0]}>
          <sphereGeometry args={[s * 0.12, 12, 12]} />
          <meshStandardMaterial color={ribbonColor} roughness={0.2} metalness={0.4} />
        </mesh>
      </group>
    </FloatingGroup>
  );
}

function Sparkle({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.scale.setScalar(0.5 + Math.sin(t * 3 + position[0]) * 0.3);
    if (ref.current.material) {
      (ref.current.material as THREE.MeshStandardMaterial).opacity =
        0.4 + Math.sin(t * 2 + position[1]) * 0.3;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshStandardMaterial
        color="#C8A96A"
        emissive="#C8A96A"
        emissiveIntensity={2}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

function ParallaxGroup({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!groupRef.current) return;
    const scrollY = window.scrollY || 0;
    groupRef.current.position.y = scrollY * 0.002;
  });
  return <group ref={groupRef}>{children}</group>;
}

function Scene() {
  const sparkles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        key: i,
        position: [
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 4 - 1,
        ] as [number, number, number],
      })),
    []
  );

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} castShadow />
      <pointLight position={[-3, 3, 2]} intensity={0.4} color="#C8A96A" />
      <hemisphereLight args={["#F5F0EB", "#E8D5B7", 0.4]} />

      <ParallaxGroup>
        <GiftBox position={[2.5, 0.8, -1]} size={1.4} color="#F5C6D0" ribbonColor="#C8A96A" speed={0.8} floatIntensity={1.2} />
        <GiftBox position={[-2.2, -0.5, -2]} size={1.1} color="#E8D5B7" ribbonColor="#B8860B" speed={1.2} floatIntensity={0.8} />
        <GiftBox position={[1, -1.2, -0.5]} size={0.9} color="#D4B8E0" ribbonColor="#C8A96A" speed={1} floatIntensity={1} />
        <GiftBox position={[-1.5, 1.2, -3]} size={0.7} color="#B5D8CC" ribbonColor="#8B7355" speed={0.6} floatIntensity={0.6} />
        <GiftBox position={[3.5, -0.8, -2.5]} size={0.6} color="#F8E8D0" ribbonColor="#C8A96A" speed={1.4} floatIntensity={0.9} />
        {sparkles.map((s) => (
          <Sparkle key={s.key} position={s.position} />
        ))}
      </ParallaxGroup>
    </>
  );
}

export default function HeroScene3D() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: "auto" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
