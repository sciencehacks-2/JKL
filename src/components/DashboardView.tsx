/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Factory, Machine } from '../types';
import {
  Zap,
  TrendingUp,
  AlertTriangle,
  Layers,
  Activity,
  Flame,
  Award,
  Coffee
} from 'lucide-react';

interface DashboardViewProps {
  factories: Factory[];
}

export default function DashboardView({ factories }: DashboardViewProps) {
  const [selectedFactIdForDept, setSelectedFactIdForDept] = useState<string>(factories[0]?.id || '');

  // মোট ব্যবহৃত এবং অপচয় হিসাব
  const totalPowerUsed = factories.reduce((acc, f) => acc + f.totalUsage, 0);
  const totalPowerWasted = factories.reduce((acc, f) => acc + f.totalWaste, 0);
  const wastagesPercentage = totalPowerUsed > 0 ? (totalPowerWasted / totalPowerUsed) * 100 : 0;

  // লাইভ গ্রাফের জন্য ডাটা হিস্ট্রি স্টেট (১০টি রিডিং পয়েন্ট)
  const [dataHistory, setDataHistory] = useState<{ usage: number; waste: number; time: string }[]>(() => {
    const arr = [];
    const baseUsage = totalPowerUsed ? totalPowerUsed : 100000;
    const baseWaste = totalPowerWasted ? totalPowerWasted : 15000;
    for (let i = 9; i >= 0; i--) {
      const date = new Date(Date.now() - i * 2000);
      const timeStr = date.toLocaleTimeString('bn-BD', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      // একটু আগে-পিছে ভেরিয়েশন করা হচ্ছে
      const factorUsage = 0.96 + Math.random() * 0.08;
      const factorWaste = 0.95 + Math.random() * 0.1;
      arr.push({
        usage: Math.round(baseUsage * factorUsage),
        waste: Math.round(baseWaste * factorWaste),
        time: timeStr
      });
    }
    return arr;
  });

  // লাইভ টেলিমোশন ইন্টারভাল
  useEffect(() => {
    const interval = setInterval(() => {
      setDataHistory(prev => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('bn-BD', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

        // ক্ষুদ্র পরিবর্তন যাতে রিয়েলটাইমে কম্পন বোঝা যায়
        const variationUsage = (Math.random() * 0.04 - 0.02); // -2% to +2%
        const variationWaste = (Math.random() * 0.04 - 0.02);

        const nextUsage = Math.max(0, Math.round(totalPowerUsed * (1 + variationUsage)));
        const nextWaste = Math.max(0, Math.round(totalPowerWasted * (1 + variationWaste)));

        const nextPoint = {
          usage: nextUsage,
          waste: nextWaste,
          time: timeStr
        };

        return [...prev.slice(1), nextPoint];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [totalPowerUsed, totalPowerWasted]);

  // SVG পাথ ক্যালকুলেটর ফাংশনসমূহ
  const computeLinePath = (history: typeof dataHistory, key: 'usage' | 'waste') => {
    if (history.length === 0) return '';
    const maxY = 130;
    const maxVal = Math.max(...history.map(d => d.usage), 1) * 1.15;
    const points = history.map((pt, idx) => {
      const x = idx * (500 / 9);
      const val = key === 'usage' ? pt.usage : pt.waste;
      const y = maxY - (val / maxVal) * 105 - 10;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  const computeAreaPath = (history: typeof dataHistory, key: 'usage' | 'waste') => {
    if (history.length === 0) return '';
    const linePath = computeLinePath(history, key);
    const maxY = 125; // base floor within SVG
    return `${linePath} L 500,${maxY} L 0,${maxY} Z`;
  };

  // শুধু চা কারখানা সমূহের বিদ্যুৎ ও অপচয় হিসাব (বিশ্লেষণ)
  const teaFactories = factories.filter(f => f.type === 'tea');
  const teaCount = teaFactories.length;
  const teaTotalUsed = teaFactories.reduce((acc, f) => acc + f.totalUsage, 0);
  const teaTotalWasted = teaFactories.reduce((acc, f) => acc + f.totalWaste, 0);
  const teaWastagePercentage = teaTotalUsed > 0 ? (teaTotalWasted / teaTotalUsed) * 100 : 0;

  // সকল নিবন্ধিত কারখানার তালিকা থেকে সকল মেশিন একত্রিত করা
  const allMachines: { machine: Machine; factoryName: string }[] = [];
  factories.forEach(f => {
    f.machines.forEach(m => {
      allMachines.push({ machine: m, factoryName: f.name });
    });
  });

  // ১. বিদ্যুৎ অপচয়কারী অ্যাপ্লায়েন্স সমূহের র্যাংক (উচ্চ অপচয় অনুযায়ী সর্ট করা)
  const topWastingMachines = [...allMachines]
    .sort((a, b) => b.machine.wastedPower - a.machine.wastedPower)
    .slice(0, 4);

  // ২. সর্বোচ্চ বিদ্যুৎ উৎপাদনকারী বা ব্যবহারকারী ডিভাইস সমূহের র্যাংক (ব্যবহার অনুযায়ী সর্ট)
  const topConsumingMachines = [...allMachines]
    .sort((a, b) => b.machine.currentUsage - a.machine.currentUsage)
    .slice(0, 4);

  // বিভাগ-ভিত্তিক বিশ্লেষণের জন্য নির্বাচিত ফ্যাক্টরি অবজেক্ট
  const selectedFactory = factories.find(f => f.id === selectedFactIdForDept);

  // নির্বাচিত ফ্যাক্টরি অনুযায়ী সর্বোচ্চ ব্যবহারকারী বিভাগ বের করা
  let highestDeptName = '';
  let highestDeptValue = 0;
  if (selectedFactory) {
    Object.entries(selectedFactory.departmentUsage).forEach(([dept, val]) => {
      if (val > highestDeptValue) {
        highestDeptValue = val;
        highestDeptName = dept;
      }
    });
  }

  return (
    <div className="space-y-6" id="dashboard-view">
      {/* ১. প্রধান স্ট্যাটাস মনিটর হেডার */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl relative overflow-hidden" id="main-monitor-card">
        {/* ব্যাকগ্রাউন্ড রেটিকল এফেক্ট */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4 mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Activity className="text-cyan-400 w-5 h-5" />
              বিদ্যুৎ অপচয় ও ব্যবহার স্ক্রিন মনিটর
            </h2>
            <p className="text-xs text-slate-400">সকল নিবন্ধিত কারখানার একত্রিত রিয়েল-টাইমস ভোল্টেজ ও এনার্জি ডেটা</p>
          </div>
          <span className="text-[10px] bg-cyan-950 text-cyan-400 px-2.5 py-1 rounded-md border border-cyan-500/30 font-mono">
            লাইভ টেলিমোশন ডাটা সংযোগ: ৮১%
          </span>
        </div>

        {/* ২টি প্রধান গ্রিড বক্স */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="energy-totals-bento">
          {/* মোট ব্যবহৃত বিদ্যুৎ */}
          <div className="bg-slate-950 border border-slate-850 p-4.5 rounded-xl flex items-center gap-4 relative overflow-hidden">
            <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold">মোট সমষ্টিক বিদ্যুৎ ব্যবহার</p>
              <h3 className="text-2xl font-bold text-white font-sans mt-0.5" id="total-used-val">
                {totalPowerUsed.toLocaleString('bn-BD')} <span className="text-xs font-normal text-slate-400">kWh</span>
              </h3>
              <p className="text-[10px] text-emerald-500 flex items-center gap-1 mt-1 font-mono">
                ↑ ২.৪% আগের মাস থেকে
              </p>
            </div>
          </div>

          {/* মোট অপচয়কৃত বিদ্যুৎ */}
          <div className="bg-slate-950 border border-slate-850 p-4.5 rounded-xl flex items-center gap-4 relative overflow-hidden">
            <div className="p-3 bg-rose-500/10 rounded-lg text-rose-400">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold">মোট অপচয়কৃত বিদ্যুৎ</p>
              <h3 className="text-2xl font-bold text-rose-500 font-sans mt-0.5" id="total-wasted-val">
                {totalPowerWasted.toLocaleString('bn-BD')} <span className="text-xs font-normal text-slate-400">kWh</span>
              </h3>
              <p className="text-[10px] text-rose-500 font-mono mt-1">
                যা সামগ্রিক পাওয়ারের {wastagesPercentage.toFixed(1)}% অপচয়!
              </p>
            </div>
          </div>
        </div>

        {/* নতুন সাইড-বাই-সাইড কলাম: ১টি লোডিং বার এবং ১টি লাইভ গ্রাফ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5" id="live-monitoring-duo">
          {/* পাওয়ার এফিসিয়েন্সি সূচক (লোডিং বার) */}
          <div className="bg-slate-950 border border-slate-850 p-5 rounded-xl flex flex-col justify-between relative overflow-hidden" id="power-efficiency-card">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Activity className="w-4.5 h-4.5 text-emerald-400" />
                  পাওয়ার এফিসিয়েন্সি সূচক (লোড প্রগ্রেস বার)
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                  {(100 - wastagesPercentage).toFixed(1)}%
                </span>
              </div>
              
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                গ্রিডে সরবরাহকৃত বিদ্যুৎ শক্তির কত শতাংশ অপচয় না হয়ে সফলভাবে ব্যবহৃত হচ্ছে তার রিয়েল-টাইম নির্দেশক। অপচয় কমাতে অ্যাক্টিভ বৈদ্যুতিক ত্রুটিসমূহ সমাধান করুন।
              </p>

              {/* ভিজ্যুয়াল লোডিং বার */}
              <div className="w-full bg-slate-900 h-4 rounded-full overflow-hidden flex border border-slate-800" id="efficiency-progress-bar">
                <div
                  className="bg-emerald-500 h-full transition-all duration-500 flex items-center justify-center text-[9px] text-slate-950 font-bold"
                  style={{ width: `${100 - wastagesPercentage}%` }}
                >
                  {(100 - wastagesPercentage) >= 15 ? `${(100 - wastagesPercentage).toFixed(0)}%` : ''}
                </div>
                <div
                  className="bg-rose-500 h-full transition-all duration-500 flex items-center justify-center text-[9px] text-white font-bold"
                  style={{ width: `${wastagesPercentage}%` }}
                >
                  {wastagesPercentage >= 15 ? `${wastagesPercentage.toFixed(0)}%` : ''}
                </div>
              </div>

              <div className="flex justify-between text-[11px] text-slate-500 mt-3 font-mono">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> কার্যকরী বিদ্যুৎ: {Math.max(0, totalPowerUsed - totalPowerWasted).toLocaleString('bn-BD')} kWh</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> অপচয়: {totalPowerWasted.toLocaleString('bn-BD')} kWh</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-900 flex justify-between items-center text-[11px]">
              <span className="text-slate-400">গ্রিড স্ট্যাটাস সূচক:</span>
              <span className={`font-semibold font-mono ${wastagesPercentage > 15 ? 'text-amber-405' : 'text-emerald-400'}`}>
                {wastagesPercentage > 15 ? 'সতর্কতা (অপচয় বেশি)' : 'অনুকূল (স্থিতিশীল)'}
              </span>
            </div>
          </div>

          {/* লাইভ বিদ্যুৎ ব্যবহার ও অপচয় গ্রাফ */}
          <div className="bg-slate-950 border border-slate-850 p-5 rounded-xl flex flex-col justify-between relative overflow-hidden" id="live-electricity-usage-wastage-card">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <TrendingUp className="w-4.5 h-4.5 text-cyan-400" />
                  রিয়েল-টাইম বিদ্যুৎ ব্যবহার ও অপচয় গ্রাফ
                </span>
                <span className="text-[10px] bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 px-2 py-0.5 rounded font-mono animate-pulse">
                  লাইভ গ্রিড সিঙ্ক
                </span>
              </div>

              {/* গ্রাফ লেজেন্ড ও রিয়েল টাইপ কি */}
              <div className="flex flex-wrap gap-4 mb-2.5 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  <span className="text-slate-400">লাইভ গতিশীল লোড:</span>
                  <span className="font-mono text-emerald-400 font-bold animate-pulse">
                    {(dataHistory[dataHistory.length - 1]?.usage || 0).toLocaleString('bn-BD')} kW
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                  <span className="text-slate-400">লাইভ ক্ষতিকর অপচয়:</span>
                  <span className="font-mono text-rose-400 font-bold animate-pulse">
                    {(dataHistory[dataHistory.length - 1]?.waste || 0).toLocaleString('bn-BD')} kW
                  </span>
                </div>
              </div>

              {/* লাইভ SVG চার্ট */}
              <div className="relative w-full h-[125px] bg-slate-950 rounded-lg p-1 border border-slate-900/60 flex items-center justify-center">
                <svg viewBox="0 0 500 130" className="w-full h-full overflow-visible" id="live-telemetry-svg">
                  <defs>
                    <linearGradient id="usage-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.2"/>
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                    </linearGradient>
                    <linearGradient id="waste-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.2"/>
                      <stop offset="100%" stopColor="#f43f5e" stopOpacity="0"/>
                    </linearGradient>
                  </defs>

                  {/* গ্রিড লাইনসমূহ */}
                  <line x1="0" y1="20" x2="500" y2="20" stroke="#1e293b" strokeDasharray="3,3" strokeWidth="0.5" />
                  <line x1="0" y1="55" x2="500" y2="55" stroke="#1e293b" strokeDasharray="3,3" strokeWidth="0.5" />
                  <line x1="0" y1="90" x2="500" y2="90" stroke="#1e293b" strokeDasharray="3,3" strokeWidth="0.5" />
                  <line x1="0" y1="120" x2="500" y2="120" stroke="#334155" strokeWidth="0.5" />

                  {/* হরিজোন্টাল লেবেল */}
                  <text x="5" y="15" className="text-[8px] fill-slate-500 font-mono font-bold">110%</text>
                  <text x="5" y="50" className="text-[8px] fill-slate-500 font-mono font-bold">50%</text>
                  <text x="5" y="85" className="text-[8px] fill-slate-500 font-mono font-bold">10%</text>

                  {/* usage এর এরিয়া ফিল */}
                  <path
                    d={computeAreaPath(dataHistory, 'usage')}
                    fill="url(#usage-grad)"
                    className="transition-all duration-300"
                  />
                  {/* usage এর রেখা */}
                  <path
                    d={computeLinePath(dataHistory, 'usage')}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-300"
                  />

                  {/* waste এর এরিয়া ফিল */}
                  <path
                    d={computeAreaPath(dataHistory, 'waste')}
                    fill="url(#waste-grad)"
                    className="transition-all duration-300"
                  />
                  {/* waste এর রেখা */}
                  <path
                    d={computeLinePath(dataHistory, 'waste')}
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-300"
                  />

                  {/* সর্বশেষ পয়েন্টে ব্লিঙ্কিং মার্কার এবং ডট */}
                  {dataHistory.map((pt, idx) => {
                    if (idx === dataHistory.length - 1) {
                      const maxY = 130;
                      const maxVal = Math.max(...dataHistory.map(d => d.usage), 1) * 1.15;
                      const x = idx * (500 / 9);
                      const usageY = maxY - (pt.usage / maxVal) * 105 - 10;
                      const wasteY = maxY - (pt.waste / maxVal) * 105 - 10;

                      return (
                        <g key={idx}>
                          {/* Usage Indicator */}
                          <circle cx={x} cy={usageY} r="6" fill="#10b981" className="animate-ping" style={{ transformOrigin: `${x}px ${usageY}px` }} />
                          <circle cx={x} cy={usageY} r="3.5" fill="#10b981" stroke="#0f172a" strokeWidth="1" />
                          
                          {/* Waste Indicator */}
                          <circle cx={x} cy={wasteY} r="6" fill="#f43f5e" className="animate-ping" style={{ transformOrigin: `${x}px ${wasteY}px` }} />
                          <circle cx={x} cy={wasteY} r="3.5" fill="#f43f5e" stroke="#0f172a" strokeWidth="1" />
                        </g>
                      );
                    }
                    return null;
                  })}
                </svg>
              </div>
            </div>

            {/* গ্রাফ টাইম রিডআউট */}
            <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-2.5">
              <span>{dataHistory[0]?.time}</span>
              <span className="animate-pulse flex items-center gap-1 text-cyan-500/80">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block animate-pulse" />
                লাইভ ট্র্যাকিং সক্রিয় (২ সেকেন্ড অন্তর হালনাগাদ)
              </span>
              <span>{dataHistory[dataHistory.length - 1]?.time}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ২. নিবন্ধিত চা কারখানা সমূহের জন্য ডেডিকেটেড বিদ্যুৎ পর্যবেক্ষণ ব্লক (Requirement 8) */}
      <div className="bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-990 p-5 rounded-2xl relative overflow-hidden" id="tea-factories-special-monitor-card">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center gap-2 mb-3">
          <Coffee className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-emerald-200">নিবন্ধিত চা কারখানা বিদ্যুৎ পর্যবেক্ষণ কেন্দ্র (Tea Sector)</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl mb-4">
          বাংলাদেশে নিবন্ধিত ঐতিহ্যবাহী চা কারখানাসমূহের জন্য কাস্টম এনার্জি প্রোফাইল। চা পাতা ড্রাইং এবং হিটিং বিভাগে সর্বোচ্চ পরিমাণ তাপীয় অপচয় হয়ে থাকে।
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4" id="tea-special-stats">
          <div className="bg-slate-950/80 border border-emerald-900/40 p-3.5 rounded-xl">
            <p className="text-[11px] text-slate-400">মোট চা কারখানা</p>
            <h4 className="text-xl font-bold text-emerald-400 font-sans mt-0.5">{teaCount} টি</h4>
          </div>

          <div className="bg-slate-950/80 border border-emerald-900/40 p-3.5 rounded-xl">
            <p className="text-[11px] text-slate-400">মোট চা বিদ্যুৎ ব্যবহার</p>
            <h4 className="text-xl font-bold text-slate-200 font-sans mt-0.5">{teaTotalUsed.toLocaleString('bn-BD')} kWh</h4>
          </div>

          <div className="bg-slate-950/80 border border-emerald-900/40 p-3.5 rounded-xl">
            <p className="text-[11px] text-slate-400">মোট চা বিদ্যুৎ অপচয়</p>
            <h4 className="text-xl font-bold text-rose-400 font-sans mt-0.5">{teaTotalWasted.toLocaleString('bn-BD')} kWh</h4>
          </div>

          <div className="bg-slate-950/80 border border-emerald-900/40 p-3.5 rounded-xl">
            <p className="text-[11px] text-slate-400">অপচয়ের হার</p>
            <h4 className="text-xl font-bold text-amber-400 font-sans mt-0.5">{teaWastagePercentage.toFixed(1)}%</h4>
          </div>
        </div>
      </div>

      {/* ৩. সর্বোচ্চ ডিভাইস ব্যবহার ও অপচয় বিশ্লেষণ গ্রিড (Requirements 2, 7 & 11) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="device-usage-analysis-grid">
        {/* সর্বোচ্চ বিদ্যুৎ ব্যবহারকারী ডিভাইসসমূহ */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between" id="top-consuming-devices-card">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-1">
              <TrendingUp className="text-cyan-400 w-4 h-4" />
              ১. সর্বোচ্চ বিদ্যুৎ ব্যবহারকারী ৪টি ডিভাইস (Consumer Devices)
            </h3>
            <p className="text-xs text-slate-400 mb-4">কারখানাসমূহ জুড়ে বর্তমানে সবচেয়ে বেশি বিদ্যুৎ টানছে এমন যন্ত্রপাতি</p>
          </div>
          <div className="space-y-3.5" id="consuming-devices-list">
            {topConsumingMachines.map(({ machine, factoryName }, index) => {
              const maxVal = topConsumingMachines[0]?.machine.currentUsage || 1;
              const widthPct = (machine.currentUsage / maxVal) * 100;
              return (
                <div key={machine.id} className="bg-slate-950/50 border border-slate-850 p-3 rounded-xl hover:border-slate-800 transition-colors">
                  <div className="flex justify-between items-start mb-1.5">
                    <div>
                      <span className="text-xs font-bold text-slate-200">{machine.name}</span>
                      <p className="text-[10px] text-slate-400">{factoryName} • <span className="text-cyan-400 font-semibold">{machine.department}</span></p>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 font-bold">{machine.currentUsage} <span className="text-[10px] text-slate-400">kW</span></span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${widthPct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* সর্বোচ্চ বিদ্যুৎ অপচয়কারী ডিভাইসসমূহ */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between" id="top-wasting-devices-card">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-1">
              <AlertTriangle className="text-rose-500 w-4 h-4" />
              ২. সবচেয়ে বেশি অপচয়কারী ৪টি ডেবাইস/অ্যাপ্লায়েন্স (High Waste Elements)
            </h3>
            <p className="text-xs text-slate-400 mb-4">ক্ষয়প্রাপ্ত ইন্সুলেশন বা যান্ত্রিক ক্রুটির কারণে বিদ্যুৎ সিস্টেম থেকে অপচয় বয়ে যাচ্ছে</p>
          </div>
          <div className="space-y-3.5" id="wasting-devices-list">
            {topWastingMachines.map(({ machine, factoryName }) => {
              const maxVal = topWastingMachines[0]?.machine.wastedPower || 1;
              const widthPct = (machine.wastedPower / maxVal) * 100;
              return (
                <div key={machine.id} className="bg-slate-950/50 border border-slate-850 p-3 rounded-xl hover:border-slate-850 transition-colors">
                  <div className="flex justify-between items-start mb-1.5">
                    <div>
                      <span className="text-xs font-bold text-slate-200">{machine.name}</span>
                      <p className="text-[10px] text-slate-400">
                        {factoryName} • <span className="text-amber-500 font-semibold">{machine.department}</span>
                      </p>
                    </div>
                    <span className="text-xs font-mono text-rose-400 font-bold">{machine.wastedPower} <span className="text-[10px] text-slate-400">kW</span></span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full transition-all" style={{ width: `${widthPct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ৩. কারখানা ভিত্তিক বিভাগ এবং সর্বোচ্চ ব্যবহৃত বিভাগ খুঁজে পাওয়ার ইন্টারেক্টিভ মডিউল (Requirement 9) */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl" id="department-utility-analyzer-box">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-3.5 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Layers className="text-cyan-400 w-4.5 h-4.5" />
              কারখানা অনুযায়ী কোন বিভাগে সর্বোচ্চ বিদ্যুৎ ব্যবহারের তদারকি
            </h3>
            <p className="text-xs text-slate-400">প্রতিটি মেশিনের ফিল্ড অনুযায়ী কারখানার সবথেকে বেশি বিদ্যুৎ খরচ করা বিভাগ চিহ্নিত করুন</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">কারখানা পরিবর্তন করুন:</span>
            <select
              value={selectedFactIdForDept}
              onChange={(e) => setSelectedFactIdForDept(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-200 px-2.5 py-1.5 rounded-lg outline-none focus:border-cyan-500 cursor-pointer"
              id="department-selector-dropdown"
            >
              {factories.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
        </div>

        {selectedFactory ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="department-analysis-inner">
            {/* বাম পাশ - বিভাগের বিদ্যুৎ ব্যবহার প্রগতি বারসমূহ */}
            <div className="space-y-3">
              <span className="text-xs text-slate-400 font-bold my-1 block">বিভাগীয় বিদ্যুৎ বন্টন (কিলোওয়াট-ঘণ্টা/kWh):</span>
              {Object.entries(selectedFactory.departmentUsage).map(([dept, val]) => {
                const totalDeptValSum = Object.values(selectedFactory.departmentUsage).reduce((a, b) => a + b, 0);
                const percent = totalDeptValSum > 0 ? (val / totalDeptValSum) * 100 : 0;
                const isHighest = dept === highestDeptName;
                return (
                  <div key={dept} className={`p-3 rounded-lg border ${isHighest ? 'bg-cyan-950/20 border-cyan-500/35' : 'bg-slate-950/40 border-slate-850'}`}>
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className={`font-semibold ${isHighest ? 'text-cyan-300' : 'text-slate-300'}`}>
                        {dept} {isHighest && '★'}
                      </span>
                      <span className="font-mono text-slate-200 font-bold">{val.toLocaleString('bn-BD')} kWh</span>
                    </div>
                    {/* গ্রাফিকাল প্রগ্রেস বার */}
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${isHighest ? 'bg-cyan-400' : 'bg-slate-700'}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ডান পাশ - সর্বোচ্চ ব্যবহারকারী বিভাগ ভিজ্যুয়াল নোটিফিকেশন কার্ড */}
            <div className="bg-slate-950 border border-slate-800 p-4.5 rounded-xl flex flex-col justify-between" id="highest-dept-highlight-card">
              <div>
                <span className="text-[10px] bg-cyan-950 border border-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded font-mono font-bold tracking-wider uppercase">
                  HIGHEST CONSUMPTION DEPT. FOUND
                </span>
                <h4 className="text-lg font-bold text-slate-200 mt-3 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-500" />
                  {highestDeptName}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mt-2">
                  <strong className="text-cyan-400 font-normal">{selectedFactory.name}</strong> এর সবকটি ডিপার্টমেটের এভারেজ ট্র্যাকিং এর ফলাফল অনুযায়ী উপরে উল্লিখিত ডিপার্টমেন্টটি দেশের গ্রিড থেকে সর্বোচ্চ বিদ্যুৎ টেনেছে। এই বিভাগে অপ্রয়োজনীয় বিদ্যুৎ সংযোগ বন্ধে অটো ট্রিপ ক্যাবিনেট যুক্ত করা যেতে পারে।
                </p>
                <div className="mt-4 p-3 bg-cyan-950/20 rounded-lg border border-cyan-800/20 text-xs text-cyan-300 font-medium">
                  ব্যয় বিদ্যুৎ অনুপাত: {(selectedFactory.totalUsage > 0 ? (highestDeptValue / selectedFactory.totalUsage) * 100 : 0).toFixed(1)}% কারখানার মোট বিদ্যুৎ বাজেটের
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-semibold pt-4">
                <Award className="w-4 h-4" />
                রিয়েল-টাইম এনার্জি লগিং সক্রিয় আছে
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500">কোন কারখানা চিহ্নিত করা নেই।</p>
        )}
      </div>
    </div>
  );
}
