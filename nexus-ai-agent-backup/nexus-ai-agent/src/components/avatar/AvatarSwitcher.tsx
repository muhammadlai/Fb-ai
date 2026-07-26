import React from "react";
import { AvatarType } from "../../avatar/AvatarManager";

interface Props {
  avatar: AvatarType;
  onChange: (avatar: AvatarType) => void;
}

export default function AvatarSwitcher({
  avatar,
  onChange,
}: Props) {
  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        right: 20,
        display: "flex",
        gap: 10,
        zIndex: 1000,
      }}
    >
      <button onClick={() => onChange("male")}>
        👨 Male
      </button>

      <button onClick={() => onChange("female")}>
        👩 Female
      </button>

      <button onClick={() => onChange("robot")}>
        🤖 Robot
      </button>
    </div>
  );
}
