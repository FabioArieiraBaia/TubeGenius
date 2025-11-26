
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useCallback, useState } from 'react';
import { CurvedArrowDownIcon } from './components/icons';
import LoadingIndicator from './components/LoadingIndicator';
import PromptForm from './components/PromptForm';
import VideoResult from './components/VideoResult';
import TextResult from './components/TextResult';
import IntroAnimation from './components/IntroAnimation';
import { generateImage } from './services/geminiService';
import { AppState, GenerateImageParams, GenerationMode, ViralTitle } from './types';

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [textResults, setTextResults] = useState<ViralTitle[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastConfig, setLastConfig] = useState<GenerateImageParams | null>(null);

  // State to control prompt form via props (for "Create Thumbnail from Title" flow)
  const [forcedPrompt, setForcedPrompt] = useState<string | undefined>(undefined);
  const [forcedMode, setForcedMode] = useState<GenerationMode | undefined>(undefined);

  const handleGenerate = useCallback(async (params: GenerateImageParams) => {
    setAppState(AppState.LOADING);
    setErrorMessage(null);
    setLastConfig(params);
    setImageUrls([]);
    setTextResults([]);

    try {
      const result = await generateImage(params);
      
      if (result.textResults && result.textResults.length > 0) {
        setTextResults(result.textResults);
        setAppState(AppState.SUCCESS);
      } else if (result.imageUrls && result.imageUrls.length > 0) {
        setImageUrls(result.imageUrls);
        setAppState(AppState.SUCCESS);
      } else {
        throw new Error("No results generated");
      }
    } catch (error) {
      console.error('Generation failed:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred.';
      setErrorMessage(`Generation failed: ${errorMessage}`);
      setAppState(AppState.ERROR);
    }
  }, []);

  const handleRetry = useCallback(() => {
    if (lastConfig) {
      handleGenerate(lastConfig);
    }
  }, [lastConfig, handleGenerate]);

  const handleNew = useCallback(() => {
    setAppState(AppState.IDLE);
    setImageUrls([]);
    setTextResults([]);
    setErrorMessage(null);
    setLastConfig(null);
    setForcedPrompt(undefined);
    setForcedMode(undefined);
  }, []);

  const handleUseTitle = useCallback((title: string) => {
    setForcedPrompt(title);
    setForcedMode(GenerationMode.YOUTUBE_THUMBNAIL);
    setAppState(AppState.IDLE);
    setTextResults([]);
  }, []);

  const renderError = (message: string) => (
    <div className="text-center bg-red-900/20 border border-red-500 p-8 rounded-lg max-w-lg">
      <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
      <p className="text-red-300">{message}</p>
      <button
        onClick={handleRetry}
        className="mt-6 px-6 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
        Try Again
      </button>
      <button
        onClick={handleNew}
        className="mt-2 ml-4 px-6 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors">
        New Prompt
      </button>
    </div>
  );

  return (
    <>
      {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}
      
      <div className={`h-screen bg-black text-gray-200 flex flex-col font-sans overflow-hidden transition-opacity duration-1000 ${showIntro ? 'opacity-0' : 'opacity-100'}`}>
        <header className="py-6 flex justify-center items-center px-8 relative z-10 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md">
          <h1 className="text-4xl font-bold tracking-tight text-center">
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Tube</span>
            <span className="text-white">Genius</span>
            <span className="ml-2 text-sm font-normal text-gray-400 border border-gray-700 px-2 py-0.5 rounded-full">AI Studio</span>
          </h1>
        </header>
        <main className="w-full max-w-6xl mx-auto flex-grow flex flex-col p-4 overflow-y-auto custom-scrollbar">
          {appState === AppState.IDLE ? (
            <>
              <div className="flex-grow flex items-center justify-center min-h-[400px]">
                <div className="relative text-center max-w-2xl">
                  <h2 className="text-5xl font-bold text-white mb-6">
                    Create <span className="text-emerald-400">Viral</span> Thumbnails
                  </h2>
                  <p className="text-xl text-gray-400 mb-12">
                    Enter your video title. We generate 3 high-CTR variations instantly.
                  </p>
                  <CurvedArrowDownIcon className="mx-auto w-16 h-16 text-gray-700 animate-bounce" />
                </div>
              </div>
              <div className="pb-12">
                <PromptForm 
                  onGenerate={handleGenerate} 
                  initialPrompt={forcedPrompt}
                  initialMode={forcedMode}
                />
              </div>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center py-8">
              {appState === AppState.LOADING && <LoadingIndicator />}
              
              {appState === AppState.SUCCESS && textResults.length > 0 && (
                 <TextResult 
                    titles={textResults}
                    onUseTitle={handleUseTitle}
                    onNew={handleNew}
                 />
              )}

              {appState === AppState.SUCCESS && imageUrls.length > 0 && (
                <VideoResult
                  imageUrls={imageUrls}
                  onRetry={handleRetry}
                  onNew={handleNew}
                />
              )}
              
              {appState === AppState.ERROR &&
                errorMessage &&
                renderError(errorMessage)}
            </div>
          )}
        </main>
        
        {/* Footer Credits */}
        <footer className="py-4 text-center border-t border-gray-800 bg-gray-900/30 text-xs text-gray-500">
          <p>
            Designed & Developed by <a href="https://fabioarieira.com" target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">Fábio Arieira</a>
          </p>
          <p className="opacity-50 mt-1">35 Years of Technology Excellence • fabioarieira.com</p>
        </footer>
      </div>
    </>
  );
};

export default App;
