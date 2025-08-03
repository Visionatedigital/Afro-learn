import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';

// Simple 3D shapes instead of external models
function MascotShape({ mascotKey }) {
  const getMascotConfig = (key) => {
    switch(key) {
      case 'robot':
        return { 
          geometry: 'box', 
          scale: [0.8, 1.2, 0.8], 
          color: '#4A90E2',
          position: [0, Math.sin(Date.now() / 500) * 0.1, 0]
        };
      case 'lion':
        return { 
          geometry: 'sphere', 
          scale: [1, 1, 1], 
          color: '#FFA500',
          position: [0, Math.sin(Date.now() / 500) * 0.1, 0]
        };
      case 'butterfly':
        return { 
          geometry: 'box', 
          scale: [1.5, 0.3, 0.8], 
          color: '#FF69B4',
          position: [0, Math.sin(Date.now() / 500) * 0.1, 0]
        };
      case 'bear':
        return { 
          geometry: 'sphere', 
          scale: [1.2, 1.2, 1.2], 
          color: '#8B4513',
          position: [0, Math.sin(Date.now() / 500) * 0.1, 0]
        };
      case 'rabbit':
        return { 
          geometry: 'box', 
          scale: [0.6, 1.4, 0.6], 
          color: '#FFFFFF',
          position: [0, Math.sin(Date.now() / 500) * 0.1, 0]
        };
      default: // owl
        return { 
          geometry: 'sphere', 
          scale: [1, 1, 1], 
          color: '#654321',
          position: [0, Math.sin(Date.now() / 500) * 0.1, 0]
        };
    }
  };

  const config = getMascotConfig(mascotKey);
  
  return (
    <mesh position={config.position} scale={config.scale}>
      {config.geometry === 'box' ? (
        <boxGeometry args={[1, 1, 1]} />
      ) : (
        <sphereGeometry args={[0.5, 16, 16]} />
      )}
      <meshStandardMaterial color={config.color} />
    </mesh>
  );
}

export default function Mascot3DViewer({ mascotKey = 'owl', style = {} }) {
  return (
    <div style={{ width: 96, height: 96, ...style }}>
      <Canvas camera={{ position: [0, 0.2, 2], fov: 40 }} style={{ background: 'transparent' }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 2, 2]} intensity={0.7} />
        <Suspense fallback={<Html center>Loading...</Html>}>
          <MascotShape mascotKey={mascotKey} />
        </Suspense>
        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>
    </div>
  );
} 