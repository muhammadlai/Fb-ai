export type AvatarType = "male" | "female" | "robot";

export interface AvatarConfig {
  id: AvatarType;
  name: string;
  model: string;
  voice: string;
}

export const Avatars: Record<AvatarType, AvatarConfig> = {
  male: {
    id: "male",
    name: "Aitzaz",
    model: "/models/aitzaz.vrm",
    voice: "male",
  },

  female: {
    id: "female",
    name: "Nexus Assistant",
    model: "/models/female.vrm",
    voice: "female",
  },

  robot: {
    id: "robot",
    name: "Nexus AI",
    model: "/models/robot.vrm",
    voice: "robot",
  },
};

export default Avatars;
