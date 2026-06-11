/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Factory, FundRequest, SystemNotification } from './types';

// ডেমো কারখানার তালিকা
export const INITIAL_FACTORIES: Factory[] = [
  {
    id: 'fact-1',
    name: 'সুরমা ভ্যালী চা ফ্যাক্টরি',
    type: 'tea',
    location: 'শ্রীমঙ্গল, মৌলভীবাজার',
    latitude: 55, // কাস্টম গ্রিড ম্যাপের জন্য রিলেটিভ শতকরা কোঅর্ডিনেট
    longitude: 65,
    contactNumber: '01711223344',
    registeredAt: '2025-06-01',
    reRegistrationDueDate: '2026-06-15', // খুব শীঘ্রই পুনঃ-নিবন্ধন প্রয়োজন
    totalUsage: 45000,
    totalWaste: 8500,
    departmentUsage: {
      'পাতা প্রক্রিয়াকরণ (Withering)': 15000,
      'গাঁজন ও শুকানো (Fermentation & Drying)': 18000,
      'বাছাই ও প্যাকেজিং (Sorting & Packing)': 8000,
      'অফিস ও স্টোরেজ': 4000
    },
    machines: [
      {
        id: 'mach-1-1',
        name: 'চা পাতা কাটিং মেশিন-১',
        department: 'পাতা প্রক্রিয়াকরণ (Withering)',
        currentUsage: 120, // kW
        wastedPower: 15, // kW
        gpsLatitude: 55.2,
        gpsLongitude: 65.1,
        status: 'running'
      },
      {
        id: 'mach-1-2',
        name: 'অটোমেটিক ড্রায়ার ও হিটার',
        department: 'গাঁজন ও শুকানো (Fermentation & Drying)',
        currentUsage: 250,
        wastedPower: 38,
        gpsLatitude: 55.5,
        gpsLongitude: 65.3,
        status: 'faulty' // বৈদ্যুতিক ত্রুটি রয়েছে
      },
      {
        id: 'mach-1-3',
        name: 'প্যাকেজিং সর্টার ইউনিট',
        department: 'বাছাই ও প্যাকেজিং (Sorting & Packing)',
        currentUsage: 80,
        wastedPower: 4,
        gpsLatitude: 54.9,
        gpsLongitude: 64.9,
        status: 'idle'
      }
    ],
    activeFaults: [
      {
        id: 'fault-1-1',
        componentName: 'ড্রায়ার অ্যান্ড হিটার কয়েল',
        type: 'leakage',
        severity: 'high',
        description: 'হিটিং কয়েলে ৩.৫ অ্যাম্পিয়ার কারেন্ট লিকেজ সনাক্ত করা হয়েছে। অবিলম্বে কয়েল মেরামত বা পরিবর্তন করা প্রয়োজন।',
        reportedAt: '2026-06-10 12:30',
        resolved: false
      }
    ]
  },
  {
    id: 'fact-2',
    name: 'মধুমতি টেক্সটাইল ও স্পিনিং মিলস',
    type: 'textile',
    location: 'সাভার, ঢাকা',
    latitude: 35,
    longitude: 45,
    contactNumber: '01811223355',
    registeredAt: '2024-05-10',
    reRegistrationDueDate: '2025-05-10', // ইতিমধ্যে শেষ হয়ে গেছে (পুনঃ-নিবন্ধন আবশ্যক)
    totalUsage: 68000,
    totalWaste: 14200,
    departmentUsage: {
      'স্পিনিং বিভাগ (Spinning)': 28000,
      'উইভিং বিভাগ (Weaving)': 22000,
      'ডায়িং ও ফিনিশিং (Dyeing)': 15000,
      'অফিস ও ইউটিলিটি': 3000
    },
    machines: [
      {
        id: 'mach-2-1',
        name: 'স্পিনিং লুম রটার-১',
        department: 'স্পিনিং বিভাগ (Spinning)',
        currentUsage: 310,
        wastedPower: 45,
        gpsLatitude: 35.1,
        gpsLongitude: 45.2,
        status: 'running'
      },
      {
        id: 'mach-2-2',
        name: 'ডায়িং বয়লার মোটর',
        department: 'ডায়িং ও ফিনিশিং (Dyeing)',
        currentUsage: 180,
        wastedPower: 22,
        gpsLatitude: 35.4,
        gpsLongitude: 44.8,
        status: 'running'
      }
    ],
    activeFaults: [
      {
        id: 'fault-2-1',
        componentName: 'স্পিনিং রটার কন্ট্রোল প্যানেল',
        type: 'fault',
        severity: 'medium',
        description: 'ভোল্টেজ ফ্ল্যাকচুয়েশনের কারণে কন্ট্রোল প্যানেলের ট্রিপ সুইচ বারংবার অটো শাটডাউন দিচ্ছে।',
        reportedAt: '2026-06-10 14:15',
        resolved: false
      }
    ]
  },
  {
    id: 'fact-3',
    name: 'কক্সবাজার ব্লু টি এস্টেট',
    type: 'tea',
    location: 'বান্দরবান পার্বত্য অঞ্চল',
    latitude: 75,
    longitude: 75,
    contactNumber: '01511223366',
    registeredAt: '2025-08-15',
    reRegistrationDueDate: '2026-08-15', // আগামী ২ মাস পর
    totalUsage: 31000,
    totalWaste: 4200,
    departmentUsage: {
      'পাতা প্রক্রিয়াকরণ (Withering)': 11000,
      'গাঁজন ও শুকানো (Fermentation & Drying)': 12000,
      'বাছাই ও প্যাকেজিং (Sorting & Packing)': 5000,
      'অফিস ও অন্যান্য': 3000
    },
    machines: [
      {
        id: 'mach-3-1',
        name: 'ড্রায়ার রোলার ইউনিট-বি',
        department: 'গাঁজন ও শুকানো (Fermentation & Drying)',
        currentUsage: 140,
        wastedPower: 12,
        gpsLatitude: 75.2,
        gpsLongitude: 75.3,
        status: 'running'
      }
    ],
    activeFaults: []
  },
  {
    id: 'fact-4',
    name: 'জনতা জুট মিলস লিমিটেড',
    type: 'jute',
    location: 'আশুগঞ্জ, ব্রাহ্মণবাড়িয়া',
    latitude: 45,
    longitude: 55,
    contactNumber: '01911223377',
    registeredAt: '2025-01-20',
    reRegistrationDueDate: '2026-01-20', // অতিবাহিত হয়েছে (পুনঃ-নিবন্ধন আবশ্যক)
    totalUsage: 59000,
    totalWaste: 11800,
    departmentUsage: {
      'সূতা প্রস্তুতি (Spinning)': 21000,
      'টুইস্টিং ও উইভিং (Weaving)': 25000,
      'ফিনিশিং ও প্রেসিং': 9000,
      'ইউটিলিটি ও পাম্প': 4000
    },
    machines: [
      {
        id: 'mach-4-1',
        name: 'জুট কার্ডিং মেশিন ৩',
        department: 'সূতা প্রস্তুতি (Spinning)',
        currentUsage: 220,
        wastedPower: 35,
        gpsLatitude: 45.1,
        gpsLongitude: 55.4,
        status: 'faulty'
      }
    ],
    activeFaults: [
      {
        id: 'fault-4-1',
        componentName: 'কার্ডিং মেশিন ৩ ফেজ ক্যাবল',
        type: 'leakage',
        severity: 'high',
        description: 'প্রধান আর্মার্ড ক্যাবলের ইন্সুলেশন ক্ষয় হয়ে ফেজ-টু-গ্রাউন্ড লিকেজ কারেন্ট প্রবাহিত হচ্ছে। স্পর্শ করা বিপদজনক!',
        reportedAt: '2026-06-10T15:00:00Z',
        resolved: false
      }
    ]
  },
  {
    id: 'fact-5',
    name: 'স্মার্ট চা ম্যানুফ্যাকচারিং প্ল্যান্ট',
    type: 'tea',
    location: 'শ্রীমঙ্গল, সিলেট',
    latitude: 52,
    longitude: 67,
    contactNumber: '01712222222',
    registeredAt: '2025-11-12',
    reRegistrationDueDate: '2026-11-12', // পুনঃ-নিবন্ধন ডেট নিরাপদ
    totalUsage: 38000,
    totalWaste: 5300,
    departmentUsage: {
      'পাতা প্রক্রিয়াকরণ (Withering)': 12000,
      'গাঁজন ও শুকানো (Fermentation & Drying)': 16000,
      'বাছাই ও প্যাকেজিং (Sorting & Packing)': 8000,
      'অফিস ও সাধারণ কার পার্ক': 2000
    },
    machines: [
      {
        id: 'mach-5-1',
        name: 'রোটারি ভিটার ২',
        department: 'পাতা প্রক্রিয়াকরণ (Withering)',
        currentUsage: 95,
        wastedPower: 8,
        gpsLatitude: 52.1,
        gpsLongitude: 67.2,
        status: 'running'
      },
      {
        id: 'mach-5-2',
        name: 'অটো সুইফটার চা সর্টার',
        department: 'বাছাই ও প্যাকেজিং (Sorting & Packing)',
        currentUsage: 65,
        wastedPower: 14, // উচ্চ অপচয়কারী অ্যাপ্লায়েন্স
        gpsLatitude: 51.8,
        gpsLongitude: 66.9,
        status: 'running'
      }
    ],
    activeFaults: []
  }
];

