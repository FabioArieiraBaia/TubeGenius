
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useRef } from 'react';
import {
  AspectRatio,
  GenerateImageParams,
  GeminiModel,
  GenerationMode,
} from '../types';
import {
  ArrowRightIcon,
  ChevronDownIcon,
  RectangleStackIcon,
  SlidersHorizontalIcon,
  FramesModeIcon,
  XMarkIcon,
  TvIcon,
  SparklesIcon,
  BannerIcon,
  ZapIcon,
} from './icons';

const aspectRatioDisplayNames: Record<AspectRatio, string> = {
  [AspectRatio.SQUARE]: 'Square (1:1)',
  [AspectRatio.LANDSCAPE]: 'Landscape (16:9)',
  [AspectRatio.PORTRAIT]: 'Portrait (9:16)',
  [AspectRatio.LANDSCAPE_4_3]: 'Landscape (4:3)',
  [AspectRatio.PORTRAIT_4_3]: 'Portrait (3:4)',
};

const CustomSelect: React.FC<{
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ label, value, onChange, icon, children }) => (
  <div>
    <label className="text-xs block mb-1.5 font-medium text-gray-400">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        {icon}
      </div>
      <select
        value={value}
        onChange={onChange}
        className="w-full bg-[#1f1f1f] border border-gray-600 rounded-lg pl-10 pr-8 py-2.5 appearance-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-gray-200">
        {children}
      </select>
      <ChevronDownIcon className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
    </div>
  </div>
);

interface PromptFormProps {
  onGenerate: (params: GenerateImageParams) => void;
  initialPrompt?: string;
  initialMode?: GenerationMode;
}

