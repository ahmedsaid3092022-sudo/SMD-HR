/**
 * SMD - Suez Methanol Derivatives Co.
 * Top Navigation Bar adhering to Universal Design Top Bar Contract
 */

import React from 'react';
import { UserSession } from '../types';
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  Calculator, 
  Calendar, 
  Briefcase, 
  Cpu, 
  BarChart3, 
  FileText, 
  Database, 
  Lock, 
  LogOut,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';

export type ActiveTab = 
  | 'dashboard'
  | 'employees'
  | 'attendance'
  | 'overtime'
  | 'leaves'
  | 'permits'
  | 'zkteco'
  | 'reports'
  | 'forms'
  | 'architecture'
  | 'licensing';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  user: UserSession;
  onLogout: () => void;
  onLockNow: () => void;
  isTimeLocked: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  user,
  onLogout,
  onLockNow,
  isTimeLocked
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'employees', label: 'العاملين', icon: Users },
    { id: 'attendance', label: 'الحضور والورديات', icon: Clock },
    { id: 'overtime', label: 'حاسبة الإضافي (6م)', icon: Calculator },
    { id: 'leaves', label: 'الإجازات والأرصدة', icon: Calendar },
    { id: 'permits', label: 'الأذونات والمأموريات', icon: Briefcase },
    { id: 'zkteco', label: 'أجهزة ZKTeco', icon: Cpu },
    { id: 'reports', label: 'التحليل القطاعي', icon: BarChart3 },
    { id: 'forms', label: 'النماذج الذكية', icon: FileText },
    { id: 'architecture', label: 'المعمارية و SQL', icon: Database },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Primary Top Bar Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          
          {/* Zone 1: Brand Zone */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-lg p-1 bg-white border border-slate-200 shadow-xs flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="SMD Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="leading-tight">
              <span className="text-base font-extrabold text-slate-900 tracking-tight whitespace-nowrap">
                SMD الموارد البشرية
              </span>
              <span className="block text-[11px] text-blue-700 font-semibold whitespace-nowrap">
                شركة السويس لمشتقات الميثانول
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (Single-line, unboxed, subtle hover states) */}
          <nav className="hidden xl:flex items-center gap-5 text-xs font-semibold text-slate-600 overflow-x-auto py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? 'text-blue-700 font-bold bg-blue-50 border-b-2 border-blue-600'
                      : 'hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Session Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Role indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700 text-xs font-medium border border-slate-200">
              {user.role === 'ADMIN' ? (
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              ) : (
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              )}
              <span className="whitespace-nowrap font-mono">{user.role === 'ADMIN' ? 'مسؤول (Admin)' : 'قارئ (Viewer)'}</span>
            </div>

            {/* Quick Licensing / Time-Lock trigger for Admin */}
            {user.role === 'ADMIN' && (
              <button
                onClick={() => onTabChange('licensing')}
                title="إدارة ترخيص وقفل النظام (Time-Lock)"
                className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}

            {/* Logout */}
            <button
              onClick={onLogout}
              title="تسجيل الخروج"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-300 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline whitespace-nowrap">خروج</span>
            </button>
          </div>

        </div>
      </div>

      {/* Sub-bar for medium / smaller screens so tabs are never clipped */}
      <div className="xl:hidden border-t border-slate-200 bg-slate-50 px-4 py-2 overflow-x-auto flex items-center gap-2 text-xs">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-1.5 py-1 px-2.5 rounded-md whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
