// Neural Network Visualization Component
// An interactive canvas-based neural network with mouse interactions

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  connections: number[];
  brightness: number;
}

interface Props {
  nodeCount?: number;
  connectionDistance?: number;
}

export default function NeuralNetwork({ 
  nodeCount = 80, 
  connectionDistance = 150 
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const nodesRef = useRef<Node[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize nodes
  const initNodes = useCallback((width: number, height: number) => {
    const nodes: Node[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        connections: [],
        brightness: Math.random() * 0.5 + 0.5,
      });
    }
    nodesRef.current = nodes;
  }, [nodeCount]);

  // Calculate connections between nodes
  const updateConnections = useCallback(() => {
    const nodes = nodesRef.current;
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].connections = [];
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < connectionDistance) {
          nodes[i].connections.push(j);
        }
      }
    }
  }, [connectionDistance]);

  // Animation loop
  const animate = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    
    const nodes = nodesRef.current;
    const mouse = mouseRef.current;
    
    // Update node positions
    for (const node of nodes) {
      // Apply velocity
      node.x += node.vx;
      node.y += node.vy;
      
      // Bounce off edges
      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;
      
      // Keep within bounds
      node.x = Math.max(0, Math.min(width, node.x));
      node.y = Math.max(0, Math.min(height, node.y));
      
      // Mouse interaction - gentle attraction/repulsion
      const dx = mouse.x - node.x;
      const dy = mouse.y - node.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 200 && distance > 0) {
        const force = (200 - distance) / 200 * 0.02;
        node.vx += (dx / distance) * force;
        node.vy += (dy / distance) * force;
        node.brightness = Math.min(1, node.brightness + 0.1);
      } else {
        node.brightness = Math.max(0.5, node.brightness - 0.02);
      }
      
      // Apply friction
      node.vx *= 0.99;
      node.vy *= 0.99;
    }
    
    // Update connections
    updateConnections();
    
    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      for (const j of node.connections) {
        const other = nodes[j];
        const dx = node.x - other.x;
        const dy = node.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const opacity = (1 - distance / connectionDistance) * 0.3;
        
        // Check if near mouse for highlight effect
        const midX = (node.x + other.x) / 2;
        const midY = (node.y + other.y) / 2;
        const mouseDist = Math.sqrt(
          (mouse.x - midX) ** 2 + (mouse.y - midY) ** 2
        );
        
        if (mouseDist < 100) {
          // Highlighted connection (cyan)
          ctx.strokeStyle = `rgba(102, 252, 241, ${opacity * 2})`;
          ctx.lineWidth = 1.5;
        } else {
          // Normal connection
          ctx.strokeStyle = `rgba(102, 252, 241, ${opacity})`;
          ctx.lineWidth = 0.5;
        }
        
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
      }
    }
    
    // Draw nodes
    for (const node of nodes) {
      const dx = mouse.x - node.x;
      const dy = mouse.y - node.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Glow effect for nearby nodes
      if (distance < 150) {
        const glowSize = (1 - distance / 150) * 20;
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, glowSize
        );
        gradient.addColorStop(0, 'rgba(102, 252, 241, 0.5)');
        gradient.addColorStop(1, 'rgba(102, 252, 241, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Draw node
      ctx.fillStyle = `rgba(102, 252, 241, ${node.brightness})`;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius * (distance < 100 ? 1.5 : 1), 0, Math.PI * 2);
      ctx.fill();
    }
    
    animationRef.current = requestAnimationFrame(() => animate(ctx, width, height));
  }, [connectionDistance, updateConnections]);

  // Setup canvas and start animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initNodes(canvas.width, canvas.height);
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    
    // Start animation
    setIsLoaded(true);
    animate(ctx, canvas.width, canvas.height);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationRef.current);
    };
  }, [animate, initNodes]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
      className="absolute inset-0"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: 'transparent' }}
      />
    </motion.div>
  );
}
