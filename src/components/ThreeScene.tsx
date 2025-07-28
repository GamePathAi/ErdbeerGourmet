import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface ThreeSceneProps {
  className?: string;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ 
  className = '' 
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  const animationIdRef = useRef<number | null>(null);
  const [webglError, setWebglError] = useState<boolean>(false);

  // Check WebGL support
  const isWebGLSupported = () => {
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!context;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Check WebGL support first
    if (!isWebGLSupported()) {
      console.warn('WebGL is not supported or blocked. Showing fallback.');
      setWebglError(true);
      return;
    }

    // Get container dimensions
    const containerWidth = currentMount.clientWidth;
    const containerHeight = currentMount.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffe6e6); // Warm strawberry-themed background
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerWidth / containerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 3, 12);

    // Renderer setup with error handling
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(containerWidth, containerHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.setClearColor(0x87CEEB, 1);
      rendererRef.current = renderer;

      // Add renderer to DOM
      currentMount.appendChild(renderer.domElement);
    } catch (error) {
      console.error('Failed to create WebGL renderer:', error);
      setWebglError(true);
      return;
    }

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(8, 8, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Create 3D strawberries
    const createStrawberry = (x: number, y: number, z: number, scale: number = 1) => {
      const group = new THREE.Group();
      
      // Strawberry body (ellipsoid)
      const bodyGeometry = new THREE.SphereGeometry(1 * scale, 16, 12);
      bodyGeometry.scale(1, 1.3, 1); // Make it more strawberry-shaped
      const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xe74c3c });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.castShadow = true;
      body.receiveShadow = true;
      group.add(body);
      
      // Strawberry leaves (green top)
      const leavesGeometry = new THREE.ConeGeometry(0.8 * scale, 0.4 * scale, 6);
      const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x27ae60 });
      const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
      leaves.position.y = 1.1 * scale;
      leaves.rotation.y = Math.PI / 6;
      group.add(leaves);
      
      // Small seeds on strawberry
      for (let i = 0; i < 12; i++) {
        const seedGeometry = new THREE.SphereGeometry(0.05 * scale, 4, 4);
        const seedMaterial = new THREE.MeshLambertMaterial({ color: 0xf1c40f });
        const seed = new THREE.Mesh(seedGeometry, seedMaterial);
        
        const angle = (i / 12) * Math.PI * 2;
        const height = (Math.random() - 0.5) * 1.5 * scale;
        seed.position.set(
          Math.cos(angle) * 0.8 * scale,
          height,
          Math.sin(angle) * 0.8 * scale
        );
        group.add(seed);
      }
      
      group.position.set(x, y, z);
      return group;
    };
    
    // Add multiple strawberries of different sizes
    const strawberry1 = createStrawberry(-6, 1, -3, 1.5);
    const strawberry2 = createStrawberry(0, 0.5, -5, 2);
    const strawberry3 = createStrawberry(6, 1.2, -2, 1.3);
    const strawberry4 = createStrawberry(-3, 0.8, 2, 1.1);
    const strawberry5 = createStrawberry(4, 0.6, 3, 1.4);
    
    scene.add(strawberry1);
    scene.add(strawberry2);
    scene.add(strawberry3);
    scene.add(strawberry4);
    scene.add(strawberry5);
    
    // Store strawberries for animation
    const strawberries = [strawberry1, strawberry2, strawberry3, strawberry4, strawberry5];

    // Create floating petals and sparkles
    const floatingElements: Array<{ element: THREE.Mesh; type: string }> = [];
    
    // Create flower petals
    for (let i = 0; i < 12; i++) {
      const petalGeometry = new THREE.PlaneGeometry(0.3, 0.6);
      const petalMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xffc0cb, // Pink petals
        transparent: true, 
        opacity: 0.7,
        side: THREE.DoubleSide
      });
      const petal = new THREE.Mesh(petalGeometry, petalMaterial);
      
      petal.position.set(
        (Math.random() - 0.5) * 30,
        Math.random() * 8 + 3,
        (Math.random() - 0.5) * 30
      );
      
      petal.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      floatingElements.push({ element: petal, type: 'petal' });
      scene.add(petal);
    }
    
    // Create sparkle particles
    for (let i = 0; i < 15; i++) {
      const sparkleGeometry = new THREE.SphereGeometry(0.1, 6, 6);
      const sparkleColor = Math.random() > 0.5 ? 0xffd700 : 0xffffff; // Gold or white
      const sparkleMaterial = new THREE.MeshLambertMaterial({ 
        color: sparkleColor,
        transparent: true, 
        opacity: 0.9
      });
      const sparkle = new THREE.Mesh(sparkleGeometry, sparkleMaterial);
      
      sparkle.position.set(
        (Math.random() - 0.5) * 25,
        Math.random() * 6 + 2,
        (Math.random() - 0.5) * 25
      );
      
      floatingElements.push({ element: sparkle, type: 'sparkle' });
      scene.add(sparkle);
    }

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      // Gentle camera movement
      camera.position.x = Math.sin(Date.now() * 0.0005) * 2;
      camera.lookAt(0, 2, 0);
      
      // Animate strawberries with gentle bobbing and rotation
       strawberries.forEach((strawberry, index) => {
         strawberry.rotation.y += 0.01;
         strawberry.position.y += Math.sin(Date.now() * 0.001 + index * 0.5) * 0.002;
       });
       
       // Animate floating elements
       floatingElements.forEach((item, index) => {
         if (item.type === 'petal') {
           // Gentle floating motion for petals
           item.element.position.y += Math.sin(Date.now() * 0.001 + index) * 0.003;
           item.element.rotation.z += 0.005;
           item.element.position.x += Math.sin(Date.now() * 0.0005 + index) * 0.002;
         } else if (item.type === 'sparkle') {
           // Twinkling motion for sparkles
           item.element.position.y += Math.cos(Date.now() * 0.002 + index) * 0.004;
           item.element.scale.setScalar(1 + Math.sin(Date.now() * 0.003 + index) * 0.3);
         }
       });
      
      renderer.render(scene, camera);
    };
    
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!currentMount || !rendererRef.current) return;
      
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight;
      
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      
      rendererRef.current.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      if (currentMount && rendererRef.current) {
        currentMount.removeChild(rendererRef.current.domElement);
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      if (sceneRef.current) {
        sceneRef.current.clear();
      }
      
      // Cleanup geometries and materials
      floatingElements.forEach(item => {
        item.element.geometry.dispose();
        if (Array.isArray(item.element.material)) {
          item.element.material.forEach(material => material.dispose());
        } else {
          item.element.material.dispose();
        }
      });
    };
  }, []);

  // Fallback component when WebGL is not available
  if (webglError) {
    return (
      <div 
        className={`three-scene-fallback strawberry-theme ${className}`}
        style={{ 
          width: '100%', 
          height: '100%',
          minHeight: '400px',
          background: 'linear-gradient(to bottom, #ffe6e6 0%, #ffcccc 50%, #ffb3b3 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Fallback strawberries */}
        <div className="fallback-strawberries">
          <div className="strawberry strawberry-1" style={{
            position: 'absolute',
            fontSize: '4rem',
            left: '10%',
            top: '40%',
            animation: 'bounce 3s ease-in-out infinite'
          }}>🍓</div>
          <div className="strawberry strawberry-2" style={{
            position: 'absolute',
            fontSize: '5rem',
            left: '45%',
            top: '50%',
            animation: 'bounce 3s ease-in-out infinite 0.5s'
          }}>🍓</div>
          <div className="strawberry strawberry-3" style={{
            position: 'absolute',
            fontSize: '3.5rem',
            right: '15%',
            top: '35%',
            animation: 'bounce 3s ease-in-out infinite 1s'
          }}>🍓</div>
          <div className="strawberry strawberry-4" style={{
            position: 'absolute',
            fontSize: '3rem',
            left: '25%',
            bottom: '30%',
            animation: 'bounce 3s ease-in-out infinite 1.5s'
          }}>🍓</div>
          <div className="strawberry strawberry-5" style={{
            position: 'absolute',
            fontSize: '4.5rem',
            right: '30%',
            bottom: '25%',
            animation: 'bounce 3s ease-in-out infinite 2s'
          }}>🍓</div>
        </div>
        
        {/* Fallback petals */}
        <div className="fallback-petals">
          <div className="petal petal-1" style={{
            position: 'absolute',
            fontSize: '2rem',
            left: '20%',
            top: '20%',
            animation: 'float 4s ease-in-out infinite'
          }}>🌸</div>
          <div className="petal petal-2" style={{
            position: 'absolute',
            fontSize: '1.5rem',
            right: '25%',
            top: '15%',
            animation: 'float 5s ease-in-out infinite 1s'
          }}>🌸</div>
          <div className="petal petal-3" style={{
            position: 'absolute',
            fontSize: '2.5rem',
            left: '60%',
            top: '25%',
            animation: 'float 4.5s ease-in-out infinite 2s'
          }}>🌸</div>
          <div className="petal petal-4" style={{
            position: 'absolute',
            fontSize: '1.8rem',
            left: '80%',
            bottom: '40%',
            animation: 'float 6s ease-in-out infinite 0.5s'
          }}>🌸</div>
        </div>
        
        {/* Fallback sparkles */}
        <div className="fallback-sparkles">
          <div className="sparkle sparkle-1" style={{
            position: 'absolute',
            fontSize: '1.5rem',
            left: '35%',
            top: '30%',
            animation: 'twinkle 2s ease-in-out infinite'
          }}>✨</div>
          <div className="sparkle sparkle-2" style={{
            position: 'absolute',
            fontSize: '1.2rem',
            right: '40%',
            top: '60%',
            animation: 'twinkle 2.5s ease-in-out infinite 0.8s'
          }}>✨</div>
          <div className="sparkle sparkle-3" style={{
            position: 'absolute',
            fontSize: '1.8rem',
            left: '70%',
            bottom: '50%',
            animation: 'twinkle 3s ease-in-out infinite 1.2s'
          }}>✨</div>
        </div>
        
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(5deg); }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-10px) scale(1.1); }
          }
          @keyframes twinkle {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.3); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div 
      ref={mountRef} 
      className={`three-scene ${className}`}
      style={{ 
        width: '100%', 
        height: '100%',
        minHeight: '400px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    />
  );
};

export default ThreeScene;