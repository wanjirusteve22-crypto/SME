import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Appointment, 
  WaitlistEntry, 
  ClientProfile, 
  Service, 
  StaffMember, 
  ReminderConfig,
  CalendarGap
} from '../types';
import { 
  INITIAL_APPOINTMENTS, 
  INITIAL_WAITLIST, 
  INITIAL_CLIENTS, 
  INITIAL_SERVICES, 
  INITIAL_STAFF, 
  INITIAL_REMINDER_CONFIG 
} from '../data/seedData';

interface AppContextType {
  appointments: Appointment[];
  waitlist: WaitlistEntry[];
  clients: ClientProfile[];
  services: Service[];
  staff: StaffMember[];
  config: ReminderConfig;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  activeTab: 'schedule' | 'defense' | 'recovery' | 'retention' | 'portal';
  setActiveTab: (tab: 'schedule' | 'defense' | 'recovery' | 'retention' | 'portal') => void;
  
  // Metrics
  metrics: {
    totalRevenue: number;
    noShowLoss: number;
    depositProtected: number;
    recoveredRevenue: number;
    recoveryRate: number;
    confirmedRate: number;
    totalSlotsToday: number;
    completedCount: number;
  };

  // Actions
  bookAppointment: (data: Omit<Appointment, 'id' | 'reminders'>) => Appointment;
  confirmAppointment: (id: string) => void;
  cancelAppointment: (id: string, reason: string) => void;
  markNoShow: (id: string) => void;
  completeAppointment: (id: string, checkoutData: Appointment['checkoutData']) => void;
  rescheduleAppointment: (id: string, newDate: string, newTime: string) => void;
  addToWaitlist: (entry: Omit<WaitlistEntry, 'id' | 'createdAt' | 'status'>) => WaitlistEntry;
  offerSlotToWaitlist: (waitlistId: string, slotDate: string, slotTime: string, staffId: string) => void;
  claimWaitlistOffer: (waitlistId: string) => Appointment | null;
  broadcastFlashOpening: (date: string, time: string, staffId: string, discountPercent: number) => void;
  sendManualReminder: (appointmentId: string, type: 'sms' | 'email' | 'whatsapp') => void;
  updateReminderConfig: (newConfig: Partial<ReminderConfig>) => void;
  updateClientNotes: (clientId: string, notes: ClientProfile['technicalNotes']) => void;
  findGapsForDate: (date: string, staffId?: string) => CalendarGap[];
  resetToDefaults: () => void;
  
