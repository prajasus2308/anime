/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import Slideshow from './components/Slideshow';

interface AnimeResult {
  characterName: string;
}

export default function App() {
  const [name, setName] = useState('');
  const [result, setResult] = useState<AnimeResult | null>(null);

  const absoluteMatches: Record<string, string> = {
    "anish": "Sukuna",
    "pratyush": "Gun Park",
    "vedang": "Yuji",
    "nikunj": "Rin Itoshi",
    "kushagra": "Gojo"
  };

  const randomPool = [
      "Eren Yeager", "Luffy", "Zoro", "Naruto Uzumaki", "Sasuke Uchiha", 
      "Kakashi", "Killua", "Gon Freecss", "Levi Ackerman", "Light Yagami", 
      "L Lawliet", "Goku", "Vegeta", "Ichigo Kurosaki", "Aizen", 
      "Saitama", "Garou", "Tanjiro", "Nezuko", "Inosuke", 
      "Zenitsu", "Rengoku", "Toji Fushiguro", "Megumi Fushiguro", "Choso", 
      "Thorfinn", "Askeladd", "Ken Kaneki", "Mob (Shigeo)", "Reigen Arataka",
      "Rimuru Tempest", "Sung Jin-Woo", "Guts", "Griffith", "Edward Elric",
      "Roy Mustang", "Dazai Osamu", "Chuuya Nakahara", "Baki Hanma", "Isagi Yoichi"
  ];

  const revealSoul = (e: React.FormEvent) => {
    e.preventDefault();
    const rawName = name.trim();
    if (rawName === "") return;

    const firstName = rawName.split(" ")[0].toLowerCase();

    let chosenCharacter = "";

    if (absoluteMatches.hasOwnProperty(firstName)) {
        chosenCharacter = absoluteMatches[firstName];
    } else {
        const cleanFullName = rawName.toLowerCase();
        let hash = 0;
        for (let i = 0; i < cleanFullName.length; i++) {
          hash = cleanFullName.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % randomPool.length;
        chosenCharacter = randomPool[index];
    }

    setResult({ characterName: chosenCharacter });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-white p-6">
      <Slideshow />
      
      <div className="w-full max-w-lg bg-[#14161d] rounded-3xl p-10 text-center shadow-2xl border border-white/5 z-10">
        <h1 className="text-4xl font-semibold -tracking-tight mb-2">Anime Matcher</h1>
        <p className="text-gray-400 mb-10">Discover your matching character characteristically</p>
        
        {!result ? (
          <form onSubmit={revealSoul} className="flex flex-col gap-6">
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#1b1e27] border border-[#2b303f] rounded-2xl p-5 text-white text-center text-lg outline-none focus:border-red-500 transition"
              placeholder="Enter your name" 
              autoComplete="off"
            />
            <button 
              type="submit"
              className="w-full bg-[#e63946] text-white font-semibold rounded-2xl p-5 text-lg hover:bg-[#f14653] transition shadow-lg hover:shadow-red-500/20"
            >
              Find Match
            </button>
          </form>
        ) : (
          <div className="mt-10">
            <div className="text-xs uppercase tracking-widest text-gray-400 mb-3">Your Match</div>
            <motion.div 
              className="text-4xl font-bold mb-8"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 12 }}
            >
              {result.characterName}
            </motion.div>
            <motion.button 
              onClick={() => { setResult(null); setName(''); }} 
              className="text-sm text-gray-500 hover:text-white transition"
              whileHover={{ scale: 1.1, color: '#ffffff' }}
              whileTap={{ scale: 0.95 }}
            >
              Match again?
            </motion.button>
          </div>
        )}
      </div>

      <div 
        className="absolute bottom-6 text-sm font-bold z-10 transition-opacity opacity-100 uppercase tracking-wider"
        style={{
          color: '#ffffff',
          textShadow: '0 0 5px #fff, 0 0 10px #fff, 0 0 20px #e63946, 0 0 30px #e63946'
        }}
      >
        Made by Pratyush and Kushagra
      </div>
    </div>
  );
}


