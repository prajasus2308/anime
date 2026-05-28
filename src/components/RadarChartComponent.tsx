import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TRAITS_MAP } from '../data';

interface RadarChartProps {
  characterName: string;
}

const RadarChartComponent: React.FC<RadarChartProps> = ({ characterName }) => {
  if (!TRAITS_MAP[characterName]) return null;

  return (
    <div className="h-64 mb-8">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                { trait: 'Strength', value: TRAITS_MAP[characterName].strength },
                { trait: 'Intelligence', value: TRAITS_MAP[characterName].intelligence },
                { trait: 'Kindness', value: TRAITS_MAP[characterName].kindness },
                { trait: 'Power', value: TRAITS_MAP[characterName].power },
                { trait: 'Speed', value: TRAITS_MAP[characterName].speed },
            ]}>
                <PolarGrid stroke="#4a5568" />
                <PolarAngleAxis dataKey="trait" tick={{ fill: '#e2e8f0', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Traits" dataKey="value" stroke="#f472b6" fill="#f472b6" fillOpacity={0.6} />
            </RadarChart>
        </ResponsiveContainer>
    </div>
  );
};

export default RadarChartComponent;
