import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export type AvatarType = 'professional_male' | 'professional_female' | 'futuristic_robot' | 'holographic_ai';

export type AvatarState = 'idle' | 'speaking' | 'listening' | 'thinking' | 'celebrating';

interface ThreeDAvatarCanvasProps {
  avatarType: AvatarType;
  avatarState: AvatarState;
  speechVolume?: number; // 0.0 to 1.0 for lip sync reactivity
  onAvatarClick?: () => void;
}

export const ThreeDAvatarCanvas: React.FC<ThreeDAvatarCanvasProps> = ({
  avatarType,
  avatarState,
  speechVolume = 0,
  onAvatarClick,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Refs for animated objects
  const avatarGroupRef = useRef<THREE.Object3D | null>(null);
  const headGroupRef = useRef<THREE.Object3D | null>(null);
  const mouthMeshRef = useRef<THREE.Mesh | null>(null);
  const jawMeshRef = useRef<THREE.Object3D | null>(null);
  const leftEyeRef = useRef<THREE.Object3D | null>(null);
  const rightEyeRef = useRef<THREE.Object3D | null>(null);
  const leftEyelidRef = useRef<THREE.Object3D | null>(null);
  const rightEyelidRef = useRef<THREE.Object3D | null>(null);
  const leftArmRef = useRef<THREE.Object3D | null>(null);
  const rightArmRef = useRef<THREE.Object3D | null>(null);
  const particlesMeshRef = useRef<THREE.Points | null>(null);
  const thinkingRingsGroupRef = useRef<THREE.Group | null>(null);
  const holographicMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const celebrationBurstGroupRef = useRef<THREE.Group | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const morphMeshRef = useRef<{ mesh: THREE.Mesh; index: number } | null>(null);

  // Mutable refs for state props to ensure smooth animation loop execution
  const avatarStateRef = useRef<AvatarState>(avatarState);
  const speechVolumeRef = useRef<number>(speechVolume);

  useEffect(() => {
    avatarStateRef.current = avatarState;
  }, [avatarState]);

  useEffect(() => {
    speechVolumeRef.current = speechVolume;
  }, [speechVolume]);

  // Mouse tracking state
  const mousePos = useRef({ x: 0, y: 0 });
  const targetHeadRot = useRef({ x: 0, y: 0 });

  // Blinking timer
  const blinkProgress = useRef(0);
  const nextBlinkTime = useRef(Date.now() + 3000);

  // Handle Mouse Move for Eye Contact
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const x = (e.clientX / windowWidth) * 2 - 1;
      const y = -(e.clientY / windowHeight) * 2 + 1;
      mousePos.current = { x, y };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Function to load GLTF model /avatars/nexus.glb
  const loadAvatarModel = (scene: THREE.Scene, type: AvatarType) => {
    // Remove existing avatar group if present
    if (avatarGroupRef.current) {
      scene.remove(avatarGroupRef.current);
      avatarGroupRef.current = null;
    }

    // Reset references
    headGroupRef.current = null;
    jawMeshRef.current = null;
    mouthMeshRef.current = null;
    leftEyeRef.current = null;
    rightEyeRef.current = null;
    leftEyelidRef.current = null;
    rightEyelidRef.current = null;
    leftArmRef.current = null;
    rightArmRef.current = null;
    mixerRef.current = null;
    morphMeshRef.current = null;

    // Create Holographic Material Shader if needed
    const customHoloShader = {
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0x06b6d4) },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
          float scanline = sin(vPosition.y * 40.0 + uTime * 6.0) * 0.15 + 0.85;
          vec3 glow = uColor * intensity * scanline * 2.0;
          gl_FragColor = vec4(glow, intensity * 0.8);
        }
      `,
    };
    const holoMat = new THREE.ShaderMaterial({
      ...customHoloShader,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    holographicMaterialRef.current = holoMat;

    const loader = new GLTFLoader();
    loader.load(
      '/avatars/nexus.glb',
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, -0.5, 0);

        // Normalize model height if needed
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        if (size.y > 0 && size.y > 5) {
          const targetHeight = 2.0;
          const scale = targetHeight / size.y;
          model.scale.setScalar(scale);
        }

        avatarGroupRef.current = model;

        // Traverse GLTF scene to assign refs & apply shadow / materials safely
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            if (type === 'holographic_ai' && holographicMaterialRef.current) {
              (child as THREE.Mesh).material = holographicMaterialRef.current;
            }
          }

          const nameLower = child.name.toLowerCase();

          // Search for head
          if (!headGroupRef.current && (nameLower.includes('head') || nameLower.includes('neck'))) {
            headGroupRef.current = child;
          }

          // Search for jaw / mouth
          if (!jawMeshRef.current && (nameLower.includes('jaw') || nameLower.includes('mouth'))) {
            jawMeshRef.current = child;
          }

          // Search for eyes
          if (nameLower.includes('eye')) {
            if (nameLower.includes('left') || nameLower.includes('l') || nameLower.includes('_l')) {
              leftEyeRef.current = child;
            } else if (nameLower.includes('right') || nameLower.includes('r') || nameLower.includes('_r')) {
              rightEyeRef.current = child;
            }
          }

          // Search for eyelids
          if (nameLower.includes('eyelid') || nameLower.includes('lid')) {
            if (nameLower.includes('left') || nameLower.includes('l') || nameLower.includes('_l')) {
              leftEyelidRef.current = child;
            } else if (nameLower.includes('right') || nameLower.includes('r') || nameLower.includes('_r')) {
              rightEyelidRef.current = child;
            }
          }

          // Search for arms
          if (nameLower.includes('arm')) {
            if (nameLower.includes('left') || nameLower.includes('l') || nameLower.includes('_l')) {
              leftArmRef.current = child;
            } else if (nameLower.includes('right') || nameLower.includes('r') || nameLower.includes('_r')) {
              rightArmRef.current = child;
            }
          }

          // Check morph targets for lip sync
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.morphTargetDictionary && mesh.morphTargetInfluences) {
              const keys = Object.keys(mesh.morphTargetDictionary);
              const openKey = keys.find((k) => /mouth|jaw|viseme|open|aa|ah|v_open/i.test(k));
              if (openKey !== undefined) {
                morphMeshRef.current = {
                  mesh,
                  index: mesh.morphTargetDictionary[openKey],
                };
              }
            }
          }
        });

        // Setup AnimationMixer if GLB contains clip animations
        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(model);
          mixerRef.current = mixer;
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
        }

        scene.add(model);
      },
      undefined,
      (error) => {
        console.warn('GLTF load fallback: /avatars/nexus.glb not found or failed to load:', error);
        // Fallback root group to ensure renderer and canvas operate smoothly
        const fallbackGroup = new THREE.Group();
        fallbackGroup.position.set(0, -0.5, 0);
        avatarGroupRef.current = fallbackGroup;
        scene.add(fallbackGroup);
      }
    );
  };

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 600;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 4.2);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(3, 5, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const cyanRimLight = new THREE.PointLight(0x06b6d4, 3, 10);
    cyanRimLight.position.set(-3, 2, -2);
    scene.add(cyanRimLight);

    const purpleRimLight = new THREE.PointLight(0xa855f7, 3, 10);
    purpleRimLight.position.set(3, 2, -2);
    scene.add(purpleRimLight);

    const bottomSpotLight = new THREE.SpotLight(0x38bdf8, 2);
    bottomSpotLight.position.set(0, -3, 2);
    bottomSpotLight.angle = Math.PI / 4;
    scene.add(bottomSpotLight);

    // Stage Background: Holographic Ground Grid Ring
    const gridHelper = new THREE.GridHelper(10, 20, 0xa855f7, 0x06b6d4);
    gridHelper.position.y = -1.6;
    (gridHelper.material as THREE.Material).opacity = 0.25;
    (gridHelper.material as THREE.Material).transparent = true;
    scene.add(gridHelper);

    const ringGeo = new THREE.RingGeometry(0.8, 1.6, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3,
    });
    const stageRing = new THREE.Mesh(ringGeo, ringMat);
    stageRing.rotation.x = Math.PI / 2;
    stageRing.position.y = -1.59;
    scene.add(stageRing);

    // Particle Stars System
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 10;
      particlePositions[i + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesMeshRef.current = particles;

    // Thinking Rings Group
    const thinkingGroup = new THREE.Group();
    for (let r = 1; r <= 3; r++) {
      const ringG = new THREE.TorusGeometry(0.7 + r * 0.25, 0.012, 16, 100);
      const ringM = new THREE.MeshBasicMaterial({
        color: r === 1 ? 0x06b6d4 : r === 2 ? 0xa855f7 : 0xec4899,
        transparent: true,
        opacity: 0.7,
      });
      const tRing = new THREE.Mesh(ringG, ringM);
      tRing.rotation.x = Math.PI / (r + 1);
      thinkingGroup.add(tRing);
    }
    thinkingGroup.position.set(0, 0.4, 0);
    scene.add(thinkingGroup);
    thinkingRingsGroupRef.current = thinkingGroup;

    // Celebration Star Burst Group
    const celebrationGroup = new THREE.Group();
    const starGeo = new THREE.SphereGeometry(0.03, 8, 8);
    const starMat = new THREE.MeshBasicMaterial({ color: 0xfacc15, transparent: true, opacity: 0 });
    for (let s = 0; s < 40; s++) {
      const star = new THREE.Mesh(starGeo, starMat.clone());
      star.position.set((Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1);
      celebrationGroup.add(star);
    }
    scene.add(celebrationGroup);
    celebrationBurstGroupRef.current = celebrationGroup;

    // Load GLTF Avatar /avatars/nexus.glb
    loadAvatarModel(scene, avatarType);

    // Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 600;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Main Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const delta = clock.getDelta();

      const currentState = avatarStateRef.current;
      const currentVolume = speechVolumeRef.current;

      // Update AnimationMixer if GLB animations exist
      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }

      // Floating / Breathing subtle animation
      if (avatarGroupRef.current) {
        avatarGroupRef.current.position.y = -0.5 + Math.sin(elapsedTime * 1.5) * 0.05;
      }

      // Rotate Stage Ring & Particles
      stageRing.rotation.z = elapsedTime * 0.2;
      if (particlesMeshRef.current) {
        particlesMeshRef.current.rotation.y = elapsedTime * 0.05;
      }

      // Eye & Head Tracking Mouse Position
      if (headGroupRef.current) {
        targetHeadRot.current.y = mousePos.current.x * 0.35;
        targetHeadRot.current.x = -mousePos.current.y * 0.25;

        headGroupRef.current.rotation.y = THREE.MathUtils.lerp(
          headGroupRef.current.rotation.y,
          targetHeadRot.current.y,
          0.08
        );
        headGroupRef.current.rotation.x = THREE.MathUtils.lerp(
          headGroupRef.current.rotation.x,
          targetHeadRot.current.x,
          0.08
        );
      }

      // Procedural Blinking
      if (Date.now() > nextBlinkTime.current) {
        blinkProgress.current += 0.2;
        if (blinkProgress.current >= Math.PI) {
          blinkProgress.current = 0;
          nextBlinkTime.current = Date.now() + 2500 + Math.random() * 3000;
        }
      }
      const lidScaleY = Math.max(0.05, 1 - Math.sin(blinkProgress.current));
      if (leftEyelidRef.current && rightEyelidRef.current) {
        leftEyelidRef.current.scale.y = lidScaleY;
        rightEyelidRef.current.scale.y = lidScaleY;
      }

      // Lip Sync / Mouth Animation when Speaking
      let targetMouthOpen = 0.05;
      if (currentState === 'speaking') {
        targetMouthOpen = 0.15 + Math.sin(elapsedTime * 18) * 0.2 + currentVolume * 0.4;
      } else if (currentState === 'listening') {
        targetMouthOpen = 0.08;
      } else if (currentState === 'celebrating') {
        targetMouthOpen = 0.25; // Big happy smile/open
      }

      if (jawMeshRef.current) {
        jawMeshRef.current.rotation.x = THREE.MathUtils.lerp(
          jawMeshRef.current.rotation.x,
          targetMouthOpen,
          0.2
        );
      }

      if (morphMeshRef.current && morphMeshRef.current.mesh.morphTargetInfluences) {
        const { mesh, index } = morphMeshRef.current;
        mesh.morphTargetInfluences[index] = THREE.MathUtils.lerp(
          mesh.morphTargetInfluences[index],
          targetMouthOpen,
          0.2
        );
      }

      // State-Based Gesture & Arm Animations
      if (leftArmRef.current && rightArmRef.current) {
        if (currentState === 'celebrating') {
          // Arms raised in celebration!
          leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 2.2, 0.1);
          rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -2.2, 0.1);
          leftArmRef.current.rotation.x = Math.sin(elapsedTime * 6) * 0.2;
          rightArmRef.current.rotation.x = Math.cos(elapsedTime * 6) * 0.2;
        } else if (currentState === 'thinking') {
          // Hand to chin gesture
          rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -1.2, 0.1);
          rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0.8, 0.1);
          leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.2, 0.1);
        } else if (currentState === 'speaking') {
          // Expressive hand gesturing while speaking
          leftArmRef.current.rotation.z = 0.3 + Math.sin(elapsedTime * 4) * 0.15;
          rightArmRef.current.rotation.z = -0.3 - Math.cos(elapsedTime * 4) * 0.15;
          leftArmRef.current.rotation.x = Math.sin(elapsedTime * 3) * 0.1;
          rightArmRef.current.rotation.x = Math.cos(elapsedTime * 3) * 0.1;
        } else {
          // Normal idle posture
          leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.2, 0.05);
          rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.2, 0.05);
          leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, 0.05);
          rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, 0.05);
        }
      }

      // Thinking Rings Animation
      if (thinkingRingsGroupRef.current) {
        if (currentState === 'thinking') {
          thinkingRingsGroupRef.current.visible = true;
          thinkingRingsGroupRef.current.children.forEach((r, idx) => {
            r.rotation.y += (idx + 1) * 0.03;
            r.rotation.x += (idx + 1) * 0.02;
          });
        } else {
          thinkingRingsGroupRef.current.visible = false;
        }
      }

      // Celebrating Particles Explosion
      if (celebrationBurstGroupRef.current) {
        if (currentState === 'celebrating') {
          celebrationBurstGroupRef.current.visible = true;
          celebrationBurstGroupRef.current.children.forEach((p: any, i) => {
            p.material.opacity = 1.0;
            const angle = (i / 40) * Math.PI * 2;
            const speed = 0.03;
            p.position.x += Math.cos(angle) * speed;
            p.position.y += Math.sin(angle) * speed + 0.01;
            p.position.z += (Math.random() - 0.5) * speed;
          });
        } else {
          celebrationBurstGroupRef.current.visible = false;
          celebrationBurstGroupRef.current.children.forEach((p: any) => {
            p.position.set(0, 0, 0);
          });
        }
      }

      // Holographic Material Scanlines pulse
      if (holographicMaterialRef.current) {
        holographicMaterialRef.current.uniforms.uTime.value = elapsedTime;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Trigger model refresh when avatarType changes
  useEffect(() => {
    if (sceneRef.current) {
      loadAvatarModel(sceneRef.current, avatarType);
    }
  }, [avatarType]);

  return (
    <div
      ref={mountRef}
      onClick={onAvatarClick}
      className="w-full h-full relative cursor-pointer select-none overflow-hidden"
      title="Click 3D Avatar to interact or trigger greeting"
    />
  );
};
