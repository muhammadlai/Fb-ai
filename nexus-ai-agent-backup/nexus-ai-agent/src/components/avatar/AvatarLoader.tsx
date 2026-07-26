import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Avatars, AvatarType } from "../../avatar/AvatarManager";

type Props = {
  avatar: AvatarType;
};

export default function AvatarLoader({ avatar }: Props) {
  const current = Avatars[avatar];

  return (
    <Canvas camera={{ position: [0, 1.6, 3], fov: 45 }}>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={2} />

      {/* TODO: Load current.model (.vrm/.glb) here */}

      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial />
      </mesh>

      <OrbitControls enablePan={false} />

    </Canvas>
  );
}
