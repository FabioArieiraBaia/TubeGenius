
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useState } from 'react';

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Timeline of the animation
    const timers = [
      setTimeout(() => setStep(1), 500),  // App Name
      setTimeout(() => setStep(2), 2000), // Dev Name
      setTimeout(() => setStep(3), 3500), // Exp & Site
      setTimeout(() => setExiting(true), 5500), // Start Exit
      setTimeout(() => onComplete(), 6500), // Unmount
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden font-mono transition-opacity duration-1000 ${
        exiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_1px,transparent_1px),linear-gradient(90deg,rgba(18,18,18,0)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>

      <div className="relative z-10 text-center px-4">
        
        {/* Step 1: App Name */}
        <div className={`transition-all duration-1000 transform ${step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-2 glitch-text">
            TUBE<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">GENIUS</span>
          </h1>
          <div className="h-0.5 w-24 bg-gray-700 mx-auto rounded-full mb-12"></div>
        </div>

        {/* Step 2: Developer Name */}
        <div className={`transition-all duration-1000 delay-200 transform ${step >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <p className="text-gray-400 text-sm uppercase tracking-[0.3em] mb-2">Developed By</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 text-shadow-glow">
            Fábio Arieira
          </h2>
        </div>

        {/* Step 3: Experience & Site */}
        <div className={`transition-all duration-1000 delay-500 transform ${step >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <div className="flex items-center justify-center gap-3 text-emerald-400 text-sm md:text-base font-bold my-4">
             <span className="border border-emerald-500/50 px-2 py-0.5 rounded bg-emerald-500/10">35 YEARS EXPERIENCE</span>
             <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
             <span className="text-gray-300">FULL STACK ARCHITECT</span>
          </div>
          <p className="text-indigo-400 hover:text-indigo-300 transition-colors tracking-widest text-sm">
            fabioarieira.com
          </p>
        </div>
      </div>

      {/* Futuristic Scanline */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-1/4 w-full animate-scanline pointer-events-none"></div>
    </div>
  );
};

export default IntroAnimation;
