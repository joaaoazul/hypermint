
import React, { useState, useEffect, useRef } from 'react';
import { SecurityLog, SecurityAlert } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const GENERATE_LOGS = [
    { type: 'INFO', source: 'FIREWALL', message: 'Inbound packet allowed from 192.168.1.x' },
    { type: 'INFO', source: 'BLOCKCHAIN', message: 'Scanning mempool for pending transactions...' },
    { type: 'INFO', source: 'USER_AUTH', message: 'Session token verified for user 0x7a...9f' },
    { type: 'WARN', source: 'AI_AGENT', message: 'Unusual rapid request pattern detected from IP block 45.2.x.x' },
    { type: 'INFO', source: 'BLOCKCHAIN', message: 'Block #1928492 processed. No anomalies.' },
    { type: 'SUCCESS', source: 'AI_AGENT', message: 'Smart contract bytecode verified safe.' },
    { type: 'INFO', source: 'FIREWALL', message: 'Rate limit bucket refreshed.' },
];

export const SecurityDashboard: React.FC = () => {
    const [logs, setLogs] = useState<SecurityLog[]>([]);
    const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
    const [trafficData, setTrafficData] = useState<any[]>([]);
    const [systemStatus, setSystemStatus] = useState<'SECURE' | 'WARNING' | 'CRITICAL'>('SECURE');
    const logsContainerRef = useRef<HTMLDivElement>(null);
    const [userScrolled, setUserScrolled] = useState(false);

    // Initial Data
    useEffect(() => {
        const initialLogs = Array.from({ length: 10 }).map((_, i) => ({
            id: `init-${i}`,
            timestamp: Date.now() - (1000 * i),
            type: 'INFO' as const,
            source: 'AI_AGENT' as const,
            message: 'System initializing security protocols...'
        }));
        setLogs(initialLogs.reverse());
        
        // Initial Traffic Data
        const initialTraffic = Array.from({ length: 20 }).map((_, i) => ({
            time: i,
            value: 20 + Math.random() * 10
        }));
        setTrafficData(initialTraffic);
    }, []);

    // Intelligent auto-scroll
    useEffect(() => {
        const container = logsContainerRef.current;
        if (!container) return;
        
        // Check if we are near the bottom (allow 50px buffer)
        // If user scrolled up, don't force scroll down
        const isNearBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
        
        if (isNearBottom) {
            container.scrollTop = container.scrollHeight;
        }
    }, [logs]);

    const handleScroll = () => {
        const container = logsContainerRef.current;
        if (container) {
            const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 50;
            setUserScrolled(!isAtBottom);
        }
    };

    // Simulate Real-time Logs & Traffic
    useEffect(() => {
        const interval = setInterval(() => {
            const randomLogTemplate = GENERATE_LOGS[Math.floor(Math.random() * GENERATE_LOGS.length)];
            const newLog: SecurityLog = {
                id: Date.now().toString() + Math.random(),
                timestamp: Date.now(),
                type: randomLogTemplate.type as any,
                source: randomLogTemplate.source as any,
                message: randomLogTemplate.message
            };
            
            setLogs(prev => [...prev.slice(-49), newLog]);
            
            // Update Traffic
            setTrafficData(prev => {
                const newData = [...prev.slice(1)];
                newData.push({
                    time: prev[prev.length - 1].time + 1,
                    value: Math.max(10, Math.min(100, prev[prev.length - 1].value + (Math.random() - 0.5) * 20))
                });
                return newData;
            });

        }, 800);
        return () => clearInterval(interval);
    }, []);

    // Simulate AI Anomaly Detection
    useEffect(() => {
        const anomalyInterval = setInterval(() => {
            if (Math.random() > 0.7) {
                triggerAnomaly();
            }
        }, 8000);
        return () => clearInterval(anomalyInterval);
    }, []);

    const triggerAnomaly = () => {
        const anomalies = [
            { title: 'Liquidity Drain Attempt', severity: 'critical', details: 'Flash loan attack pattern detected in mempool.' },
            { title: 'Botnet Traffic Spike', severity: 'high', details: 'DDoS signature match from region AS492.' },
            { title: 'Unauthorized Contract Call', severity: 'medium', details: 'Non-owner attempted to call restricted function.' },
        ];
        
        const anomaly = anomalies[Math.floor(Math.random() * anomalies.length)];
        const newAlert: SecurityAlert = {
            id: Date.now().toString(),
            title: anomaly.title,
            severity: anomaly.severity as any,
            timestamp: Date.now(),
            status: 'detecting',
            details: anomaly.details
        };

        setAlerts(prev => [newAlert, ...prev]);
        setSystemStatus(anomaly.severity === 'critical' ? 'CRITICAL' : 'WARNING');
        
        // Simulate AI Mitigation
        setTimeout(() => {
            setAlerts(prev => prev.map(a => a.id === newAlert.id ? { ...a, status: 'mitigating' } : a));
            
            // Add Log
            setLogs(prev => [...prev, {
                id: Date.now().toString(),
                timestamp: Date.now(),
                type: 'WARN',
                source: 'AI_AGENT',
                message: `Mitigation started for: ${anomaly.title}`
            }]);
        }, 2000);

        setTimeout(() => {
            setAlerts(prev => prev.map(a => a.id === newAlert.id ? { ...a, status: 'resolved' } : a));
            setSystemStatus('SECURE');
             setLogs(prev => [...prev, {
                id: Date.now().toString(),
                timestamp: Date.now(),
                type: 'SUCCESS',
                source: 'AI_AGENT',
                message: `Threat resolved: ${anomaly.title}. Defense parameters updated.`
            }]);
        }, 5000);
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto px-4 py-8 animate-fade-in font-mono pb-32 min-h-screen">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <span className="text-brand-accent">🛡️</span> AI Security Guardian
                    </h1>
                    <p className="text-brand-text-muted mt-2">Real-time threat monitoring and automated defense system.</p>
                </div>
                <div className={`px-6 py-3 rounded-lg border flex items-center gap-3 ${
                    systemStatus === 'SECURE' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                    systemStatus === 'WARNING' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' :
                    'bg-red-500/10 border-red-500/30 text-red-500 animate-pulse'
                }`}>
                    <div className={`w-3 h-3 rounded-full ${
                        systemStatus === 'SECURE' ? 'bg-green-500' :
                        systemStatus === 'WARNING' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="font-bold tracking-widest">SYSTEM STATUS: {systemStatus}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Logs & Traffic */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Traffic Monitor */}
                    <div className="glass-panel p-6 rounded-xl border border-brand-border">
                        <div className="flex justify-between items-center mb-4">
                             <h3 className="text-white font-bold text-sm uppercase tracking-wider">Network Traffic Pattern</h3>
                             <span className="text-xs text-brand-accent">Live Inbound/Outbound</span>
                        </div>
                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trafficData}>
                                    <defs>
                                        <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#33FFE0" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#33FFE0" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis hide />
                                    <YAxis hide domain={[0, 100]} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#11131A', border: '1px solid #33FFE0' }}
                                        itemStyle={{ color: '#33FFE0', fontFamily: 'monospace' }}
                                        labelStyle={{ display: 'none' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#33FFE0" fillOpacity={1} fill="url(#colorTraffic)" isAnimationActive={false} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Terminal Logs */}
                    <div className="glass-panel rounded-xl border border-brand-border bg-[#0E0F12] overflow-hidden flex flex-col h-[400px]">
                        <div className="p-3 border-b border-gray-800 flex justify-between items-center bg-[#161A1E]">
                             <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                             </div>
                             <span className="text-xs text-gray-500 font-bold">/var/log/ai_guardian.log</span>
                        </div>
                        <div 
                            ref={logsContainerRef}
                            onScroll={handleScroll}
                            className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs custom-scrollbar"
                        >
                            {logs.map((log) => (
                                <div key={log.id} className="flex gap-3 hover:bg-white/5 p-1 rounded transition-colors">
                                    <span className="text-gray-500 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                                    <span className={`shrink-0 font-bold w-16 ${
                                        log.type === 'INFO' ? 'text-blue-400' :
                                        log.type === 'WARN' ? 'text-yellow-400' :
                                        log.type === 'CRIT' ? 'text-red-500' : 'text-green-400'
                                    }`}>{log.type}</span>
                                    <span className="text-purple-400 shrink-0 w-24">[{log.source}]</span>
                                    <span className="text-gray-300 break-all">{log.message}</span>
                                </div>
                            ))}
                            {userScrolled && (
                                <div 
                                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-brand-accent text-black px-3 py-1 rounded text-xs font-bold cursor-pointer opacity-80 hover:opacity-100 shadow-neon" 
                                  onClick={() => {
                                      if(logsContainerRef.current) logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
                                      setUserScrolled(false);
                                  }}
                                >
                                    ↓ Resume Auto-scroll
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Alerts & Active Defenses */}
                <div className="space-y-6">
                    
                    {/* Active Threats */}
                    <div className="glass-panel p-6 rounded-xl border border-brand-border">
                        <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span>⚠️</span> Active Threats
                        </h3>
                        <div className="space-y-3">
                            {alerts.filter(a => a.status !== 'resolved').length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <div className="text-4xl mb-2">✅</div>
                                    <p>No active threats detected.</p>
                                </div>
                            ) : (
                                alerts.filter(a => a.status !== 'resolved').map(alert => (
                                    <div key={alert.id} className={`p-4 rounded-lg border ${
                                        alert.severity === 'critical' ? 'bg-red-500/10 border-red-500/50' : 
                                        'bg-yellow-500/10 border-yellow-500/50'
                                    } animate-pulse-glow`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                                                alert.severity === 'critical' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-black'
                                            }`}>{alert.severity}</span>
                                            <span className="text-[10px] text-gray-400">{alert.status}...</span>
                                        </div>
                                        <h4 className="text-white font-bold text-sm mb-1">{alert.title}</h4>
                                        <p className="text-xs text-gray-300 mb-3">{alert.details}</p>
                                        <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-brand-accent animate-[progressBar_2s_ease-in-out_infinite]"></div>
                                        </div>
                                        <div className="text-[10px] text-brand-accent mt-1">AI Counter-measures deploying...</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Automated Defenses Status */}
                    <div className="glass-panel p-6 rounded-xl border border-brand-border">
                        <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span>🛡️</span> Active Defenses
                        </h3>
                        <div className="space-y-4">
                            {[
                                { name: 'Smart Contract Auditor', status: 'Active', load: '12%' },
                                { name: 'Mempool Scanner', status: 'Active', load: '45%' },
                                { name: 'Anti-Bot Firewall', status: 'Active', load: '89%' },
                                { name: 'Rug-Pull Detector', status: 'Active', load: '23%' },
                            ].map((defense, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-[#161A1E] rounded-lg border border-gray-800">
                                    <div>
                                        <div className="text-sm font-bold text-gray-300">{defense.name}</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                            <span className="text-[10px] text-green-500 uppercase">{defense.status}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] text-gray-500">Sys Load</div>
                                        <div className="text-xs font-mono text-brand-accent">{defense.load}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel p-4 rounded-xl border border-brand-border bg-gradient-to-r from-purple-900/20 to-blue-900/20">
                        <h4 className="text-white font-bold text-sm mb-2">AI Agent Status</h4>
                        <div className="flex items-center gap-4">
                             <div className="relative">
                                 <div className="w-12 h-12 rounded-full border-2 border-brand-accent flex items-center justify-center">
                                     <span className="text-xl">🤖</span>
                                 </div>
                                 <div className="absolute -bottom-1 -right-1 bg-green-500 text-black text-[10px] font-bold px-1.5 rounded-full border border-black">ON</div>
                             </div>
                             <div>
                                 <div className="text-xs text-gray-400">Learning Model</div>
                                 <div className="text-sm font-bold text-white">v2.5-Flash-Guard</div>
                             </div>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-3 leading-relaxed">
                            The agent is actively analyzing 14,000+ data points per second to ensure platform integrity.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};
