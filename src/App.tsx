/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Music, Home, Compass, Clock, Share2, Camera } from 'lucide-react';
import confetti from 'canvas-confetti';
import { toPng } from 'html-to-image';
import { CHARACTER_DATA, COLOUR_CHARACTER_MAP, FOOD_CHARACTER_MAP, NAME_CHARACTER_MAP } from './data';
import { CHARACTER_SERIES_MAP } from './series-map';
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
  const [streak, setStreak] = useState(0);
  const [confettiIntensity, setConfettiIntensity] = useState(150);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [dailyProgress, setDailyProgress] = useState({
      foodMatched: false,
      nameMatched: false
  });
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<AnimeResult[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<string>("All");
  
  const lastResultRef = useRef<AnimeResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const updateQuest = (type: 'foodMatched' | 'nameMatched') => {
      setDailyProgress(prev => {
          const newProgress = { ...prev, [type]: true };
          localStorage.setItem('dailyProgress', JSON.stringify(newProgress));
          return newProgress;
      });
  };

  const handleMatchAgain = () => {
    playClickSound(isMuted);
    playSuccessSound(isMuted);
    if ('vibrate' in navigator) navigator.vibrate(200);
    setIsFlipped(true);
    setTimeout(() => {
        lastResultRef.current = null;
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
    const savedStreak = localStorage.getItem('animeStreak');
    if (savedStreak) setStreak(parseInt(savedStreak));

    const savedIntensity = localStorage.getItem('confettiIntensity');
    if (savedIntensity) setConfettiIntensity(parseInt(savedIntensity));
    
    const savedUser = localStorage.getItem('userName');
    if (savedUser) setCurrentUser(savedUser);

    const savedProgress = localStorage.getItem('dailyProgress');
    const lastDate = localStorage.getItem('lastQuestDate');
    const today = new Date().toDateString();

    if (lastDate !== today) {
        const newProgress = { foodMatched: false, nameMatched: false };
        setDailyProgress(newProgress);
        localStorage.setItem('dailyProgress', JSON.stringify(newProgress));
        localStorage.setItem('lastQuestDate', today);
    } else if (savedProgress) {
        setDailyProgress(JSON.parse(savedProgress));
    }
  }, []);

  useEffect(() => {
    toggleAmbientAudio(isAmbientPlaying);
  }, [isAmbientPlaying]);

  useEffect(() => {
    if (result && result !== lastResultRef.current) {
      lastResultRef.current = result;
      confetti({
        particleCount: confettiIntensity,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Update history
      setHistory(prev => {
          const newHistory = [...prev, result];
          localStorage.setItem('animeHistory', JSON.stringify(newHistory));
          return newHistory;
      });

      if (result.userName && result.userName.trim() !== "") {
          setCurrentUser(result.userName);
          localStorage.setItem('userName', result.userName);
      }

      // Streak logic
      const today = new Date().toDateString();
      const lastDate = localStorage.getItem('lastMatchDate');
      
      setStreak(prevStreak => {
          let newStreak = 1;
          if (lastDate) {
              const lastDateObj = new Date(lastDate);
              const todayObj = new Date();
              const diffMs = todayObj.getTime() - lastDateObj.getTime();
              const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
              
              if (diffDays === 1) {
                  newStreak = prevStreak + 1;
              } else if (diffDays === 0) {
                  newStreak = prevStreak;
              }
          }
          localStorage.setItem('animeStreak', newStreak.toString());
          localStorage.setItem('lastMatchDate', today);
          return newStreak;
      });
    }
  }, [result, isMuted]);

  const revealSoul = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound(isMuted);
    playSuccessSound(isMuted);
    if ('vibrate' in navigator) navigator.vibrate(200);
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
    updateQuest('nameMatched');
    setResult({ characterName: charInfo.name, quote: charInfo.quote, description: charInfo.description, userName: name });
  };

  const matchByFood = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound(isMuted);
    playSuccessSound(isMuted);
    const chosenCharacter = FOOD_CHARACTER_MAP[food.toLowerCase()] || randomPool[0];
    const charInfo = CHARACTER_DATA[chosenCharacter];
    updateQuest('foodMatched');
    setResult({ characterName: charInfo.name, quote: charInfo.quote, description: charInfo.description, userName: name });
  };

  return (
    <div className="min-h-screen bg-black/70 text-white flex flex-col justify-center items-center p-6 font-sans pb-24">
      <div className="fixed top-6 left-6 z-50 flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md">
        {currentUser && <span className="text-sm font-bold text-white">{currentUser}</span>}
        {streak > 0 && <span className="text-xs bg-pink-500 text-white px-2 py-0.5 rounded-full font-bold">🔥 {streak}</span>}
      </div>
      <div className="fixed top-6 right-6 flex gap-2 z-50">
        <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
            <label className="text-xs">Intensity</label>
            <input type="range" min="50" max="500" value={confettiIntensity} onChange={(e) => {
                const val = parseInt(e.target.value);
                setConfettiIntensity(val);
                localStorage.setItem('confettiIntensity', val.toString());
            }} />
        </div>
        <button 
          onClick={() => { playClickSound(isMuted); setIsAmbientPlaying(!isAmbientPlaying); }}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
        >
          <Music className={`w-6 h-6 ${isAmbientPlaying ? 'text-pink-300' : ''}`} />
        </button>
        <button 
          onClick={() => { playClickSound(isMuted); setIsMuted(!isMuted); }}
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
                <select value={selectedSeries} onChange={(e) => setSelectedSeries(e.target.value)} className="w-full bg-[#1b1e27] text-white p-2 rounded-xl border border-white/5 mb-4">
                    {["All", ...Array.from(new Set(history.map(h => CHARACTER_SERIES_MAP[h.characterName] || "Unknown")))].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {history.length === 0 ? <p className="text-gray-400">No matches yet!</p> : (
                    <ul className="space-y-4">
                        {history
                         .filter(match => selectedSeries === "All" || (CHARACTER_SERIES_MAP[match.characterName] || "Unknown") === selectedSeries)
                         .map((match, i) => (
                            <li key={i} className="bg-[#1b1e27] p-4 rounded-xl border border-white/5">
                                <p className="font-bold">{match.characterName}</p>
                                <p className="text-sm text-gray-400">{match.userName || 'Anonymous'} - {CHARACTER_SERIES_MAP[match.characterName] || "Unknown"}</p>
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
                
                <div className="bg-[#1b1e27] rounded-3xl p-6 border border-white/5 text-left space-y-3">
                    <h3 className="font-bold text-pink-300">Daily Quests</h3>
                    <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${dailyProgress.foodMatched ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                        <p className={dailyProgress.foodMatched ? 'text-gray-300 line-through' : 'text-gray-100'}>Match by Food</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${dailyProgress.nameMatched ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                        <p className={dailyProgress.nameMatched ? 'text-gray-300 line-through' : 'text-gray-100'}>Match by Name</p>
                    </div>
                </div>
                
                <button onClick={() => { playClickSound(isMuted); setMode("selection"); }} className="w-full bg-white text-black font-semibold rounded-full p-4 hover:bg-gray-200 transition">Start Match</button>
              </div>
            ) : mode === "selection" ? (
              <div className="flex flex-col gap-4">
                <button onClick={() => { playClickSound(isMuted); setMode("food"); }} className="w-full bg-[#1b1e27] border border-[#2b303f] rounded-full p-4 hover:border-red-500 transition">Match by Food</button>
                <button onClick={() => { playClickSound(isMuted); setMode("name"); }} className="w-full bg-[#1b1e27] border border-[#2b303f] rounded-full p-4 hover:border-red-500 transition">Match by Name</button>
              </div>
            ) : (
                <form onSubmit={mode === "name" ? revealSoul : matchByFood} className="flex flex-col gap-6">
                    <p className="text-sm text-gray-400">Enter your details for your anime match!</p>
                    <input 
                      type="text" 
                      value={mode === "name" ? name : food} 
                      onChange={(e) => mode === "name" ? setName(e.target.value) : setFood(e.target.value)} 
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
                ref={resultRef}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1, rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md bg-[#111111]/80 border border-white/10 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-md"
            >
                <div className="text-xs uppercase tracking-widest text-gray-400 mb-3">Your Character Match</div>
                <div className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300">
                    {result.characterName}
                </div>
                {streak > 1 && (
                    <div className="text-sm text-pink-300 mb-4 font-bold tracking-widest">
                        🔥 {streak} DAY STREAK
                    </div>
                )}
                <div className="bg-[#1b1e27] p-6 rounded-2xl mb-8 border border-white/5">
                    <p className="font-bold mb-4 text-lg italic">"{result.quote}"</p>
                    <p className="text-gray-400">{result.description}</p>
                </div>
                <div className="flex gap-4">
                    <motion.button 
                        onClick={handleMatchAgain}
                        className="flex-1 bg-white text-black font-semibold rounded-full p-4 hover:bg-gray-200 transition"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Match again?
                    </motion.button>
                    <motion.button
                        onClick={async () => {
                            playClickSound(isMuted);
                            if (resultRef.current) {
                                try {
                                    const dataUrl = await toPng(resultRef.current);
                                    const link = document.createElement('a');
                                    link.download = 'my-anime-match.png';
                                    link.href = dataUrl;
                                    link.click();
                                } catch (err) {
                                    console.error('Error saving image:', err);
                                }
                            }
                        }}
                        className="flex-none bg-[#1b1e27] text-white p-4 rounded-full border border-white/10 hover:border-pink-300 transition"
                    >
                        <Camera className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                        onClick={async () => {
                            playClickSound(isMuted);
                            const shareData: ShareData = {
                                title: 'My Anime Character Match',
                                text: `Hey there, I got "${result.characterName}" in this app made by Pratyush Kushagra and Anish, wanna try? Go to the link-(https://anime-kushpraj.vercel.app/)`,
                                url: 'https://anime-kushpraj.vercel.app/',
                            };

                            try {
                                // Robustly try one of the provided images
                                const imageUrls = ['https://wallpapercave.com/wp/wp5535573.jpg', 'https://wallpapercave.com/wp/wp1853123.jpg'];
                                let file: File | null = null;
                                
                                for (const url of imageUrls) {
                                    try {
                                        const response = await fetch(url);
                                        if (!response.ok) continue;
                                        const blob = await response.blob();
                                        file = new File([blob], 'matched-character.jpg', { type: blob.type });
                                        break;
                                    } catch (err) {
                                        console.warn(`Could not fetch image from ${url}:`, err);
                                    }
                                }

                                if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
                                    shareData.files = [file];
                                }
                            } catch (err) {
                                console.warn('Could not add image to share:', err);
                            }

                            try {
                                if (navigator.share) {
                                    await navigator.share(shareData);
                                } else {
                                    await navigator.clipboard.writeText(shareData.text);
                                    alert('Link copied to clipboard!');
                                }
                            } catch (err) {
                                console.error('Error sharing:', err);
                            }
                        }}
                        className="flex-none bg-[#1b1e27] text-white p-4 rounded-full border border-white/10 hover:border-pink-300 transition"
                    >
                        <Share2 className="w-5 h-5" />
                    </motion.button>
                </div>
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
        Made by <a href="https://github.com/kushpraj" target="_blank" rel="noopener noreferrer" className="hover:text-pink-300 transition">Pratyush,Kushagra& Anish</a>
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


