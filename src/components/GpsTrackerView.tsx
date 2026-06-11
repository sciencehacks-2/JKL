/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Factory, Machine } from '../types';
import { Compass, RefreshCw, Radio, CheckCircle, Search, Map, Battery } from 'lucide-react';

interface GpsTrackerViewProps {
  factories: Factory[];
}

export default function GpsTrackerView({ factories }: GpsTrackerViewProps) {
  // সকল যন্ত্রপাতি সমূহের ফ্ল্যাট লিস্ট তৈরি করা
  const initialMachineList: { machine: Machine; factoryName: string; factoryId: string }[] = [];
  factories.forEach(f => {
    f.machines.forEach(m => {
      initialMachineList.push({ machine: m, factoryName: f.name, factoryId: f.id });
    });
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(initialMachineList[0]?.machine.id || null);
  const [updatingGps, setUpdatingGps] = useState(false);
  const [successPing, setSuccessPing] = useState(false);

  // জিপিএস স্থানাঙ্ক ফেক-রিমোট রিফ্রেশ করার সিমুলেশন
  const handleGpsUpdate = () => {
    setUpdatingGps(true);
    setSuccessPing(false);
    setTimeout(() => {
      setUpdatingGps(false);
      setSuccessPing(true);
      setTimeout(() => setSuccessPing(false), 3000);
    }, 1500);
  };

  // সার্চিং
  const filteredMachines = initialMachineList.filter(item => {
    const query = searchQuery.toLowerCase();
    return item.machine.name.toLowerCase().includes(query) ||
           item.factoryName.toLowerCase().includes(query) ||
           item.machine.department.toLowerCase().includes(query);
  });

  // বর্তমানে নির্বাচিত মেশিন অবজেক্ট
  const selectedItem = initialMachineList.find(item => item.machine.id === selectedMachineId);

  return (
    <div className="space-y-6" id="gps-tracker-root">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* বাম পাশ - মেশিনের তালিকা */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between" id="gps-machines-list-panel">
          <div>
            <div className="border-b border-slate-800 pb-4 mb-4">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Compass className="text-cyan-400 w-4.5 h-4.5" />
                মেশিন জিপিএস লোকোমোটিভ ট্র্যাকিং সেন্টার
              </h3>
              <p className="text-xs text-slate-400 mt-1">মেশিনে বিল্ট-ইন জিপিএস এবং ৩জি মডেম চিপসেটের মাধ্যমে তাৎক্ষণিক পজিশন বিশ্লেষণ</p>
            </div>

            {/* সার্চবার ফিল্টার */}
            <div className="relative mb-4">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-slate-500" />
              </span>
              <input
                type="text"
                value={searchQuery}
                placeholder="মেশিনের নাম, বিভাগ বা কারখানার নাম দিয়ে খুঁজুন..."
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 pl-9 pr-4 py-2 rounded-xl focus:border-cyan-500 outline-none"
              />
            </div>

            {/* তালিকা স্ক্রলার */}
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1" id="gps-machine-scroller">
              {filteredMachines.length === 0 ? (
                <text className="text-slate-500 text-xs text-center py-10 block">কোন জিপিএস সম্বলিত মেশিন খুঁজে পাওয়া যায়নি।</text>
              ) : (
                filteredMachines.map(item => {
                  const isSelected = item.machine.id === selectedMachineId;
                  return (
                    <button
                      key={item.machine.id}
                      onClick={() => {
                        setSelectedMachineId(item.machine.id);
                        setSuccessPing(false);
                      }}
                      className={`w-full p-3.5 rounded-xl border text-left flex justify-between items-center transition-all cursor-pointer ${
                        isSelected ? 'bg-cyan-950/20 border-cyan-500/50' : 'bg-slate-950 border-slate-850 hover:bg-slate-900/50'
                      }`}
                      id={`gps-mach-btn-${item.machine.id}`}
                    >
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-slate-200 block">{item.machine.name}</span>
                        <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                          <span className="bg-slate-900 px-1.5 py-0.5 rounded text-cyan-400 border border-slate-800">{item.factoryName}</span>
                          <span>{item.machine.department}</span>
                        </div>
                      </div>

                      {/* স্ট্যাটাস ও জিপিএস কোঅর্ডিনেট লেবেল */}
                      <div className="text-right space-y-1">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                          item.machine.status === 'running' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20' :
                          item.machine.status === 'faulty' ? 'bg-rose-950 text-rose-400 border border-rose-500/20 animate-pulse' :
                          'bg-slate-900 text-slate-400'
                        }`}>
                          {item.machine.status === 'running' ? 'চলমান' :
                           item.machine.status === 'faulty' ? 'ত্রুটিযুক্ত' : 'অলস'}
                        </span>
                        <p className="text-[10px] text-slate-500 font-mono">Lat: {item.machine.gpsLatitude}, Lng: {item.machine.gpsLongitude}</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-950/30 border border-slate-850 rounded-xl text-xs text-slate-400">
            * ট্র্যাকিং এর সঠিকতার স্তর: <strong className="text-emerald-400">অনতিরেক ৪ মিটার (উচ্চতা ও পজিশন সমর্থিত)</strong>। জিপিএস নোডগুলো সচল থাকলে ২ মিনিট পর পর নেটওয়ার্কে সিগন্যাল পাঠিয়ে ডাটা রিফ্রেশ করে থাকে।
          </div>
        </div>

        {/* ডান পাশ - নির্ধারিত ডিভাইসের লাইভ সিগন্যাল এবং বিবরণ */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between" id="gps-detailed-monitor-panel">
          {selectedItem ? (
            <div className="space-y-5" id="gps-detailed-card-active">
              
              {/* লাইভ লোকেটর অ্যানিমেশন উইজেট */}
              <div className="relative bg-slate-950 p-5 rounded-xl border border-slate-800 overflow-hidden flex flex-col items-center justify-center text-center">
                {/* রিং অ্যান্টেনা এফেক্ট */}
                <div className="relative w-20 h-20 bg-cyan-950/20 border border-cyan-500/20 rounded-full flex items-center justify-center mb-3">
                  <div className={`absolute inset-0 bg-cyan-500/10 rounded-full ${updatingGps ? 'animate-ping' : ''}`} />
                  <Radio className="w-8 h-8 text-cyan-400 relative z-10" />
                </div>

                <span className="text-[10px] text-cyan-400 font-bold tracking-widest font-mono uppercase">GPS DEVICE ACTIVE BEACON</span>
                <h4 className="text-sm font-bold text-slate-200 mt-2">{selectedItem.machine.name}</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">ডিভাইস আইডি: GPS-{selectedItem.machine.id.toUpperCase()}</p>

                {/* সিমুলেটেড ব্যাটারি সূচক */}
                <div className="flex items-center gap-1.5 mt-3 text-[10px] text-slate-400 border border-slate-850 px-2.5 py-1 rounded bg-slate-900/40">
                  <Battery className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ব্যাটারি লাইফ: ৯২% (সচল)</span>
                </div>
              </div>

              {/* জিপিএস স্যাটেলাইট ডাটা উইন্ডো */}
              <div className="space-y-2.5">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider font-mono">Satellite Coordinates</span>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                    <span className="text-[9px] text-slate-500 font-bold uppercase block">Latitude (অক্ষাংশ)</span>
                    <span className="text-sm font-bold text-cyan-400 font-mono block mt-1">{selectedItem.machine.gpsLatitude.toFixed(4)}° N</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                    <span className="text-[9px] text-slate-500 font-bold uppercase block">Longitude (দ্রাঘিমাংশ)</span>
                    <span className="text-sm font-bold text-cyan-400 font-mono block mt-1">{selectedItem.machine.gpsLongitude.toFixed(4)}° E</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">প্যারেন্ট প্ল্যান্ট:</span>
                    <span className="font-semibold text-slate-200 truncate max-w-[140px]">{selectedItem.factoryName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">চলতি লোড কনসাম্পশন:</span>
                    <span className="font-semibold text-emerald-400 font-mono">{selectedItem.machine.currentUsage} kW</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">অপচয়কৃত লিকেজ কারেন্ট:</span>
                    <span className="font-semibold text-rose-400 font-mono">{selectedItem.machine.wastedPower} kW</span>
                  </div>
                </div>
              </div>

              {/* আপডেট ও পিং বাটন */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  disabled={updatingGps}
                  onClick={handleGpsUpdate}
                  className="w-full bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs py-2.5 px-4 rounded-xl border border-slate-750 hover:border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  id="gps-signal-trigger-btn"
                >
                  <RefreshCw className={`w-4 h-4 text-cyan-400 ${updatingGps ? 'animate-spin' : ''}`} />
                  {updatingGps ? 'জিপিএস সিগন্যাল রিফ্রেশ হচ্ছে...' : 'জিপিএস স্থানাঙ্ক পুনঃ-নির্ধারণ করুন'}
                </button>

                {successPing && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl flex items-center gap-2 text-emerald-400 text-xs animate-fade-in justify-center">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <span>সিগন্যাল সফল: সর্বশেষ কোঅর্ডিনেটস লুপ হয়েছে!</span>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="text-center py-20 text-slate-500 text-xs" id="gps-detailed-placeholder">
              জিপিএস স্যাটেলাইট সিগন্যাল নিরীক্ষণ করার জন্য বাম দিকের যেকোনো মেশিন বা অপটিমা ডিভাইস নির্বাচন করুন
            </div>
          )}

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 text-[10px] text-slate-400 leading-relaxed mt-4">
            <span className="text-cyan-400 font-bold block mb-1">প্রযুক্তিগত তথ্য:</span>
            এই অ্যাপলিকেশনের মেশিনগুলি কাস্টম ২.৪ গিগাহার্টজ ব্যান্ডে স্যাটেলাইটের সাথে সংযুক্ত আছে, যা প্রতিকূল আবহাওয়াতেও নিরবচ্ছিন্ন ট্র্যাকিং ডাটা প্রদানে সক্ষম।
          </div>
        </div>

      </div>
    </div>
  );
}
