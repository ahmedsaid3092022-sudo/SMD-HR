/**
 * SMD - Suez Methanol Derivatives Co.
 * Local Storage & Persistence Service
 */

import {
  Employee,
  LeaveBalance,
  LeaveRecord,
  PermitRecord,
  MissionRecord,
  AttendanceRecord,
  ZKTecoDevice,
  BiometricLogEntry,
  LicenseConfig,
  UserSession,
  ShiftType
} from '../types';
import {
  INITIAL_EMPLOYEES,
  INITIAL_LEAVE_BALANCES,
  INITIAL_LEAVES,
  INITIAL_PERMITS,
  INITIAL_MISSIONS,
  generateInitialAttendance,
  INITIAL_DEVICES,
  INITIAL_LICENSE
} from '../data/initialData';
import { calculateOvertime } from '../utils/overtimeCalculator';

const KEYS = {
  EMPLOYEES: 'smd_hr_employees',
  LEAVE_BALANCES: 'smd_hr_leave_balances',
  LEAVES: 'smd_hr_leaves',
  PERMITS: 'smd_hr_permits',
  MISSIONS: 'smd_hr_missions',
  ATTENDANCE: 'smd_hr_attendance',
  DEVICES: 'smd_hr_devices',
  BIOMETRIC_LOGS: 'smd_hr_biometric_logs',
  LICENSE: 'smd_hr_license',
  USER_SESSION: 'smd_hr_user_session'
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    if (!val) return fallback;
    return JSON.parse(val) as T;
  } catch (err) {
    console.error(`Error loading key ${key}:`, err);
    return fallback;
  }
}

