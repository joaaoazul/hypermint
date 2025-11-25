import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const generateDepthData = () => {
  const data = [];
  // Bids (Green side)
  for (let i = 0; i < 20; i++) {
    data.push({
      price: 0.000028 + (i * 0.0000001),
      bidVolume: 1000 + (i * 100),
      askVolume: null,
      type: 'bid'
    });
  }
  // Asks (Red side)
  for (let i = 0; i < 20; i++) {
    data.push({
      price: 0.000030 + (i * 0.0000001),
      bidVolume: null,
      askVolume: 1000 + (20 - i) * 100,
      type: 'ask'
    });
  }
  return data;
};

export const DepthChart: React.FC = () => {
  const data = generateDepthData();

  return (
    <div className="w-full h-[450px] bg-[#161A1E] relative">
      <div className="absolute top-4 left-4 z-10 flex gap-4 text-xs font-bold">
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 bg-[#0ECB81] rounded-sm"></div>
           <span className="text-gray-400">Bids (Buy)</span>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 bg-[#F6465D] rounded-sm"></div>
           <span className="text-gray-400">Asks (Sell)</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <XAxis 
             dataKey="price" 
             type="number" 
             domain={['dataMin', 'dataMax']} 
             tick={{ fill: '#848E9C', fontSize: 10 }} 
             tickFormatter={(val) => val.toFixed(7)}
             axisLine={false}
             tickLine={false}
          />
          <YAxis 
            hide 
          />
          <Tooltip 
             contentStyle={{ backgroundColor: '#1E2329', border: '1px solid #2B2F36', borderRadius: '4px' }}
             itemStyle={{ fontSize: '12px' }}
             formatter={(value, name) => [value, name === 'bidVolume' ? 'Volume' : 'Volume']}
             labelFormatter={(label) => `Price: ${Number(label).toFixed(8)}`}
          />
          <Area 
             type="step" 
             dataKey="bidVolume" 
             stroke="#0ECB81" 
             fill="#0ECB81" 
             fillOpacity={0.2} 
             strokeWidth={2}
             connectNulls
          />
          <Area 
             type="step" 
             dataKey="askVolume" 
             stroke="#F6465D" 
             fill="#F6465D" 
             fillOpacity={0.2} 
             strokeWidth={2}
             connectNulls
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
