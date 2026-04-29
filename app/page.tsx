'use client';

import { useState } from 'react';
import Presentation from '@/components/Presentation';
import DESPresentation from '@/components/DESPresentation';

export default function Home() {
  const [algo, setAlgo] = useState<'aes' | 'des'>('aes');

  return (
    <main className="w-full min-h-screen flex flex-col">
      <div className="w-full bg-slate-900 border-b border-slate-800 p-4 flex justify-center gap-4">
        <button 
          onClick={() => setAlgo('aes')}
          className={`px-6 py-2 rounded font-bold transition-colors ${algo === 'aes' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
        >
          AES
        </button>
        <button 
          onClick={() => setAlgo('des')}
          className={`px-6 py-2 rounded font-bold transition-colors ${algo === 'des' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
        >
          DES
        </button>
      </div>
      <div className="flex-1 w-full bg-white relative overflow-hidden">
        {algo === 'aes' ? <Presentation /> : <DESPresentation />}
      </div>
    </main>
  );
}

