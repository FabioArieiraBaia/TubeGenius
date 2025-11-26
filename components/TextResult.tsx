
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { ArrowRightIcon, ZapIcon } from './icons';
import { ViralTitle } from '../types';

interface TextResultProps {
  titles: ViralTitle[];
  onUseTitle: (title: string) => void;
  onNew: () => void;
}

const TextResult: React.FC<TextResultProps> = ({ titles, onUseTitle, onNew }) => {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 bg-emerald-400/20 border-emerald-500/50';
    if (score >= 75) return 'text-yellow-400 bg-yellow-400/20 border-yellow-500/50';
    return 'text-orange-400 bg-orange-400/20 border-orange-500/50';
  };

  const getBarColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 75) return 'bg-yellow-500';
    return 'bg-orange-500';
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6 animate-in fade-in duration-500">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <ZapIcon className="w-8 h-8 text-yellow-500 fill-yellow-500" />
            Viral Potential Analysis
        </h2>
        <p className="text-gray-400 text-lg">
            AI-predicted Click-Through Rates based on cognitive science.
        </p>
      </div>

      <div className="w-full grid gap-4">
        {titles.map((item, index) => (
          <div 
            key={index} 
            className="bg-[#1f1f1f] border border-gray-700 hover:border-gray-500 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all group shadow-xl relative overflow-hidden"
          >
            {/* Score Indicator */}
            <div className="flex flex-col items-center justify-center min-w-[80px] text-center">
                 <div className={`text-2xl font-black ${getScoreColor(item.score).split(' ')[0]}`}>
                     {item.score}%
                 </div>
                 <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Viral Score</span>
            </div>

            <div className="flex-grow w-full border-l border-gray-700 pl-0 md:pl-6">
                {/* Bias Badge */}
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                        Option {index + 1}
                    </span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getScoreColor(item.score)}`}>
                        {item.cognitiveBias}
                    </span>
                </div>

               {/* Title */}
               <h3 className="text-xl md:text-2xl font-medium text-white group-hover:text-yellow-400 transition-colors mb-3">
                   {item.title}
               </h3>

               {/* Progress Bar */}
               <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                   <div 
                      className={`h-full ${getBarColor(item.score)} transition-all duration-1000 ease-out`} 
                      style={{ width: `${item.score}%` }}
                   ></div>
               </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
               <button
                 onClick={() => handleCopy(item.title)}
                 className="flex-1 md:flex-none px-4 py-3 text-sm font-semibold bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-colors border border-gray-600"
               >
                 Copy
               </button>
               <button
                 onClick={() => onUseTitle(item.title)}
                 className="flex-1 md:flex-none px-6 py-3 text-sm bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold rounded-xl transition-transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
               >
                 Create Thumbnail
                 <ArrowRightIcon className="w-4 h-4" />
               </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onNew}
        className="mt-8 px-6 py-2 text-gray-400 hover:text-white border border-transparent hover:border-gray-700 rounded-full transition-all text-sm"
      >
        Go Back / Try New Topic
      </button>
    </div>
  );
};

export default TextResult;
