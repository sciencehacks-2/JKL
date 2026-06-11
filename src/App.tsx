/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import FactoriesView from './components/FactoriesView';
import MapView from './components/MapView';
import GpsTrackerView from './components/GpsTrackerView';
import FundRequestsView from './components/FundRequestsView';
import FaultsAlertsView from './components/FaultsAlertsView';

import { Factory, FundRequest, SystemNotification, Fault } from './types';
import { INITIAL_FACTORIES, INITIAL_FUND_REQUESTS, INITIAL_NOTIFICATIONS } from './data';
import { ShieldAlert, Info, Settings, Lightbulb, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // কারখানাসমূহের লিস্ট স্টেট
  const [factories, setFactories] = useState<Factory[]>(() => {
    const saved = localStorage.getItem('power_track_factories');
    return saved ? JSON.parse(saved) : INITIAL_FACTORIES;
  });

  // ফান্ডের আবেদন লিস্ট স্টেট
  const [fundRequests, setFundRequests] = useState<FundRequest[]>(() => {
    const saved = localStorage.getItem('power_track_funds');
    return saved ? JSON.parse(saved) : INITIAL_FUND_REQUESTS;
  });

  // নোটিফিকেশন লিস্ট স্টেট
  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem('power_track_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // লোকাল স্টোরেজে সিঙ্ক করা
  useEffect(() => {
    localStorage.setItem('power_track_factories', JSON.stringify(factories));
  }, [factories]);

  useEffect(() => {
    localStorage.setItem('power_track_funds', JSON.stringify(fundRequests));
  }, [fundRequests]);

  useEffect(() => {
    localStorage.setItem('power_track_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // ১. নতুন কারখানা নিবন্ধন হ্যান্ডলার (Requirement 4 & 5)
  const handleRegisterFactory = (
    newFactoryData: Omit<Factory, 'id' | 'machines' | 'activeFaults'>
  ) => {
    const newId = `fact-${Date.now()}`;
    
    // নিবন্ধিত কারখানার জন্য ৩টি কাল্পনিক আইওটি মেশিন এবং একটি জিপিএস সেন্সর সোর্স গঠন করা
    const baseGpsLat = newFactoryData.latitude;
    const baseGpsLng = newFactoryData.longitude;

    const defaultMachines = [
      {
        id: `mach-${newId}-1`,
        name: 'প্রধান ইন্ডাকশন থার্মো সেকশন',
        department: 'ড্রায়িং অ্যান্ড হিটিং',
        currentUsage: Math.floor(Math.random() * 150) + 80,
        wastedPower: Math.floor(Math.random() * 15) + 2,
        gpsLatitude: baseGpsLat + 0.12,
        gpsLongitude: baseGpsLng - 0.08,
        status: 'running' as const
      },
      {
        id: `mach-${newId}-2`,
        name: 'অটো চিপ প্যাকিং গেজেট',
        department: 'প্যাকিং ও স্টোরেজ',
        currentUsage: Math.floor(Math.random() * 100) + 40,
        wastedPower: Math.floor(Math.random() * 8) + 1,
        gpsLatitude: baseGpsLat - 0.05,
        gpsLongitude: baseGpsLng + 0.15,
        status: 'idle' as const
      }
    ];

    const completedFactory: Factory = {
      ...newFactoryData,
      id: newId,
      machines: defaultMachines,
      activeFaults: []
    };

    setFactories(prev => [...prev, completedFactory]);

    // বিজ্ঞপ্তি ট্রিগার করা
    const newNotification: SystemNotification = {
      id: `notif-${Date.now()}`,
      factoryName: newFactoryData.name,
      message: `কারখানা নিবন্ধন সফল: "${newFactoryData.name}" আনুষ্ঠানিকভাবে বিদ্যুৎ গ্রিড নেটওয়ার্কে সংযুক্ত হয়েছে।`,
      type: 'fund',
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  // ২. কারখানার পুনঃ-নিবন্ধন রিনিউয়াল নিশ্চিত করা (Requirement 10)
  const handleReRegisterFactory = (id: string) => {
    const today = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);
    const formattedDue = nextYear.toISOString().split('T')[0];

    setFactories(prev =>
      prev.map(f => {
        if (f.id === id) {
          return {
            ...f,
            reRegistrationDueDate: formattedDue
          };
        }
        return f;
      })
    );

    const targetFactoryName = factories.find(f => f.id === id)?.name || 'কারখানা';

    const newNotification: SystemNotification = {
      id: `notif-${Date.now()}`,
      factoryName: targetFactoryName,
      message: `পুনঃ-নিবন্ধন সম্পন্ন: "${targetFactoryName}" এর লাইসেন্সের মেয়াদ আগামী ${new Date(formattedDue).toLocaleDateString('bn-BD')} পর্যন্ত বাড়ানো হয়েছে।`,
      type: 'reregister',
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  // ৩. জরুরী ফান্ডের আবেদন করা (Requirement 12)
  const handleApplyForFunds = (requestData: Omit<FundRequest, 'id' | 'requestedAt' | 'status'>) => {
    const newRequest: FundRequest = {
      ...requestData,
      id: `req-${Date.now()}`,
      requestedAt: new Date().toLocaleDateString('bn-BD') + ' ' + new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      status: 'pending'
    };

    setFundRequests(prev => [...prev, newRequest]);

    const newNotification: SystemNotification = {
      id: `notif-${Date.now()}`,
      factoryName: requestData.factoryName,
      message: `তহবিলের আবেদন: ${requestData.sector} খাতের জন্য ৳ ${requestData.amount.toLocaleString('bn-BD')} টাকার আবেদন জমা হয়েছে।`,
      type: 'fund',
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  // ৪. বৈদ্যুতিক ত্রুটি বা লিকেজ সমাধান সম্পন্ন করা - সাথে কমানো হবে বিদ্যুৎ অপচয়! (Requirement 1, 2 & 11)
  const handleResolveFault = (factoryId: string, faultId: string) => {
    setFactories(prev =>
      prev.map(fact => {
        if (fact.id === factoryId) {
          // ত্রুটি তালিকায় resolved ট্রু করা
          const updatedFaults = fact.activeFaults.map(fl => {
            if (fl.id === faultId) {
              return { ...fl, resolved: true };
            }
            return fl;
          });

          // বিদ্যুৎ অপচয় উল্লেখযোগ্য হারে কমানো (রিয়েল-টাইম এনার্জি রিডাকশন ইফেক্ট প্রদর্শন)
          const reductionAmount = Math.min(fact.totalWaste, 2500); // ২৫০০ কিলোওয়াট ক্ষতিকর অপচয় কমানো হলো
          const updatedWaste = Math.max(0, fact.totalWaste - reductionAmount);

          return {
            ...fact,
            activeFaults: updatedFaults,
            totalWaste: updatedWaste
          };
        }
        return fact;
      })
    );

    const factObj = factories.find(f => f.id === factoryId);
    const faultObj = factObj?.activeFaults.find(fl => fl.id === faultId);

    const newNotification: SystemNotification = {
      id: `notif-${Date.now()}`,
      factoryName: factObj?.name || 'কারখানা',
      message: `ত্রুটি সমাধান করা হয়েছে: "${faultObj?.componentName}" এর সংকেতিক ত্রুটি সফল সংস্কারের মাধ্যমে কারখানার বিদ্যুৎ সাশ্রয় নিশ্চিত করা হয়েছে।`,
      type: 'fund',
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  // ৫. নোটিফিকেশন রিড হিসেবে সেট করা
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => {
        if (notif.id === id) {
          return { ...notif, read: true };
        }
        return notif;
      })
    );
  };

  // ৬. বিজ্ঞপ্তির তালিকা সম্পূর্ণ পরিষ্কার করা
  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const activeFaultsCount = factories.reduce(
    (acc, f) => acc + f.activeFaults.filter(fl => !fl.resolved).length,
    0
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-cyan-500 selection:text-slate-950" id="main-app-container">
      {/* ১. শীর্ষ হেডার ও নোটিফিকেশন বার */}
      <Header
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onClearNotifications={handleClearNotifications}
        factoryCount={factories.length}
      />

      <div className="flex-1 flex flex-col lg:flex-row" id="app-workspace-layout">
        {/* ২. বামপাশের সাইডবার ট্যাবনিয়ন্ত্রণ নেভিগেশন */}
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          faultsCount={activeFaultsCount}
        />

        {/* ৩. মূল ড্যাশবোর্ড স্ক্রিন মনিটর */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto max-h-[calc(100vh-80px)]" id="app-viewport">
          
          {/* দ্রুত সিস্টেম অ্যালার্ট ব্যানার - অ্যাক্টিভ বড় আকারের ভোল্টেজ বা লিকেজ থাকলে ফ্ল্যাশ হবে */}
          {activeFaultsCount > 0 && (
            <div className="bg-rose-500/10 border border-rose-500/35 text-rose-300 p-4 rounded-2xl mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-3 animate-pulse" id="alert-master-marquee">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-5 h-5 text-rose-500 flex-shrink-0" />
                <div className="text-xs">
                  <span className="font-bold block text-rose-400">গুরুত্বপূর্ণ সতর্কবার্তা: বৈদ্যুতিক লিকেজ অবিরত!</span>
                  <span>নেটওয়ার্কভুক্ত কারখানাসমূহে বর্তমানে {activeFaultsCount} টি লাইভ শর্টসার্কিট বা ৩-ফেজ ওভারলোড লিকেজ সনাক্ত করা হয়েছে।</span>
                </div>
              </div>
              <button
                onClick={() => setCurrentTab('faults')}
                className="bg-rose-955 hover:bg-rose-900/60 text-[11px] font-bold text-rose-300 py-1.5 px-3 rounded-lg border border-rose-500/20 shadow cursor-pointer transition-colors"
                id="view-active-alerts-link-btn"
              >
                ত্রুটি ডায়েরি দেখুন
              </button>
            </div>
          )}

          {/* ট্যাব কনটেন্ট সুইচার */}
          <div className="transition-all duration-200">
            {currentTab === 'dashboard' && (
              <DashboardView factories={factories} />
            )}

            {currentTab === 'factories' && (
              <FactoriesView
                factories={factories}
                onRegisterFactory={handleRegisterFactory}
                onReRegisterFactory={handleReRegisterFactory}
              />
            )}

            {currentTab === 'map' && (
              <MapView factories={factories} />
            )}

            {currentTab === 'gps-tracking' && (
              <GpsTrackerView factories={factories} />
            )}

            {currentTab === 'fund-requests' && (
              <FundRequestsView
                factories={factories}
                fundRequests={fundRequests}
                onApplyForFunds={handleApplyForFunds}
              />
            )}

            {currentTab === 'faults' && (
              <FaultsAlertsView
                factories={factories}
                onResolveFault={handleResolveFault}
              />
            )}
          </div>
        </main>
      </div>

      {/* ৪. গ্লোবাল সিস্টেম ফুটনোট */}
      <footer className="bg-slate-900/40 border-t border-slate-900 px-6 py-3 text-center text-[11px] text-slate-500 font-mono flex flex-col sm:flex-row justify-between items-center gap-3" id="app-footer-bar">
        <p>© ২০২৬ কারিগরি ইনস্টিটিউট অব বাংলাদেশ • পরিবেশবান্ধব এনার্জি উদ্যোগ</p>
        <div className="flex items-center gap-4.5">
          <span className="flex items-center gap-1"><Lightbulb className="w-3.5 h-3.5 text-yellow-400" /> এনার্জি সেভিং মোড সক্রিয়</span>
          <span>সার্ভার স্ট্যাটাস: ৯৯.৯% অনলাইন</span>
        </div>
      </footer>
    </div>
  );
}
