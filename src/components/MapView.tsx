/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Factory } from '../types';
import { MapPin, Info, Coffee, Zap, ShieldAlert, Navigation } from 'lucide-react';

interface MapViewProps {
  factories: Factory[];
}

export default function MapView({ factories }: MapViewProps) {
  const [selectedFactoryId, setSelectedFactoryId] = useState<string | null>(factories[0]?.id || null);

  const selectedFactory = factories.find(f => f.id === selectedFactoryId);

  return (
    <div className="space-y-6" id="map-view-root">
      
      {/* ম্যাপ কন্টেইনার এবং সাইডবার ইন্টিগ্রেশন */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ভৌগোলিক ইন্টারেক্টিভ রিলেটিভ ভিজ্যুয়াল ম্যাপ */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between" id="map-canvas-container">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-1">
              <Navigation className="text-cyan-400 w-4.5 h-4.5" />
              বাংলাদেশ শিল্পাঞ্চল ম্যাপ গ্রিড (Geographical Map Tracker)
            </h3>
            <p className="text-xs text-slate-400 mb-5">নিবন্ধিত কারখানার ভৌগোলিক অবস্থান ও ইনস্ট্যান্ট এনার্জি ফিডব্যাক পেতে পিনে ক্লিক করুন</p>
          </div>

          {/* ম্যাপ স্টেজ */}
          <div className="relative w-full aspect-[4/3] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden select-none" id="bangladesh-grid-map">
            {/* কাল্পনিক ভৌগলিক গ্রিডলাইন ব্যাকগ্রাউন্ড */}
            <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-5 pointer-events-none">
              {Array.from({ length: 144 }).map((_, i) => (
                <div key={i} className="border border-slate-400" />
              ))}
            </div>

            {/* নদী ও ভৌগোলিক ছায়া নির্দেশক */}
            <div className="absolute inset-x-0 top-1/2 h-1 bg-gradient-to-r from-blue-950 via-cyan-900/40 to-indigo-950 rounded-full blur-[1px] pointer-events-none" title="পদ্মা ও মেঘনা সংগমস্থল" />
            <div className="absolute left-1/2 inset-y-0 w-1 bg-gradient-to-b from-blue-950 via-cyan-900/25 to-transparent rounded-full blur-[1px] pointer-events-none" />

            {/* ভৌগলিক অঞ্চল লেবেল */}
            <p className="absolute top-4 left-6 text-[10px] text-slate-600 font-mono">NORTH-WEST REGION (রংপুর / রাজশাহী)</p>
            <p className="absolute top-4 right-6 text-[10px] text-slate-600 font-mono">EASTERN HILLS (সিলেট / শ্রীমঙ্গল)</p>
            <p className="absolute bottom-4 left-6 text-[10px] text-slate-600 font-mono">SOUTH-WEST BAY (খুলনা / বরিশাল)</p>
            <p className="absolute bottom-4 right-6 text-[10px] text-slate-600 font-mono">SOUTH-EAST BAY (চট্টগ্রাম / কক্সবাজার)</p>
            <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-mono font-bold bg-slate-950/80 px-2 py-0.5 rounded border border-slate-900">ঢাকাকেন্দ্রিক সদর দপ্তর</p>

            {/* কারখানার লোকেশন পিনগুলো */}
            {factories.map(f => {
              const isSelected = f.id === selectedFactoryId;
              const hasCriticalFault = f.activeFaults.some(fail => fail.severity === 'high');
              return (
                <button
                  key={f.id}
                  onClick={() => setSelectedFactoryId(f.id)}
                  style={{
                    top: `${f.latitude}%`,
                    left: `${f.longitude}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer focus:outline-none transition-transform duration-200 hover:scale-110 z-10"
                  id={`map-pin-${f.id}`}
                >
                  {/* পিন আইকন ও রেডিয়েল গ্লো */}
                  <div className="relative">
                    {isSelected && (
                      <span className="absolute -inset-2 bg-cyan-400/20 rounded-full animate-ping pointer-events-none" />
                    )}
                    {hasCriticalFault && (
                      <span className="absolute -inset-3 bg-rose-500/35 rounded-full animate-ping pointer-events-none" />
                    )}

                    <div className={`p-1.5 rounded-full border shadow-lg ${
                      isSelected ? 'bg-cyan-500 text-slate-950 border-white' :
                      hasCriticalFault ? 'bg-rose-600 text-white border-rose-400 animate-bounce' :
                      f.type === 'tea' ? 'bg-emerald-600 text-white border-emerald-300' :
                      'bg-slate-800 text-slate-300 border-slate-600'
                    }`}>
                      {f.type === 'tea' ? (
                        <Coffee className="w-3.5 h-3.5" />
                      ) : (
                        <MapPin className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </div>

                  {/* লেবেল ট্যাগ */}
                  <span className={`mt-1 text-[9px] px-1.5 py-0.5 rounded border shadow font-semibold truncate max-w-[100px] ${
                    isSelected ? 'bg-cyan-400 text-slate-950 border-white font-bold' : 'bg-slate-900 text-slate-300 border-slate-850'
                  }`}>
                    {f.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-3.5 text-[11px] text-slate-500 flex justify-between font-mono bg-slate-950/40 p-2 rounded border border-slate-850/60">
            <span>স্থানাঙ্ক সীমা: ২৫.২৪° উত্তর অক্ষাংশ, ৯০.২৫° পূর্ব দ্রাঘিমাংশ</span>
            <span className="text-emerald-400">● অল গ্রিডস অপারেশনাল</span>
          </div>
        </div>

        {/* মানচিত্রে নির্বাচিত কারখানার রিয়েল-টাইম তথ্য বিবরণী */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between" id="map-info-panel">
          {selectedFactory ? (
            <div className="space-y-4" id="selected-factory-map-card">
              <div className="border-b border-slate-800 pb-3">
                <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                  selectedFactory.type === 'tea' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20' : 'bg-slate-950 text-cyan-400'
                }`}>
                  {selectedFactory.type === 'tea' ? 'চা বাগান উৎপাদন কেন্দ্র' : 'শিল্প কারখানা'}
                </span>
                <h4 className="text-base font-bold text-slate-100 mt-2">{selectedFactory.name}</h4>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  {selectedFactory.location}
                </p>
              </div>

              {/* বিদ্যুৎ ব্যবহার প্রোফাইল */}
              <div className="space-y-2.5">
                <h5 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">ENERGY USAGE METRIC</h5>
                
                <div className="p-3 bg-slate-950/70 border border-slate-850 rounded-xl">
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="text-slate-400">বিদ্যুৎ ব্যবহার:</span>
                    <span className="font-mono text-emerald-400 font-bold">{selectedFactory.totalUsage.toLocaleString('bn-BD')} kWh</span>
                  </div>
                  {/* শতাংশের ভিজ্যুয়ালাইজেশন */}
                  <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: '75%' }} />
                  </div>
                </div>

                <div className="p-3 bg-slate-950/70 border border-slate-850 rounded-xl">
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="text-slate-400">বিদ্যুৎ অপচয়:</span>
                    <span className="font-mono text-rose-400 font-bold">{selectedFactory.totalWaste.toLocaleString('bn-BD')} kWh</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full" style={{ width: `${(selectedFactory.totalWaste / selectedFactory.totalUsage) * 100}%` }} />
                  </div>
                </div>
              </div>

              {/* বৈদ্যুতিক যন্ত্রাংশ ও ত্রুটি বিবরণী */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">ACTIVE FAULTS</h5>
                {selectedFactory.activeFaults.length === 0 ? (
                  <div className="p-3 bg-slate-950/40 border border-slate-850/50 rounded-xl text-center text-xs text-slate-500">
                    কারখানাটিতে কোনো বৈদ্যুতিক ত্রুটি বা লিকেজ নেই।
                  </div>
                ) : (
                  selectedFactory.activeFaults.map(fail => (
                    <div key={fail.id} className="p-3 bg-rose-950/10 border border-rose-500/20 rounded-xl flex gap-x-2.5 items-start">
                      <ShieldAlert className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-rose-300">{fail.componentName}</p>
                        <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{fail.description}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* জিপিএস সংযোগ স্থানাঙ্ক */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 space-y-1">
                <p className="text-[10px] text-slate-500 font-semibold font-mono">GPS GRID COMPLIANCE</p>
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>পজিশন অক্ষাংশ:</span>
                  <span className="text-cyan-400">{selectedFactory.latitude}° N</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>পজিশন দ্রাঘিমাংশ:</span>
                  <span className="text-cyan-400">{selectedFactory.longitude}° E</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500 text-xs" id="map-factories-select-placeholder">
              ম্যাপে কারখানার পিনে ট্যাপ করে বিস্তারিত লোড করুন
            </div>
          )}

          <div className="mt-4 p-3 bg-slate-950/40 border border-slate-850 rounded-xl text-[11px] text-slate-400 leading-relaxed">
            <span className="text-amber-400 font-bold block mb-1">নির্দেশনা:</span>
            সবুজ পিনসমূহ <strong className="text-emerald-400">চা ফ্যাক্টরি</strong> নির্দেশ করে, গোল পিনগুলো সাধারণ কারখানা এবং লাল পিন বিদ্যুৎ ত্রুটিযুক্ত অঞ্চল নির্দেশ করে।
          </div>
        </div>

      </div>
    </div>
  );
}
