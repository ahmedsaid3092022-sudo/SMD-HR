/**
 * SMD - Suez Methanol Derivatives Co.
 * Smart Forms Generator (Official Leave, Mission, and Permit Forms)
 * Exports to Microsoft Word (.doc) and Printable A4 PDF format
 */

import React, { useState } from 'react';
import { Employee, LeaveBalance, LeaveType } from '../types';
import { 
  FileText, 
  Printer, 
  Download, 
  User, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  Stamp 
} from 'lucide-react';
import { exportToWordDocument } from '../utils/fileExport';

interface SmartFormsProps {
  employees: Employee[];
  leaveBalances: LeaveBalance[];
  initialEmployeeId?: string;
}

export const SmartForms: React.FC<SmartFormsProps> = ({
  employees,
  leaveBalances,
  initialEmployeeId
}) => {
  const [selectedFormType, setSelectedFormType] = useState<'leave' | 'mission' | 'permit'>('leave');
  const [selectedEmpId, setSelectedEmpId] = useState<string>(initialEmployeeId || employees[0]?.employeeId || '');

  // Dynamic form inputs
  const [leaveType, setLeaveType] = useState<LeaveType>('اعتيادي');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [daysCount, setDaysCount] = useState(4);
  const [reason, setReason] = useState('ظروف عائلية وقضاء إجازة سنوية');
  const [replacementName, setReplacementName] = useState('م. طارق الشناوي (رئيس قسم الصيانة)');

  // Mission specific
  const [missionDest, setMissionDest] = useState('الهيئة المصرية العامة للبترول - القاهرة');
  const [missionPurpose, setMissionPurpose] = useState('حضور اجتماع لجنة المشروعات الاستراتيجية ومراجعة عقود التوريد');
  const [missionDays, setMissionDays] = useState(2);
  const [hasAllowance, setHasAllowance] = useState(true);

  // Permit specific
  const [permitReason, setPermitReason] = useState('إنهاء معاملة شخصية طارئة بالشهر العقاري');
  const [permitTime, setPermitTime] = useState('من الساعة 11:00 صباحاً إلى 01:00 ظهراً');

  const employee = employees.find(e => e.employeeId === selectedEmpId) || employees[0];
  const balance = leaveBalances.find(b => b.employeeId === employee?.employeeId);

  const remAnnual = balance ? Math.max(0, balance.annualOpening - balance.annualUsed) : 0;
  const remCasual = balance ? Math.max(0, balance.casualOpening - balance.casualUsed) : 0;
  const remSick = balance ? Math.max(0, balance.sickOpening - balance.sickUsed) : 0;

  const handlePrint = () => {
    window.print();
  };

  const handleExportWord = () => {
    const printArea = document.getElementById('printable-official-form');
    if (!printArea) return;
    const formTitle = selectedFormType === 'leave' ? 'طلب_إجازة' : selectedFormType === 'mission' ? 'أمر_مأمورية' : 'إذن_خروج';
    exportToWordDocument(
      `${formTitle}_${employee?.employeeId}_SMD`,
      printArea.innerHTML,
      `${formTitle}_${employee?.employeeId}`
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Top Controls Banner (Hidden in Print) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs no-print flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            النماذج الرسمية الذكية (Smart Forms Generator)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            توليد النماذج الحكومية والبترولية الرسمية معبأة آلياً ببيانات الموظف وأرصدته مع إمكانية الطباعة A4 أو التصدير إلى Word
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportWord}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>تصدير إلى Word (.doc)</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة النموذج (A4 PDF)</span>
          </button>
        </div>
      </div>

      {/* Form Customization Strip (No-print) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs no-print space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              نوع النموذج الرسمي
            </label>
            <select
              value={selectedFormType}
              onChange={(e) => setSelectedFormType(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-blue-700"
            >
              <option value="leave">نموذج طلب إجازة رسمي (Form HR-01)</option>
              <option value="mission">أمر تكليف بمأمورية عمل (Form HR-02)</option>
              <option value="permit">إذن تصريح مغادرة / عودة (Form HR-03)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              اختر الموظف (المعبأ تلقائياً)
            </label>
            <select
              value={selectedEmpId}
              onChange={(e) => setSelectedEmpId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            >
              {employees.map(e => (
                <option key={e.employeeId} value={e.employeeId}>
                  {e.employeeId} - {e.name} ({e.department})
                </option>
              ))}
            </select>
          </div>

          {selectedFormType === 'leave' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                نوع الإجازة المطلوبة
              </label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              >
                <option value="اعتيادي">إجازة اعتيادية</option>
                <option value="عارضة">إجازة عارضة</option>
                <option value="مرضي">إجازة مرضية</option>
                <option value="حج وزيارة القدس">إجازة حج / عمرة</option>
                <option value="بدون مرتب">إجازة بدون مرتب</option>
              </select>
            </div>
          )}

        </div>
      </div>

      {/* OFFICIAL PRINTABLE A4 FORM PREVIEW */}
      <div 
        id="printable-official-form" 
        className="bg-white p-8 sm:p-12 rounded-2xl border-2 border-slate-300 shadow-xl max-w-4xl mx-auto text-slate-900 text-sm leading-relaxed"
      >
        
        {/* SMD Corporate Header with Logo */}
        <div className="flex items-center justify-between border-b-2 border-blue-900 pb-5 mb-6">
          <div className="text-right">
            <h1 className="text-lg font-black text-slate-900 tracking-tight">
              شركة السويس لمشتقات الميثانول (ش.م.م)
            </h1>
            <p className="text-xs text-blue-900 font-bold">
              Suez Methanol Derivatives Co. (SMD)
            </p>
            <p className="text-xs text-slate-600 mt-1">
              الإدارة العامة للموارد البشرية والشؤون الإدارية
            </p>
            <p className="text-[10px] text-slate-400 font-mono">
              سجل تجاري 14890 - السويس - جمهورية مصر العربية
            </p>
          </div>

          <div className="w-20 h-20 p-1 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-xs">
            <img 
              src="/logo.png" 
              alt="SMD Logo" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="text-left font-mono text-xs text-slate-500">
            <div>الكود النموذجي: SMD-HR-2026</div>
            <div>التاريخ: {new Date().toISOString().split('T')[0]}</div>
            <div>الرقم المسلسل: {employee?.serial || 1}</div>
          </div>
        </div>

        {/* Form Title Banner */}
        <div className="bg-slate-100 border border-slate-300 p-2.5 text-center font-bold text-base text-blue-950 mb-6 rounded">
          {selectedFormType === 'leave' && `طلب إجازة ${leaveType} (نموذج رقم 1)`}
          {selectedFormType === 'mission' && 'أمر تكليف رسمي بمأمورية عمل خارجي (نموذج رقم 2)'}
          {selectedFormType === 'permit' && 'إذن وتصريح خروج مؤقت لمهمة عمل / شخصي (نموذج رقم 3)'}
        </div>

        {/* Employee Data Matrix */}
        <div className="border border-slate-300 rounded mb-6 overflow-hidden">
          <div className="bg-slate-100 px-4 py-2 font-bold text-xs border-b border-slate-300 text-slate-800">
            أولاً: بيانات الموظف الأساسية (تعبئة النظام الآلية)
          </div>
          <table className="w-full text-right text-xs">
            <tbody>
              <tr className="border-b border-slate-200">
                <th className="py-2.5 px-4 bg-slate-50 w-32 font-bold">اسم الموظف:</th>
                <td className="py-2.5 px-4 font-bold text-slate-900">{employee?.name}</td>
                <th className="py-2.5 px-4 bg-slate-50 w-32 font-bold">كود الموظف (PIN):</th>
                <td className="py-2.5 px-4 font-mono font-bold text-blue-800">{employee?.employeeId}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <th className="py-2.5 px-4 bg-slate-50 font-bold">المسمى الوظيفي:</th>
                <td className="py-2.5 px-4 text-slate-800">{employee?.currentTitle}</td>
                <th className="py-2.5 px-4 bg-slate-50 font-bold">المسمى المكلف به:</th>
                <td className="py-2.5 px-4 text-slate-800">{employee?.assignedTitle || '—'}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <th className="py-2.5 px-4 bg-slate-50 font-bold">الإدارة / القطاع:</th>
                <td className="py-2.5 px-4 font-semibold text-slate-800">{employee?.department}</td>
                <th className="py-2.5 px-4 bg-slate-50 font-bold">الدرجة الوظيفية:</th>
                <td className="py-2.5 px-4 text-slate-800">{employee?.grade} ({employee?.contractType})</td>
              </tr>
              <tr>
                <th className="py-2.5 px-4 bg-slate-50 font-bold">الرقم القومي:</th>
                <td className="py-2.5 px-4 font-mono text-slate-800">{employee?.nationalId}</td>
                <th className="py-2.5 px-4 bg-slate-50 font-bold">الرقم التأميني:</th>
                <td className="py-2.5 px-4 font-mono text-slate-800">{employee?.insuranceId}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SPECIFIC CONTENT BY FORM TYPE */}

        {/* 1. LEAVE FORM DETAILS */}
        {selectedFormType === 'leave' && (
          <div className="space-y-6">
            <div className="border border-slate-300 rounded overflow-hidden">
              <div className="bg-slate-100 px-4 py-2 font-bold text-xs border-b border-slate-300 text-slate-800">
                ثانياً: تفاصيل الإجازة المطلوبة وموقف الأرصدة
              </div>
              <div className="p-4 space-y-3 text-xs">
                <p>
                  أرجو التكرم بالموافقة على منحي إجازة <strong>({leaveType})</strong> لمدة <strong>({daysCount}) أيام</strong> تبدأ من تاريخ <strong>({startDate})</strong> وحتى تاريخ <strong>({new Date(new Date(startDate).getTime() + (daysCount - 1) * 86400000).toISOString().split('T')[0]})</strong>، وذلك نظراً لـ: <u>{reason}</u>.
                </p>

                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 border border-slate-200 rounded text-center">
                  <div>
                    <span className="text-[11px] text-slate-500 block">رصيد اعتيادي متبقي</span>
                    <strong className="font-mono text-blue-800 text-sm">{remAnnual} يوم</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">رصيد عارضة متبقي</span>
                    <strong className="font-mono text-emerald-800 text-sm">{remCasual} يوم</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">رصيد مرضي (دورة 3 سنوات)</span>
                    <strong className="font-mono text-rose-800 text-sm">{remSick} يوم</strong>
                  </div>
                </div>

                <div className="pt-2">
                  <span>الموظف القائم بالعمل البديل وتسليم المهام: </span>
                  <strong className="text-slate-900 underline">{replacementName}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. MISSION FORM DETAILS */}
        {selectedFormType === 'mission' && (
          <div className="space-y-6">
            <div className="border border-slate-300 rounded overflow-hidden">
              <div className="bg-slate-100 px-4 py-2 font-bold text-xs border-b border-slate-300 text-slate-800">
                ثانياً: تفاصيل التكليف بمأمورية العمل
              </div>
              <div className="p-4 space-y-3 text-xs">
                <p>
                  بناءً على مقتضيات صالح العمل بشركة السويس لمشتقات الميثانول، يكلف المذكور أعلاه بالقيام بمأمورية عمل رسمي إلى: <strong>({missionDest})</strong> وذلك لمدة <strong>({missionDays}) أيام</strong> تبدأ من تاريخ <strong>({startDate})</strong>.
                </p>
                <p>
                  <strong>الغرض من المأمورية:</strong> {missionPurpose}
                </p>
                <div className="p-3 bg-amber-50/60 border border-amber-200 rounded">
                  <span>المعاملة المالية وبدلات الانتقال: </span>
                  <strong className="text-amber-900">
                    {hasAllowance ? 'مأمورية معتمدة ببدل سفر وانتقال كامل طبقاً للائحة شركة SMD' : 'مأمورية بدون بدل مالي مع توفير سيارة الشركة'}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. PERMIT FORM DETAILS */}
        {selectedFormType === 'permit' && (
          <div className="space-y-6">
            <div className="border border-slate-300 rounded overflow-hidden">
              <div className="bg-slate-100 px-4 py-2 font-bold text-xs border-b border-slate-300 text-slate-800">
                ثانياً: تصريح الخروج المؤقت
              </div>
              <div className="p-4 space-y-3 text-xs">
                <p>
                  يصرح للموظف الموضح بياناته بعاليه بالمغادرة والعودة خلال مواعيد العمل الرسمية <strong>({permitTime})</strong> بتاريخ اليوم <strong>({startDate})</strong>.
                </p>
                <p>
                  <strong>السبب والجهة:</strong> {permitReason}
                </p>
                <p className="text-slate-500 text-[11px]">
                  تنبيه: لا يجوز أن تزيد مدة الإذن الشخصي عن ساعتين خلال الوردية طبقاً لتعليمات إدارة الأمن والسلامة ومكتب العمل.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Signatures & Official Approvals Footer */}
        <div className="mt-12 pt-6 border-t-2 border-slate-300 grid grid-cols-4 gap-4 text-center text-xs">
          <div>
            <span className="font-bold text-slate-700 block mb-8">توقيع الموظف</span>
            <span className="border-b border-dashed border-slate-400 block pb-1 font-mono text-[10px] text-slate-400">
              ..............................
            </span>
          </div>
          <div>
            <span className="font-bold text-slate-700 block mb-8">الرئيس المباشر</span>
            <span className="border-b border-dashed border-slate-400 block pb-1 font-mono text-[10px] text-slate-400">
              ..............................
            </span>
          </div>
          <div>
            <span className="font-bold text-slate-700 block mb-8">مدير الموارد البشرية</span>
            <span className="border-b border-dashed border-slate-400 block pb-1 font-bold text-slate-800">
              أ. محمد عبد الرحمن
            </span>
          </div>
          <div>
            <span className="font-bold text-slate-700 block mb-8">اعتماد الإدارة العليا</span>
            <span className="border-b border-dashed border-slate-400 block pb-1 font-mono text-[10px] text-slate-400">
              خاتم شعار الشركة SMD
            </span>
          </div>
        </div>

        {/* Bottom Small Stamp Note */}
        <div className="mt-8 text-center text-[10px] text-slate-400 flex items-center justify-center gap-2">
          <Stamp className="w-3.5 h-3.5 text-blue-600" />
          <span>مستخرج آلياً من منظومة إدارة الموارد البشرية - شركة السويس لمشتقات الميثانول SMD</span>
        </div>

      </div>

    </div>
  );
};
