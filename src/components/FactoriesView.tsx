/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Factory } from '../types';
import {
  Plus,
  AlertTriangle,
  RotateCw,
  Search,
  CheckCircle,
  Clock,
  Calendar,
  Phone,
  MapPin,
  FileSpreadsheet
} from 'lucide-react';

interface FactoriesViewProps {
  factories: Factory[];
  onRegisterFactory: (newFactory: Omit<Factory, 'id' | 'machines' | 'activeFaults'>) => void;
  onReRegisterFactory: (id: string) => void;
}

export default function FactoriesView({
  factories,
  onRegisterFactory,
  onReRegisterFactory
}: FactoriesViewProps) {
  // ফর্মের ফিল্ডগুলোর স্টেট
  const [name, setName] = useState('');
  const [type, setType] = useState<'tea' | 'textile' | 'jute' | 'food_processing' | 'other'>('tea');
  const [location, setLocation] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [latitude, setLatitude] = useState(50);
  const [longitude, setLongitude] = useState(60);
  const [totalUsage, setTotalUsage] = useState(15000);
  const [totalWaste, setTotalWaste] = useState(2500);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'tea' | 'textile' | 'jute'>('all');
  const [successMsg, setSuccessMsg] = useState('');

  // সাবমিশন হ্যান্ডলার
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location || !contactNumber) {
      alert('দয়া করে কারখানার নাম, অবস্থান ও মোবাইল নম্বর সঠিকভাবে পূরণ করুন।');
      return;
    }

    // পুনঃ-নিবন্ধন ডেট (যেমন ১ বছর পর)
    const today = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);

    const formattedToday = today.toISOString().split('T')[0];
    const formattedNextYear = nextYear.toISOString().split('T')[0];

    onRegisterFactory({
      name,
      type,
      location,
      contactNumber,
      latitude: Number(latitude),
      longitude: Number(longitude),
      registeredAt: formattedToday,
      reRegistrationDueDate: formattedNextYear,
      totalUsage: Number(totalUsage),
      totalWaste: Number(totalWaste),
      departmentUsage: {
        'প্রধান ম্যানুফ্যাকচারিং': Number(totalUsage) * 0.45,
        'ড্রায়িং অ্যান্ড হিটিং': Number(totalUsage) * 0.35,
        'প্যাকিং ও স্টোরেজ': Number(totalUsage) * 0.20
      }
    });

    // ফর্ম রিসেট
    setName('');
    setLocation('');
    setContactNumber('');
    setLatitude(50);
    setLongitude(60);
    setTotalUsage(15000);
    setTotalWaste(2500);

    setSuccessMsg('কারখানাটি সফলভাবে নিবন্ধিত হয়েছে!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // ডেট এক্সপায়ার্ড বা আসন্ন চেক করা
  const getReRegistrationStatus = (dueDateStr: string) => {
    const today = new Date();
    const dueDate = new Date(dueDateStr);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { status: 'expired', label: 'মেয়াদোত্তীর্ণ! পুনঃ-নিবন্ধন বাধ্যতামূলক', color: 'text-rose-500 bg-rose-500/10 border-rose-500/30' };
    } else if (diffDays <= 30) {
      return { status: 'warning', label: `মেয়াদ আসন্ন! আর ${diffDays} দিন বাকী`, color: 'text-amber-500 bg-amber-500/10 border-amber-500/30' };
    } else {
      return { status: 'safe', label: 'নিবন্ধন ভ্যালিড ও নিরাপদ', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' };
    }
  };

  // ফিল্টারিং ও সার্চিং
  const filteredFactories = factories.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.location.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterType === 'all') return matchesSearch;
    return f.type === filterType && matchesSearch;
  });

  return (
    <div className="space-y-6" id="factories-view-root">
      
      {/* ২ কলাম ইন্টারফেস - বায়ে নিবন্ধন ডায়েরি, ডানে নতুন নিবন্ধন ফরম */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* কলাম ১ ও ২: কারখানার তালিকা ও পুনঃ-নিবন্ধন তদারকি */}
        <div className="xl:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between" id="factories-list-panel">
          <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-800 pb-4 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <FileSpreadsheet className="text-cyan-400 w-4.5 h-4.5" />
                  সকল নিবন্ধিত কারখানাসমূহ ({factories.length} টি)
                </h3>
                <p className="text-xs text-slate-400 mt-1">কারখানার ক্যাটাগরি, রিয়েল-টাইম লাইসেন্স ভ্যালিডিটি ও রানিং ব্যবহার</p>
              </div>

              {/* চা-কারখানা স্পেসিফিক ফিল্টার ট্যাব */}
              <div className="flex gap-1 bg-slate-950 p-1 border border-slate-800 rounded-lg">
                <button
                  type="button"
                  onClick={() => setFilterType('all')}
                  className={`text-[11px] px-2.5 py-1 rounded-md transition-colors cursor-pointer ${filterType === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  সব কারখানা
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('tea')}
                  className={`text-[11px] px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${filterType === 'tea' ? 'bg-emerald-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  চা কারখানা
                </button>
              </div>
            </div>

            {/* সার্চ বার */}
            <div className="relative mb-4">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-slate-500" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="কারখানার নাম বা জেলা দিয়ে খুঁজুন..."
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 pl-9 pr-4 py-2 rounded-xl focus:border-cyan-500 outline-none"
              />
            </div>

            {/* তালিকা */}
            <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1" id="factory-scroller">
              {filteredFactories.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  কোন নিবন্ধিত কারখানা পাওয়া যায়নি।
                </div>
              ) : (
                filteredFactories.map(f => {
                  const regStatus = getReRegistrationStatus(f.reRegistrationDueDate);
                  return (
                    <div
                      key={f.id}
                      className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-slate-800"
                      id={`factory-item-${f.id}`}
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-slate-200">{f.name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                            f.type === 'tea' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20' :
                            f.type === 'textile' ? 'bg-blue-950 text-blue-400 border border-blue-500/20' :
                            f.type === 'jute' ? 'bg-amber-950 text-amber-400 border border-amber-500/20' :
                            'bg-slate-900 text-slate-400 border border-slate-700'
                          }`}>
                            {f.type === 'tea' ? 'চা কারখানা' :
                             f.type === 'textile' ? 'টেক্সটাইল' :
                             f.type === 'jute' ? 'জুট মিলস' : 'অন্যান্য'}
                          </span>
                        </div>

                        {/* কারখানার বিস্তারিত তথ্য */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-400 text-xs">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                            {f.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-slate-500" />
                            {f.contactNumber}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            নিবন্ধন: {new Date(f.registeredAt).toLocaleDateString('bn-BD')}
                          </span>
                        </div>

                        {/* বিদ্যুৎ ব্যবহার ডাটা */}
                        <div className="grid grid-cols-2 gap-3 pt-1.5 text-xs">
                          <div className="bg-slate-900/60 border border-slate-850 p-1.5 px-2.5 rounded-lg">
                            <span className="text-[10px] text-slate-500 block">মোট বিদ্যুৎ ব্যবহার:</span>
                            <span className="font-semibold text-slate-300">{f.totalUsage.toLocaleString('bn-BD')} kWh</span>
                          </div>
                          <div className="bg-slate-900/60 border border-slate-850 p-1.5 px-2.5 rounded-lg">
                            <span className="text-[10px] text-slate-500 block">অপচয় হওয়া বিদ্যুৎ:</span>
                            <span className="font-semibold text-rose-400">{f.totalWaste.toLocaleString('bn-BD')} kWh</span>
                          </div>
                        </div>
                      </div>

                      {/* লাইসেন্স পুনঃ-নিবন্ধন তদারকি বাটন এবং স্ট্যাটাস (Requirement 10) */}
                      <div className="flex flex-col items-start md:items-end gap-2.5 border-t md:border-t-0 border-slate-850 pt-3 md:pt-0">
                        <div className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border ${regStatus.color}`}>
                          {regStatus.label}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          শেষ তারিখ: {new Date(f.reRegistrationDueDate).toLocaleDateString('bn-BD')}
                        </div>

                        {(regStatus.status === 'expired' || regStatus.status === 'warning') && (
                          <button
                            type="button"
                            onClick={() => onReRegisterFactory(f.id)}
                            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs py-1.5 px-3.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                            id={`rereg-btn-${f.id}`}
                          >
                            <RotateCw className="w-3.5 h-3.5 animate-spin-hover" />
                            পুনঃ-নিবন্ধন করুন
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          <div className="mt-4 p-3 bg-slate-950/40 rounded-xl border border-slate-850 text-xs text-slate-400 leading-relaxed">
            * সরকারী নিয়মনীতি অনুযায়ী পরিবেশ ও এনার্জি ছাড়পত্র নিশ্চিতকরণের লক্ষ্যে নিবন্ধনের <strong className="text-cyan-400">মেয়াদোত্তীর্ণ কারখানাসমূহকে পুনঃ-নিবন্ধন বা Re-registering</strong> এর আওতায় আসতে হবে। পুনঃ-নিবন্ধনে লাইসেন্সের মেয়াদ পরবর্তী ১ বছরের জন্য বৃদ্ধি পায়।
          </div>
        </div>

        {/* কলাম ৩: নতুন কারখানা নিবন্ধন ফরম */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl" id="factory-registration-form-panel">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
            <Plus className="text-cyan-400 w-5 h-5" />
            নতুন কারখানা নিবন্ধন ফরম
          </h3>

          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-3 rounded-xl flex items-center gap-2 mb-4 animate-fade-in">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs" id="factory-reg-form">
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">কারখানার বৈজ্ঞানিক নাম *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: মৌচাক গ্রিন টি এস্টেট"
                className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-lg text-slate-200 outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">শিল্পের ধরণ বা ক্যাটাগরি *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-lg text-slate-200 outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="tea">চা কারখানা (Tea Garden Factory)</option>
                <option value="textile">টেক্সটাইল ও স্পিনিং (Textile)</option>
                <option value="jute">পাট ও জুট মিলস (Jute Spinning)</option>
                <option value="food_processing">খাদ্য প্রক্রিয়াকরণ (Food Processing)</option>
                <option value="other">অন্যান্য (Other)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">অবস্থান / জেলা ঠিকানা *</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="যেমন: শ্রীমঙ্গল, সিলেট"
                className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-lg text-slate-200 outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">মোবাইল / যোগাযোগ নম্বর *</label>
              <input
                type="tel"
                required
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="017xxxxxxxx"
                className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-lg text-slate-200 outline-none focus:border-cyan-500"
              />
            </div>

            {/* জিপিএস অক্ষাংশ ও দ্রাঘিমাংশ কোঅর্ডিনেটস */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">জিপিএস অক্ষাংশ (Lat) *</label>
                <input
                  type="number"
                  min="10"
                  max="90"
                  required
                  value={latitude}
                  onChange={(e) => setLatitude(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-lg text-slate-200 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">জিপিএস দ্রাঘিমাংশ (Lng) *</label>
                <input
                  type="number"
                  min="10"
                  max="90"
                  required
                  value={longitude}
                  onChange={(e) => setLongitude(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-lg text-slate-200 outline-none"
                />
              </div>
            </div>

            {/* বেস ইলেকট্রিক্যাল প্রোফাইল */}
            <div className="grid grid-cols-2 gap-3 border-t border-slate-850 pt-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">প্রারম্ভিক ব্যবহার (kWh)</label>
                <input
                  type="number"
                  required
                  value={totalUsage}
                  onChange={(e) => setTotalUsage(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-lg text-slate-200 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">প্রারম্ভিক অপচয় (kWh)</label>
                <input
                  type="number"
                  required
                  value={totalWaste}
                  onChange={(e) => setTotalWaste(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-lg text-slate-200 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              id="submit-factory-reg-btn"
            >
              <Plus className="w-4.5 h-4.5" />
              কারখানা নিবন্ধন সম্পন্ন করুন
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
