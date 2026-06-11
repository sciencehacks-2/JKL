/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, ShieldCheck, Factory as FactoryIcon, Clock } from 'lucide-react';
import { SystemNotification } from '../types';

interface HeaderProps {
  notifications: SystemNotification[];
  onMarkAsRead: (id: string) => void;
  onClearNotifications: () => void;
  factoryCount: number;
}

export default function Header({
  notifications,
  onMarkAsRead,
  onClearNotifications,
  factoryCount
}: HeaderProps) {
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatBanglaTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    const timeStr = date.toLocaleTimeString('bn-BD', options);
    const dateStr = date.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
    return { timeStr, dateStr };
  };

  const { timeStr, dateStr } = formatBanglaTime(currentTime);

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white relative z-50 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg" id="app-header">
      {/* বাম পাশ - লোগো এবং পরিচিতি */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-cyan-950 border border-cyan-500 rounded-lg animate-pulse" id="logo-icon-container">
          <FactoryIcon className="w-8 h-8 text-cyan-400" id="main-logo-svg" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400" id="header-title">
            ইলেক্ট্রিসিটি ও ফল্ট মনিটরিং কনসোল
          </h1>
          <p className="text-xs text-slate-400 font-mono tracking-wider" id="header-subtitle">
            INDUSTRY POWER TRACKER & FAULT MONITOR • BANGLADESH
          </p>
        </div>
      </div>

      {/* ডান পাশ - ঘড়ী, বিজ্ঞপ্তি এবং লাইভ কাউন্টার */}
      <div className="flex flex-wrap items-center gap-4 md:gap-6 w-full md:w-auto justify-end">
        {/* রিয়েল-টাইম সময় মনিটর */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-lg" id="bengali-clock">
          <Clock className="w-4 h-4 text-emerald-400" />
          <div className="text-right">
            <p className="text-xs text-emerald-400 font-mono font-semibold">{timeStr}</p>
            <p className="text-[10px] text-slate-400">{dateStr}</p>
          </div>
        </div>

        {/* নিবন্ধিত ফ্যাক্টরি কাউন্টার */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/30 px-3 py-1.5 rounded-lg" id="factories-counter-badge">
          <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />
          <span className="text-xs text-slate-300">মোট কারখানা:</span>
          <span className="text-sm font-bold text-cyan-400 font-sans">{factoryCount} টি</span>
        </div>

        {/* ড্রপডাউন সহ নোটিফিকেশন বেল */}
        <div className="relative" id="notification-bell-wrapper">
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="relative p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-colors rounded-lg cursor-pointer flex items-center justify-center"
            id="notif-bell-btn"
          >
            <Bell className="w-5 h-5 text-slate-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-sans text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-900 animate-bounce" id="notif-badge-count">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-3 w-80 md:w-96 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl overflow-hidden text-slate-200 z-[100]" id="notif-dropdown">
              <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  তাত্ক্ষণিক নোটিফিকেশন ({unreadCount})
                </span>
                {notifications.length > 0 && (
                  <button
                    onClick={onClearNotifications}
                    className="text-xs text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                    id="clear-all-notif-btn"
                  >
                    সব মুছুন
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto" id="notif-list-container">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    কোন নতুন নোটিফিকেশন বা ত্রুটির তথ্য নেই।
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => onMarkAsRead(notif.id)}
                      className={`p-3.5 border-b border-slate-900/60 transition-colors hover:bg-slate-900 cursor-pointer flex gap-3 ${
                        notif.read ? 'opacity-60 bg-transparent' : 'bg-slate-900/40 border-l-4 border-cyan-500'
                      }`}
                      id={`notif-item-${notif.id}`}
                    >
                      <div className="mt-0.5">
                        {notif.type === 'leakage' && (
                          <div className="w-2.5 h-2.5 bg-rose-500 rounded-full" />
                        )}
                        {notif.type === 'fault' && (
                          <div className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
                        )}
                        {notif.type === 'reregister' && (
                          <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full" />
                        )}
                        {notif.type === 'fund' && (
                          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <span className="text-[11px] font-semibold text-cyan-400 truncate">{notif.factoryName}</span>
                          <span className="text-[9px] text-slate-500 font-mono">
                            {new Date(notif.timestamp).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed break-words">{notif.message}</p>
                        {!notif.read && (
                          <span className="text-[9px] text-emerald-400 block mt-1 hover:underline cursor-pointer">
                            পঠিত হিসেবে চিহ্নিত করুন
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-2 bg-slate-900/40 text-center border-t border-slate-950">
                <p className="text-[10px] text-slate-500">অ্যাক্টিভ ফল্ট ও লিকেজ সতর্কতা ব্যাকগ্রাউন্ডে চেক হচ্ছে</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
