/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CHARACTER_DATA, COLOUR_CHARACTER_MAP, FOOD_CHARACTER_MAP } from './data';
import Slideshow from './components/Slideshow';
import { playClickSound, playSuccessSound } from './lib/audio';

interface AnimeResult {
  characterName: string;
  quote: string;
  description: string;
  userName?: string;
}

export default function App() {
  const [name, setName] = useState('');
  const [result, setResult] = useState<AnimeResult | null>(null);
  
  const [mode, setMode] = useState<"landing" | "selection" | "colour" | "food" | "name">("landing");
  const [colour, setColour] = useState('');
  const [food, setFood] = useState('');

  const randomPool = Object.keys(CHARACTER_DATA);

  useEffect(() => {
    if (result) {
      playSuccessSound();
    }
  }, [result]);

  const revealSoul = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    const rawName = name.trim();
    if (rawName === "") return;
    const cleanFullName = rawName.toLowerCase();
    let hash = 0;
    for (let i = 0; i < cleanFullName.length; i++) {
        hash = cleanFullName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % randomPool.length;
    const chosenCharacter = randomPool[index];
    const charInfo = CHARACTER_DATA[chosenCharacter];
    setResult({ characterName: charInfo.name, quote: charInfo.quote, description: charInfo.description, userName: name });
  };

  const matchByFood = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    const chosenCharacter = FOOD_CHARACTER_MAP[food.toLowerCase()] || randomPool[0];
    const charInfo = CHARACTER_DATA[chosenCharacter];
    setResult({ characterName: charInfo.name, quote: charInfo.quote, description: charInfo.description, userName: name });
  };

  const matchByColour = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    const chosenCharacter = COLOUR_CHARACTER_MAP[colour.toLowerCase()] || randomPool[0];
    const charInfo = CHARACTER_DATA[chosenCharacter];
    setResult({ characterName: charInfo.name, quote: charInfo.quote, description: charInfo.description, userName: name });
  };

  return (
    <div className="min-h-screen bg-black/70 text-white flex flex-col justify-center items-center p-6 font-sans">
      <Slideshow />
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div 
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md bg-[#111111]/80 border border-white/10 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-md"
          >
            {mode === "landing" ? (
              <div className="space-y-6">
                <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-500">AnimeSoul Matcher</h1>
                <p className="text-xl text-gray-300">Discover your anime alter ego in seconds.</p>
                <button onClick={() => { playClickSound(); setMode("selection"); }} className="w-full bg-white text-black font-semibold rounded-full p-4 hover:bg-gray-200 transition">Start Match</button>
              </div>
            ) : mode === "selection" ? (
              <div className="flex flex-col gap-4">
                <button onClick={() => { playClickSound(); setMode("colour"); }} className="w-full bg-[#1b1e27] border border-[#2b303f] rounded-full p-4 hover:border-red-500 transition">Match by Colour</button>
                <button onClick={() => { playClickSound(); setMode("food"); }} className="w-full bg-[#1b1e27] border border-[#2b303f] rounded-full p-4 hover:border-red-500 transition">Match by Food</button>
                <button onClick={() => { playClickSound(); setMode("name"); }} className="w-full bg-[#1b1e27] border border-[#2b303f] rounded-full p-4 hover:border-red-500 transition">Match by Name</button>
              </div>
            ) : (
                <form onSubmit={mode === "name" ? revealSoul : mode === "colour" ? matchByColour : matchByFood} className="flex flex-col gap-6">
                    <p className="text-sm text-gray-400">Enter your details for your anime match!</p>
                    <input type="text" value={mode === "name" ? name : mode === "colour" ? colour : food} onChange={(e) => mode === "name" ? setName(e.target.value) : mode === "colour" ? setColour(e.target.value) : setFood(e.target.value)} className="w-full bg-[#1b1e27] border border-[#2b303f] rounded-full p-4 text-center" placeholder={`Enter your ${mode}`} autoComplete="off" />
                    <button type="submit" className="w-full bg-red-600 text-white font-semibold rounded-full p-4">Find Match</button>
                    <button type="button" onClick={() => { playClickSound(); setMode("selection"); }} className="text-sm text-gray-500 underline">Back</button>
                </form>
            )}
          </motion.div>
        ) : (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-[#111111]/80 border border-white/10 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-md"
            >
                <div className="text-xs uppercase tracking-widest text-gray-400 mb-3">Your Character Match</div>
                <div className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-purple-400">
                    {result.characterName}
                </div>
                <div className="bg-[#1b1e27] p-6 rounded-2xl mb-8 border border-white/5">
                    <p className="font-bold mb-4 text-lg italic">"{result.quote}"</p>
                    <p className="text-gray-400">{result.description}</p>
                </div>
                <motion.button 
                    onClick={() => { setResult(null); setName(''); setColour(''); setFood(''); setMode("selection"); }}
                    className="w-full bg-white text-black font-semibold rounded-full p-4 hover:bg-gray-200 transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Match again?
                </motion.button>
            </motion.div>
        )}
      </AnimatePresence>
      <div 
        className="fixed bottom-6 text-sm font-bold opacity-60 uppercase tracking-wider text-gray-500"
      >
        Made by Pratyush, Kushagra, and Anish
      </div>
    </div>
  );
}


