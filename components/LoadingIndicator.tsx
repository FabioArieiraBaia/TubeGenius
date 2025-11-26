
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "Analyzing viral trends...",
  "Maximizing contrast for click-through rate...",
  "Generating expressive reaction shots...",
  "Applying 4K cinematic lighting...",
  "Optimizing color saturation...",
  "Rendering 3 unique variations...",
  "Finalizing visual hooks...",
];

const LoadingIndicator: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 1500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div className="relative w-24 h-24 mb-8">
         <div className="absolute inset-0 border-t-4 border-red-500 rounded-full animate-spin"></div>
         <div className="absolute inset-3 border-t-4 border-orange-400 rounded-full animate-spin-reverse"></div>
      </div>
      <h2 className="text-2xl font-bold mt-4 text-white">Creating Thumbnails</h2>
      <p className="mt-2 text-gray-400 text-center transition-opacity duration-500 min-h-[1.5rem]">
        {loadingMessages[messageIndex]}
      </p>
    </div>
  );
};

export default LoadingIndicator;
