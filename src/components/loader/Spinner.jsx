import React from 'react';
import { motion } from 'framer-motion';

export default function Spinner({
  size = 'md',
  primaryColor = '#6366f1', // indigo-500
  secondaryColor = '#ec4899', // pink-500
  speed = 'normal',
  style = 'cosmic',
  className = '',
  text = 'HOK TOK is working magic...',
}) {
  const sizeClasses = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-20 w-20',
  };

  const speedClasses = {
    slow: 3,
    normal: 1.8,
    fast: 1,
  };

  // Cosmic Rings - Now with proper color application
  const CosmicRings = () => (
    <div className={`relative ${sizeClasses[size]}`}>
      {[0.8, 0.6, 0.4].map((scale, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border-2 border-t-transparent"
          style={{ 
            scale,
            borderColor: i === 0 ? primaryColor : secondaryColor
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: speedClasses[speed] * (i + 1),
            ease: "linear",
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );

  // Galaxy Spinner with hex colors
  const GalaxySpinner = () => {
    const particles = 8;
    return (
      <div className={`relative ${sizeClasses[size]}`}>
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-opacity-30"
          style={{ borderColor: primaryColor }}
          animate={{ rotate: 360 }}
          transition={{
            duration: speedClasses[speed] * 2,
            ease: "linear",
            repeat: Infinity,
          }}
        />
        {[...Array(particles)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-0 h-2 w-2 rounded-full"
            style={{ 
              backgroundColor: i % 2 === 0 ? primaryColor : secondaryColor,
              x: '50%',
              y: 0
            }}
            animate={{
              x: ['50%', '120%', '50%', '-20%', '50%'],
              y: ['0%', '50%', '100%', '50%', '0%'],
            }}
            transition={{
              duration: speedClasses[speed],
              ease: "easeInOut",
              repeat: Infinity,
              times: [0, 0.25, 0.5, 0.75, 1],
            }}
          />
        ))}
      </div>
    );
  };

  // Neon Pulse with hex colors
  const NeonPulse = () => (
    <motion.div
      className={`${sizeClasses[size]} rounded-full`}
      style={{ 
        backgroundColor: primaryColor,
        boxShadow: `0 0 15px ${primaryColor}`
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.8, 1, 0.8],
      }}
      transition={{
        duration: speedClasses[speed],
        repeat: Infinity,
      }}
    />
  );

  // Firework Burst with hex colors
  const FireworkBurst = () => {
    const particles = 12;
    return (
      <div className={`relative ${sizeClasses[size]}`}>
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: primaryColor }}
          animate={{ scale: [1, 0.8, 1] }}
          transition={{
            duration: speedClasses[speed],
            repeat: Infinity,
          }}
        />
        {[...Array(particles)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full"
            style={{ 
              backgroundColor: i % 3 === 0 ? primaryColor : secondaryColor,
              x: '50%',
              y: '50%',
              opacity: 0
            }}
            animate={{
              x: ['50%', `${50 + Math.sin((i * 30) * (Math.PI/180)) * 100}%`],
              y: ['50%', `${50 + Math.cos((i * 30) * (Math.PI/180)) * 100}%`],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: speedClasses[speed],
              repeat: Infinity,
              delay: i * 0.05,
            }}
          />
        ))}
      </div>
    );
  };

  // Liquid Morph with hex colors
  const LiquidMorph = () => (
    <motion.div
      className={`${sizeClasses[size]}`}
      style={{ backgroundColor: primaryColor }}
      animate={{
        borderRadius: [
          '30% 70% 70% 30% / 30% 30% 70% 70%',
          '50% 50% 50% 50% / 50% 50% 50% 50%',
          '70% 30% 30% 70% / 70% 70% 30% 30%',
          '30% 70% 70% 30% / 30% 30% 70% 70%',
        ],
        rotate: 360,
      }}
      transition={{
        duration: speedClasses[speed] * 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );

  const renderSpinner = () => {
    switch (style) {
      case 'galaxy': return <GalaxySpinner />;
      case 'neon': return <NeonPulse />;
      case 'cosmic': return <CosmicRings />;
      case 'firework': return <FireworkBurst />;
      case 'liquid': return <LiquidMorph />;
      default: return <CosmicRings />;
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-6 ${className}`}>
      {renderSpinner()}
      {text && (
        <motion.p 
          className="text-sm font-medium text-gray-400 mt-4"
          animate={{ 
            opacity: [0.6, 1, 0.6],
            scale: [0.98, 1, 0.98],
          }}
          transition={{ 
            duration: speedClasses[speed],
            repeat: Infinity,
          }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}