  // Quick simulation trigger for testing
  simulateInstantRecovery: (slotId: string, waitlistId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  APPOINTMENTS: 'bookflow_appointments_v1',
  WAITLIST: 'bookflow_waitlist_v1',
  CLIENTS: 'bookflow_clients_v1',
  CONFIG: 'bookflow_config_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WAITLIST);
      return saved ? JSON.parse(saved) : INITIAL_WAITLIST;
    } catch {
      return INITIAL_WAITLIST;
    }
  });

  const [clients, setClients] = useState<ClientProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLIENTS);
      return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
    } catch {
      return INITIAL_CLIENTS;
    }
  });

  const [config, setConfig] = useState<ReminderConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
      return saved ? JSON.parse(saved) : INITIAL_REMINDER_CONFIG;
    } catch {
      return INITIAL_REMINDER_CONFIG;
    }
  });

  const [selectedDate, setSelectedDate] = useState<string>('2026-10-21');
  const [activeTab, setActiveTab] = useState<'schedule' | 'defense' | 'recovery' | 'retention' | 'portal'>('defense');

  // Persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WAITLIST, JSON.stringify(waitlist));
  }, [waitlist]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  }, [config]);

  // Derived financial & no-show metrics
  const metrics = React.useMemo(() => {
    let totalRevenue = 0;
    let noShowLoss = 0;
    let depositProtected = 0;
    let recoveredRevenue = 0;
    let confirmedCount = 0;
    let completedCount = 0;

    appointments.forEach((apt) => {
      if (apt.status === 'completed') {
        completedCount++;
        totalRevenue += apt.checkoutData?.finalPaid || apt.price;
      } else if (apt.status === 'confirmed') {
        confirmedCount++;
        totalRevenue += apt.price;
      } else if (apt.status === 'no_show') {
        // Lost full service price minus forfeited deposit
        const netLost = Math.max(0, apt.price - (apt.depositPaid ? apt.depositAmount : 0));
        noShowLoss += netLost;
        if (apt.depositPaid) {
          depositProtected += apt.depositAmount;
        }
      }

      if (apt.isRecoveredSlot) {
        recoveredRevenue += apt.price;
      }
    });

    const activeOrFinished = appointments.filter(a => a.status !== 'cancelled');
    const totalPotential = noShowLoss + recoveredRevenue;
    const recoveryRate = totalPotential > 0 ? Math.round((recoveredRevenue / totalPotential) * 100) : 0;
    const confirmedRate = activeOrFinished.length > 0 
      ? Math.round((appointments.filter(a => a.status === 'confirmed' || a.status === 'completed').length / activeOrFinished.length) * 100)
      : 0;

    return {
      totalRevenue,
      noShowLoss,
      depositProtected,
      recoveredRevenue,
      recoveryRate,
      confirmedRate,
      totalSlotsToday: appointments.filter(a => a.date === selectedDate).length,
      completedCount,
    };
  }, [appointments, selectedDate]);

  // Action implementations
  const bookAppointment = (data: Omit<Appointment, 'id' | 'reminders'>): Appointment => {
    const newId = `apt-${Date.now()}`;
    const initialReminders: Appointment['reminders'] = [];

    if (config.enable48hEmail) {
      initialReminders.push({
        id: `rem-${Date.now()}-1`,
        type: 'email',
        timingLabel: 'Booking Confirmation & 48h Instructions',
        sentAt: 'Just now',
        status: 'delivered',
        contentPreview: `Booked: ${data.time} on ${data.date}. Calendar invite attached.`
      });
    }

    if (config.enable24hSMS) {
      initialReminders.push({
        id: `rem-${Date.now()}-2`,
        type: 'sms',
        timingLabel: 'Automated SMS Confirmation',
        sentAt: 'Queued (24h before)',
        status: 'pending',
        contentPreview: `BookFlow: Reply C to confirm your appointment at The Grand Union.`
      });
    }

    const newApt: Appointment = {
      ...data,
      id: newId,
      reminders: initialReminders,
    };

    setAppointments(prev => [newApt, ...prev]);

    // Check if client exists or create
    setClients(prev => {
      const existing = prev.find(c => c.name.toLowerCase() === data.clientName.toLowerCase() || c.phone === data.clientPhone);
      if (existing) {
        return prev.map(c => c.id === existing.id ? { ...c, totalVisits: c.totalVisits + 1 } : c);
      }
      return [
        {
          id: `cli-${Date.now()}`,
          name: data.clientName,
          phone: data.clientPhone,
          email: data.clientEmail,
          reliabilityScore: 100,
          totalVisits: 1,
          totalSpend: data.price,
          lastVisitDate: data.date,
          serviceCadenceDays: 21,
          noShowCount: 0,
          lateCancelCount: 0,
          requiresDeposit: false,
          technicalNotes: {
            stylingNotes: 'First time guest'
          }
        },
        ...prev
      ];
    });

    return newApt;
  };

  const confirmAppointment = (id: string) => {
    setAppointments(prev => prev.map(apt => {
      if (apt.id === id) {
        return {
          ...apt,
          status: 'confirmed',
          reminders: [
            ...apt.reminders,
            {
              id: `rem-${Date.now()}`,
              type: 'sms',
              timingLabel: 'Client 1-Click Confirmation',
              sentAt: 'Just now',
              status: 'delivered',
              contentPreview: 'Verified by client via secure link. Time locked in schedule.'
            }
          ]
        };
      }
      return apt;
    }));
  };

  const cancelAppointment = (id: string, reason: string) => {
    setAppointments(prev => prev.map(apt => {
      if (apt.id === id) {
        return {
          ...apt,
          status: 'cancelled',
          cancellationReason: reason,
          cancelledAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          reminders: [
            ...apt.reminders,
            {
              id: `rem-cancel-${Date.now()}`,
              type: 'sms',
              timingLabel: 'Cancellation Acknowledged',
              sentAt: 'Just now',
              status: 'delivered',
              contentPreview: `Cancellation confirmed. Slot re-opened to waitlist queue.`
            }
          ]
        };
      }
      return apt;
    }));

    // Update client late cancel count if within 24 hours
    const targetApt = appointments.find(a => a.id === id);
    if (targetApt) {
      setClients(prev => prev.map(c => {
        if (c.name.toLowerCase() === targetApt.clientName.toLowerCase() || c.phone === targetApt.clientPhone) {
          const newLate = c.lateCancelCount + 1;
          const newScore = Math.max(30, c.reliabilityScore - 8);
          return {
            ...c,
            lateCancelCount: newLate,
            reliabilityScore: newScore,
            requiresDeposit: newScore < config.unreliableThresholdScore
          };
        }
        return c;
      }));
    }
  };

  const markNoShow = (id: string) => {
    const targetApt = appointments.find(a => a.id === id);
    if (!targetApt) return;

    setAppointments(prev => prev.map(apt => {
      if (apt.id === id) {
        return {
          ...apt,
          status: 'no_show',
          notes: apt.depositPaid 
            ? `Customer did not arrive. Deposit ($${apt.depositAmount}) retained under protection policy.`
            : 'Unprotected no-show. 100% loss incurred.',
          reminders: [
            ...apt.reminders,
            {
              id: `rem-noshow-${Date.now()}`,
              type: 'sms',
              timingLabel: 'Missed Appointment Notice',
              sentAt: 'Just now',
              status: 'delivered',
              contentPreview: 'You missed your scheduled visit today. Please contact us to rebook.'
            }
          ]
        };
      }
      return apt;
    }));

    // Penalize client reliability score significantly
    setClients(prev => prev.map(c => {
      if (c.name.toLowerCase() === targetApt.clientName.toLowerCase() || c.phone === targetApt.clientPhone) {
        const newNoShow = c.noShowCount + 1;
        const newScore = Math.max(20, c.reliabilityScore - 20);
        return {
          ...c,
          noShowCount: newNoShow,
          reliabilityScore: newScore,
          requiresDeposit: true, // Always enforce deposit on no-show
        };
      }
      return c;
    }));
  };

  const completeAppointment = (id: string, checkoutData: Appointment['checkoutData']) => {
    setAppointments(prev => prev.map(apt => {
      if (apt.id === id) {
        return {
          ...apt,
          status: 'completed',
          checkoutData
        };
      }
      return apt;
    }));

    // Update client spend
    const targetApt = appointments.find(a => a.id === id);
    if (targetApt && checkoutData) {
      setClients(prev => prev.map(c => {
        if (c.name.toLowerCase() === targetApt.clientName.toLowerCase() || c.phone === targetApt.clientPhone) {
          return {
            ...c,
            totalSpend: c.totalSpend + checkoutData.finalPaid,
            lastVisitDate: targetApt.date,
          };
        }
        return c;
      }));
    }
  };

  const rescheduleAppointment = (id: string, newDate: string, newTime: string) => {
    setAppointments(prev => prev.map(apt => {
      if (apt.id === id) {
        return {
          ...apt,
          date: newDate,
          time: newTime,
          status: 'confirmed',
          reminders: [
            ...apt.reminders,
            {
              id: `rem-resched-${Date.now()}`,
              type: 'sms',
              timingLabel: 'Rescheduled Confirmation',
              sentAt: 'Just now',
              status: 'delivered',
              contentPreview: `Rescheduled to ${newDate} at ${newTime}. We look forward to seeing you!`
            }
          ]
        };
      }
      return apt;
    }));
  };

  const addToWaitlist = (entry: Omit<WaitlistEntry, 'id' | 'createdAt' | 'status'>): WaitlistEntry => {
    const newEntry: WaitlistEntry = {
      ...entry,
      id: `wait-${Date.now()}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'waiting',
    };
    setWaitlist(prev => [newEntry, ...prev]);
    return newEntry;
  };

  const offerSlotToWaitlist = (waitlistId: string, slotDate: string, slotTime: string, staffId: string) => {
    // 15-minute reservation timer
    const expiry = new Date(Date.now() + 15 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setWaitlist(prev => prev.map(w => {
      if (w.id === waitlistId) {
        return {
          ...w,
          status: 'offered',
          offerExpiresAt: expiry,
          offeredSlot: {
            date: slotDate,
            time: slotTime,
            staffId
          }
        };
      }
      return w;
    }));
  };

  const claimWaitlistOffer = (waitlistId: string): Appointment | null => {
    const waitItem = waitlist.find(w => w.id === waitlistId);
    if (!waitItem || !waitItem.offeredSlot) return null;

    const srv = INITIAL_SERVICES.find(s => s.id === waitItem.serviceId) || INITIAL_SERVICES[0];

    // Create recovered appointment
    const newApt: Appointment = {
      id: `apt-recovered-${Date.now()}`,
      clientId: `cli-${Date.now()}`,
      clientName: waitItem.clientName,
      clientPhone: waitItem.clientPhone,
      clientEmail: waitItem.clientEmail,
      serviceId: waitItem.serviceId,
      staffId: waitItem.offeredSlot.staffId,
      date: waitItem.offeredSlot.date,
      time: waitItem.offeredSlot.time,
      durationMinutes: srv.durationMinutes,
      price: srv.price,
      status: 'confirmed',
      depositPaid: srv.depositRequired,
      depositAmount: srv.depositAmount,
      isRecoveredSlot: true,
      reminders: [
        {
          id: `rem-wait-claim-${Date.now()}`,
          type: 'sms',
          timingLabel: 'Waitlist Fast-Track Claim',
          sentAt: 'Just now',
          status: 'delivered',
          contentPreview: `Slot confirmed! You secured ${srv.name} on ${waitItem.offeredSlot.date} at ${waitItem.offeredSlot.time}.`
        }
      ]
    };

    setAppointments(prev => [newApt, ...prev]);

    // Mark waitlist entry booked
    setWaitlist(prev => prev.map(w => w.id === waitlistId ? { ...w, status: 'booked' } : w));

    return newApt;
  };

  const broadcastFlashOpening = (date: string, time: string, staffId: string, discountPercent: number) => {
    // Generates a flash opening offer to top waitlist entries
    const eligibleWaitlist = waitlist.filter(w => w.status === 'waiting');
    if (eligibleWaitlist.length > 0) {
      const topMatch = eligibleWaitlist[0];
      offerSlotToWaitlist(topMatch.id, date, time, staffId);
    }
  };

  const sendManualReminder = (appointmentId: string, type: 'sms' | 'email' | 'whatsapp') => {
    setAppointments(prev => prev.map(apt => {
      if (apt.id === appointmentId) {
        const typeLabel = type === 'sms' ? 'Direct SMS' : type === 'email' ? 'Direct Email' : 'WhatsApp';
        return {
          ...apt,
          reminders: [
            ...apt.reminders,
            {
              id: `rem-manual-${Date.now()}`,
              type,
              timingLabel: `Instant ${typeLabel} Dispatch`,
              sentAt: 'Just now',
              status: 'delivered',
              contentPreview: `Reminder sent to ${apt.clientPhone}: Appointment on ${apt.date} at ${apt.time}.`
            }
          ]
        };
      }
      return apt;
    }));
  };

  const updateReminderConfig = (newConfig: Partial<ReminderConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const updateClientNotes = (clientId: string, notes: ClientProfile['technicalNotes']) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, technicalNotes: { ...c.technicalNotes, ...notes } } : c));
  };

  const findGapsForDate = (date: string, staffId?: string): CalendarGap[] => {
    const dayStaff = staffId ? INITIAL_STAFF.filter(s => s.id === staffId) : INITIAL_STAFF;
    const gaps: CalendarGap[] = [];

    dayStaff.forEach(st => {
      const staffApts = appointments
        .filter(a => a.date === date && a.staffId === st.id && a.status !== 'cancelled')
        .sort((a, b) => a.time.localeCompare(b.time));

      // Calculate gap between successive bookings
      for (let i = 0; i < staffApts.length - 1; i++) {
        const curr = staffApts[i];
        const next = staffApts[i + 1];

        const [currH, currM] = curr.time.split(':').map(Number);
        const currEndMinutes = currH * 60 + currM + curr.durationMinutes;

        const [nextH, nextM] = next.time.split(':').map(Number);
        const nextStartMinutes = nextH * 60 + nextM;

        const gapMinutes = nextStartMinutes - currEndMinutes;
        if (gapMinutes >= 20 && gapMinutes <= 90) {
          const gapH = Math.floor(currEndMinutes / 60).toString().padStart(2, '0');
          const gapM = (currEndMinutes % 60).toString().padStart(2, '0');
          const endH = Math.floor(nextStartMinutes / 60).toString().padStart(2, '0');
          const endM = (nextStartMinutes % 60).toString().padStart(2, '0');

          gaps.push({
            staffId: st.id,
            date,
            startTime: `${gapH}:${gapM}`,
            endTime: `${endH}:${endM}`,
            durationMinutes: gapMinutes,
            suggestedServiceId: gapMinutes >= 30 ? 'srv-3' : 'srv-6', // Beard Sculpt or Express Lineup
          });
        }
      }
    });

    return gaps;
  };

  const simulateInstantRecovery = (slotId: string, waitlistId: string) => {
    const slot = appointments.find(a => a.id === slotId);
    if (!slot) return;
    
    // 1. Offer slot to waitlist entry
    offerSlotToWaitlist(waitlistId, slot.date, slot.time, slot.staffId);

    // 2. Claim it immediately to demonstrate the complete loop
    setTimeout(() => {
      claimWaitlistOffer(waitlistId);
    }, 600);
  };

  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);
    localStorage.removeItem(STORAGE_KEYS.WAITLIST);
    localStorage.removeItem(STORAGE_KEYS.CLIENTS);
    localStorage.removeItem(STORAGE_KEYS.CONFIG);
    setAppointments(INITIAL_APPOINTMENTS);
    setWaitlist(INITIAL_WAITLIST);
    setClients(INITIAL_CLIENTS);
    setConfig(INITIAL_REMINDER_CONFIG);
  };

  return (
    <AppContext.Provider
      value={{
        appointments,
        waitlist,
        clients,
        services: INITIAL_SERVICES,
        staff: INITIAL_STAFF,
        config,
        selectedDate,
        setSelectedDate,
        activeTab,
        setActiveTab,
        metrics,
        bookAppointment,
        confirmAppointment,
        cancelAppointment,
        markNoShow,
        completeAppointment,
        rescheduleAppointment,
        addToWaitlist,
        offerSlotToWaitlist,
        claimWaitlistOffer,
        broadcastFlashOpening,
        sendManualReminder,
        updateReminderConfig,
        updateClientNotes,
        findGapsForDate,
        resetToDefaults,
        simulateInstantRecovery
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
