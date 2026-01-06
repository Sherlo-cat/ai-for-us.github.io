// 3D Particle Sphere Component
// A large centered sphere made of particles with mouse interaction
// Only front-facing particles respond to mouse, with smaller attraction range

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Fibonacci sphere algorithm for even distribution
function fibonacciSphere(samples: number, radius: number): Float32Array {
  const points = new Float32Array(samples * 3);
  const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle

  for (let i = 0; i < samples; i++) {
    const y = 1 - (i / (samples - 1)) * 2; // y goes from 1 to -1
    const radiusAtY = Math.sqrt(1 - y * y); // radius at y
    const theta = phi * i; // golden angle increment

    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;

    points[i * 3] = x * radius;
    points[i * 3 + 1] = y * radius;
    points[i * 3 + 2] = z * radius;
  }

  return points;
}

interface ParticleFieldProps {
  count?: number;
  radius?: number;
  mouseInfluence?: number;
  returnSpeed?: number;
  maxDisplacement?: number;
}

function ParticleField({
  count = 2000,
  radius = 3,
  mouseInfluence = 0.8, // Reduced from 2.5 to 0.8 for smaller range
  returnSpeed = 0.08, // Increased for faster return
  maxDisplacement = 0.5, // Reduced max displacement
}: ParticleFieldProps) {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const { viewport, camera } = useThree();
  
  // Store original positions (in local space)
  const originalPositions = useMemo(() => fibonacciSphere(count, radius), [count, radius]);
  
  // Displacement offsets for each particle (starts at 0)
  const displacements = useMemo(() => new Float32Array(count * 3).fill(0), [count]);
  
  // Mouse position in normalized device coordinates
  const mouseNDC = useRef(new THREE.Vector2(-10, -10));
  
  // Raycaster for mouse interaction
  const raycaster = useRef(new THREE.Raycaster());
  
  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseNDC.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseNDC.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    const handleMouseLeave = () => {
      mouseNDC.current.set(-10, -10);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  
  // Create line connections between nearby particles
  const lineIndices = useMemo(() => {
    const indices: number[] = [];
    const connectionDistance = radius * 0.25;
    
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = originalPositions[i * 3] - originalPositions[j * 3];
        const dy = originalPositions[i * 3 + 1] - originalPositions[j * 3 + 1];
        const dz = originalPositions[i * 3 + 2] - originalPositions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (dist < connectionDistance) {
          indices.push(i, j);
        }
      }
    }
    return new Uint16Array(indices);
  }, [originalPositions, count, radius]);
  
  // Line positions buffer
  const linePositions = useMemo(() => {
    return new Float32Array(lineIndices.length * 3);
  }, [lineIndices]);
  
  // Animation frame
  useFrame((state, delta) => {
    if (!groupRef.current || !pointsRef.current || !linesRef.current) return;
    
    // Slow rotation
    groupRef.current.rotation.y += delta * 0.15;
    
    // Get the group's world matrix for transforming points
    const worldMatrix = groupRef.current.matrixWorld;
    const inverseMatrix = worldMatrix.clone().invert();
    
    // Set up raycaster from mouse
    raycaster.current.setFromCamera(mouseNDC.current, camera);
    const rayOrigin = raycaster.current.ray.origin;
    const rayDirection = raycaster.current.ray.direction;
    
    // Use ray-sphere intersection to find mouse position on the sphere surface
    // This ensures we're detecting the actual front surface, not a plane in the middle
    const sphereCenter = new THREE.Vector3(0, 0, 0);
    const sphere = new THREE.Sphere(sphereCenter, radius);
    const mouseWorldPos = new THREE.Vector3();
    const hitSphere = raycaster.current.ray.intersectSphere(sphere, mouseWorldPos);
    
    // If ray doesn't hit sphere, find the closest point on ray to sphere center
    // Use this point directly (outside sphere) so particles can be pulled OUT of the sphere
    if (!hitSphere) {
      // Find closest point on ray to sphere center
      const closestPoint = new THREE.Vector3();
      raycaster.current.ray.closestPointToPoint(sphereCenter, closestPoint);
      
      // Check if the closest point is in front of the camera and near the sphere
      const distToCenter = closestPoint.distanceTo(sphereCenter);
      const maxAttractionDist = radius + mouseInfluence; // 1x mouseInfluence outside sphere
      
      if (closestPoint.z > 0 && distToCenter < maxAttractionDist) {
        // Use the actual closest point (outside sphere) as target
        // This allows particles to be pulled OUTWARD toward the mouse
        mouseWorldPos.copy(closestPoint);
      } else {
        // Mouse is too far away, set to invalid position
        mouseWorldPos.set(-100, -100, -100);
      }
    }
    
    // Transform mouse position to local space
    const mouseLocalPos = mouseWorldPos.clone().applyMatrix4(inverseMatrix);
    
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    // Temporary vectors for calculations
    const particleWorldPos = new THREE.Vector3();
    const particleLocalPos = new THREE.Vector3();
    const toMouse = new THREE.Vector3();
    
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;
      
      // Original position in local space
      const ox = originalPositions[ix];
      const oy = originalPositions[iy];
      const oz = originalPositions[iz];
      
      // Current position with displacement
      particleLocalPos.set(
        ox + displacements[ix],
        oy + displacements[iy],
        oz + displacements[iz]
      );
      
      // Transform to world space to check if front-facing
      particleWorldPos.copy(particleLocalPos).applyMatrix4(worldMatrix);
      
      // Check if particle is front-facing (facing camera)
      // A particle is front-facing if its world Z position is positive (closer to camera)
      const isFrontFacing = particleWorldPos.z > 0;
      
      // Calculate distance from mouse in local space
      toMouse.set(
        mouseLocalPos.x - particleLocalPos.x,
        mouseLocalPos.y - particleLocalPos.y,
        mouseLocalPos.z - particleLocalPos.z
      );
      const distToMouse = toMouse.length();
      
      // Only attract if front-facing and within range
      if (isFrontFacing && distToMouse < mouseInfluence && distToMouse > 0.01) {
        // Stronger attraction force for more visible effect
        // Particles closer to mouse get pulled more strongly
        const force = Math.pow(1 - distToMouse / mouseInfluence, 2) * 0.08;
        
        // Pull toward mouse (outward from sphere center toward mouse)
        toMouse.normalize();
        displacements[ix] += toMouse.x * force;
        displacements[iy] += toMouse.y * force;
        displacements[iz] += toMouse.z * force;
      }
      
      // Always apply return force toward original position
      displacements[ix] *= (1 - returnSpeed);
      displacements[iy] *= (1 - returnSpeed);
      displacements[iz] *= (1 - returnSpeed);
      
      // Clamp displacement magnitude
      const dispMag = Math.sqrt(
        displacements[ix] * displacements[ix] +
        displacements[iy] * displacements[iy] +
        displacements[iz] * displacements[iz]
      );
      
      if (dispMag > maxDisplacement) {
        const scale = maxDisplacement / dispMag;
        displacements[ix] *= scale;
        displacements[iy] *= scale;
        displacements[iz] *= scale;
      }
      
      // Update position buffer
      positions[ix] = ox + displacements[ix];
      positions[iy] = oy + displacements[iy];
      positions[iz] = oz + displacements[iz];
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Update line positions
    const linePositionsArray = linesRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < lineIndices.length; i++) {
      const particleIndex = lineIndices[i];
      linePositionsArray[i * 3] = positions[particleIndex * 3];
      linePositionsArray[i * 3 + 1] = positions[particleIndex * 3 + 1];
      linePositionsArray[i * 3 + 2] = positions[particleIndex * 3 + 2];
    }
    linesRef.current.geometry.attributes.position.needsUpdate = true;
  });
  
  // Initialize line positions
  const initialLinePositions = useMemo(() => {
    const positions = new Float32Array(lineIndices.length * 3);
    for (let i = 0; i < lineIndices.length; i++) {
      const particleIndex = lineIndices[i];
      positions[i * 3] = originalPositions[particleIndex * 3];
      positions[i * 3 + 1] = originalPositions[particleIndex * 3 + 1];
      positions[i * 3 + 2] = originalPositions[particleIndex * 3 + 2];
    }
    return positions;
  }, [lineIndices, originalPositions]);
  
  return (
    <group ref={groupRef}>
      {/* Particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={new Float32Array(originalPositions)}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          color="#66FCF1"
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Connection Lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={lineIndices.length}
            array={initialLinePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#66FCF1"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

interface ParticleSphereProps {
  className?: string;
}

export default function ParticleSphere({ className }: ParticleSphereProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  return (
    <div 
      className={`w-full h-full transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <ParticleField
          count={1500}
          radius={2.8}
          mouseInfluence={1.2}
          returnSpeed={0.06}
          maxDisplacement={1.2}
        />
      </Canvas>
    </div>
  );
}