// প্রাথমিক তহবিলের আবেদন
export const INITIAL_FUND_REQUESTS: FundRequest[] = [
  {
    id: 'fund-1',
    factoryId: 'fact-1',
    factoryName: 'সুরমা ভ্যালী চা ফ্যাক্টরি',
    sector: 'বৈদ্যুতিক নিরাপত্তা ও কয়েল উন্নয়ন',
    amount: 150000,
    purpose: 'উচ্চক্ষমতাসম্পন্ন ড্রায়ার মেশিনের হিটিং কয়েল প্রতিস্থাপন এবং ফেজ-টু-গ্রান্ড লিকেজ মেরামতের জন্য অর্থায়ন প্রয়োজন।',
    status: 'pending',
    requestedAt: '2026-06-10 13:00'
  },
  {
    id: 'fund-2',
    factoryId: 'fact-4',
    factoryName: 'জনতা জুট মিলস লিমিটেড',
    sector: 'ক্যাবল পুনর্বাসন প্রকল্প',
    amount: 85000,
    purpose: 'ক্ষতিগ্রস্ত ৩-ফেজ আর্মার্ড পাওয়ার ক্যাবলের প্রতিস্থাপন ও ফেজ লিকেজ ডিটেক্টর অ্যালার্ম মডিউল ইন্সটলেশন।',
    status: 'approved',
    requestedAt: '2026-06-08 10:20'
  }
];

