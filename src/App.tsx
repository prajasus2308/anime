/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Music, Home, Compass, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CHARACTER_DATA, COLOUR_CHARACTER_MAP, FOOD_CHARACTER_MAP, NAME_CHARACTER_MAP } from './data';
import Slideshow from './components/Slideshow';
import { playClickSound, playSuccessSound, toggleAmbientAudio } from './lib/audio';

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
  const [isMuted, setIsMuted] = useState(false);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<AnimeResult[]>([]);
  
  const handleMatchAgain = () => {
    playClickSound(isMuted);
    setIsFlipped(true);
    setTimeout(() => {
        setResult(null); setName(''); setColour(''); setFood(''); setMode("selection");
        setIsFlipped(false);
    }, 600);
  };

  const randomPool = Object.keys(CHARACTER_DATA);

  useEffect(() => {
    const savedHistory = localStorage.getItem('animeHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    toggleAmbientAudio(isAmbientPlaying);
  }, [isAmbientPlaying]);

  useEffect(() => {
    if (result) {
      playSuccessSound(isMuted);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Update history
      const newHistory = [...history, result];
      setHistory(newHistory);
      localStorage.setItem('animeHistory', JSON.stringify(newHistory));
    }
  }, [result, isMuted]);

  const revealSoul = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound(isMuted);
    const rawName = name.trim();
    if (rawName === "") return;
    const cleanFullName = rawName.toLowerCase();
    
    let chosenCharacter = NAME_CHARACTER_MAP[cleanFullName];
    
    if (!chosenCharacter) {
        let hash = 0;
        for (let i = 0; i < cleanFullName.length; i++) {
            hash = cleanFullName.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % randomPool.length;
        chosenCharacter = randomPool[index];
    }
    
    const charInfo = CHARACTER_DATA[chosenCharacter];
    setResult({ characterName: charInfo.name, quote: charInfo.quote, description: charInfo.description, userName: name });
  };

  const matchByFood = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound(isMuted);
    const chosenCharacter = FOOD_CHARACTER_MAP[food.toLowerCase()] || randomPool[0];
    const charInfo = CHARACTER_DATA[chosenCharacter];
    setResult({ characterName: charInfo.name, quote: charInfo.quote, description: charInfo.description, userName: name });
  };

  const matchByColour = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound(isMuted);
    const chosenCharacter = COLOUR_CHARACTER_MAP[colour.toLowerCase()] || randomPool[0];
    const charInfo = CHARACTER_DATA[chosenCharacter];
    setResult({ characterName: charInfo.name, quote: charInfo.quote, description: charInfo.description, userName: name });
  };

  return (
    <div className="min-h-screen bg-black/70 text-white flex flex-col justify-center items-center p-6 font-sans pb-24">
      <div className="fixed top-6 right-6 flex gap-2 z-50">
        <button 
          onClick={() => setIsAmbientPlaying(!isAmbientPlaying)}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
        >
          <Music className={`w-6 h-6 ${isAmbientPlaying ? 'text-pink-300' : ''}`} />
        </button>
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
        >
          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>
      </div>
      <Slideshow />
      <AnimatePresence mode="wait">
        {showHistory ? (
            <motion.div
                key="history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-md bg-[#111111]/80 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-md overflow-y-auto max-h-[60vh]"
            >
                <h2 className="text-2xl font-bold mb-4">History</h2>
                {history.length === 0 ? <p className="text-gray-400">No matches yet!</p> : (
                    <ul className="space-y-4">
                        {history.map((match, i) => (
                            <li key={i} className="bg-[#1b1e27] p-4 rounded-xl border border-white/5">
                                <p className="font-bold">{match.characterName}</p>
                                <p className="text-sm text-gray-400">{match.userName || 'Anonymous'}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </motion.div>
        ) : !result ? (
          <motion.div 
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md bg-[#111111]/80 border border-white/10 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-md"
          >
            {mode === "landing" ? (
              <div className="space-y-6">
                <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300">AnimeSoul Matcher</h1>
                <p className="text-xl text-gray-300">Discover your anime alter ego in seconds.</p>
                <button onClick={() => { playClickSound(isMuted); setMode("selection"); }} className="w-full bg-white text-black font-semibold rounded-full p-4 hover:bg-gray-200 transition">Start Match</button>
              </div>
            ) : mode === "selection" ? (
              <div className="flex flex-col gap-4">
                <button onClick={() => { playClickSound(isMuted); setMode("colour"); }} className="w-full bg-[#1b1e27] border border-[#2b303f] rounded-full p-4 hover:border-red-500 transition">Match by Colour</button>
                <button onClick={() => { playClickSound(isMuted); setMode("food"); }} className="w-full bg-[#1b1e27] border border-[#2b303f] rounded-full p-4 hover:border-red-500 transition">Match by Food</button>
                <button onClick={() => { playClickSound(isMuted); setMode("name"); }} className="w-full bg-[#1b1e27] border border-[#2b303f] rounded-full p-4 hover:border-red-500 transition">Match by Name</button>
              </div>
            ) : (
                <form onSubmit={mode === "name" ? revealSoul : mode === "colour" ? matchByColour : matchByFood} className="flex flex-col gap-6">
                    <p className="text-sm text-gray-400">Enter your details for your anime match!</p>
                    <input 
                      type="text" 
                      value={mode === "name" ? name : mode === "colour" ? colour : food} 
                      onChange={(e) => mode === "name" ? setName(e.target.value) : mode === "colour" ? setColour(e.target.value) : setFood(e.target.value)} 
                      onKeyDown={(e) => {
                         if (e.key === 'Enter') {
                            playClickSound(isMuted);
                         }
                      }}
                      className="w-full bg-[#1b1e27] border border-[#2b303f] rounded-full p-4 text-center" 
                      placeholder={`Enter your ${mode}`} 
                      autoComplete="off" 
                    />
                    <motion.button 
                      type="submit" 
                      className="w-full bg-red-600 text-white font-semibold rounded-full p-4"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      Find Match
                    </motion.button>
                    <button type="button" onClick={() => { playClickSound(isMuted); setMode("selection"); }} className="text-sm text-gray-500 underline">Back</button>
                </form>
            )}
          </motion.div>
        ) : (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1, rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md bg-[#111111]/80 border border-white/10 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-md"
            >
                <div className="text-xs uppercase tracking-widest text-gray-400 mb-3">Your Character Match</div>
                <div className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300">
                    {result.characterName}
                </div>
                <div className="bg-[#1b1e27] p-6 rounded-2xl mb-8 border border-white/5">
                    <p className="font-bold mb-4 text-lg italic">"{result.quote}"</p>
                    <p className="text-gray-400">{result.description}</p>
                </div>
                <motion.button 
                    onClick={handleMatchAgain}
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
        className="fixed bottom-20 text-sm font-bold z-10 transition-opacity opacity-100 uppercase tracking-wider"
        style={{
          color: '#ffffff',
          textShadow: '0 0 5px #fff, 0 0 10px #fff, 0 0 20px #e63946, 0 0 30px #e63946'
        }}
      >
        Made by <a href="https://github.com/kushpraj" target="_blank" rel="noopener noreferrer" className="hover:text-pink-300 transition">Kushpraj & Team</a>
      </div>

      <nav className="fixed bottom-0 left-0 w-full bg-black/80 backdrop-blur-md border-t border-white/10 flex justify-around p-4 z-50">
        <button onClick={() => { playClickSound(isMuted); setMode("landing"); setShowHistory(false); }} className={`flex flex-col items-center ${mode === 'landing' ? 'text-pink-300' : 'text-gray-400'}`}>
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
        </button>
        <button onClick={() => { playClickSound(isMuted); setMode("selection"); setShowHistory(false); }} className={`flex flex-col items-center ${mode === 'selection' ? 'text-pink-300' : 'text-gray-400'}`}>
            <Compass className="w-6 h-6" />
            <span className="text-xs">Explore</span>
        </button>
        <button onClick={() => { playClickSound(isMuted); setShowHistory(true); }} className={`flex flex-col items-center ${showHistory ? 'text-pink-300' : 'text-gray-400'}`}>
            <Clock className="w-6 h-6" />
            <span className="text-xs">History</span>
        </button>
      </nav>
    </div>
  );
}


