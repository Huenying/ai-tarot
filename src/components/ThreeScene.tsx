"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

const RADIUS = 15;
const CARD_W = 1.5;
const CARD_H = 2.35;

/* ------------------------------------------------------------------ */
/*  Single Card in the cylinder — always faces camera                  */
/* ------------------------------------------------------------------ */

function CylinderCard({
  angle,
  radius,
  isFocused,
}: {
  angle: number;
  radius: number;
  isFocused: boolean;
}) {
  const pivotRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const texture = useTexture("/images/card-cover.jpeg");

  useFrame((state) => {
    if (pivotRef.current) {
      // 1) All cards float in sync (same sin phase)
      pivotRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.15;

      // 2) Always face the camera (billboard)
      pivotRef.current.lookAt(state.camera.position);
    }
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.25 + Math.sin(state.clock.elapsedTime * 1.2) * 0.12;
    }
  });

  const x = radius * Math.sin(angle);
  const z = radius * Math.cos(angle);

  return (
    <group position={[x, 0, z]}>
      {/* Pivot group: position.y animated + lookAt camera */}
      <group ref={pivotRef}>
        {/* Glow behind focused card */}
        {isFocused && (
          <mesh ref={glowRef} position={[0, 0, -0.01]}>
            <planeGeometry args={[CARD_W + 0.15, CARD_H + 0.2]} />
            <meshBasicMaterial
              color="#E6C687"
              transparent
              opacity={0.35}
              depthWrite={false}
            />
          </mesh>
        )}

        {/* Card body */}
        <mesh>
          <planeGeometry args={[CARD_W, CARD_H]} />
          <meshBasicMaterial
            map={texture}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>

        {/* Gold border on focused card */}
        {isFocused && (
          <mesh position={[0, 0, 0.005]}>
            <planeGeometry args={[CARD_W + 0.05, CARD_H + 0.05]} />
            <meshBasicMaterial
              color="#E6C687"
              transparent
              opacity={0.15}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        )}
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Carousel Scene — rotates the whole cylinder                        */
/* ------------------------------------------------------------------ */

function CarouselScene({
  currentIndex,
  totalCards,
}: {
  currentIndex: number;
  totalCards: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Smooth rotation toward target
  const targetRotation = -currentIndex * ((2 * Math.PI) / totalCards);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y +=
        (targetRotation - groupRef.current.rotation.y) * Math.min(1, delta * 4);
    }
  });

  const cards = useMemo(
    () =>
      Array.from({ length: totalCards }, (_, i) => ({
        angle: (i / totalCards) * Math.PI * 2,
      })),
    [totalCards]
  );

  return (
    <group ref={groupRef}>
      {/* Subtle floor reflection ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]}>
        <ringGeometry args={[RADIUS - 3, RADIUS + 3, 64]} />
        <meshBasicMaterial
          color="#2B4C7E"
          transparent
          opacity={0.06}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {cards.map((c, i) => (
        <CylinderCard
          key={i}
          angle={c.angle}
          radius={RADIUS}
          isFocused={i === currentIndex}
        />
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Public wrapper                                                     */
/* ------------------------------------------------------------------ */

export default function ThreeScene({
  currentIndex,
  totalCards,
}: {
  currentIndex: number;
  totalCards: number;
}) {
  return (
    <Canvas
      camera={{ position: [0, 1.2, 28], fov: 40, near: 0.5, far: 65 }}
      gl={{ antialias: true, alpha: false }}
      style={{ width: "100%", height: "100%" }}
    >
      <color attach="background" args={["#F0EFF5"]} />

      <ambientLight intensity={0.6} />

      <CarouselScene currentIndex={currentIndex} totalCards={totalCards} />
    </Canvas>
  );
}
