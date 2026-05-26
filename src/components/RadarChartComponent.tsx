import React from 'react';
import { motion } from 'motion/react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { TRAITS_MAP } from '../data';

interface RadarChartProps {
  characterName: string;
}

const AVERAGE_TRAITS = { strength: 82, intelligence: 77, kindness: 76, power: 83, speed: 82 };

const RadarChartComponent: React.FC<RadarChartProps> = ({ characterName }) => {
  if (!TRAITS_MAP[characterName]) return null;

  const data = [
    { trait: 'Strength', user: TRAITS_MAP[characterName].strength, average: AVERAGE_TRAITS.strength },
    { trait: 'Intelligence', user: TRAITS_MAP[characterName].intelligence, average: AVERAGE_TRAITS.intelligence },
    { trait: 'Kindness', user: TRAITS_MAP[characterName].kindness, average: AVERAGE_TRAITS.kindness },
    { trait: 'Power', user: TRAITS_MAP[characterName].power, average: AVERAGE_TRAITS.power },
    { trait: 'Speed', user: TRAITS_MAP[characterName].speed, average: AVERAGE_TRAITS.speed },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="h-72 mb-8 bg-black/20 rounded-3xl p-2 border border-white/5"
    >
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                <PolarGrid stroke="#4a5568" />
                <PolarAngleAxis dataKey="trait" tick={{ fill: '#e2e8f0', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Your Match" dataKey="user" stroke="#f472b6" fill="#f472b6" fillOpacity={0.5} />
                <Radar name="Average" dataKey="average" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                <Legend iconSize={10} wrapperStyle={{fontSize: '12px'}} />
            </RadarChart>
        </ResponsiveContainer>
    </motion.div>
  );
};

export default RadarChartComponent;
