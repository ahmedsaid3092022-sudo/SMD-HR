/**
 * SMD - Suez Methanol Derivatives Co.
 * Permits & Missions Management (Personal/Work Permits & Missions with Allowance)
 */

import React, { useState } from 'react';
import { 
  PermitRecord, 
  MissionRecord, 
  Employee, 
  PermitType, 
  MissionType, 
  UserSession 
} from '../types';
import { 
  Briefcase, 
  Clock, 
  Plus, 
  Search, 
  CheckCircle2, 
  MapPin, 
  Car, 
  DollarSign 
} from 'lucide-react';

interface PermitsAndMissionsProps {
  permits: PermitRecord[];
  missions: MissionRecord[];
  employees: Employee[];
  user: UserSession;
  onAddPermit: (permit: Omit<PermitRecord, 'id'>) => void;
  onAddMission: (mission: Omit<MissionRecord, 'id'>) => void;
  onSelectEmployee: (employeeId: string) => void;
}

export const PermitsAndMissions: React.FC<PermitsAndMissionsProps> = ({
  permits,
  missions,
  employees,
  user,
  onAddPermit,
  onAddMission,
  onSelectEmployee
}) => {
  const [activeTab, setActiveTab] = useState<'permits' | 'missions'>('permits');
  const [showAddPermitModal, setShowAddPermitModal] = useState(false);
  const [showAddMissionModal, setShowAddMissionModal] = useState(false);

  // Permit Form State
  const [pEmpId, setPEmpId] = useState(employees[0]?.employeeId || '');
  const [pType, setPType] = useState<PermitType>('إذن شخصي');
  const [pDate, setPDate] = useState(new Date().toISOString().split('T')[0]);
  const [pStart, setPStart] = useState('11:00');
  const [pEnd, setPEnd] = useState('13:00');
  const [pDuration, setPDuration] = useState(2);
  const [pReason, setPReason] = useState('');

  // Mission Form State
  const [mEmpId, setMEmpId] = useState(employees[0]?.employeeId || '');
  const [mType, setMType] = useState<MissionType>('مأمورية ببدل');
  const [mDestination, setMDestination] = useState('');
  const [mPurpose, setMPurpose] = useState('');
  const [mStart, setMStart] = useState(new Date().toISOString().split('T')[0]);
  const [mEnd, setMEnd] = useState(new Date().toISOString().split('T')[0]);
  const [mDays, setMDays] = useState(2);
  const [mAllowancePerDay, setMAllowancePerDay] = useState(450);
  const [mTransport, setMTransport] = useState<'سيارة الشركة' | 'قطار / حافلة' | 'طيران' | 'خاصة ببدل انتقال'>('سيارة الشركة');

  const empMap = new Map(employees.map(e => [e.employeeId, e]));

  const handlePermitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPermit({
      employeeId: pEmpId,
      permitType: pType,
      date: pDate,
      startTime: pStart,
      endTime: pEnd,
      durationHours: Number(pDuration),
      reason: pReason,
      status: 'معتمد',
      approvedBy: user.name
    });
    setShowAddPermitModal(false);
    setPReason('');
  };

  const handleMissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = mType === 'مأمورية ببدل' ? mDays * mAllowancePerDay : 0;
    onAddMission({
      employeeId: mEmpId,
      missionType: mType,
      destination: mDestination,
      purpose: mPurpose,
      startDate: mStart,
      endDate: mEnd,
      daysCount: Number(mDays),
      allowancePerDay: mType === 'مأمورية ببدل' ? mAllowancePerDay : 0,
      totalAllowance: total,
      transportationType: mTransport,
      status: 'معتمد',
      approvedBy: user.name
    });
    setShowAddMissionModal(false);
    setMDestination('');
    setMPurpose('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            إدارة الأذونات والمأموريات الرسمية
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            تصاريح الخروج المؤقت (إذن شخصي / إذن عمل) والمأموريات الخارجية (ببدل / بدون بدل / داخلية)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {user.role === 'ADMIN' && (
            <>
              <button
                onClick={() => setShowAddPermitModal(true)}
                className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>إصدار تصريح / إذن</span>
              </button>
              <button
                onClick={() => setShowAddMissionModal(true)}
                className="px-3.5 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>إصدار أمر مأمورية</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('permits')}
          className={`py-2 px-4 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'permits'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>سجل الأذونات والتصاريح ({permits.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('missions')}
          className={`py-2 px-4 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'missions'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>سجل المأموريات وبدلات السفر ({missions.length})</span>
        </button>
      </div>

      {/* PERMITS TAB */}
      {activeTab === 'permits' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">رقم الإذن</th>
                  <th className="py-3 px-3">كود الموظف</th>
                  <th className="py-3 px-4">اسم الموظف والإدارة</th>
                  <th className="py-3 px-3">نوع الإذن</th>
                  <th className="py-3 px-3 font-mono">التاريخ</th>
                  <th className="py-3 px-3 font-mono">الفترة (من - إلى)</th>
                  <th className="py-3 px-3 font-mono">المدة بالساعات</th>
                  <th className="py-3 px-4">السبب</th>
                  <th className="py-3 px-3">المعتمد</th>
                  <th className="py-3 px-3">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {permits.map(p => {
                  const emp = empMap.get(p.employeeId);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-700">{p.id}</td>
                      <td className="py-3 px-3 font-mono text-blue-700 font-bold">{p.employeeId}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => onSelectEmployee(p.employeeId)}
                          className="font-bold text-slate-900 hover:text-blue-700 cursor-pointer text-right block"
                        >
                          {emp?.name}
                        </button>
                        <span className="text-[10px] text-slate-500 block">{emp?.department}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          p.permitType === 'إذن شخصي' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {p.permitType}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-700">{p.date}</td>
                      <td className="py-3 px-3 font-mono text-slate-700">{p.startTime} - {p.endTime}</td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">{p.durationHours} س</td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{p.reason}</td>
                      <td className="py-3 px-3 text-slate-700">{p.approvedBy || 'معتمد'}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[11px]">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MISSIONS TAB */}
      {activeTab === 'missions' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">رقم التكليف</th>
                  <th className="py-3 px-3">كود</th>
                  <th className="py-3 px-4">اسم الموظف والإدارة</th>
                  <th className="py-3 px-3">نوع المأمورية</th>
                  <th className="py-3 px-4">الجهة والهدف</th>
                  <th className="py-3 px-3">الفترة والمدة</th>
                  <th className="py-3 px-3 font-mono">البدل المالي المستحق</th>
                  <th className="py-3 px-3">وسيلة الانتقال</th>
                  <th className="py-3 px-3">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {missions.map(m => {
                  const emp = empMap.get(m.employeeId);
                  return (
                    <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-700">{m.id}</td>
                      <td className="py-3 px-3 font-mono text-blue-700 font-bold">{m.employeeId}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => onSelectEmployee(m.employeeId)}
                          className="font-bold text-slate-900 hover:text-blue-700 cursor-pointer text-right block"
                        >
                          {emp?.name}
                        </button>
                        <span className="text-[10px] text-slate-500 block">{emp?.department}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          m.missionType === 'مأمورية ببدل'
                            ? 'bg-amber-100 text-amber-900'
                            : m.missionType === 'مأمورية داخلية'
                            ? 'bg-slate-100 text-slate-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {m.missionType}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{m.destination}</div>
                        <div className="text-[10px] text-slate-500">{m.purpose}</div>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-700">
                        <div>{m.startDate} إلى {m.endDate}</div>
                        <span className="font-bold text-slate-900">({m.daysCount} أيام)</span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-700">
                        {m.totalAllowance ? `${m.totalAllowance} ج.م` : 'بدون بدل مالي'}
                      </td>
                      <td className="py-3 px-3 text-slate-600">{m.transportationType}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[11px]">
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Permit Modal */}
      {showAddPermitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">إصدار تصريح خروج / إذن عمل</h3>
              <button onClick={() => setShowAddPermitModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>
            <form onSubmit={handlePermitSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">الموظف *</label>
                <select
                  value={pEmpId}
                  onChange={(e) => setPEmpId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                >
                  {employees.map(e => (
                    <option key={e.employeeId} value={e.employeeId}>{e.employeeId} - {e.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">نوع الإذن *</label>
                  <select
                    value={pType}
                    onChange={(e) => setPType(e.target.value as PermitType)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="إذن شخصي">إذن شخصي (بحد أقصى ساعتين)</option>
                    <option value="إذن عمل">إذن عمل / خروج لمهمة رسمية</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">التاريخ *</label>
                  <input
                    type="date"
                    value={pDate}
                    onChange={(e) => setPDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">من الساعة</label>
                  <input
                    type="time"
                    value={pStart}
                    onChange={(e) => setPStart(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">إلى الساعة</label>
                  <input
                    type="time"
                    value={pEnd}
                    onChange={(e) => setPEnd(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">المدة (ساعات)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="8"
                    value={pDuration}
                    onChange={(e) => setPDuration(Number(e.target.value))}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">السبب أو الجهة المقصودة *</label>
                <input
                  type="text"
                  required
                  value={pReason}
                  onChange={(e) => setPReason(e.target.value)}
                  placeholder="سبب الخروج والمتابعة..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddPermitModal(false)} className="px-4 py-2 bg-slate-100 rounded-lg text-xs">إلغاء</button>
                <button type="submit" className="px-5 py-2 bg-blue-700 text-white rounded-lg text-xs font-bold">اعتماد الإذن</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Mission Modal */}
      {showAddMissionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">إصدار أمر تكليف بمأمورية عمل</h3>
              <button onClick={() => setShowAddMissionModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>
            <form onSubmit={handleMissionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">الموظف المكلف بالمأمورية *</label>
                <select
                  value={mEmpId}
                  onChange={(e) => setMEmpId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                >
                  {employees.map(e => (
                    <option key={e.employeeId} value={e.employeeId}>{e.employeeId} - {e.name} ({e.department})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">نوع المأمورية *</label>
                  <select
                    value={mType}
                    onChange={(e) => setMType(e.target.value as MissionType)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="مأمورية ببدل">مأمورية ببدل سفر وانتقال</option>
                    <option value="مأمورية داخلية">مأمورية داخلية (نطاق السويس)</option>
                    <option value="مأمورية بدون بدل">مأمورية بدون بدل</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">وسيلة الانتقال</label>
                  <select
                    value={mTransport}
                    onChange={(e) => setMTransport(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="سيارة الشركة">سيارة الشركة</option>
                    <option value="قطار / حافلة">قطار / حافلة</option>
                    <option value="طيران">طيران</option>
                    <option value="خاصة ببدل انتقال">سيارة خاصة ببدل انتقال</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">الجهة المقصودة (الموقع / المحافظة) *</label>
                <input
                  type="text"
                  required
                  value={mDestination}
                  onChange={(e) => setMDestination(e.target.value)}
                  placeholder="مثال: الهيئة المصرية العامة للبترول - القاهرة"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">الغرض من المأمورية *</label>
                <input
                  type="text"
                  required
                  value={mPurpose}
                  onChange={(e) => setMPurpose(e.target.value)}
                  placeholder="تفاصيل التكليف الرسمي..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">تاريخ البدء</label>
                  <input
                    type="date"
                    value={mStart}
                    onChange={(e) => setMStart(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">تاريخ العودة</label>
                  <input
                    type="date"
                    value={mEnd}
                    onChange={(e) => setMEnd(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">عدد الأيام</label>
                  <input
                    type="number"
                    min="1"
                    value={mDays}
                    onChange={(e) => setMDays(Number(e.target.value))}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                    required
                  />
                </div>
              </div>
              {mType === 'مأمورية ببدل' && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">قيمة البدل اليومي (ج.م)</label>
                    <input
                      type="number"
                      value={mAllowancePerDay}
                      onChange={(e) => setMAllowancePerDay(Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded font-mono"
                    />
                  </div>
                  <div>
                    <span className="block text-slate-700 font-semibold mb-1">إجمالي البدل المستحق</span>
                    <span className="text-base font-black text-amber-900 font-mono block pt-1">
                      {mDays * mAllowancePerDay} جنيه مصري
                    </span>
                  </div>
                </div>
              )}
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddMissionModal(false)} className="px-4 py-2 bg-slate-100 rounded-lg text-xs">إلغاء</button>
                <button type="submit" className="px-5 py-2 bg-amber-700 text-white rounded-lg text-xs font-bold">اعتماد التكليف</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
