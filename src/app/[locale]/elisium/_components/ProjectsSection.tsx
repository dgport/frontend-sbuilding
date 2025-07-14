"use client";

import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

const BuildingCarousel3D = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const carouselGroupRef = useRef<THREE.Group | null>(null);
  const imagesRef = useRef<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const autoRotateRef = useRef<NodeJS.Timeout | null>(null);
  const targetRotation = useRef(0);
  const animationRef = useRef<number | null>(null);

  const buildingProjects = [
    {
      image: "/images/projects/elisium.jpg",
      title: "Modern Residential Complex",
      description: "Luxury apartments with sustainable design",
    },
    {
      image: "/images/projects/house-abashidze.png",
      title: "Commercial Office Tower",
      description: "State-of-the-art business center",
    },
    {
      image: "/images/projects/house-bagrationi.png",
      title: "Mixed-Use Development",
      description: "Retail and residential integration",
    },
    {
      image: "/images/projects/house-sulaberidze.png",
      title: "Urban Housing Project",
      description: "Affordable and modern living spaces",
    },
    {
      image: "/images/projects/your-space.png",
      title: "Green Building Initiative",
      description: "Eco-friendly architectural solution",
    },
  ];

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f1419);
    sceneRef.current = scene;

    // Camera setup with responsive aspect ratio
    const aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.set(0, 0, 8);
    cameraRef.current = camera;

    // Renderer setup with responsive size
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting setup for natural colors
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
    rimLight.position.set(-5, 0, -5);
    scene.add(rimLight);

    // Carousel group
    const carouselGroup = new THREE.Group();
    carouselGroupRef.current = carouselGroup;
    scene.add(carouselGroup);

    // Create carousel items with more rectangular dimensions
    const radius = 6;
    const angleStep = (Math.PI * 2) / buildingProjects.length;
    const images: any[] = [];

    buildingProjects.forEach((project, index) => {
      // Image plane with more rectangular aspect ratio (3:2)
      const cardWidth = 3.6;
      const cardHeight = 2.4;
      const geometry = new THREE.PlaneGeometry(cardWidth, cardHeight);

      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load(project.image);

      // Configure texture for proper coverage (like object-fit: cover)
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      // Calculate texture offset and scale for center crop effect
      const textureAspect = 1; // Assuming square images, adjust if needed
      const cardAspect = cardWidth / cardHeight;

      if (textureAspect > cardAspect) {
        // Image is wider than card, crop sides
        const scale = cardAspect / textureAspect;
        texture.repeat.set(scale, 1);
        texture.offset.set((1 - scale) / 2, 0);
      } else {
        // Image is taller than card, crop top/bottom
        const scale = textureAspect / cardAspect;
        texture.repeat.set(1, scale);
        texture.offset.set(0, (1 - scale) / 2);
      }

      // Use MeshStandardMaterial for more natural colors
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        metalness: 0,
        roughness: 1,
      });

      const plane = new THREE.Mesh(geometry, material);
      const angle = angleStep * index;
      plane.position.x = Math.sin(angle) * radius;
      plane.position.z = Math.cos(angle) * radius;
      plane.position.y = 0;
      plane.lookAt(0, 0, 0);
      plane.castShadow = true;
      plane.receiveShadow = true;
      plane.userData = { index, project };

      // Frame with matching dimensions
      const frameGeometry = new THREE.PlaneGeometry(
        cardWidth + 0.1,
        cardHeight + 0.1
      );
      const frameMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        transparent: true,
        opacity: 0.8,
        metalness: 0,
        roughness: 1,
      });

      const frame = new THREE.Mesh(frameGeometry, frameMaterial);
      frame.position.copy(plane.position);
      frame.position.z -= 0.01;
      frame.lookAt(0, 0, 0);

      // Reflection with same texture configuration
      const reflectionGeometry = new THREE.PlaneGeometry(cardWidth, cardHeight);
      const reflectionTexture = texture.clone();
      reflectionTexture.needsUpdate = true;

      const reflectionMaterial = new THREE.MeshStandardMaterial({
        map: reflectionTexture,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
        metalness: 0,
        roughness: 1,
      });

      const reflection = new THREE.Mesh(reflectionGeometry, reflectionMaterial);
      reflection.position.copy(plane.position);
      reflection.position.y = -3.2; // Adjusted for new card height
      reflection.scale.y = -1;
      reflection.lookAt(0, 0, 0);

      carouselGroup.add(frame);
      carouselGroup.add(plane);
      carouselGroup.add(reflection);

      images.push({
        plane,
        frame,
        reflection,
        angle,
        project,
        originalIndex: index,
      });
    });

    imagesRef.current = images;

    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      transparent: true,
      opacity: 0.1,
      metalness: 0,
      roughness: 1,
    });

    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.5;
    ground.receiveShadow = true;
    scene.add(ground);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      if (isAutoRotating && carouselGroupRef.current) {
        targetRotation.current += 0.005;
      }

      if (carouselGroupRef.current) {
        // Smooth rotation interpolation
        const rotationDiff =
          targetRotation.current - carouselGroupRef.current.rotation.y;
        carouselGroupRef.current.rotation.y += rotationDiff * 0.08;

        // Calculate current index based on rotation
        // Normalize rotation to 0-2π range
        const normalizedRotation =
          ((carouselGroupRef.current.rotation.y % (Math.PI * 2)) +
            Math.PI * 2) %
          (Math.PI * 2);

        // Calculate which image is closest to the front (z-axis positive direction)
        let closestIndex = 0;
        let minDistance = Infinity;

        images.forEach((item, index) => {
          const itemAngle = (angleStep * index) % (Math.PI * 2);
          const currentAngle = (normalizedRotation + itemAngle) % (Math.PI * 2);

          // Distance from front position (angle 0)
          const distance = Math.min(currentAngle, Math.PI * 2 - currentAngle);

          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
          }
        });

        if (closestIndex !== currentIndex) {
          setCurrentIndex(closestIndex);
        }
      }

      // Update image visibility and effects
      images.forEach((item, index) => {
        // Calculate how close this image is to the front
        const itemAngle = (angleStep * index) % (Math.PI * 2);
        const currentAngle = carouselGroupRef.current
          ? (carouselGroupRef.current.rotation.y + itemAngle) % (Math.PI * 2)
          : 0;

        // Normalize to 0-π range (distance from front)
        const distanceFromFront = Math.min(
          currentAngle,
          Math.PI * 2 - currentAngle
        );

        // Keep all cards the same size - no scaling
        item.plane.scale.setScalar(1);
        item.frame.scale.setScalar(1);
        item.reflection.scale.set(1, -1, 1);

        // Adjust opacity based on position
        const isSelected = index === currentIndex;
        const baseOpacity = isSelected
          ? 1.0
          : Math.max(0.6, 1 - distanceFromFront / Math.PI);

        item.plane.material.opacity = baseOpacity;
        item.reflection.material.opacity = baseOpacity * 0.15;
      });

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // Responsive handling
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current)
        return;

      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      if (
        mountRef.current &&
        rendererRef.current &&
        rendererRef.current.domElement
      ) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }

      if (autoRotateRef.current) clearInterval(autoRotateRef.current);
      window.removeEventListener("resize", handleResize);

      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [isAutoRotating]);

  // Navigation functions
  const rotateToIndex = (index: number) => {
    if (index < 0 || index >= buildingProjects.length) return;

    setCurrentIndex(index);
    const angleStep = (Math.PI * 2) / buildingProjects.length;

    // Calculate the shortest rotation path
    const currentRotation = targetRotation.current;
    const targetAngle = -(angleStep * index);

    // Find the shortest rotation direction
    let rotationDiff = targetAngle - currentRotation;

    // Normalize to [-π, π] range for shortest path
    while (rotationDiff > Math.PI) rotationDiff -= Math.PI * 2;
    while (rotationDiff < -Math.PI) rotationDiff += Math.PI * 2;

    targetRotation.current = currentRotation + rotationDiff;
  };

  const rotateToNext = () => {
    const nextIndex = (currentIndex + 1) % buildingProjects.length;
    rotateToIndex(nextIndex);
  };

  const rotateToPrevious = () => {
    const prevIndex =
      (currentIndex - 1 + buildingProjects.length) % buildingProjects.length;
    rotateToIndex(prevIndex);
  };

  const toggleAutoRotation = () => {
    setIsAutoRotating((prev) => {
      const next = !prev;
      if (next) {
        autoRotateRef.current = setInterval(() => {
          setCurrentIndex((currentIdx) => {
            const nextIdx = (currentIdx + 1) % buildingProjects.length;
            rotateToIndex(nextIdx);
            return nextIdx;
          });
        }, 4000);
      } else if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current);
        autoRotateRef.current = null;
      }
      return next;
    });
  };

  return (
    <div className="relative w-full h-[80vh] bg-gray-900 overflow-hidden">
      <div
        ref={mountRef}
        className="absolute inset-0 flex justify-center items-center mx-4 md:mx-0 md:block"
      />

      {/* Title */}
      <div className="absolute top-6 left-6 z-10">
        <h1 className="text-3xl font-light text-white mb-2">Our Projects</h1>
        <p className="text-gray-300 text-sm">Architectural Excellence</p>
      </div>

      {/* Project Info */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-md px-4 sm:px-0">
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 border border-slate-600/30">
          <h3 className="text-xl font-semibold text-white mb-2">
            {buildingProjects[currentIndex].title}
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            {buildingProjects[currentIndex].description}
          </p>
        </div>
      </div>

      {/* Left Arrow */}
      <button
        onClick={rotateToPrevious}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white flex items-center justify-center transition-colors duration-300 shadow-lg"
        aria-label="Previous project"
      >
        ←
      </button>

      {/* Right Arrow */}
      <button
        onClick={rotateToNext}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white flex items-center justify-center transition-colors duration-300 shadow-lg"
        aria-label="Next project"
      >
        →
      </button>

      {/* Controls */}
      <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-4">
        <button
          onClick={toggleAutoRotation}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 shadow-lg ${
            isAutoRotating
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-slate-800/80 hover:bg-slate-700 text-white"
          }`}
        >
          {isAutoRotating ? "Pause" : "Auto Play"}
        </button>

        <div className="flex gap-2">
          {buildingProjects.map((_, index) => (
            <button
              key={index}
              onClick={() => rotateToIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-blue-400 scale-125"
                  : "bg-gray-400/50 hover:bg-gray-300"
              }`}
              aria-label={`Go to project ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuildingCarousel3D;
