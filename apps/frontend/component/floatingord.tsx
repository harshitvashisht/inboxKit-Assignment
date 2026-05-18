"use client"
import { useState } from "react";
//@ts-ignore
export default function FloatingOrb({ index, size, position, delay, color }){

      const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

      
    const moveX = (mousePosition.x - 0.5) * (index + 1) * 30;
    const moveY = (mousePosition.y - 0.5) * (index + 1) * 30;

    return (
      <div
        className="absolute rounded-full blur-xl transition-transform duration-500 ease-out animate-pulse"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          ...position,
          transform: `translate(${moveX}px, ${moveY}px)`,
          animationDuration: '6s',
          animationDelay: `${delay}s`,
        }}
      />
    );
}