function safeSet<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving key ${key}:`, err);
  }
}

export const StorageService = {
  // Session
  getCurrentUser(): UserSession | null {
    return safeGet<UserSession | null>(KEYS.USER_SESSION, {
      id: 'USR-001',
      name: 'أ. محمد عبد الرحمن (مدير الموارد البشرية)',
      email: 'admin@smd.com.eg',
      role: 'ADMIN'
    });
  },
  setCurrentUser(user: UserSession | null): void {
    safeSet(KEYS.USER_SESSION, user);
  },

  // Employees
  getEmployees(): Employee[] {
    return safeGet<Employee[]>(KEYS.EMPLOYEES, INITIAL_EMPLOYEES);
  },
  saveEmployees(employees: Employee[]): void {
    safeSet(KEYS.EMPLOYEES, employees);
  },
  addEmployee(emp: Omit<Employee, 'serial'>): Employee {
    const list = this.getEmployees();
    const maxSerial = list.reduce((m, e) => Math.max(m, e.serial), 0);
    const newEmp: Employee = {
      ...emp,
      serial: maxSerial + 1
    };
    list.push(newEmp);
    this.saveEmployees(list);

    // Also initialize leave balance
    const balances = this.getLeaveBalances();
    if (!balances.find(b => b.employeeId === newEmp.employeeId)) {
      balances.push({
        employeeId: newEmp.employeeId,
        year: new Date().getFullYear(),
        annualOpening: newEmp.grade.includes('مدير') ? 30 : 21,
        casualOpening: 7,
        sickOpening: 90,
        sickCycleStartYear: new Date().getFullYear(),
        annualUsed: 0,
        casualUsed: 0,
        sickUsed: 0,
        otherUsed: 0
      });
      this.saveLeaveBalances(balances);
    }

    return newEmp;
  },
  updateEmployee(updated: Employee): void {
    const list = this.getEmployees().map(e => (e.employeeId === updated.employeeId ? updated : e));
    this.saveEmployees(list);
  },
  deleteEmployee(employeeId: string): void {
    const list = this.getEmployees().filter(e => e.employeeId !== employeeId);
    this.saveEmployees(list);
  },

  // Leave Balances
  getLeaveBalances(): LeaveBalance[] {
    return safeGet<LeaveBalance[]>(KEYS.LEAVE_BALANCES, INITIAL_LEAVE_BALANCES);
  },
  saveLeaveBalances(balances: LeaveBalance[]): void {
    safeSet(KEYS.LEAVE_BALANCES, balances);
  },

  // Leaves
  getLeaves(): LeaveRecord[] {
    return safeGet<LeaveRecord[]>(KEYS.LEAVES, INITIAL_LEAVES);
  },
  saveLeaves(leaves: LeaveRecord[]): void {
    safeSet(KEYS.LEAVES, leaves);
  },
  addLeave(leave: Omit<LeaveRecord, 'id'>): LeaveRecord {
    const list = this.getLeaves();
    const newId = `LV-${new Date().getFullYear()}-${String(list.length + 1).padStart(3, '0')}`;
    const newRecord: LeaveRecord = { ...leave, id: newId };
    list.unshift(newRecord);
    this.saveLeaves(list);

    // Deduct from balance if approved
    if (newRecord.status === 'معتمد') {
      this.updateBalanceForLeave(newRecord);
    }
    return newRecord;
  },
  updateBalanceForLeave(leave: LeaveRecord): void {
    const balances = this.getLeaveBalances();
    const bal = balances.find(b => b.employeeId === leave.employeeId);
    if (!bal) return;

    if (leave.leaveType === 'اعتيادي') {
      bal.annualUsed += leave.daysCount;
    } else if (leave.leaveType === 'عارضة') {
      bal.casualUsed += leave.daysCount;
    } else if (leave.leaveType === 'مرضي') {
      bal.sickUsed += leave.daysCount;
    } else {
      bal.otherUsed += leave.daysCount;
    }
    this.saveLeaveBalances(balances);
  },

  // Permits
  getPermits(): PermitRecord[] {
    return safeGet<PermitRecord[]>(KEYS.PERMITS, INITIAL_PERMITS);
  },
  savePermits(permits: PermitRecord[]): void {
    safeSet(KEYS.PERMITS, permits);
  },
  addPermit(permit: Omit<PermitRecord, 'id'>): PermitRecord {
    const list = this.getPermits();
    const newId = `PR-${new Date().getFullYear()}-${String(list.length + 101).padStart(3, '0')}`;
    const newRec: PermitRecord = { ...permit, id: newId };
    list.unshift(newRec);
    this.savePermits(list);
    return newRec;
  },

  // Missions
  getMissions(): MissionRecord[] {
    return safeGet<MissionRecord[]>(KEYS.MISSIONS, INITIAL_MISSIONS);
  },
  saveMissions(missions: MissionRecord[]): void {
    safeSet(KEYS.MISSIONS, missions);
  },
  addMission(mission: Omit<MissionRecord, 'id'>): MissionRecord {
    const list = this.getMissions();
    const newId = `MS-${new Date().getFullYear()}-${String(list.length + 51).padStart(3, '0')}`;
    const newRec: MissionRecord = { ...mission, id: newId };
    list.unshift(newRec);
    this.saveMissions(list);
    return newRec;
  },

  // Attendance
  getAttendance(): AttendanceRecord[] {
    return safeGet<AttendanceRecord[]>(KEYS.ATTENDANCE, generateInitialAttendance());
  },
  saveAttendance(records: AttendanceRecord[]): void {
    safeSet(KEYS.ATTENDANCE, records);
  },
  addAttendanceRecord(record: Omit<AttendanceRecord, 'id'>): AttendanceRecord {
    const list = this.getAttendance();
    const newId = `ATT-${new Date().getFullYear()}-${String(list.length + 1).padStart(3, '0')}`;
    const newRec: AttendanceRecord = { ...record, id: newId };
    list.unshift(newRec);
    this.saveAttendance(list);
    return newRec;
  },

  // ZKTeco Devices
  getDevices(): ZKTecoDevice[] {
    return safeGet<ZKTecoDevice[]>(KEYS.DEVICES, INITIAL_DEVICES);
  },
  saveDevices(devices: ZKTecoDevice[]): void {
    safeSet(KEYS.DEVICES, devices);
  },
  updateDevice(updated: ZKTecoDevice): void {
    const list = this.getDevices().map(d => (d.id === updated.id ? updated : d));
    this.saveDevices(list);
  },

  // Biometric Logs
  getBiometricLogs(): BiometricLogEntry[] {
    return safeGet<BiometricLogEntry[]>(KEYS.BIOMETRIC_LOGS, [
      {
        id: "LOG-01",
        deviceId: "ZK-01",
        enrollNumber: "1001",
        timestamp: "2026-11-01 07:55:12",
        verifyMode: "بصمة إصبع",
        punchType: "دخول"
      },
      {
        id: "LOG-02",
        deviceId: "ZK-01",
        enrollNumber: "1001",
        timestamp: "2026-11-01 20:00:44",
        verifyMode: "بصمة إصبع",
        punchType: "خروج"
      },
      {
        id: "LOG-03",
        deviceId: "ZK-01",
        enrollNumber: "1002",
        timestamp: "2026-11-01 08:02:10",
        verifyMode: "بصمة وجه",
        punchType: "دخول"
      },
      {
        id: "LOG-04",
        deviceId: "ZK-01",
        enrollNumber: "1002",
        timestamp: "2026-11-01 16:05:30",
        verifyMode: "بصمة وجه",
        punchType: "خروج"
      }
    ]);
  },
  saveBiometricLogs(logs: BiometricLogEntry[]): void {
    safeSet(KEYS.BIOMETRIC_LOGS, logs);
  },

  // License & Time-Lock
  getLicense(): LicenseConfig {
    return safeGet<LicenseConfig>(KEYS.LICENSE, INITIAL_LICENSE);
  },
  saveLicense(lic: LicenseConfig): void {
    safeSet(KEYS.LICENSE, lic);
  },

  isSystemLocked(): { isLocked: boolean; reason?: string } {
    const lic = this.getLicense();
    if (lic.isTimeLocked) {
      return { isLocked: true, reason: 'تم إيقاف تشغيل النظام يدوياً بواسطة مسؤول النظام (Admin Lockout).' };
    }
    const today = new Date().toISOString().split('T')[0];
    if (lic.expiryDate && today > lic.expiryDate) {
      return {
        isLocked: true,
        reason: `انتهت صلاحية ترخيص البرنامج في تاريخ ${lic.expiryDate}. يرجى تجديد الترخيص مع إدارة نظم المعلومات بشركة السويس لمشتقات الميثانول.`
      };
    }
    return { isLocked: false };
  },

  // Reset all to initial state
  resetAllData(): void {
    localStorage.removeItem(KEYS.EMPLOYEES);
    localStorage.removeItem(KEYS.LEAVE_BALANCES);
    localStorage.removeItem(KEYS.LEAVES);
    localStorage.removeItem(KEYS.PERMITS);
    localStorage.removeItem(KEYS.MISSIONS);
    localStorage.removeItem(KEYS.ATTENDANCE);
    localStorage.removeItem(KEYS.DEVICES);
    localStorage.removeItem(KEYS.BIOMETRIC_LOGS);
    localStorage.removeItem(KEYS.LICENSE);
  }
};
