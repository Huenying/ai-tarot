"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { withBasePath } from "@/lib/config";

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
  holdProgress,
}: {
  angle: number;
  radius: number;
  isFocused: boolean;
  holdProgress: number;
}) {
  const pivotRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const texture = useTexture(withBasePath("/images/card-cover.jpeg"));

  useFrame((state) => {
    if (pivotRef.current) {
      pivotRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.15;
      pivotRef.current.lookAt(state.camera.position);
    }
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.25 + Math.sin(state.clock.elapsedTime * 1.2) * 0.12;
    }
    // Pulse the ring as holdProgress fills
    if (ringRef.current && holdProgress > 0) {
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.4 + holdProgress * 0.5;
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

        {/* Progress ring around the card (only during palm hold) */}
        {isFocused && holdProgress > 0 && (
          <group position={[0, 0, 0.02]}>
            {/* Full dim background ring */}
            <mesh>
              <ringGeometry args={[CARD_W * 0.65, CARD_W * 0.75, 48]} />
              <meshBasicMaterial
                color="#E6C687"
                transparent
                opacity={0.12}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
            {/* Progress arc — rotates so it fills from the top */}
            <mesh ref={ringRef} rotation={[0, 0, -Math.PI / 2]}>
              <ringGeometry
                args={[CARD_W * 0.65, CARD_W * 0.75, 48, 1, 0, holdProgress * Math.PI * 2]}
              />
              <meshBasicMaterial
                color="#E6C687"
                transparent
                opacity={0.6}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
          </group>
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
  holdProgress,
}: {
  currentIndex: number;
  totalCards: number;
  holdProgress: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

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
          holdProgress={i === currentIndex ? holdProgress : 0}
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
  holdProgress = 0,
}: {
  currentIndex: number;
  totalCards: number;
  holdProgress?: number;
}) {
  return (
    <Canvas
      camera={{ position: [0, 1.2, 28], fov: 40, near: 0.5, far: 65 }}
      gl={{ antialias: true, alpha: false }}
      style={{ width: "100%", height: "100%" }}
    >
      <color attach="background" args={["#F0EFF5"]} />

      <ambientLight intensity={0.6} />

      <CarouselScene
        currentIndex={currentIndex}
        totalCards={totalCards}
        holdProgress={holdProgress}
      />
    </Canvas>
  );
}
