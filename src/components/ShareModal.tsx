import React from 'react';
import { motion } from 'motion/react';
import { X, Share2 } from 'lucide-react';
import RadarChartComponent from './RadarChartComponent';

interface ShareModalProps {
  result: any; // Using any for simplicity as per existing code
  onClose: () => void;
  onShare: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ result, onClose, onShare }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-6 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md bg-[#111111] border border-white/10 rounded-3xl p-8 shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold mb-6 text-center text-pink-300">Share Your Match</h2>
        <div className="text-center mb-6">
          <div className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300">
            {result.characterName}
          </div>
          <p className="italic text-gray-300">"{result.quote}"</p>
        </div>
        <RadarChartComponent characterName={result.characterName} />
        <button
          onClick={onShare}
          className="w-full bg-pink-600 text-white font-semibold rounded-full p-4 flex items-center justify-center gap-2 hover:bg-pink-700 transition"
        >
          <Share2 className="w-5 h-5" />
          Share Match
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ShareModal;
