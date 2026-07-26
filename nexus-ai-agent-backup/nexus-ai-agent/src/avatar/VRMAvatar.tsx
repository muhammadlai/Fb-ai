import { useEffect } from "react";
import * as THREE from "three";
import { loadVRM } from "./VRMLoader";

type Props = {
  scene: THREE.Scene;
  url: string;
};

export default function VRMAvatar({ scene, url }: Props) {
  useEffect(() => {
    let current: any = null;

    loadVRM(url)
      .then((vrm) => {
        current = vrm;
        scene.add(vrm.scene);
      })
      .catch(console.error);

    return () => {
      if (current) {
        scene.remove(current.scene);
      }
    };
  }, [scene, url]);

  return null;
}
