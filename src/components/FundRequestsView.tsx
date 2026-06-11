/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Factory, FundRequest } from '../types';
import { DollarSign, Send, CheckCircle, Clock, AlertCircle, Sparkles } from 'lucide-react';

interface FundRequestsViewProps {
  factories: Factory[];
  fundRequests: FundRequest[];
  onApplyForFunds: (request: Omit<FundRequest, 'id' | 'requestedAt' | 'status'>) => void;
}

export default function FundRequestsView({
  factories,
  fundRequests,
  onApplyForFunds
}: FundRequestsViewProps) {
  const [factoryId, setFactoryId] = useState(factories[0]?.id || '');
  const [sector, setSector] = useState('কয়েল ও হিটার প্রতিস্থাপন (Heating & Dryers)');
  const [amount, setAmount] = useState<number>(120000);
  const [purpose, setPurpose] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!factoryId || !sector || !amount || !purpose) {
      alert('দয়া করে ফর্মের সবকটি তথ্য সঠিকভাবে পূরণ করুন।');
      return;
    }

    const factoryObj = factories.find(f => f.id === factoryId);
    if (!factoryObj) return;

    onApplyForFunds({
      factoryId,
      factoryName: factoryObj.name,
      sector,
      amount: Number(amount),
      purpose
    });

    // ফর্ম রিসেট
    setPurpose('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className="space-y-6" id="fund-requests-root">
      
      {/* প্রধান ওভারভিউ ব্যানার */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden" id="fund-hero-card">
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <DollarSign className="text-emerald-400 w-5 h-5" />
            জরুরী এনার্জি ও ফল্ট রিকভারি ফান্ড পোর্টাল (Apply for Funds)
          </h2>
          <p className="text-xs text-slate-400 mt-1">কারখানাসমূহে অচল মেশিন মেরামত, লিকেজ ডিভাইস প্রতিস্থাপন ও জিপিএস ট্র্যাক ইন্সটলেশনের জন্য সরকারী বিশেষ আর্থিক সহায়তা কেন্দ্র</p>
        </div>
        <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded font-mono font-bold">
          মোট অনুমোদিত বাজেট: ১,৫০,০০,০০০ ৳
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* বায়ের কলাম - আবেদন ফর্ম */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between" id="fund-apply-form-panel">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
              <Sparkles className="text-cyan-400 w-4.5 h-4.5" />
              নতুন তহবিলের আবেদন ফরম
            </h3>

            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-3 rounded-xl mb-4 flex items-center gap-2 animate-fade-in">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>তহবিলের আবেদনটি পর্যালোচনার জন্য জমা দেওয়া হয়েছে!</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs" id="fund-request-form">
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">অনুরোধকারী কারখানা *</label>
                <select
                  required
                  value={factoryId}
                  onChange={(e) => setFactoryId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-lg text-slate-200 outline-none focus:border-cyan-500 cursor-pointer"
                >
                  {factories.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">প্রয়োজনীয় আর্থিক খাত *</label>
                <select
                  required
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-lg text-slate-200 outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="কয়েল ও হিটার প্রতিস্থাপন (Heating & Dryers)">কয়েল ও হিটার প্রতিস্থাপন (Heating & Dryers)</option>
                  <option value="বৈদ্যুতিক লিকেজ ও ওয়ারিং সংস্কার (Wiring Maintenance)">বৈদ্যুতিক লিকেজ ও ওয়ারিং সংস্কার (Wiring Maintenance)</option>
                  <option value="৩-ফেজ ক্যাবল ইন্সুলেশন উন্নয়ন (Armored Cables)">৩-ফেজ ক্যাবল ইন্সুলেশন উন্নয়ন (Armored Cables)</option>
                  <option value="বিল্ট-ইন জিপিএস ও সেন্সর স্থাপন (GPS & Sensor Tech)">মেশিন জিপিএস ও আইওটি স্থাপন (GPS & Sensor Tech)</option>
                  <option value="গ্রিন পাওয়ার জেনারেটর সংযোজন (Eco Generator)">গ্রিন পাওয়ার এনার্জি সংযোজন (Eco Generator)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">প্রয়োজনীয় আর্থিক অনুদান (টাকা/৳) *</label>
                <input
                  type="number"
                  min="5000"
                  max="1000000"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-lg text-slate-200 outline-none focus:border-cyan-500 font-mono text-xs"
                />
                <p className="text-[10px] text-slate-500 mt-1">সর্বনিম্ন ৫,০০০ ৳ থেকে সর্বোচ্চ ১০,০০,০০০ ৳ পর্যন্ত</p>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">প্রয়োজনীয়তা ও ক্রুটির স্পষ্ট বিবরণী *</label>
                <textarea
                  required
                  rows={4}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="যেমন: আমাদের বয়লার হিটিং মেশিনে ক্রনিক লিকেজ পাওয়া গেছে যা পরিবেশের ক্ষতি করছে এবং বিদ্যুৎ ব্যয় দ্বিগুণ করেছে। এই অর্থ সরঞ্জাম মেরামত প্রকল্পে ব্যবহার হবে..."
                  className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-lg text-slate-200 outline-none focus:border-cyan-500 resize-none font-normal"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                id="fund-submit-btn"
              >
                <Send className="w-4 h-4" />
                আবেদন জমা দিন (Apply Now)
              </button>
            </form>
          </div>

          <div className="mt-4 p-3 bg-slate-955 border border-slate-850 rounded-lg text-[11px] text-slate-500 leading-normal">
            * আবেদনের অনুমোদন এনার্জি অডিটর বোর্ড দ্বারা যাচাই সাপেক্ষে ২ কার্যদিবসের মধ্যে দেওয়া হয়ে থাকে।
          </div>
        </div>

        {/* ডানের ২ কলাম - আবেদনের ইতিহাস ও ট্র্যাক */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-2xl" id="fund-requests-history-panel">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
            <Clock className="text-cyan-400 w-4.5 h-4.5" />
            আবেদনের অগ্রগতি ও ঐতিহাসিক রেকর্ডসমূহ ({fundRequests.length} টি)
          </h3>

          <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1" id="fund-history-scroller">
            {fundRequests.length === 0 ? (
              <p className="text-slate-500 text-xs text-center py-10">কোন আবেদনের ডেটা পাওয়া যায়নি।</p>
            ) : (
              [...fundRequests].reverse().map(req => (
                <div
                  key={req.id}
                  className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-3 hover:border-slate-800 transition-all font-normal"
                  id={`fund-request-item-${req.id}`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">{req.factoryName}</span>
                      <span className="text-[10px] text-cyan-400">{req.sector}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-200">৳ {req.amount.toLocaleString('bn-BD')}</span>
                      
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        req.status === 'approved' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20' :
                        req.status === 'rejected' ? 'bg-rose-950 text-rose-400 border border-rose-500/20' :
                        'bg-slate-900 text-amber-400 border border-slate-800 animate-pulse'
                      }`}>
                        {req.status === 'approved' ? 'অনুমোদিত' :
                         req.status === 'rejected' ? 'প্রত্যাখ্যাত' : 'অপেক্ষমান'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/40 p-2.5 rounded-lg border border-slate-900/60 break-words font-sans">
                    {req.purpose}
                  </p>

                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                    <span>আইডি: REQ-{req.id.toUpperCase()}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-600" />
                      দাখিলকৃত তারিখ: {req.requestedAt}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
