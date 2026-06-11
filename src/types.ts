/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Fault {
  id: string;
  componentName: string; // যন্ত্রাংশের নাম
  type: 'leakage' | 'fault' | 'overload'; // ধরণ
  severity: 'low' | 'medium' | 'high'; // তীব্রতা
  description: string; // বিবরণ
  reportedAt: string; // রিপোর্ট করার সময়
  resolved: boolean; // সমাধান করা হয়েছে কিনা
}

export interface Machine {
  id: string;
  name: string; // মেশিনের নাম
  department: string; // বিভাগ
  currentUsage: number; // বর্তমান বিদ্যুৎ ব্যবহার (kW)
  wastedPower: number; // অপচয়কৃত বিদ্যুৎ (kW)
  gpsLatitude: number; // জিপিএস অক্ষাংশ
  gpsLongitude: number; // জিপিএস দ্রাঘিমাংশ
  status: 'running' | 'idle' | 'faulty'; // অবস্থা
}

export interface Factory {
  id: string;
  name: string; // কারখানার নাম
  type: 'tea' | 'textile' | 'jute' | 'food_processing' | 'other'; // ধরণ (বিশেষ করে চা কারখানা)
  location: string; // স্থান (যেমন: সিলেট, শ্রীমঙ্গল, মৌলভীবাজার, চট্টগ্রাম)
  latitude: number; // মানচিত্রের জন্য পজিশন
  longitude: number;
  contactNumber: string; // যোগাযোগ নম্বর
  registeredAt: string; // নিবন্ধনের তারিখ
  reRegistrationDueDate: string; // পুনঃ-নিবন্ধনের শেষ তারিখ
  totalUsage: number; // মোট বিদ্যুৎ ব্যবহার (kWh)
  totalWaste: number; // মোট অপচয় (kWh)
  departmentUsage: { [key: string]: number }; // বিভাগ অনুযায়ী ব্যবহার (kWh)
  machines: Machine[]; // মেশিনের তালিকা
  activeFaults: Fault[]; // অ্যাক্টিভ বৈদ্যুতিক ত্রুটির তালিকা
}

export interface FundRequest {
  id: string;
  factoryId: string;
  factoryName: string;
  sector: string; // কোন খাতে প্রয়োজন
  amount: number; // কত টাকা/তহবিল প্রয়োজন
  purpose: string; // প্রয়োজনীয়তার বিবরণ
  status: 'pending' | 'approved' | 'rejected'; // অবস্থা
  requestedAt: string; // আবেদনের সময়
}

export interface SystemNotification {
  id: string;
  factoryName: string;
  message: string;
  type: 'fault' | 'leakage' | 'reregister'| 'fund';
  timestamp: string;
  read: boolean;
}
