/**
 * SMD - Suez Methanol Derivatives Co.
 * Login Component with prominent SMD Logo & Dual Roles
 */

import React, { useState } from 'react';
import { UserSession, UserRole } from '../types';
import { ShieldCheck, LogIn, Lock, Building2, User } from 'lucide-react';

interface LoginProps {
  onLogin: (session: UserSession) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@smd.com.eg');
  const [password, setPassword] = useState('••••••••');
  const [role, setRole] = useState<UserRole>('ADMIN');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'ADMIN') {
      onLogin({
        id: 'USR-001',
        name: 'أ. محمد عبد الرحمن (مدير الموارد البشرية)',
        email: email || 'admin@smd.com.eg',
        role: 'ADMIN'
      });
    } else {
      onLogin({
        id: 'USR-002',
        name: 'أحمد السعيد (مشرف مراقبة - قارئ)',
        email: email || 'viewer@smd.com.eg',
        role: 'VIEWER'
      });
    }
  };

  const handleQuickLogin = (selectedRole: UserRole) => {
    if (selectedRole === 'ADMIN') {
      onLogin({
        id: 'USR-001',
        name: 'أ. محمد عبد الرحمن (مدير الموارد البشرية)',
        email: 'admin@smd.com.eg',
        role: 'ADMIN'
      });
    } else {
      onLogin({
        id: 'USR-002',
        name: 'أحمد السعيد (مشرف مراقبة - قارئ)',
        email: 'viewer@smd.com.eg',
        role: 'VIEWER'
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 selection:bg-blue-600 selection:text-white">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header with prominent SMD Logo */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-6 text-center text-white relative">
          <div className="w-24 h-24 mx-auto mb-3 bg-white p-2 rounded-2xl shadow-lg flex items-center justify-center border-2 border-blue-500/30">
            <img 
              src="/logo.png" 
              alt="شعار شركة السويس لمشتقات الميثانول - SMD" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mb-1">
            شركة السويس لمشتقات الميثانول
          </h1>
          <p className="text-xs text-blue-300 font-medium">
            Suez Methanol Derivatives Co. (SMD)
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-300 rounded-lg text-xs font-semibold border border-blue-500/20">
            <span>الإدارة العامة للموارد البشرية والشؤون الإدارية</span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          <div className="mb-4 text-center">
            <h2 className="text-base font-bold text-slate-800">
              تسجيل الدخول للنظام الداخلي
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              منظومة مراقبة الحضور والانصراف، الورديات، وربط أجهزة ZKTeco
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                البريد الإلكتروني المؤسسي
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-left font-mono"
                  dir="ltr"
                  placeholder="user@smd.com.eg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-left font-mono"
                  dir="ltr"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                مستوى الصلاحية (Role)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { setRole('ADMIN'); setEmail('admin@smd.com.eg'); }}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border flex items-center justify-center gap-1.5 transition-colors ${
                    role === 'ADMIN'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>مسؤول نظام (Admin)</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setRole('VIEWER'); setEmail('viewer@smd.com.eg'); }}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border flex items-center justify-center gap-1.5 transition-colors ${
                    role === 'VIEWER'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>مستخدم قراءة (Viewer)</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>دخول إلى لوحة التحكم</span>
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <p className="text-[11px] text-center text-slate-500 mb-2 font-medium">
              دخول سريع للتجربة والتقييم:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('ADMIN')}
                className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs rounded border border-slate-300 font-medium transition-colors"
              >
                دخول كمسؤول (Admin)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('VIEWER')}
                className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs rounded border border-slate-300 font-medium transition-colors"
              >
                دخول كقارئ (Viewer)
              </button>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-[11px] text-slate-400">
              خادم محلي مؤمن · إصدار الترخيص المؤسسي SMD-v2.6
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
