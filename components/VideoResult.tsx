
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { ArrowPathIcon, PlusIcon } from './icons';

interface VideoResultProps {
  imageUrls: string[];
  onRetry: () => void;
  onNew: () => void;
}

const VideoResult: React.FC<VideoResultProps> = ({
  imageUrls,
  onRetry,
  onNew,
}) => {
  return (
    <div className="w-full flex flex-col items-center gap-8 animate-in fade-in duration-500">
      <div className="text-center mb-4">
         <h2 className="text-3xl font-bold text-white mb-2">
            Thumbnails Ready
        </h2>
        <p className="text-gray-400">Choose the one that screams "Click Me"</p>
      </div>
     
      {/* Grid Layout for Multiple Results */}
      <div className={`grid gap-6 w-full ${imageUrls.length > 1 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'max-w-xl'}`}>
        {imageUrls.map((url, index) => (
            <div key={index} className="group relative flex flex-col gap-3 bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-xl hover:shadow-2xl hover:border-gray-500 transition-all">
                <div className="relative aspect-video bg-black overflow-hidden">
                    <img
                        src={url}
                        alt={`Result ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                         <a 
                            href={url} 
                            download={`thumbnail_${index + 1}.png`}
                            className="bg-white text-black font-bold px-4 py-2 rounded-full text-sm hover:bg-gray-200 transform hover:scale-105 transition-all"
                        >
                            Download High Res
                        </a>
                    </div>
                </div>
                {imageUrls.length > 1 && (
                    <div className="px-4 pb-3">
                         <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                            Option {index + 1}
                         </span>
                    </div>
                )}
            </div>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-8">
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-3 bg-gray-800 border border-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors">
          <ArrowPathIcon className="w-5 h-5" />
          Regenerate All
        </button>
        <button
          onClick={onNew}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-orange-900/20">
          <PlusIcon className="w-5 h-5" />
          New Title
        </button>
      </div>
    </div>
  );
};

export default VideoResult;
