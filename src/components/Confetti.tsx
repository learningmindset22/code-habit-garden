
import React, { useEffect, useRef } from 'react';

interface ConfettiProps {
  show: boolean;
  onComplete?: () => void;
}

const Confetti: React.FC<ConfettiProps> = ({ show, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (!show || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Confetti particles
    const particles: Particle[] = [];
    
    // Confetti colors
    const colors = [
      'rgba(54, 162, 235, 0.7)',    // Blue
      'rgba(75, 192, 192, 0.7)',    // Teal
      'rgba(153, 102, 255, 0.7)',   // Purple
      'rgba(255, 159, 64, 0.7)',    // Orange
      'rgba(255, 99, 132, 0.7)',    // Pink
    ];
    
    // Particle class
    class Particle {
      x: number;
      y: number;
      color: string;
      size: number;
      speed: number;
      angle: number;
      rotation: number;
      rotationSpeed: number;
      gravity: number;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height / 2 - canvas.height / 2;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.size = Math.random() * 10 + 5;
        this.speed = Math.random() * 3 + 2;
        this.angle = Math.random() * Math.PI * 2;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = Math.random() * 0.2 - 0.1;
        this.gravity = 0.1;
      }
      
      update() {
        this.y += this.speed;
        this.x += Math.sin(this.angle) * 2;
        this.rotation += this.rotationSpeed;
        this.speed += this.gravity;
        
        // Reset if out of bounds
        if (this.y > canvas.height) {
          this.y = Math.random() * canvas.height / 2 - canvas.height / 2;
          this.x = Math.random() * canvas.width;
          this.speed = Math.random() * 3 + 2;
        }
      }
      
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color;
        
        // Draw rectangle confetti
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        
        ctx.restore();
      }
    }
    
    // Create confetti particles
    for (let i = 0; i < 150; i++) {
      particles.push(new Particle());
    }
    
    // Animation loop
    let frameCount = 0;
    const maxFrames = 180; // 3 seconds at 60fps
    
    const animate = () => {
      frameCount++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      if (frameCount < maxFrames) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        if (onComplete) onComplete();
      }
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [show, onComplete]);
  
  if (!show) return null;
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
    />
  );
};

export default Confetti;
