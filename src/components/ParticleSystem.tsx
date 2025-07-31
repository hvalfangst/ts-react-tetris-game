import React from 'react';
import type { ParticleEffect } from '../types/tetris';

interface ParticleSystemProps {
  particles: ParticleEffect[];
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({ particles }) => {
  return (
    <div className="particle-system">
      {particles.map((particle) => {
        const opacity = particle.life / particle.maxLife;
        const scale = 0.5 + (opacity * 0.5);
        
        return (
          <div
            key={particle.id}
            className="particle"
            style={{
              position: 'absolute',
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: '4px',
              height: '4px',
              backgroundColor: particle.color,
              borderRadius: '50%',
              opacity,
              transform: `scale(${scale})`,
              pointerEvents: 'none',
              boxShadow: `0 0 4px ${particle.color}`,
            }}
          />
        );
      })}
    </div>
  );
};