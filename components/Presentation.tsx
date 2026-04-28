'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize, Minimize, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { generateAESPresentation, generateAESDecryptionPresentation, SlideData, Cell, SBOX, INV_SBOX } from '@/lib/aes';

export default function Presentation() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [slides, setSlides] = useState<SlideData[]>(() =>
    generateAESPresentation('HELLO AES CRYPTO', 'SECRET KEY 12345')
  );
  
  const [currentStep, setCurrentStep] = useState(0);
  const slide = slides[currentStep];

  // Forms limits
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [ptInput, setPtInput] = useState('HELLO AES CRYPTO');
  const [kyInput, setKyInput] = useState('SECRET KEY 12345');

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    let newSlides;
    if (mode === 'encrypt') {
      newSlides = generateAESPresentation(ptInput, kyInput);
    } else {
      newSlides = generateAESDecryptionPresentation(ptInput, kyInput);
    }
    setSlides(newSlides);
    setCurrentStep(2); // Skip straight to the process start
  };

  const nextStep = () => {
    if (currentStep < slides.length - 1) setCurrentStep((s) => s + 1);
  };
  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing
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

  // Fullscreen Management
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

  // Compute a single stable rendered Grid if it's a process block
  // We determine if we should render a grid at all
  const renderGrid = (currentGrid?: Cell[][], animType?: string, currentSlideId?: string, annotations?: any[]) => {
    if (!currentGrid) return null;
    return (
      <div className="flex flex-col relative items-center">
        <span className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">State Matrix</span>
        <div className="flex flex-col border-2 border-slate-800 bg-slate-800 gap-[1px]">
          {currentGrid.map((row, rIdx) => (
            <div key={`row-${rIdx}`} className="flex gap-[1px]">
              {row.map((cell, cIdx) => {
                let delay = 0;
                let bgActive = 'bg-blue-600';
                
                if (animType === 'subbytes') {
                    delay = (rIdx * 4 + cIdx) * 0.03;
                } else if (animType === 'mixcolumns') {
                    delay = cIdx * 0.15;
                } else if (animType === 'shiftrows') {
                    delay = rIdx * 0.15;
                    bgActive = 'bg-blue-500';
                } else if (animType === 'addroundkey') {
                    delay = 0;
                    bgActive = 'bg-indigo-500';
                } else if (animType === 'load-matrix') {
                    delay = (cIdx * 4 + rIdx) * 0.15;
                }

                const cellAnnotation = annotations?.find(a => a.row === rIdx && a.col === cIdx);

                return (
                 <motion.div
                  layout // Smoothly animate across screen if position in array changes (ShiftRows)
                  key={cell.id} // Important: ties layout tracking to the unique block ID
                  className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-white font-mono text-sm md:text-base text-slate-900 relative ${cellAnnotation ? 'z-30' : 'z-10'}`}
                 >
                  {animType && animType !== 'none' && animType !== 'load-matrix' && (
                    <motion.div 
                      key={`${currentSlideId}-${cell.id}-overlay`} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.4, 0] }}
                      transition={{ duration: 1.2, delay: delay, ease: 'easeOut' }}
                      className={`absolute inset-0 pointer-events-none z-0 ${bgActive}`}
                    />
                  )}
                  {cellAnnotation && (
                    <motion.div 
                      key={`annot-${currentSlideId}-${rIdx}-${cIdx}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9 }}
                      className={`absolute z-20 ${
                        cellAnnotation.pos === 'top' ? 'bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2' :
                        cellAnnotation.pos === 'bottom' ? 'top-[calc(100%+12px)] left-1/2 -translate-x-1/2' :
                        cellAnnotation.pos === 'left' ? 'right-[calc(100%+12px)] top-1/2 -translate-y-1/2' :
                        'left-[calc(100%+12px)] top-1/2 -translate-y-1/2'
                      }`}
                    >
                      <div className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap shadow-lg">
                        {cellAnnotation.text}
                      </div>
                      <div className={`absolute w-0 h-0 border-[6px] border-transparent ${
                        cellAnnotation.pos === 'top' ? 'top-full left-1/2 -translate-x-1/2 border-t-blue-600 border-b-0' :
                        cellAnnotation.pos === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 border-b-blue-600 border-t-0' :
                        cellAnnotation.pos === 'left' ? 'left-full top-1/2 -translate-y-1/2 border-l-blue-600 border-r-0' :
                        'right-full top-1/2 -translate-y-1/2 border-r-blue-600 border-l-0'
                      }`} />
                    </motion.div>
                  )}
                  <motion.span
                    key={animType === 'load-matrix' ? `load-${currentSlideId}-${cell.val}` : cell.val} // Preserve ShiftRows layout animation
                    initial={ animType === 'load-matrix' ? { opacity: 0, scale: 0.1, y: 15 } : { opacity: 0, scale: 0.5, y: -10 } }
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={ animType === 'load-matrix' ? { delay: delay, type: 'spring', stiffness: 200, damping: 12 } : { delay: delay * 0.5 } }
                    className="absolute font-bold z-10"
                  >
                    {cell.val}
                  </motion.span>
                 </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div 
      ref={containerRef} 
      className="h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden flex flex-col"
    >
      {/* Header Section */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 flex items-center justify-center rounded-sm rotate-45">
            <div className="w-4 h-4 bg-white -rotate-45"></div>
          </div>
          <h1 className="text-xl font-bold tracking-tight hidden sm:block">AES Interactive <span className="text-blue-600">Explorer</span></h1>
          <h1 className="text-xl font-bold tracking-tight sm:hidden">AES <span className="text-blue-600">Explorer</span></h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-1">
            {slides.map((_, i) => (
              <div 
                key={i} 
                className={`w-6 lg:w-10 h-1 transition-colors ${i <= currentStep ? 'bg-blue-600' : 'bg-slate-200'}`}
              ></div>
            ))}
          </div>
          <button 
            onClick={toggleFullscreen} 
            className="px-4 py-1.5 border border-slate-300 rounded text-sm font-medium hover:bg-slate-50 text-slate-700"
          >
            {isFullscreen ? 'Exit Full Screen' : 'Full Screen Mode'}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:flex-row gap-0 overflow-y-auto">
        {/* Left: Visualization */}
        <div className="flex-1 p-6 md:p-10 flex flex-col items-center justify-center bg-white min-h-[400px]">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-light mb-2"><span className="font-bold">{slide.title}</span></h2>
            <p className="text-slate-500 uppercase tracking-widest text-xs">Step {currentStep + 1} / {slides.length}</p>
          </div>

          {/* Dynamic Inner Stage based on Slide Type */}
          <div className="w-full flex flex-col items-center justify-center flex-1">
            {slide.type === 'intro' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-6 max-w-lg text-center"
              >
                 <p className="text-slate-600 text-lg leading-relaxed">{slide.description}</p>
                 <button 
                    onClick={nextStep}
                    className="bg-blue-600 text-white rounded px-8 py-3 flex items-center gap-2 hover:bg-blue-700 transition-colors shadow shadow-blue-200 font-bold"
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
                  <button type="button" onClick={() => setMode('encrypt')} className={`flex-1 py-2 text-xs font-bold uppercase rounded ${mode === 'encrypt' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>Encrypt</button>
                  <button type="button" onClick={() => setMode('decrypt')} className={`flex-1 py-2 text-xs font-bold uppercase rounded ${mode === 'decrypt' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>Decrypt</button>
                </div>
                <form onSubmit={handleGenerate} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{mode === 'encrypt' ? 'Plaintext Block' : 'Ciphertext (HEX)'}</label>
                    <input
                      type="text"
                      maxLength={mode === 'encrypt' ? 16 : 32}
                      value={ptInput}
                      onChange={(e) => setPtInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-4 py-3 text-sm font-mono focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-slate-900"
                      placeholder={mode === 'encrypt' ? "16 characters" : "32 hex characters"}
                    />
                    <div className="text-[10px] uppercase font-bold text-slate-400 text-right">{ptInput.length} / {mode === 'encrypt' ? 16 : 32} {mode === 'encrypt' ? 'bytes' : 'hex chars'}</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Encryption Key</label>
                    <input
                      type="text"
                      maxLength={16}
                      value={kyInput}
                      onChange={(e) => setKyInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-4 py-3 text-sm font-mono focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-slate-900"
                      placeholder="16 characters"
                    />
                    <div className="text-[10px] uppercase font-bold text-slate-400 text-right">{kyInput.length} / 16 bytes</div>
                  </div>
                  <button type="submit" className="w-full bg-blue-600 text-white rounded py-3 font-bold hover:bg-blue-700 transition-colors mt-2 uppercase tracking-wide text-sm">
                    Set Params & Begin {mode === 'encrypt' ? 'Encryption' : 'Decryption'}
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
                       <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 + 0.5 }} className="w-8 h-8 md:w-10 md:h-10 border border-blue-200 bg-blue-50 text-blue-700 flex items-center justify-center font-mono font-bold text-xs md:text-sm">
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
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 sm:gap-x-12 gap-y-8 h-max">
                    {slide.roundKeys.map((rk, roundIdx) => (
                      <motion.div 
                        key={`rk-${roundIdx}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: roundIdx * 0.1 }}
                        className="flex flex-col items-center flex-shrink-0"
                      >
                        <div className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 whitespace-nowrap">
                          Round {roundIdx} Key
                          {roundIdx === 0 && <span className="ml-1 text-blue-500">(Original)</span>}
                          {roundIdx === 10 && <span className="ml-1 text-purple-500">(Final)</span>}
                        </div>
                        <div className="grid grid-cols-4 gap-[2px] p-2 bg-slate-100 border border-slate-300 shadow-sm rounded-sm">
                          {Array.from({ length: 4 }).map((_, rIdx) => 
                            Array.from({ length: 4 }).map((_, cIdx) => (
                              <div 
                                key={`rk-${roundIdx}-${rIdx}-${cIdx}`}
                                className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center font-mono text-[9px] sm:text-[10px] font-bold ${roundIdx === 0 ? 'bg-blue-50 text-blue-800 border-blue-200' : roundIdx === 10 ? 'bg-purple-50 text-purple-800 border-purple-200' : 'bg-white text-slate-800 border-slate-200'} border`}
                              >
                                {rk[rIdx][cIdx].toString(16).padStart(2, '0').toUpperCase()}
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {(slide.type === 'process' || slide.type === 'summary') && (
              <div className="w-full min-h-full flex flex-col items-center py-4 sm:py-8">
                <div className={`my-auto flex w-full gap-6 sm:gap-8 xl:gap-16 justify-center ${slide.animType === 'subbytes' ? 'flex-col xl:flex-row xl:items-center' : 'flex-col items-center'}`}>
                  {renderGrid(slide.grid, slide.animType, slide.id, slide.annotations)}
                  {(() => {
                  if (slide.animType !== 'subbytes') return null;

                  let prevGridByte = '';
                  let targetRow = -1;
                  let targetCol = -1;
                  
                  if (currentStep > 0) {
                    const prevGrid = slides[currentStep - 1].grid;
                    if (prevGrid && prevGrid[0] && prevGrid[0][0]) {
                       prevGridByte = prevGrid[0][0].val;
                       if (prevGridByte.length === 2) {
                         targetRow = parseInt(prevGridByte[0], 16);
                         targetCol = parseInt(prevGridByte[1], 16);
                       }
                    }
                  }

                  return (
                    <motion.div 
                      key={`sbox-lookup-${slide.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center max-w-[100vw] overflow-x-auto sm:max-w-2xl bg-white border border-slate-200 shadow-sm p-4 rounded-md"
                    >
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 z-10 relative">
                         {mode === 'encrypt' ? 'S-Box Lookup Example' : 'Inverse S-Box Lookup Example'}
                      </div>

                      {targetRow !== -1 && (
                        <div className="text-sm font-medium text-slate-600 mb-4 text-center z-10 max-w-[280px] sm:max-w-md relative">
                          Input byte <span className="font-mono bg-slate-100 px-1 py-0.5 rounded border border-slate-200">{prevGridByte}</span> is mapped using the 1st digit (<span className="font-mono text-blue-600 font-bold">{prevGridByte[0]}</span>) as the Row, and the 2nd digit (<span className="font-mono text-blue-600 font-bold">{prevGridByte[1]}</span>) as the Column.
                        </div>
                      )}

                      <div className="min-w-max grid grid-cols-[repeat(17,minmax(0,1fr))] gap-[1px] bg-slate-200 border border-slate-200 text-[8px] sm:text-[10px] md:text-sm font-mono leading-none">
                         {/* Column Headers */}
                         <div className="bg-slate-100 flex items-center justify-center p-1 text-slate-400"></div>
                         {Array.from({ length: 16 }).map((_, i) => (
                           <motion.div 
                             key={`sbox-${slide.id}-col-${i}`} 
                             initial={{ backgroundColor: '#f1f5f9', color: '#64748b' }}
                             animate={i === targetCol ? { backgroundColor: '#dbeafe', color: '#2563eb' } : { backgroundColor: '#f1f5f9', color: '#64748b' }}
                             transition={{ delay: 2.0 }}
                             className="flex items-center justify-center p-1 sm:p-2 font-bold"
                           >
                             {i.toString(16).toUpperCase()}
                           </motion.div>
                         ))}
                         
                         {/* Table Body */}
                         {Array.from({ length: 16 }).map((_, r) => (
                            <React.Fragment key={`row-${r}`}>
                              <motion.div 
                                key={`sbox-${slide.id}-row-${r}`}
                                initial={{ backgroundColor: '#f1f5f9', color: '#64748b' }}
                                animate={r === targetRow ? { backgroundColor: '#dbeafe', color: '#2563eb' } : { backgroundColor: '#f1f5f9', color: '#64748b' }}
                                transition={{ delay: 1.5 }}
                                className="flex items-center justify-center p-1 sm:p-2 font-bold"
                              >
                                {r.toString(16).toUpperCase()}
                              </motion.div>
                              
                              {Array.from({ length: 16 }).map((_, c) => {
                                const val = mode === 'encrypt' ? SBOX[r * 16 + c] : INV_SBOX[r * 16 + c];
                                const isTarget = r === targetRow && c === targetCol;
                                
                                let bgColorDelay = 0;
                                let targetBg = '#ffffff';
                                let targetTextColor = '#334155';
                                
                                if (isTarget) {
                                  bgColorDelay = 2.5;
                                  targetBg = '#2563eb';
                                  targetTextColor = '#ffffff';
                                } else if (r === targetRow) {
                                  bgColorDelay = 1.5;
                                  targetBg = '#eff6ff';
                                  targetTextColor = '#1e40af';
                                } else if (c === targetCol) {
                                  bgColorDelay = 2.0;
                                  targetBg = '#eff6ff';
                                  targetTextColor = '#1e40af';
                                }

                                return (
                                  <motion.div 
                                    key={`sbox-${slide.id}-cell-${r}-${c}`} 
                                    initial={{ backgroundColor: '#ffffff', color: '#334155' }}
                                    animate={{ backgroundColor: targetBg, color: targetTextColor }}
                                    transition={{ delay: bgColorDelay }}
                                    className={`flex items-center justify-center p-1 sm:p-2 min-w-[20px] sm:min-w-[28px] ${isTarget ? 'font-bold shadow-[inset_0_0_0_1px_rgba(37,99,235,0.5)]' : ''}`}
                                  >
                                    {val.toString(16).padStart(2, '0').toUpperCase()}
                                  </motion.div>
                                );
                              })}
                            </React.Fragment>
                         ))}
                      </div>
                    </motion.div>
                  );
                })()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Sidebar Explanation */}
        <div className="w-full md:w-[324px] bg-slate-50 border-t md:border-t-0 md:border-l border-slate-200 p-8 flex flex-col gap-6 shrink-0">
          <div>
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">Concept Guide</h3>
            <p className="text-lg font-bold leading-tight mb-3">{slide.title}</p>
            <p className="text-slate-600 text-sm leading-relaxed">
              {slide.description}
            </p>
          </div>

          {currentStep < slides.length - 1 && (
            <div className="mt-auto hidden md:block">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase mb-2">
                <span>Next Operation</span>
                <span className="text-slate-900 truncate ml-2">{slides[currentStep + 1]?.title}</span>
              </div>
              <div className="w-full h-1 bg-slate-200 overflow-hidden">
                <div className="w-1/4 h-full bg-blue-600"></div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer Controls */}
      <footer className="h-16 border-t border-slate-200 bg-white px-4 md:px-8 flex items-center justify-between shrink-0">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded text-[10px] font-mono shadow-sm text-slate-600 font-bold">SPACE</kbd>
            <span className="text-xs text-slate-500 hidden sm:inline">to Play</span>
          </div>
          <div className="flex items-center gap-2 text-blue-600 font-bold">
            <kbd className="px-2 py-1 bg-blue-50 border border-blue-200 rounded text-[10px] font-mono shadow-sm">→</kbd>
            <span className="text-xs hidden sm:inline">Next</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 md:gap-4">
          <button 
             onClick={prevStep} 
             disabled={currentStep === 0}
             className="px-4 md:px-6 py-2 bg-slate-100 text-slate-600 font-bold rounded hover:bg-slate-200 transition-colors disabled:opacity-50 text-sm md:text-base"
          >
            Back
          </button>
          <button 
             onClick={nextStep} 
             disabled={currentStep === slides.length - 1}
             className="px-4 md:px-6 py-2 bg-blue-600 text-white font-bold rounded shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm md:text-base"
          >
            Continue
          </button>
        </div>
      </footer>
    </div>
  );
}
