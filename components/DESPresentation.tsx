'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize, Minimize, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { generateDESPresentation, generateDESDecryptionPresentation, DESSlideData, DESCell } from '@/lib/des';

export default function DESPresentation() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [slides, setSlides] = useState<DESSlideData[]>(() =>
    generateDESPresentation('HELLO DS', 'KEY12345')
  );
  
  const [currentStep, setCurrentStep] = useState(0);
  const slide = slides[currentStep];

  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [ptInput, setPtInput] = useState('HELLO DS');
  const [kyInput, setKyInput] = useState('KEY12345');

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    let newSlides;
    if (mode === 'encrypt') {
      newSlides = generateDESPresentation(ptInput, kyInput);
    } else {
      newSlides = generateDESDecryptionPresentation(ptInput, kyInput);
    }
    setSlides(newSlides);
    setCurrentStep(2); 
  };

  const nextStep = () => {
    if (currentStep < slides.length - 1) setCurrentStep((s) => s + 1);
  };
  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') return;
      if (e.key === 'ArrowRight' || e.code === 'Space') {
        e.preventDefault();
        setCurrentStep((s) => (s < slides.length - 1 ? s + 1 : s));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentStep((s) => (s > 0 ? s - 1 : s));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length]);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen().catch(err => console.error(err));
    }
  };

  const renderGrid = (currentGrid?: DESCell[][]) => {
    if (!currentGrid) return null;
    return (
      <div className="flex flex-col relative items-center">
        <span className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">64-bit State (8 Bytes)</span>
        <div className="flex border-2 border-slate-800 bg-slate-800 gap-[1px]">
          {currentGrid[0].map((cell, cIdx) => (
             <motion.div
              key={cell.id} 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: cIdx * 0.1 }}
              className="w-10 h-14 md:w-16 md:h-16 flex items-center justify-center bg-white font-mono text-sm md:text-base font-bold text-slate-900 relative"
             >
               {cell.val}
             </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderFeistel = (slideData: DESSlideData) => {
    const { L, R, roundKey, er, xor, sbox, feistelF, newR } = slideData;
    if(!L || !R) return null;
    return (
      <div className="flex flex-col items-center w-full max-w-4xl relative gap-6 py-6 md:py-8 h-full">
         <div className="flex justify-between w-full max-w-lg px-8">
            <div className="flex flex-col items-center">
               <span className="text-xs font-bold text-slate-500 mb-1 md:mb-2 uppercase">L (32 bits)</span>
               <div className="bg-white border-2 border-slate-800 px-3 py-1.5 md:px-4 md:py-2 font-mono font-bold text-sm md:text-base">{L}</div>
            </div>
            <div className="flex flex-col items-center">
               <span className="text-xs font-bold text-slate-500 mb-1 md:mb-2 uppercase">R (32 bits)</span>
               <div className="bg-white border-2 border-slate-800 px-3 py-1.5 md:px-4 md:py-2 font-mono font-bold text-sm md:text-base">{R}</div>
            </div>
         </div>

         <div className="relative w-full max-w-xl border border-slate-300 rounded-lg p-4 md:p-6 flex flex-col items-center bg-slate-50 shadow-sm mx-4">
            <div className="text-[10px] sm:text-xs font-bold text-purple-600 uppercase tracking-widest absolute -top-2.5 bg-slate-50 px-2 left-1/2 -translate-x-1/2">
              f function
            </div>

            <div className="flex flex-col gap-3 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-slate-200 p-2 md:p-3 rounded">
                <span className="text-[10px] md:text-xs font-bold text-slate-500 w-32 shrink-0">1. Expansion (E)</span>
                <span className="font-mono text-[9px] md:text-xs text-blue-600 break-all">{er}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-slate-200 p-2 md:p-3 rounded">
                <span className="text-[10px] md:text-xs font-bold text-slate-500 w-32 shrink-0">Round Key</span>
                <span className="font-mono text-[9px] md:text-xs text-slate-700 break-all">
                  {roundKey && <span className="text-[8px] text-slate-400 mr-2 bg-slate-100 px-1 rounded">(HEX)</span>}{roundKey}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-slate-200 p-2 md:p-3 rounded">
                <span className="text-[10px] md:text-xs font-bold text-slate-500 w-32 shrink-0">2. XOR Mixing</span>
                <span className="font-mono text-[9px] md:text-xs text-purple-600 break-all">{xor}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-slate-200 p-2 md:p-3 rounded">
                <span className="text-[10px] md:text-xs font-bold text-slate-500 w-32 shrink-0">3. S-Box (Sub)</span>
                <span className="font-mono text-[9px] md:text-xs text-green-600 break-all">{sbox}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-slate-200 p-2 md:p-3 rounded">
                <span className="text-[10px] md:text-xs font-bold text-slate-500 w-32 shrink-0">4. Permutation (P)</span>
                <span className="font-mono font-bold text-[10px] md:text-xs text-slate-800 break-all">{feistelF}</span>
              </div>
            </div>
         </div>

         <div className="flex justify-between w-full max-w-lg px-8 relative mt-2 md:mt-4">
            <svg className="absolute inset-0 w-full h-full -top-10 -z-10" preserveAspectRatio="none">
               <path d="M 64 -40 L 400 0" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" fill="none" />
               <path d="M 400 -40 L 64 0" stroke="#cbd5e1" strokeWidth="2" fill="none" />
            </svg>

            <div className="flex flex-col items-center bg-white p-2 z-10 rounded">
               <span className="text-xs font-bold text-slate-500 mb-1 uppercase">New L</span>
               <div className="bg-white border-2 border-slate-800 px-3 py-1.5 md:px-4 md:py-2 font-mono font-bold text-sm md:text-base">{R}</div>
            </div>
            <div className="flex flex-col items-center bg-white p-2 z-10 rounded">
               <span className="text-xs font-bold text-slate-500 mb-1 uppercase">New R (L ⊕ f)</span>
               <div className="bg-purple-600 text-white border-2 border-purple-800 px-3 py-1.5 md:px-4 md:py-2 font-mono font-bold text-sm md:text-base">{newR}</div>
            </div>
         </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="w-full h-full bg-slate-50 flex flex-col font-sans relative overflow-hidden">
      
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-40 relative shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center transform rotate-45">
             <div className="w-4 h-4 border-2 border-white transform -rotate-45" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">DES Interactive <span className="text-purple-600">Explorer</span></h1>
        </div>
        
        <div className="hidden md:flex flex-1 max-w-2xl mx-8">
           <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
             {slides.map((_, i) => (
                <div key={`nav-${i}`} className={`h-full flex-1 border-r border-white last:border-0 ${i <= currentStep ? 'bg-purple-600' : ''}`} />
             ))}
           </div>
        </div>

        <button onClick={toggleFullscreen} className="p-2 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors">
          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row min-h-0 relative">
        <div className="flex-1 overflow-y-auto relative p-4 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 w-full max-w-6xl mx-auto flex flex-col items-center justify-center"
            >
            {slide.type === 'intro' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-6 max-w-lg text-center"
              >
                 <p className="text-slate-600 text-lg leading-relaxed">{slide.description}</p>
                 <button 
                    onClick={nextStep}
                    className="bg-purple-600 text-white rounded px-8 py-3 flex items-center gap-2 hover:bg-purple-700 transition-colors shadow shadow-purple-200 font-bold"
                 >
                   <Play className="w-5 h-5" fill="currentColor"/>
                   <span>Start Presentation</span>
                 </button>
              </motion.div>
            )}

            {slide.type === 'input' && (
              <motion.div 
                 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                 className="w-full max-w-md bg-white border-2 border-slate-800 p-8 shadow-[4px_4px_0px_0px_rgba(30,41,59,1)]"
              >
                <div className="flex bg-slate-100 p-1 rounded border border-slate-200 mb-6">
                  <button type="button" onClick={() => setMode('encrypt')} className={`flex-1 py-2 text-xs font-bold uppercase rounded ${mode === 'encrypt' ? 'bg-white shadow text-purple-600' : 'text-slate-500 hover:text-slate-700'}`}>Encrypt</button>
                  <button type="button" onClick={() => setMode('decrypt')} className={`flex-1 py-2 text-xs font-bold uppercase rounded ${mode === 'decrypt' ? 'bg-white shadow text-purple-600' : 'text-slate-500 hover:text-slate-700'}`}>Decrypt</button>
                </div>
                <form onSubmit={handleGenerate} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{mode === 'encrypt' ? 'Plaintext Block' : 'Ciphertext (HEX)'}</label>
                    <input
                      type="text"
                      maxLength={mode === 'encrypt' ? 8 : 16}
                      value={ptInput}
                      onChange={(e) => setPtInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-4 py-3 text-sm font-mono focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all text-slate-900"
                      placeholder={mode === 'encrypt' ? "8 characters" : "16 hex characters"}
                    />
                    <div className="text-[10px] uppercase font-bold text-slate-400 text-right">{ptInput.length} / {mode === 'encrypt' ? 8 : 16} {mode === 'encrypt' ? 'bytes' : 'hex chars'}</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Secret Key</label>
                    <input
                      type="text"
                      maxLength={8}
                      value={kyInput}
                      onChange={(e) => setKyInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-4 py-3 text-sm font-mono focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all text-slate-900"
                      placeholder="8 characters"
                    />
                  </div>
                  <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded hover:bg-slate-800 transition-colors shadow">
                    Generate Visualization
                  </button>
                </form>
              </motion.div>
            )}

            {slide.type === 'hex-conv' && slide.plaintext && slide.hexBytes && (
              <div className="w-full flex items-center justify-center relative">
                <div className="flex flex-wrap justify-center gap-2 md:gap-4 max-w-2xl mt-4">
                   {slide.plaintext.split('').map((char, i) => (
                     <div key={`pt-${i}`} className="flex flex-col items-center gap-1 md:gap-2">
                       <div className="w-8 h-8 md:w-10 md:h-10 border border-slate-300 bg-white shadow-sm flex items-center justify-center font-bold md:text-lg text-slate-700">{char}</div>
                       <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 20, opacity: 1 }} transition={{ delay: i * 0.05 + 0.3 }} className="w-px bg-slate-300 h-[10px] md:h-[20px] relative">
                         <div className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 border-r border-b border-slate-400 rotate-45"></div>
                       </motion.div>
                       <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 + 0.5 }} className="w-8 h-8 md:w-10 md:h-10 border border-purple-200 bg-purple-50 text-purple-700 flex items-center justify-center font-mono font-bold text-xs md:text-sm">
                         {slide.hexBytes![i]?.toString(16).padStart(2, '0').toUpperCase()}
                       </motion.div>
                     </div>
                   ))}
                </div>
              </div>
            )}

            {slide.type === 'key-expansion' && slide.roundKeys && (
              <div className="w-full h-full flex flex-col pt-4 overflow-hidden relative">
                <div className="flex-1 overflow-y-auto pb-12 px-4 flex justify-center">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 sm:gap-x-12 gap-y-8 h-max">
                    {slide.roundKeys.map((rk, roundIdx) => (
                      <motion.div 
                        key={`rk-${roundIdx}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: roundIdx * 0.05 }}
                        className="flex flex-col items-center flex-shrink-0"
                      >
                        <div className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 whitespace-nowrap">
                          Round {roundIdx + 1} Key
                        </div>
                        <div className="p-2 bg-slate-100 border border-slate-300 shadow-sm rounded-sm font-mono text-sm font-bold text-slate-700">
                           {rk}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {(slide.type === 'ip' || slide.type === 'fp' || slide.type === 'summary') && (
              <div className="w-full min-h-full flex flex-col items-center py-4 sm:py-8 justify-center">
                 {renderGrid(slide.grid)}
              </div>
            )}
            
            {slide.type === 'feistel' && (
              <div className="w-full min-h-full flex flex-col items-center py-4 sm:py-8 justify-center overflow-y-auto">
                 {renderFeistel(slide)}
              </div>
            )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-80 bg-white border-t md:border-t-0 md:border-l border-slate-200 p-6 flex flex-col justify-between shrink-0 shadow-[-4px_0_15px_rgba(0,0,0,0.03)] z-30 relative relative min-h-[250px] md:min-h-0">
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={`desc-${slide.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-[10px] font-bold text-purple-600 mb-2 uppercase tracking-widest flex items-center gap-2">
                  <span>Concept Guide</span>
                  <div className="h-px bg-purple-100 flex-1"></div>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">{slide.title}</h2>
                <div className="text-slate-600 leading-relaxed text-sm">
                  {slide.description}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
             <div className="flex items-center justify-between mb-4">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progress</span>
               <span className="text-[10px] font-bold text-slate-900 uppercase">{currentStep + 1} / {slides.length}</span>
             </div>
             
             <div className="flex items-center gap-2">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 font-bold py-3 rounded flex items-center justify-center transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={currentStep === slides.length - 1}
                  className="flex-[2] bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded flex items-center justify-center transition-colors shadow shadow-purple-200"
                >
                  {currentStep === 0 ? 'Start' : currentStep === slides.length - 1 ? 'Finish' : 'Continue'}
                </button>
             </div>
             
             <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-medium">
                <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">SPACE</span> 
                <span>to Play</span>
                <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200 ml-2">→</span> 
                <span>Next</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
