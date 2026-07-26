import React from "react";
import AvatarLoader from "./AvatarLoader";
import { AvatarType } from "../../avatar/AvatarManager";

interface Props {
  avatar: AvatarType;
}

export default function RealHumanAvatar({ avatar }: Props) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#050816",
        borderRadius: 20,
        overflow: "hidden",
      }}
    >
      <AvatarLoader avatar={avatar} />
    </div>
  );
}