// প্রাথমিক ক্রন-নোটিফিকেশন
export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    factoryName: 'সুরমা ভ্যালী চা ফ্যাক্টরি',
    message: 'ত্রুটি সনাক্তকরণ: ড্রায়ার অ্যান্ড হিটার কয়েলে ৩.৫ অ্যাম্পিয়ার বিদ্যুৎ লিকেজ পাওয়া গেছে!',
    type: 'leakage',
    timestamp: '2026-06-10T12:30:00Z',
    read: false
  },
  {
    id: 'notif-2',
    factoryName: 'জনতা জুট মিলস লিমিটেড',
    message: 'জরুরী সতর্কতা: কার্ডিং মেশিন ৩ ফেজ ক্যাবলে বিপদজনক গ্রাউন্ড লিকেজ!',
    type: 'fault',
    timestamp: '2026-06-10T15:00:00Z',
    read: false
  },
  {
    id: 'notif-3',
    factoryName: 'সুরমা ভ্যালী চা ফ্যাক্টরি',
    message: 'পুনঃ-নিবন্ধন অনুস্মারক: আপনার নিবন্ধনের মেয়াদ আগামী ১৫ই জুন ২০২৬ তারিখে শেষ হবে!',
    type: 'reregister',
    timestamp: '2026-06-10T15:20:00Z',
    read: false
  }
];
