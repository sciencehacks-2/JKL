/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Factory, Fault } from '../types';
import { ShieldAlert, CheckCircle2, Flame, Wrench, RefreshCw, AlertTriangle, BatteryWarning } from 'lucide-react';

interface FaultsAlertsViewProps {
  factories: Factory[];
  onResolveFault: (factoryId: string, faultId: string) => void;
}

export default function FaultsAlertsView({ factories, onResolveFault }: FaultsAlertsViewProps) {
  // এগ্রিগেট অল ফসটস ফিল্ডগুলোতে কারখানা আইডিসহ বাইন্ড করা
  const activeFaultsList: { fault: Fault; factoryName: string; factoryId: string }[] = [];
  const resolvedFaultsList: { fault: Fault; factoryName: string; factoryId: string }[] = [];

  factories.forEach(f => {
    f.activeFaults.forEach(fl => {
      if (!fl.resolved) {
        activeFaultsList.push({ fault: fl, factoryName: f.name, factoryId: f.id });
      } else {
        resolvedFaultsList.push({ fault: fl, factoryName: f.name, factoryId: f.id });
      }
    });
  });

  const [filterType, setFilterType] = useState<'all' | 'leakage' | 'fault'>('all');
  const [loadingMap, setLoadingMap] = useState<{ [key: string]: boolean }>({});

  const handleResolveClick = (factoryId: string, faultId: string) => {
    setLoadingMap(prev => ({ ...prev, [faultId]: true }));
    setTimeout(() => {
      onResolveFault(factoryId, faultId);
      setLoadingMap(prev => ({ ...prev, [faultId]: false }));
    }, 1200);
  };

  const filteredActiveList = activeFaultsList.filter(item => {
    if (filterType === 'all') return true;
    return item.fault.type === filterType;
  });

  return (
    <div className="space-y-6" id="faults-alerts-root">
      
      {/* স্ট্যাটাস নোটিফিকেশন ব্যানার */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="faults-stats-dashboard">
        
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4.5 relative overflow-hidden">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-lg">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-semibold block">সক্রিয় বৈদ্যুতিক লিকেজ</span>
            <h4 className="text-xl font-bold text-rose-500 font-sans mt-0.5">{activeFaultsList.filter(f => f.fault.type === 'leakage').length} টি নোড</h4>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4.5 relative overflow-hidden">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-semibold block">সিস্টেম বৈদ্যুতিক ত্রুটি (Faulty)</span>
            <h4 className="text-xl font-bold text-amber-400 font-sans mt-0.5">{activeFaultsList.filter(f => f.fault.type === 'fault').length} টি পয়েন্ট</h4>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4.5 relative overflow-hidden">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-semibold block">সমাধানকৃত পয়েন্ট</span>
            <h4 className="text-xl font-bold text-emerald-400 font-sans mt-0.5">{resolvedFaultsList.length} টি সফল সমাধান</h4>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* প্রধান অ্যাক্টিভ ত্রুটি উইন্ডো */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-2xl" id="faults-active-panel">
          
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-800 pb-4 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Flame className="text-rose-500 w-4.5 h-4.5" />
                লাইভ বৈদুতিক কারেন্ট লিকেজ ও ফল্ট ডায়েরি ({filteredActiveList.length})
              </h3>
              <p className="text-xs text-slate-400 mt-1">কারেন্ট ভোল্টেজ ট্র্যাকার সেন্সর থেকে স্বয়ংক্রিয়ভাবে আগত গুরুতর সমস্যা সমূহ</p>
            </div>

            {/* ফিল্টার ট্যাব */}
            <div className="flex bg-slate-950 p-1 border border-slate-850 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-md cursor-pointer transition-all ${filterType === 'all' ? 'bg-slate-850 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                সব
              </button>
              <button
                type="button"
                onClick={() => setFilterType('leakage')}
                className={`px-3 py-1.5 rounded-md cursor-pointer transition-all ${filterType === 'leakage' ? 'bg-slate-850 text-rose-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                লিকেজ
              </button>
              <button
                type="button"
                onClick={() => setFilterType('fault')}
                className={`px-3 py-1.5 rounded-md cursor-pointer transition-all ${filterType === 'fault' ? 'bg-slate-850 text-amber-500 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                লাইন ত্রুটি (Fault)
              </button>
            </div>
          </div>

          <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1" id="fault-active-list">
            {filteredActiveList.length === 0 ? (
              <div className="p-10 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
                অভিনন্দন! এই মুহূর্তে নেটওয়ার্কে কোনো অনিষ্পন্ন লিকেজ বা গুরুতর ফল্ট উপস্থিত নেই।
              </div>
            ) : (
              filteredActiveList.map(({ fault, factoryName, factoryId }) => (
                <div
                  key={fault.id}
                  className="bg-slate-950 border border-slate-850 p-4.5 rounded-xl space-y-3 hover:border-slate-800 transition-all font-normal"
                  id={`fault-card-${fault.id}`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-rose-400">{fault.componentName}</span>
                        <span className={`text-[9px] font-sans font-bold uppercase px-2 py-0.5 rounded ${
                          fault.severity === 'high' ? 'bg-rose-950 text-rose-400 border border-rose-500/20' : 'bg-slate-900 text-amber-500'
                        }`}>
                          {fault.severity === 'high' ? 'মারাত্মক (High)' : 'মাঝারি (Medium)'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{factoryName} • জিপিএস মনিটর কোড: FLT-{fault.id.toUpperCase()}</p>
                    </div>

                    <button
                      type="button"
                      disabled={loadingMap[fault.id]}
                      onClick={() => handleResolveClick(factoryId, fault.id)}
                      className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs py-1.5 px-3.5 rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all font-sans"
                      id={`resolve-btn-${fault.id}`}
                    >
                      {loadingMap[fault.id] ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          মেরামত হচ্ছে...
                        </>
                      ) : (
                        <>
                          <Wrench className="w-3.5 h-3.5" />
                          মেরামত সম্পন্ন করুন
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-lg border border-slate-850">
                    <strong className="text-rose-400">ত্রুটির বিবরণী:</strong> {fault.description}
                  </p>

                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <BatteryWarning className="w-3.5 h-3.5 text-rose-500" />
                      সমস্যা ধরণ: {fault.type === 'leakage' ? 'কারেন্ট লিকেজ' : 'ভোল্টেজ বিচ্ছিন্নতা/ফল্ট'}
                    </span>
                    <span>রিপোর্ট সময়: {fault.reportedAt}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ডান পাশ - লিকেজ সমাধান এবং এনার্জি সংরক্ষণের তথ্য কার্ড */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between" id="faults-info-panel">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
              <CheckCircle2 className="text-cyan-400 w-4.5 h-4.5" />
              সমাধান ডায়েরি ও লিকেজ হিস্ট্রি
            </h3>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1" id="resolved-faults-scroller">
              {resolvedFaultsList.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  এখনো কোনো বৈদ্যুতিক পয়েন্ট মেরামত বা সংস্কার করা হয়নি।
                </div>
              ) : (
                resolvedFaultsList.map(({ fault, factoryName }) => (
                  <div key={fault.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-850/80 space-y-1.5 opacity-80 decoration-slice">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs font-bold text-slate-300 line-through">{fault.componentName}</span>
                      <span className="text-[9px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded uppercase">
                        মেরামতকৃত
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500">{factoryName}</p>
                    <p className="text-[11px] text-slate-400 leading-snug">{fault.description}</p>
                    <div className="text-[9px] text-slate-500 font-mono mt-1 text-right">
                      সমাধান সম্পন্ন
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-rose-950/20 text-xs text-slate-400 leading-normal mt-4">
            <span className="text-rose-400 font-bold block mb-1">সতর্ক বার্তা ও লিকেজের প্রভাব:</span>
            বৈদ্যুতিক লিকেজ কারখানার শ্রমিকদের জীবনের জন্য মারাত্মক <strong className="text-rose-500">ঝুঁকিগ্রস্ত হওয়ার পাশাপাশি</strong> প্রতিদিন গড়ে ২৫% অতিরিক্ত বিদ্যুৎ অপচয় করে থাকে। তাৎক্ষণিক সেন্সর ট্র্যাকিংয়ের মাধ্যমে ফল্ট নিষ্ক্রিয় করুন।
          </div>
        </div>

      </div>
    </div>
  );
}