const PromptForm: React.FC<PromptFormProps> = ({ onGenerate, initialPrompt, initialMode }) => {
  const [prompt, setPrompt] = useState(initialPrompt || '');
  const [description, setDescription] = useState('');
  const [mode, setMode] = useState<GenerationMode>(initialMode || GenerationMode.YOUTUBE_THUMBNAIL);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(
    AspectRatio.LANDSCAPE,
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [referenceImage, setReferenceImage] = useState<{
    data: string;
    mimeType: string;
    preview: string;
  } | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync props to state if they change
  useEffect(() => {
    if (initialPrompt !== undefined) setPrompt(initialPrompt);
    if (initialMode !== undefined) setMode(initialMode);
  }, [initialPrompt, initialMode]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [prompt]);

  useEffect(() => {
    const desc = descRef.current;
    if (desc) {
      desc.style.height = 'auto';
      desc.style.height = `${desc.scrollHeight}px`;
    }
  }, [description]);

  // Force Landscape for YouTube specific modes
  useEffect(() => {
    if (mode === GenerationMode.YOUTUBE_THUMBNAIL || mode === GenerationMode.CHANNEL_BANNER) {
      setAspectRatio(AspectRatio.LANDSCAPE);
    }
  }, [mode]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64Data = result.split(',')[1];
        const mimeType = result.split(';')[0].split(':')[1];
        setReferenceImage({
          data: base64Data,
          mimeType: mimeType,
          preview: result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setReferenceImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    onGenerate({
      prompt,
      description: mode === GenerationMode.CHANNEL_BANNER ? description : undefined,
      model: GeminiModel.FLASH_IMAGE,
      aspectRatio,
      referenceImage: referenceImage?.data,
      referenceImageMimeType: referenceImage?.mimeType,
      mode: mode,
    });
  };

  const handleContainerClick = () => {
    textareaRef.current?.focus();
  };

  const getBorderColor = () => {
    if (mode === GenerationMode.YOUTUBE_THUMBNAIL) return 'border-orange-500/50 focus-within:ring-orange-500/20';
    if (mode === GenerationMode.CHANNEL_BANNER) return 'border-purple-500/50 focus-within:ring-purple-500/20';
    if (mode === GenerationMode.VIRAL_TITLE) return 'border-yellow-500/50 focus-within:ring-yellow-500/20';
    return 'border-emerald-500/50 focus-within:ring-emerald-500/20';
  };

  const getButtonColor = () => {
    if (mode === GenerationMode.YOUTUBE_THUMBNAIL) return 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500';
    if (mode === GenerationMode.CHANNEL_BANNER) return 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500';
    if (mode === GenerationMode.VIRAL_TITLE) return 'bg-yellow-600 hover:bg-yellow-500 text-black font-bold';
    return 'bg-emerald-600 hover:bg-emerald-500';
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto z-10">
      {/* Mode Selector Tabs */}
      <div className="flex justify-center mb-6">
        <div className="bg-[#1f1f1f] p-1 rounded-xl border border-gray-700 inline-flex flex-wrap justify-center gap-1">
          <button
             type="button"
            onClick={() => setMode(GenerationMode.VIRAL_TITLE)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === GenerationMode.VIRAL_TITLE
                ? 'bg-yellow-500 text-black shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ZapIcon className="w-4 h-4" />
            Viral Titles
          </button>
          <button
            type="button"
            onClick={() => setMode(GenerationMode.YOUTUBE_THUMBNAIL)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === GenerationMode.YOUTUBE_THUMBNAIL
                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <TvIcon className="w-4 h-4" />
            Thumbnail
          </button>
           <button
            type="button"
            onClick={() => setMode(GenerationMode.CHANNEL_BANNER)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === GenerationMode.CHANNEL_BANNER
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BannerIcon className="w-4 h-4" />
            Banner
          </button>
          <button
             type="button"
            onClick={() => setMode(GenerationMode.STANDARD)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === GenerationMode.STANDARD
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <SparklesIcon className="w-4 h-4" />
            Standard
          </button>
        </div>
      </div>

      {/* Settings Panel (Standard Mode) */}
      {isSettingsOpen && mode === GenerationMode.STANDARD && (
        <div className="absolute bottom-full left-0 right-0 mb-3 p-4 bg-[#2c2c2e] rounded-xl border border-gray-700 shadow-2xl animate-in fade-in slide-in-from-bottom-2 z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <CustomSelect
              label="Aspect Ratio"
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
              icon={<RectangleStackIcon className="w-5 h-5 text-gray-400" />}>
              {Object.entries(aspectRatioDisplayNames).map(([key, name]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </CustomSelect>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full relative z-10">
        {/* Input Container */}
        <div className={`flex flex-col gap-2 bg-[#1f1f1f] border-2 rounded-2xl p-2 shadow-2xl focus-within:ring-4 transition-all duration-300 relative ${getBorderColor()}`}>
          
          {/* Reference Image Preview (Hidden in Viral Title Mode) */}
          {referenceImage && mode !== GenerationMode.VIRAL_TITLE && (
            <div className="relative mx-2 mt-2 w-fit group">
              <div className="relative rounded-lg overflow-hidden border border-gray-600 h-24 w-24">
                <img 
                  src={referenceImage.preview} 
                  alt="Reference" 
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center transition-all">
                   <button
                    type="button"
                    onClick={clearImage}
                    className="p-1 bg-red-500/80 rounded-full hover:bg-red-600 text-white transition-colors"
                    title="Remove image"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <span className="text-[10px] text-gray-400 block mt-1 text-center">Reference</span>
            </div>
          )}

          <div className="flex items-end gap-2 p-1">
             {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            
            {/* Image Upload Button (Hidden in Viral Title Mode) */}
            {mode !== GenerationMode.VIRAL_TITLE && (
                <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`p-3 rounded-xl hover:bg-gray-700 transition-colors mb-auto ${referenceImage ? 'text-emerald-400 bg-emerald-400/10' : 'text-gray-400'}`}
                title="Upload reference face or object"
                >
                <FramesModeIcon className="w-6 h-6" />
                </button>
            )}

            {/* CLICKABLE WRAPPER FOR TEXT INPUTS */}
            <div 
              className="flex-grow flex flex-col justify-center min-h-[50px] cursor-text gap-2 py-2"
              onClick={handleContainerClick}
            >
                {/* PRIMARY INPUT (Title/Prompt) */}
                <div className="flex flex-col">
                  {mode !== GenerationMode.STANDARD && (
                      <div className="flex items-center gap-2 mb-1">
                         <span className={`text-xs uppercase font-bold ml-1 tracking-wider pointer-events-none select-none ${
                             mode === GenerationMode.CHANNEL_BANNER ? 'text-purple-500' : 
                             mode === GenerationMode.VIRAL_TITLE ? 'text-yellow-500' : 'text-orange-500'
                         }`}>
                             {mode === GenerationMode.CHANNEL_BANNER ? 'Channel Name' : 
                              mode === GenerationMode.VIRAL_TITLE ? 'Video Topic / Basic Idea' : 'YouTube Video Title'}
                         </span>
                      </div>
                  )}
                  <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey && mode !== GenerationMode.CHANNEL_BANNER) {
                        e.preventDefault();
                        handleSubmit(e);
                        }
                    }}
                    placeholder={
                        mode === GenerationMode.YOUTUBE_THUMBNAIL 
                        ? "Ex: I Spent 50 Hours in VR..." 
                        : mode === GenerationMode.CHANNEL_BANNER
                        ? "Ex: Tech Reviews Daily"
                        : mode === GenerationMode.VIRAL_TITLE
                        ? "Ex: minecraft gameplay fail"
                        : "Describe the character or scene..."
                    }
                    className="w-full bg-transparent focus:outline-none resize-none text-lg text-gray-200 placeholder-gray-600"
                    rows={1}
                  />
                </div>

                {/* SECONDARY INPUT (Description - Banner Mode Only) */}
                {mode === GenerationMode.CHANNEL_BANNER && (
                   <div className="flex flex-col mt-2 border-t border-gray-700 pt-2 animate-in slide-in-from-top-2">
                      <span className="text-xs uppercase font-bold text-gray-500 mb-1 ml-1 tracking-wider pointer-events-none select-none">
                          Niche & Style Description
                      </span>
                      <textarea
                        ref={descRef}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                            }
                        }}
                        placeholder="Ex: Minimalist gaming, neon colors, controllers in background..."
                        className="w-full bg-transparent focus:outline-none resize-none text-base text-gray-300 placeholder-gray-600"
                        rows={1}
                      />
                   </div>
                )}
            </div>

            {mode === GenerationMode.STANDARD && (
                <button
                type="button"
                onClick={() => setIsSettingsOpen((prev) => !prev)}
                className={`p-3 rounded-xl hover:bg-gray-700 transition-colors mb-auto ${
                    isSettingsOpen ? 'bg-gray-700 text-white' : 'text-gray-300'
                }`}
                aria-label="Toggle settings">
                <SlidersHorizontalIcon className="w-5 h-5" />
                </button>
            )}
            
            <button
              type="submit"
              className={`p-3 rounded-xl transition-all shadow-lg transform active:scale-95 mb-auto ${getButtonColor()} disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed disabled:transform-none`}
              aria-label="Generate"
              disabled={!prompt.trim()}>
               {mode === GenerationMode.VIRAL_TITLE ? <ZapIcon className="w-6 h-6" /> : <ArrowRightIcon className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 text-center mt-3">
          {mode === GenerationMode.YOUTUBE_THUMBNAIL 
            ? "We automatically optimize for high contrast, emotive faces, and click-worthiness."
            : mode === GenerationMode.CHANNEL_BANNER 
            ? "Generates 16:9 branding assets optimized for YouTube channel headers."
            : mode === GenerationMode.VIRAL_TITLE
            ? "Generates 5 catchy, high-CTR title variations for your topic."
            : "Upload a sketch or base image for character consistency."}
        </p>
      </form>
    </div>
  );
};

export default PromptForm;
