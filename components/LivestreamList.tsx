
import React from 'react';
import { LiveStream } from '../types';

interface LivestreamListProps {
  onSelectStream: (stream: LiveStream) => void;
}

const MOCK_STREAMS: LiveStream[] = [
  { id: '1', hostName: 'DegenKing', title: '🚀 LAUNCHING $PEPE 2.0 - PRESALE LIVE NOW', viewers: 12400, thumbnail: 'https://picsum.photos/seed/stream1/300/200', isTokenGated: false, tags: ['Launch', 'Alpha'] },
  { id: '2', hostName: 'CryptoSarah', title: 'Chart Analysis + Chill ☕', viewers: 850, thumbnail: 'https://picsum.photos/seed/stream2/300/200', isTokenGated: true, minTokenBalance: 1000, tags: ['Trading', 'Education'] },
  { id: '3', hostName: 'WhaleWatcher', title: 'Hunting 100x Gems on Base Chain', viewers: 3200, thumbnail: 'https://picsum.photos/seed/stream3/300/200', isTokenGated: false, pricePerView: 0.1, tags: ['Hunting', 'Gems'] },
  { id: '4', hostName: 'SafeDev_Official', title: 'AMA: Security Audit Results', viewers: 5400, thumbnail: 'https://picsum.photos/seed/stream4/300/200', isTokenGated: false, tags: ['AMA', 'Safety'] },
];

export const LivestreamList: React.FC<LivestreamListProps> = ({ onSelectStream }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-slide-up">
      <div className="flex justify-between items-end mb-8">
         <div>
            <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-red-500 font-bold tracking-widest text-xs uppercase">Live Now</span>
            </div>
            <h2 className="text-3xl font-bold text-white">Live Launch Events</h2>
            <p className="text-gray-400 text-sm mt-1">Watch devs launch tokens in real-time. Verify before you buy.</p>
         </div>
         <button className="bg-brand-green text-black font-bold px-6 py-2 rounded hover:bg-green-400 transition-colors flex items-center gap-2">
            <span>📹</span> Start Streaming
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {MOCK_STREAMS.map((stream) => (
            <div 
              key={stream.id} 
              onClick={() => onSelectStream(stream)}
              className="group cursor-pointer rounded-xl overflow-hidden bg-brand-card border border-brand-input hover:border-brand-green/50 transition-all hover:-translate-y-1"
            >
               <div className="relative aspect-video bg-gray-900">
                  <img src={stream.thumbnail} alt={stream.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1">
                     <span>●</span> Live
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                     {stream.viewers.toLocaleString()} viewers
                  </div>
                  {stream.isTokenGated && (
                    <div className="absolute top-2 right-2 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-lg">
                       🔒 Token Gated
                    </div>
                  )}
                  {stream.pricePerView && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-lg">
                       🎟️ Pay-Per-View
                    </div>
                  )}
               </div>
               
               <div className="p-4">
                  <div className="flex gap-3">
                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-green to-blue-500 shrink-0 border-2 border-brand-dark"></div>
                     <div className="overflow-hidden">
                        <h3 className="text-white font-bold text-sm truncate group-hover:text-brand-green transition-colors">{stream.title}</h3>
                        <p className="text-gray-400 text-xs mt-1">{stream.hostName}</p>
                        <div className="flex gap-1 mt-2">
                           {stream.tags.map(tag => (
                              <span key={tag} className="text-[9px] bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded">{tag}</span>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};
