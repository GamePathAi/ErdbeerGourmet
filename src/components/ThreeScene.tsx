import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface ThreeSceneProps {
  className?: string;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ className = "three-scene" }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mountRef.current) return;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let animationId: number;
    let strawberries: THREE.Group[] = [];

    try {
      // Check for WebGL support
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        throw new Error('WebGL is not supported in this browser');
      }

      const container = mountRef.current;
      const width = container.clientWidth;
      const height = container.clientHeight;

      // Scene setup
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xfff5f5);

      // Camera setup
      camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.set(0, 2, 8);

      // Renderer setup
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.setClearColor(0xfff5f5, 1);
      
      container.appendChild(renderer.domElement);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 5, 5);
      directionalLight.castShadow = true;
      scene.add(directionalLight);

      // Create simple strawberry shapes
      const createStrawberry = (x: number, y: number, z: number, scale: number = 1) => {
        const group = new THREE.Group();
        
        // Strawberry body
        const bodyGeometry = new THREE.SphereGeometry(0.8 * scale, 12, 8);
        bodyGeometry.scale(1, 1.2, 1);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xff4757 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        group.add(body);
        
        // Strawberry leaves
        const leavesGeometry = new THREE.ConeGeometry(0.6 * scale, 0.3 * scale, 6);
        const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x2ed573 });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.y = 0.8 * scale;
        group.add(leaves);
        
        group.position.set(x, y, z);
        return group;
      };

      // Add strawberries to scene
      strawberries = [
        createStrawberry(-3, 0, 0, 1.2),
        createStrawberry(0, 1, -2, 1),
        createStrawberry(3, -0.5, 1, 0.8),
        createStrawberry(-1, -1, 3, 0.9),
        createStrawberry(2, 2, -1, 1.1)
      ];

      strawberries.forEach(strawberry => scene.add(strawberry));

      // Animation loop
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        
        // Rotate strawberries
        strawberries.forEach((strawberry, index) => {
          strawberry.rotation.y += 0.01 * (index + 1);
          strawberry.position.y += Math.sin(Date.now() * 0.001 + index) * 0.002;
        });
        
        renderer.render(scene, camera);
      };

      animate();
      setIsLoading(false);
      setError(null);

    } catch (err) {
      console.error('Three.js initialization error:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize 3D scene');
      setIsLoading(false);
    }

    // Cleanup function
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      
      if (renderer) {
        renderer.dispose();
        if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
      }
      
      // Dispose geometries and materials
      strawberries.forEach(strawberry => {
        strawberry.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (child.material instanceof THREE.Material) {
              child.material.dispose();
            }
          }
        });
      });
    };
  }, []);

  if (error) {
    return (
      <div className={className} style={{ 
        background: 'linear-gradient(135deg, #ffe6e6 0%, #ffcccc 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666'
      }}>
        <p>3D scene unavailable. Using fallback display.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={className} style={{ 
        background: 'linear-gradient(135deg, #ffe6e6 0%, #ffcccc 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p>Loading 3D scene...</p>
      </div>
    );
  }

  return (
    <div 
      ref={mountRef} 
      className={className}
      style={{ width: '100%', height: '100vh', position: 'relative' }}
    />
  );
};

export default ThreeScene;
