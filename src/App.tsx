/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import Slideshow from './components/Slideshow';

interface AnimeResult {
  characterName: string;
  quote: string;
  description: string;
  traitName: string;
  userName?: string;
}

import { CHARACTER_DATA, QUIZ_QUESTIONS, COLOUR_CHARACTER_MAP, FOOD_CHARACTER_MAP } from './data';

export default function App() {
  const [name, setName] = useState('');
  const [result, setResult] = useState<AnimeResult | null>(null);
  
  const [mode, setMode] = useState<"selection" | "colour" | "food" | "name" | "quiz" | "result">("selection");
  const [colour, setColour] = useState('');
  const [food, setFood] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [traitScores, setTraitScores] = useState<Record<string, number>>({});

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

    const charInfo = CHARACTER_DATA[chosenCharacter] || { name: chosenCharacter, quote: "...", description: "..." };
    setResult({ characterName: charInfo.name, quote: charInfo.quote, description: charInfo.description, traitName: "Mysterious Entrant" });
  };

  const handleQuizAnswer = (option: string) => {
    const question = QUIZ_QUESTIONS[currentQuestionIndex];
    const character = question.weights[option as keyof typeof question.weights];
    const trait = question.traits[option as keyof typeof question.traits];
    
    setScores(prev => ({ ...prev, [character]: (prev[character] || 0) + 1 }));
    setTraitScores(prev => ({ ...prev, [trait]: (prev[trait] || 0) + 1 }));

    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Calculate result
      const maxChar = Object.entries(scores).reduce((a, b) => (b[1] > a[1] ? b : a), [randomPool[0], 0])[0];
      const maxTrait = Object.entries(traitScores).reduce((a, b) => (b[1] > a[1] ? b : a), ["Balanced", 0])[0];
      
      const charInfo = CHARACTER_DATA[maxChar] || { name: maxChar, quote: "...", description: "..." };
      setResult({ 
        characterName: charInfo.name, 
        quote: charInfo.quote, 
        description: charInfo.description, 
        traitName: maxTrait,
        userName: name
      });
      setMode("selection");
      setCurrentQuestionIndex(0);
      setScores({});
      setTraitScores({});
    }
  };

  const matchByColour = (e: React.FormEvent) => {
    e.preventDefault();
    const chosenCharacter = COLOUR_CHARACTER_MAP[colour.toLowerCase()] || randomPool[0];
    const charInfo = CHARACTER_DATA[chosenCharacter] || { name: chosenCharacter, quote: "...", description: "..." };
    setResult({ characterName: charInfo.name, quote: charInfo.quote, description: charInfo.description, traitName: "Colour Harmony", userName: name });
  };

  const matchByFood = (e: React.FormEvent) => {
    e.preventDefault();
    const chosenCharacter = FOOD_CHARACTER_MAP[food.toLowerCase()] || randomPool[1];
    const charInfo = CHARACTER_DATA[chosenCharacter] || { name: chosenCharacter, quote: "...", description: "..." };
    setResult({ characterName: charInfo.name, quote: charInfo.quote, description: charInfo.description, traitName: "Gourmet Soul", userName: name });
  };

  const shareResult = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Anime Character Match!',
        text: `Hey! My anime character match is ${result?.characterName}${result?.userName ? ` (based on ${result.userName}'s personality)` : ''}. Check it out!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert("Sharing not supported on this browser.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-white p-6">
      <Slideshow />
      
      <div className="w-full max-w-lg bg-[#14161d] rounded-3xl p-10 text-center shadow-2xl border border-white/5 z-10">
        <h1 className="text-4xl font-semibold -tracking-tight mb-8">Anime Matcher</h1>
        
        {!result ? (
          mode === "selection" ? (
            <div className="flex flex-col gap-4">
               <button onClick={() => setMode("colour")} className="w-full bg-[#1b1e27] border border-[#2b303f] rounded-2xl p-5 hover:border-red-500 transition">Match by Colour</button>
               <button onClick={() => setMode("food")} className="w-full bg-[#1b1e27] border border-[#2b303f] rounded-2xl p-5 hover:border-red-500 transition">Match by Food</button>
               <button onClick={() => setMode("quiz")} className="w-full bg-[#1b1e27] border border-[#2b303f] rounded-2xl p-5 hover:border-red-500 transition">Personality Quiz</button>
               <button onClick={() => setMode("name")} className="w-full bg-[#1b1e27] border border-[#2b303f] rounded-2xl p-5 hover:border-red-500 transition">Match by Name</button>
            </div>
          ) : mode === "colour" ? (
             <form onSubmit={matchByColour} className="flex flex-col gap-6">
                <input type="text" value={colour} onChange={(e) => setColour(e.target.value)} className="w-full bg-[#1b1e27] border border-[#2b303f] rounded-2xl p-5 text-center" placeholder="Enter your favorite colour" autoComplete="off" />
                <button type="submit" className="w-full bg-[#e63946] text-white font-semibold rounded-2xl p-5">Find Match</button>
                <button type="button" onClick={() => setMode("selection")} className="text-gray-500 underline">Back</button>
             </form>
          ) : mode === "food" ? (
             <form onSubmit={matchByFood} className="flex flex-col gap-6">
                <input type="text" value={food} onChange={(e) => setFood(e.target.value)} className="w-full bg-[#1b1e27] border border-[#2b303f] rounded-2xl p-5 text-center" placeholder="Enter your favorite food" autoComplete="off" />
                <button type="submit" className="w-full bg-[#e63946] text-white font-semibold rounded-2xl p-5">Find Match</button>
                <button type="button" onClick={() => setMode("selection")} className="text-gray-500 underline">Back</button>
             </form>
          ) : mode === "quiz" ? (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl">{QUIZ_QUESTIONS[currentQuestionIndex].question}</h2>
              {QUIZ_QUESTIONS[currentQuestionIndex].options.map(option => (
                <button key={option} onClick={() => handleQuizAnswer(option)} className="bg-[#1b1e27] border border-[#2b303f] rounded-xl p-4 hover:border-red-500 transition text-left">{option}</button>
              ))}
            </div>
          ) : (
            <form onSubmit={revealSoul} className="flex flex-col gap-6">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#1b1e27] border border-[#2b303f] rounded-2xl p-5 text-center" placeholder="Enter your name" autoComplete="off" />
              <button type="submit" className="w-full bg-[#e63946] text-white font-semibold rounded-2xl p-5">Find Match</button>
              <button type="button" onClick={() => setMode("selection")} className="text-sm text-gray-500 underline">Back</button>
            </form>
          )
        ) : (
          <div className="mt-10">
            <div className="text-xs uppercase tracking-widest text-gray-400 mb-3">Your Personality Profile</div>
            <div className="text-xl font-bold mb-8 text-red-500">
              {result.traitName}
            </div>
            <div className="text-xs uppercase tracking-widest text-gray-400 mb-3">Your Character Match</div>
            <motion.div 
              className="text-4xl font-bold mb-8 group relative cursor-help"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {result.characterName}
              <div className="absolute left-1/2 -top-20 -translate-x-1/2 w-64 bg-white/10 backdrop-blur text-white text-sm p-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 border border-white/10 text-center">
                <p className="font-bold mb-1 italic">"{result.quote}"</p>
                <p className="text-gray-300">{result.description}</p>
              </div>
            </motion.div>
            <div className="flex gap-4 justify-center">
              <motion.button 
                onClick={() => { setResult(null); setName(''); setMode("selection"); }}                className="text-sm text-gray-500 hover:text-white transition"
                whileHover={{ scale: 1.1, color: '#ffffff' }}
                whileTap={{ scale: 0.95 }}
              >
                Match again?
              </motion.button>
              <motion.button 
                onClick={shareResult}
                className="text-sm text-gray-500 hover:text-white transition"
                whileHover={{ scale: 1.1, color: '#ffffff' }}
                whileTap={{ scale: 0.95 }}
              >
                Share Result
              </motion.button>
            </div>
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
        Made by Pratyush, Kushagra, and Anish
      </div>
    </div>
  );
}


