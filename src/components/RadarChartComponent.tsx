import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TRAITS_MAP } from '../data';

interface RadarChartProps {
  characterName: string;
}

const RadarChartComponent: React.FC<RadarChartProps> = ({ characterName }) => {
  if (!TRAITS_MAP[characterName]) return null;

  const allTraits = Object.values(TRAITS_MAP);
  const sum = allTraits.reduce((acc, t) => ({
    strength: acc.strength + t.strength,
    intelligence: acc.intelligence + t.intelligence,
    kindness: acc.kindness + t.kindness,
    power: acc.power + t.power,
    speed: acc.speed + t.speed
  }), { strength: 0, intelligence: 0, kindness: 0, power: 0, speed: 0 });

  const count = allTraits.length;
  const avg = {
    strength: sum.strength / count,
    intelligence: sum.intelligence / count,
    kindness: sum.kindness / count,
    power: sum.power / count,
    speed: sum.speed / count
  };

  const char = TRAITS_MAP[characterName];
  const chartData = [
    { trait: 'Strength', user: char.strength, avg: avg.strength },
    { trait: 'Intelligence', user: char.intelligence, avg: avg.intelligence },
    { trait: 'Kindness', user: char.kindness, avg: avg.kindness },
    { trait: 'Power', user: char.power, avg: avg.power },
    { trait: 'Speed', user: char.speed, avg: avg.speed },
  ];

  return (
    <div className="h-64 mb-8">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#4a5568" />
                <PolarAngleAxis dataKey="trait" tick={{ fill: '#e2e8f0', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Your Match" dataKey="user" stroke="#f472b6" fill="#f472b6" fillOpacity={0.6} />
                <Radar name="Global Avg" dataKey="avg" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.3} strokeDasharray="4 4" />
            </RadarChart>
        </ResponsiveContainer>
    </div>
  );
};

export default RadarChartComponent;
