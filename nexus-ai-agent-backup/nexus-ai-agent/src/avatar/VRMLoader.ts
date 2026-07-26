import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRM, VRMLoaderPlugin } from "@pixiv/three-vrm";

export async function loadVRM(url: string): Promise<VRM> {
  const loader = new GLTFLoader();
  loader.register((parser) => new VRMLoaderPlugin(parser));

  const gltf = await loader.loadAsync(url);

  const vrm = gltf.userData.vrm as VRM;

  if (!vrm) {
    throw new Error("Failed to load VRM model");
  }

  return vrm;
}
