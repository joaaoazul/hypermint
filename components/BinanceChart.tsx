
import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CrosshairMode, LineStyle, IChartApi } from 'lightweight-charts';

interface BinanceChartProps {
  data: {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }[];
  activeIndicators: string[];
  colors?: {
    up: string;
    down: string;
    bg: string;
  };
}

// --- Indicator Calculators ---

const calculateSMA = (data: any[], period: number) => {
  const result = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) continue;
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    result.push({ time: data[i].time, value: sum / period });
  }
  return result;
};

const calculateEMA = (data: any[], period: number) => {
  const result = [];
  const k = 2 / (period + 1);
  let ema = data[0].close;
  for (let i = 0; i < data.length; i++) {
    ema = data[i].close * k + ema * (1 - k);
    if (i >= period - 1) {
      result.push({ time: data[i].time, value: ema });
    }
  }
  return result;
};

const calculateBB = (data: any[], period: number, stdDevMultiplier: number) => {
  const upper = [];
  const lower = [];
  const middle = []; // Same as SMA

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) continue;
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    const sma = sum / period;
    
    let sumSqDiff = 0;
    for (let j = 0; j < period; j++) {
      sumSqDiff += Math.pow(data[i - j].close - sma, 2);
    }
    const stdDev = Math.sqrt(sumSqDiff / period);

    middle.push({ time: data[i].time, value: sma });
    upper.push({ time: data[i].time, value: sma + stdDev * stdDevMultiplier });
    lower.push({ time: data[i].time, value: sma - stdDev * stdDevMultiplier });
  }
  return { upper, lower, middle };
};

const calculateRSI = (data: any[], period: number) => {
  const result = [];
  let gains = 0;
  let losses = 0;

  // First RSI
  for (let i = 1; i <= period; i++) {
    const change = data[i].close - data[i - 1].close;
    if (change > 0) gains += change;
    else losses += Math.abs(change);
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = period + 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    let gain = change > 0 ? change : 0;
    let loss = change < 0 ? Math.abs(change) : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));
    result.push({ time: data[i].time, value: rsi });
  }
  return result;
};

const calculateMACD = (data: any[], fastPeriod: number, slowPeriod: number, signalPeriod: number) => {
  // Simple approximation using previous EMA logic
  const fastEMA = calculateEMA(data, fastPeriod);
  const slowEMA = calculateEMA(data, slowPeriod);
  
  const macdLine = [];
  // Align starts (simplified alignment for visualization)
  const mapFast = new Map(fastEMA.map(i => [i.time, i.value]));
  const mapSlow = new Map(slowEMA.map(i => [i.time, i.value]));

  data.forEach(d => {
      const f = mapFast.get(d.time);
      const s = mapSlow.get(d.time);
      if (f !== undefined && s !== undefined) {
          macdLine.push({ time: d.time, value: f - s });
      }
  });

  // Signal Line (EMA of MACD Line)
  // Quick adapter:
  const macdAsData = macdLine.map(m => ({ time: m.time, close: m.value }));
  const signalLine = calculateEMA(macdAsData, signalPeriod);
  
  const histogram = [];
  const signalMap = new Map(signalLine.map(s => [s.time, s.value]));

  for (const m of macdLine) {
     const s = signalMap.get(m.time);
     if (s !== undefined) {
       histogram.push({ time: m.time, value: m.value - s });
     }
  }

  return { macdLine, signalLine, histogram };
};

