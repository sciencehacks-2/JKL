/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  PieChart,
  Settings,
  MapPin,
  Compass,
  DollarSign,
  AlertOctagon,
  Users,
  Grid
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  faultsCount: number;
}

export default function Sidebar({ currentTab, setCurrentTab, faultsCount }: SidebarProps) {
  const tabs = [
    {
      id: 'dashboard',
      label: 'ড্যাশবোর্ড মনিটর',
      icon: PieChart,
      badge: null,
      description: 'বিদ্যুৎ ব্যবহার ও অপচয় মনিটর'
    },
    {
      id: 'factories',
      label: 'কারখানা ও নিবন্ধন',
      icon: Users,
      badge: null,
      description: 'নতুন কারখানা নিবন্ধন ও লাইসেন্স'
    },
    {
      id: 'map',
      label: 'ভৌগোলিক মানচিত্র',
      icon: MapPin,
      badge: null,
      description: 'ফ্যাক্টরি সমূহের জিপিএস লোকেশন'
    },
    {
      id: 'gps-tracking',
      label: 'মেশিন ট্র্যাকার (GPS)',
      icon: Compass,
      badge: null,
      description: 'মেশিনের অবস্থান ট্র্যাকিং'
    },
    {
      id: 'fund-requests',
      label: 'তহবিলের আবেদন',
      icon: DollarSign,
      badge: null,
      description: 'অর্থ সহায়তার আবেদন ও ডায়েরি'
    },
    {
      id: 'faults',
      label: 'ত্রুটি ও লিকেজ সতর্কতা',
      icon: AlertOctagon,
      badge: faultsCount > 0 ? faultsCount : null,
      badgeColor: 'bg-rose-500',
      description: 'বৈদ্যুতিক লিকেজ ও ফল্ট ডায়েরি'
    }
  ];

  return (
    <aside className="w-full lg:w-72 bg-slate-950 border-r border-slate-800 flex flex-col justify-between" id="app-sidebar">
      <div className="p-4 flex-1">
        {/* মেনু সাব-হেডার */}
        <div className="mb-4 px-3 py-2 bg-slate-900/60 rounded-lg border border-slate-800">
          <p className="text-[10px] text-cyan-400 font-mono tracking-wider">MONITOR NAVIGATION PANEL</p>
          <span className="text-xs text-slate-400">নিচে থেকে যেকোনো ফিচার মনিটর নির্বাচন করুন:</span>
        </div>

        {/* লিঙ্কসমুহ */}
        <nav className="space-y-1.5" id="sidebar-nav">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all cursor-pointer text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-950/80 to-slate-900 border-l-4 border-cyan-500 text-white font-medium shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
                id={`sidebar-tab-${tab.id}`}
              >
                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-500 group-hover:text-slate-400'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{tab.label}</span>
                    {tab.badge !== null && (
                      <span className={`text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full ${tab.badgeColor || 'bg-cyan-500'}`}>
                        {tab.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 font-normal truncate mt-0.5">{tab.description}</p>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ফুটার কারিগরী বিবরণী */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/30 text-[11px] text-slate-500 font-mono text-center space-y-1" id="sidebar-footer">
        <p className="font-semibold text-slate-400">শিল্প বিদ্যুৎ মনিটরিং সিস্টেম v1.4</p>
        <p>সার্ভার রেসপন্স: <span className="text-emerald-500 font-bold">সক্রিয়</span></p>
        <p>ডিভাইস সংযোগ: ২০ / ২০ জিপিএস মডিউল</p>
      </div>
    </aside>
  );
}
