/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Share2, Loader2 } from 'lucide-react';
import Slideshow from './components/Slideshow';

interface AnimeResult {
  characterName: string;
  quote: string;
  description: string;
}

export default function App() {
  const [name, setName] = useState('');
  const [result, setResult] = useState<AnimeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) throw new Error('Failed to match');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Could not find your match right now. Please try again!');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'My Anime Character Match',
      text: `I just matched with ${result?.characterName}! "${result?.quote}"`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} \n\nCheck it out here: ${shareData.url}`);
        alert('Result copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4" 
    >
      <Slideshow />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl max-w-md w-full"
      >
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">Anime Matcher</h1>
        
        {!result ? (
          <form onSubmit={handleMatch} className="flex flex-col gap-5">
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name" 
              className="p-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition"
              required
            />
            <button 
              type="submit" 
              className="px-6 py-4 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Find My Match'}
            </button>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </form>
        ) : (
          <div className="text-center py-4">
            <h2 className="text-2xl font-semibold mb-6">You matched with: <span className="font-bold text-purple-700">{result.characterName}</span></h2>
            <p className="italic text-gray-600 text-xl font-medium bg-purple-50 p-6 rounded-xl border border-purple-100 italic">"{result.quote}"</p>
            <p className="text-gray-700 mt-4 text-base">{result.description}</p>
            <div className="flex gap-4 justify-center mt-8">
              <motion.button 
                whileHover={{ scale: 1.05, color: '#6b21a8' }} 
                whileTap={{ scale: 0.95 }} 
                onClick={() => setResult(null)} 
                className="text-sm font-semibold text-gray-600 underline"
              >
                Match again?
              </motion.button>
              <button onClick={handleShare} className="flex items-center gap-2 text-sm font-semibold text-purple-700 hover:text-purple-900 bg-purple-100 px-4 py-2 rounded-full transition">
                <Share2 size={16} /> Share Result
              </button>
            </div>
          </div>
        )}
      </motion.div>
      
      <footer className="mt-8 text-white font-semibold bg-black/50 p-2 rounded">
        Sponser: Pratyush and Kushagra
      </footer>
    </div>
  );
}