export const BinanceChart: React.FC<BinanceChartProps> = ({ 
  data, 
  activeIndicators,
  colors = { up: '#0ECB81', down: '#F6465D', bg: '#161A1E' }
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Layout state
  const hasRSI = activeIndicators.includes('RSI');
  const hasMACD = activeIndicators.includes('MACD');
  
  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    // --- 1. Cleanup old charts if any ---
    const container = containerRef.current;
    container.innerHTML = ''; // Brutal clear to ensure clean DOM for multiple charts

    // --- Dimensions ---
    const totalHeight = 450;
    const oscillatorHeight = 100;
    let mainHeight = totalHeight;
    
    if (hasRSI) mainHeight -= oscillatorHeight;
    if (hasMACD) mainHeight -= oscillatorHeight;

    // --- Helper to create chart options ---
    const commonOptions = {
      layout: {
        background: { type: ColorType.Solid, color: colors.bg },
        textColor: '#848E9C',
        fontFamily: "'Inter', sans-serif",
      },
      grid: {
        vertLines: { color: '#2B2F36', style: LineStyle.Dotted },
        horzLines: { color: '#2B2F36', style: LineStyle.Dotted },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      timeScale: {
        borderColor: '#2B2F36',
        timeVisible: true,
        secondsVisible: false,
      },
    };

    // --- Create Main Chart Container ---
    const mainContainer = document.createElement('div');
    mainContainer.style.height = `${mainHeight}px`;
    mainContainer.style.width = '100%';
    container.appendChild(mainContainer);

    const mainChart = createChart(mainContainer, {
      ...commonOptions,
      height: mainHeight,
    });

    // -- Main Series --
    const candleSeries = mainChart.addCandlestickSeries({
      upColor: colors.up,
      downColor: colors.down,
      borderDownColor: colors.down,
      borderUpColor: colors.up,
      wickDownColor: colors.down,
      wickUpColor: colors.up,
    });
    
    const formattedCandles = data.map(d => ({
        time: d.time as any, open: d.open, high: d.high, low: d.low, close: d.close
    }));
    candleSeries.setData(formattedCandles);

    // -- Volume --
    const volumeSeries = mainChart.addHistogramSeries({
      priceFormat: { type: 'volume' },
      priceScaleId: '', 
    });
    mainChart.priceScale('').applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
    
    volumeSeries.setData(data.map(d => ({
      time: d.time as any,
      value: d.volume,
      color: d.close >= d.open ? 'rgba(14, 203, 129, 0.3)' : 'rgba(246, 70, 93, 0.3)',
    })));

    // -- Overlays --
    if (activeIndicators.includes('SMA')) {
       const smaData = calculateSMA(data, 20);
       const smaSeries = mainChart.addLineSeries({ color: '#FCD535', lineWidth: 2, priceLineVisible: false });
       smaSeries.setData(smaData);
    }

    if (activeIndicators.includes('EMA')) {
       const emaData = calculateEMA(data, 20);
       const emaSeries = mainChart.addLineSeries({ color: '#33FFE0', lineWidth: 2, priceLineVisible: false });
       emaSeries.setData(emaData);
    }

    if (activeIndicators.includes('BB')) {
       const bbData = calculateBB(data, 20, 2);
       const upper = mainChart.addLineSeries({ color: 'rgba(0, 150, 255, 0.5)', lineWidth: 1, priceLineVisible: false });
       const lower = mainChart.addLineSeries({ color: 'rgba(0, 150, 255, 0.5)', lineWidth: 1, priceLineVisible: false });
       upper.setData(bbData.upper);
       lower.setData(bbData.lower);
    }

    // --- Oscillators ---
    let charts: IChartApi[] = [mainChart];

    const createOscillator = (name: string) => {
        const oscDiv = document.createElement('div');
        oscDiv.style.height = `${oscillatorHeight}px`;
        oscDiv.style.width = '100%';
        oscDiv.style.borderTop = '1px solid #2B2F36';
        container.appendChild(oscDiv);

        const oscChart = createChart(oscDiv, {
            ...commonOptions,
            height: oscillatorHeight,
            timeScale: { visible: false } // Hide dates on oscillators to save space
        });

        // Add Label
        const label = document.createElement('div');
        label.innerText = name;
        label.style.position = 'absolute';
        label.style.left = '8px';
        label.style.top = '4px';
        label.style.zIndex = '5';
        label.style.fontSize = '10px';
        label.style.color = '#555';
        label.style.fontWeight = 'bold';
        label.style.pointerEvents = 'none';
        oscDiv.style.position = 'relative';
        oscDiv.appendChild(label);

        return oscChart;
    }

    if (hasRSI) {
        const rsiChart = createOscillator('RSI (14)');
        charts.push(rsiChart);
        
        const rsiSeries = rsiChart.addLineSeries({ color: '#A855F7', lineWidth: 2 });
        const rsiData = calculateRSI(data, 14);
        rsiSeries.setData(rsiData);
        
        // Add RSI Bands (70/30)
        const topLine = rsiChart.addLineSeries({ color: '#ffffff', lineWidth: 1, lineStyle: LineStyle.Dashed });
        topLine.setData(data.map(d => ({ time: d.time as any, value: 70 })));
        const botLine = rsiChart.addLineSeries({ color: '#ffffff', lineWidth: 1, lineStyle: LineStyle.Dashed });
        botLine.setData(data.map(d => ({ time: d.time as any, value: 30 })));
    }

    if (hasMACD) {
        const macdChart = createOscillator('MACD (12, 26, 9)');
        charts.push(macdChart);

        const { macdLine, signalLine, histogram } = calculateMACD(data, 12, 26, 9);
        
        const histSeries = macdChart.addHistogramSeries({ color: '#26a69a' });
        histSeries.setData(histogram.map(h => ({
            time: h.time, value: h.value, color: h.value >= 0 ? '#26a69a' : '#ef5350'
        })));

        const macdSeries = macdChart.addLineSeries({ color: '#2962FF', lineWidth: 1 });
        macdSeries.setData(macdLine);
        const signalSeries = macdChart.addLineSeries({ color: '#FF6D00', lineWidth: 1 });
        signalSeries.setData(signalLine);
    }

    // --- Synchronization ---
    // We bind all charts to sync their Logical Range
    charts.forEach(c => {
        c.timeScale().subscribeVisibleLogicalRangeChange(range => {
            if (range) {
                charts.forEach(other => {
                    if (other !== c) {
                        other.timeScale().setVisibleLogicalRange(range);
                    }
                });
            }
        });
    });

    // Fit content
    mainChart.timeScale().fitContent();

    // Resize Observer
    const handleResize = () => {
       if (mainContainer && mainChart) {
           const w = container.clientWidth;
           charts.forEach(c => c.applyOptions({ width: w }));
       }
    };
    window.addEventListener('resize', handleResize);

    return () => {
       window.removeEventListener('resize', handleResize);
       charts.forEach(c => c.remove());
    }
  }, [data, activeIndicators, colors]);

  return (
    <div className="w-full bg-[#161A1E] relative">
       <div ref={containerRef} className="w-full flex flex-col" />
    </div>
  );
};
