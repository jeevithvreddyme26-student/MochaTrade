'use client';
import React, { useState } from 'react';
import { 
  TrendingUp, ShieldCheck, Send, CheckCircle2, AlertCircle, 
  Activity, Calculator, ArrowRightLeft, BarChart3, Flame 
} from 'lucide-react';

export default function MochaTradeSimulator() {
  const [paidAds, setPaidAds] = useState(20);
  const [referrals, setReferrals] = useState(60);
  const [content, setContent] = useState(20);
  const [activeScenario, setActiveScenario] = useState('recommended');

  const PAID_CAC = 1800;
  const REF_CAC = 400;
  const CONTENT_CAC = 700;
  const TARGET_ACQUISITION = 30000;
  const ESTIMATED_GROSS_REVENUE = 46980000; 

  const blendedCAC = ((paidAds / 100) * PAID_CAC) + ((referrals / 100) * REF_CAC) + ((content / 100) * CONTENT_CAC);
  const totalSpend = (blendedCAC * TARGET_ACQUISITION);
  const netContribution = (ESTIMATED_GROSS_REVENUE - totalSpend - 9000000) / 100000; 
  const trustScore = Math.min(100, Math.round((referrals * 0.75) + (content * 0.25) + 15));

  const BASELINE_CAC = (0.80 * PAID_CAC) + (0.10 * REF_CAC) + (0.10 * CONTENT_CAC); 
  const BASELINE_SPEND = BASELINE_CAC * TARGET_ACQUISITION;
  const BASELINE_NET_LAKHS = (ESTIMATED_GROSS_REVENUE - BASELINE_SPEND - 9000000) / 100000;

  const applyScenario = (mode) => {
    setActiveScenario(mode);
    if (mode === 'baseline') {
      setPaidAds(80); setReferrals(10); setContent(10);
    } else if (mode === 'recommended') {
      setPaidAds(20); setReferrals(60); setContent(20);
    } else if (mode === 'viral') {
      setPaidAds(5); setReferrals(80); setContent(15);
    }
  };

  // UPDATED LIMITS: 50 for Retail, 500 for Active
  const [annualTrades, setAnnualTrades] = useState(60);
  const costRetail = 500 + Math.max(0, annualTrades - 50) * 20;
  const costActive = 5000 + Math.max(0, annualTrades - 500) * 20;
  const costNoPlan = annualTrades * 20;

  const getBestPlan = () => {
    const min = Math.min(costRetail, costActive, costNoPlan);
    if (min === costRetail) return { name: 'Retail Plan', cost: costRetail, base: '₹500/year' };
    if (min === costActive) return { name: 'Active Trader', cost: costActive, base: '₹5,000/year' };
    return { name: 'No Plan', cost: costNoPlan, base: '₹20/trade' };
  };
  const bestPlan = getBestPlan();

  const [chatId, setChatId] = useState('');
  const [asset, setAsset] = useState('NSE:RELIANCE');
  const [orderAmount, setOrderAmount] = useState('25000');
  const [status, setStatus] = useState('idle');

  const isINR = asset.startsWith('NSE:') || asset.startsWith('BSE:');
  const currencySymbol = isINR ? '₹' : '$';

  const handleTrade = async () => {
    if (!chatId || !orderAmount) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }
    setStatus('loading');
    
    try {
      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          chatId, 
          asset, 
          tradeAmount: orderAmount,
          bestPlanName: bestPlan.name,
          currencySymbol,
          annualTrades // We now pass this to the backend to calculate the dynamic fee
        }),
      });

      if (response.ok) {
        setStatus('success');
        setTimeout(() => setStatus('idle'), 4000);
      } else throw new Error('API request failed');
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans selection:bg-emerald-500/20">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-5 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <Activity className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold tracking-tight text-white">MochaTrade Model Simulator</h1>
                <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full font-mono font-medium">Breakout Bulls</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Live Unit Economics, Trust Friction Funnels & Verified Execution</p>
            </div>
          </div>

          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button onClick={() => applyScenario('baseline')} className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeScenario === 'baseline' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400 hover:text-slate-200'}`}>Baseline (Paid Ad Trap)</button>
            <button onClick={() => applyScenario('recommended')} className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeScenario === 'recommended' ? 'bg-emerald-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-slate-200'}`}>Target Strategy</button>
            <button onClick={() => applyScenario('viral')} className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center ${activeScenario === 'viral' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}><Flame className="w-3.5 h-3.5 mr-1 text-amber-300" /> Viral Organic</button>
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Blended CAC</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-bold text-white">₹{blendedCAC.toFixed(0)}</span>
              <span className={`text-xs ${blendedCAC < BASELINE_CAC ? 'text-emerald-400' : 'text-rose-400'}`}>{blendedCAC < BASELINE_CAC ? `↓ ${Math.round((1 - blendedCAC/BASELINE_CAC)*100)}% cheaper` : 'At Baseline'}</span>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Acquisition Budget (30k)</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-bold text-white">₹{(totalSpend / 10000000).toFixed(2)} Cr</span>
              <span className="text-xs text-slate-400">vs ₹4.65 Cr baseline</span>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Net Contribution</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className={`text-2xl font-bold ${netContribution > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>₹{netContribution.toFixed(1)} L</span>
              <span className="text-xs text-slate-400">post-CAC buffer</span>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 relative overflow-hidden">
            <div className={`absolute bottom-0 left-0 h-1 transition-all duration-300 ${trustScore >= 70 ? 'bg-emerald-400' : 'bg-amber-400'}`} style={{ width: `${trustScore}%` }} />
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Trust Score</span>
              <ShieldCheck className={`w-4 h-4 ${trustScore >= 70 ? 'text-emerald-400' : 'text-amber-400'}`} />
            </div>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-bold text-white">{trustScore} / 100</span>
              <span className="text-xs text-slate-400">{trustScore > 65 ? 'High organic virality' : 'Friction present'}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-base font-bold text-white">Live Model Comparison Graph</h2>
                </div>
                <div className="flex items-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1.5"><span className="w-3 h-3 rounded-sm bg-rose-500/80 inline-block" /><span className="text-slate-400">Baseline (Paid Heavy)</span></div>
                  <div className="flex items-center space-x-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" /><span className="text-slate-400">Current Simulator Mix</span></div>
                </div>
              </div>

              <div className="space-y-5 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1"><span className="text-slate-300">Blended CAC (Target: Below ₹800)</span><span className="text-emerald-400 font-mono">₹{blendedCAC.toFixed(0)} vs ₹{BASELINE_CAC.toFixed(0)}</span></div>
                  <div className="space-y-1.5">
                    <div className="h-4 bg-slate-950 rounded overflow-hidden flex items-center px-2"><div className="h-2 rounded bg-rose-500/80 transition-all duration-300" style={{ width: `${(BASELINE_CAC / 2000) * 100}%` }} /></div>
                    <div className="h-4 bg-slate-950 rounded overflow-hidden flex items-center px-2"><div className="h-2 rounded bg-emerald-500 transition-all duration-300" style={{ width: `${(blendedCAC / 2000) * 100}%` }} /></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1"><span className="text-slate-300">Total Spend on 30k Users</span><span className="text-emerald-400 font-mono">₹{(totalSpend / 10000000).toFixed(2)} Cr vs ₹{(BASELINE_SPEND / 10000000).toFixed(2)} Cr</span></div>
                  <div className="space-y-1.5">
                    <div className="h-4 bg-slate-950 rounded overflow-hidden flex items-center px-2"><div className="h-2 rounded bg-rose-500/80 transition-all duration-300" style={{ width: `${(BASELINE_SPEND / 60000000) * 100}%` }} /></div>
                    <div className="h-4 bg-slate-950 rounded overflow-hidden flex items-center px-2"><div className="h-2 rounded bg-emerald-500 transition-all duration-300" style={{ width: `${(totalSpend / 60000000) * 100}%` }} /></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1"><span className="text-slate-300">Net Contribution (Profit Margin)</span><span className="text-emerald-400 font-mono">₹{netContribution.toFixed(1)} L vs ₹{BASELINE_NET_LAKHS.toFixed(1)} L</span></div>
                  <div className="space-y-1.5">
                    <div className="h-4 bg-slate-950 rounded overflow-hidden flex items-center px-2"><div className="h-2 rounded bg-rose-500/80 transition-all duration-300" style={{ width: `${Math.max(5, (BASELINE_NET_LAKHS / 250) * 100)}%` }} /></div>
                    <div className="h-4 bg-slate-950 rounded overflow-hidden flex items-center px-2"><div className="h-2 rounded bg-emerald-500 transition-all duration-300" style={{ width: `${Math.max(5, (netContribution / 250) * 100)}%` }} /></div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-base font-bold text-white mb-4 flex items-center"><ArrowRightLeft className="w-5 h-5 mr-2 text-emerald-400" />Adjust Acquisition Levers</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5"><span className="text-slate-300">Paid Ads Channel (₹1,800 CAC)</span><span className="text-rose-400 font-mono">{paidAds}%</span></div>
                  <input type="range" min="0" max="100" value={paidAds} onChange={(e) => { setPaidAds(parseInt(e.target.value)); setActiveScenario('custom'); }} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5"><span className="text-slate-300">Peer-to-Peer Referrals via Receipts (₹400 CAC)</span><span className="text-emerald-400 font-mono">{referrals}%</span></div>
                  <input type="range" min="0" max="100" value={referrals} onChange={(e) => { setReferrals(parseInt(e.target.value)); setActiveScenario('custom'); }} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5"><span className="text-slate-300">Community Content & Education (₹700 CAC)</span><span className="text-indigo-400 font-mono">{content}%</span></div>
                  <input type="range" min="0" max="100" value={content} onChange={(e) => { setContent(parseInt(e.target.value)); setActiveScenario('custom'); }} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-5 space-y-6">
            
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-base font-bold text-white mb-3 flex items-center"><Calculator className="w-5 h-5 mr-2 text-indigo-400" />Trader Fee Optimization</h2>
              <div className="mb-4">
                <div className="flex justify-between text-xs font-medium text-slate-400 mb-1"><span>Simulated Annual Trades</span><span className="text-indigo-400 font-bold">{annualTrades} trades / yr</span></div>
                <input type="range" min="5" max="600" step="5" value={annualTrades} onChange={(e) => setAnnualTrades(parseInt(e.target.value))} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 mb-3 flex items-center justify-between">
                <div><span className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">Suggested Tier</span><p className="text-base font-bold text-white">{bestPlan.name}</p></div>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-md font-mono">{bestPlan.base}</span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-400 pt-1 border-t border-slate-800/80">
                <div className="flex justify-between"><span>Retail (₹500 + ₹20 after 50):</span> <span className="font-mono text-slate-200">₹{costRetail}</span></div>
                <div className="flex justify-between"><span>Active Trader (₹5000 + ₹20 after 500):</span> <span className="font-mono text-slate-200">₹{costActive}</span></div>
                <div className="flex justify-between"><span>No Plan (₹20 flat per trade):</span> <span className="font-mono text-slate-200">₹{costNoPlan}</span></div>
              </div>
            </section>

            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-base font-bold text-white mb-3 flex items-center"><Send className="w-5 h-5 mr-2 text-emerald-400" />Live Trust Receipt Dispatch</h2>
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Target Chat ID (Group or Personal)</label>
                  <input type="text" value={chatId} onChange={(e) => setChatId(e.target.value)} placeholder="e.g. -10012345678 or 98765432" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Asset Contract</label>
                    <select value={asset} onChange={(e) => setAsset(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500">
                      <optgroup label="NSE Equities">
                        <option value="NSE:RELIANCE">RELIANCE (NSE)</option>
                        <option value="NSE:HDFCBANK">HDFCBANK (NSE)</option>
                        <option value="NSE:TCS">TCS (NSE)</option>
                        <option value="NSE:INFY">INFY (NSE)</option>
                        <option value="NSE:ICICIBANK">ICICIBANK (NSE)</option>
                        <option value="NSE:TATAMOTORS">TATAMOTORS (NSE)</option>
                        <option value="NSE:SBIN">SBIN (NSE)</option>
                      </optgroup>
                      <optgroup label="BSE Equities">
                        <option value="BSE:SENSEX">SENSEX Index (BSE)</option>
                        <option value="BSE:RELIANCE">RELIANCE (BSE)</option>
                        <option value="BSE:HDFCBANK">HDFCBANK (BSE)</option>
                        <option value="BSE:BHARTIARTL">BHARTIARTL (BSE)</option>
                        <option value="BSE:TATASTEEL">TATASTEEL (BSE)</option>
                        <option value="BSE:WIPRO">WIPRO (BSE)</option>
                      </optgroup>
                      <optgroup label="Commodities & Forex">
                        <option value="XAU/USD (Gold Perp)">XAU/USD (Gold Perp)</option>
                        <option value="EUR/USD">EUR/USD</option>
                      </optgroup>
                      <optgroup label="High-Volume Crypto">
                        <option value="BTC-PERP">BTC-PERP (Bitcoin)</option>
                        <option value="ETH-PERP">ETH-PERP (Ethereum)</option>
                        <option value="SOL-PERP">SOL-PERP (Solana)</option>
                        <option value="DOGE-PERP">DOGE-PERP</option>
                      </optgroup>
                      <optgroup label="US Equities (Synthetics)">
                        <option value="NVDA (Nvidia Corp)">NVDA (Nvidia)</option>
                        <option value="TSLA (Tesla Inc)">TSLA (Tesla)</option>
                        <option value="AAPL (Apple Inc)">AAPL (Apple)</option>
                      </optgroup>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Notional Value ({currencySymbol})</label>
                    <input type="number" value={orderAmount} onChange={(e) => setOrderAmount(e.target.value)} placeholder="25000" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono" />
                  </div>
                </div>
              </div>
              <button onClick={handleTrade} disabled={status === 'loading'} className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all flex items-center justify-center text-xs disabled:opacity-60">
                {status === 'loading' ? <span className="flex items-center"><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-950" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Dispatching Verified Receipt...</span> : 'Execute Settlement & Post Receipt'}
              </button>
              <div className="mt-3 min-h-[20px]">
                {status === 'success' && <div className="flex items-center justify-center text-xs text-emerald-400 animate-in fade-in"><CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Receipt broadcasted to Telegram group!</div>}
                {status === 'error' && <div className="flex items-center justify-center text-xs text-rose-400 animate-in fade-in"><AlertCircle className="w-3.5 h-3.5 mr-1.5" /> Backend connection failed.</div>}
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}