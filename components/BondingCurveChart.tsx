import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const data = [
  { percent: 0, price: 0.0000001 },
  { percent: 10, price: 0.00000015 },
  { percent: 20, price: 0.00000022 },
  { percent: 30, price: 0.00000035 },
  { percent: 40, price: 0.00000055 },
  { percent: 50, price: 0.0000009 },
  { percent: 60, price: 0.0000015 },
  { percent: 70, price: 0.0000028 },
  { percent: 80, price: 0.0000055 },
  { percent: 90, price: 0.000012 },
  { percent: 100, price: 0.000035 },
];

export const BondingCurveChart: React.FC = () => {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-brand-border w-full h-80 flex flex-col relative overflow-hidden group shadow-2xl">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity duration-500">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor" className="text-brand-accent">
          <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
        </svg>
      </div>
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
           <h3 className="text-white text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              Bonding Curve
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse"></span>
           </h3>
           <p className="text-[10px] text-brand-text-muted mt-1">Mathematical Price Discovery</p>
        </div>
        <span className="text-[10px] bg-brand-accent/10 text-brand-accent px-3 py-1 rounded-full border border-brand-accent/20 font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(51,255,224,0.2)]">Live Simulation</span>
      </div>

      <div className="flex-1 w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPriceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#33FFE0" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="#33FFE0" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="percent" 
              tick={{fill: '#8A8F9A', fontSize: 10, fontWeight: 'bold'}} 
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => `${val}%`}
              interval="preserveStartEnd"
            />
            <YAxis hide domain={['dataMin', 'dataMax']} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#11131A', border: '1px solid #33FFE0', borderRadius: '8px', boxShadow: '0 0 15px rgba(51, 255, 224, 0.3)' }}
              itemStyle={{ color: '#33FFE0', fontSize: '12px', fontFamily: 'monospace', fontWeight: 'bold' }}
              labelStyle={{ display: 'none' }}
              formatter={(value: number) => [`${value.toFixed(8)} SOL`, 'Price']}
              cursor={{ stroke: '#33FFE0', strokeWidth: 1 }}
            />
            <ReferenceLine x={80} stroke="#4B5563" strokeDasharray="3 3" label={{ position: 'top', value: 'DEX Launch', fill: '#F1F5F9', fontSize: 10, fontWeight: 'bold' }} />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#33FFE0" 
              fillOpacity={1} 
              fill="url(#colorPriceGradient)" 
              strokeWidth={3}
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="text-[10px] text-gray-500 mt-2 text-center border-t border-dashed border-gray-800 pt-3 relative z-10">
        Target Market Cap: <span className="text-brand-accent font-bold glow-text">$69,000</span> (Auto-Migrate to Raydium)
      </div>
    </div>
  );
};