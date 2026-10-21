export type ServiceCategory = 'hair' | 'beard' | 'color' | 'spa';

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  durationMinutes: number;
  price: number;
  description: string;
  depositRequired: boolean;
  depositAmount: number;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  specialties: string[];
  workingHours: string;
  commissionRate: number; // e.g. 0.45 for 45%
  rating: number;
  chairNumber: number;
}

export type AppointmentStatus = 
  | 'confirmed' 
  | 'pending_confirmation' 
  | 'completed' 
  | 'cancelled' 
  | 'no_show' 
  | 'rescheduled';

export interface ReminderLog {
  id: string;
  type: 'sms' | 'email' | 'whatsapp';
  timingLabel: string; // e.g. "24h SMS Reminder"
  sentAt: string;
  status: 'delivered' | 'read' | 'pending';
  contentPreview: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  serviceId: string;
  staffId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  price: number;
  status: AppointmentStatus;
  depositPaid: boolean;
  depositAmount: number;
  cancellationReason?: string;
  cancelledAt?: string;
  reminders: ReminderLog[];
  notes?: string;
  isRecoveredSlot?: boolean; // filled from waitlist / flash gap
  checkoutData?: {
    servicesTotal: number;
    retailTotal: number;
    tipAmount: number;
    depositDeduction: number;
    finalPaid: number;
    paymentMethod: 'card' | 'cash' | 'card_on_file';
    completedAt: string;
  };
}

export interface WaitlistEntry {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  serviceId: string;
  preferredStaffId: string | 'any';
  requestedDate: string; // YYYY-MM-DD
  timeFlexibility: 'morning' | 'afternoon' | 'evening' | 'anytime';
  priorityScore: number; // 1-100 based on loyalty & urgency
  createdAt: string;
  status: 'waiting' | 'offered' | 'booked' | 'expired';
  offerExpiresAt?: string;
  offeredSlot?: {
    date: string;
    time: string;
    staffId: string;
  };
}

export interface TechnicalNotes {
  haircutGuards?: string;
  colorFormula?: string;
  massagePreferences?: string;
  allergies?: string;
  stylingNotes?: string;
}

export interface ClientProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  reliabilityScore: number; // 0 - 100%
  totalVisits: number;
  totalSpend: number;
  lastVisitDate: string;
  serviceCadenceDays: number; // regular frequency (e.g. 21 days)
  noShowCount: number;
  lateCancelCount: number;
  requiresDeposit: boolean;
  technicalNotes: TechnicalNotes;
}

export interface ReminderConfig {
  enable48hEmail: boolean;
  enable24hSMS: boolean;
  enable2hDayOf: boolean;
  requireDepositForUnreliable: boolean;
  unreliableThresholdScore: number; // default 85%
  defaultDepositAmount: number; // default 25
  autoOfferWaitlistOnCancel: boolean;
  flashDiscountPercent: number; // default 15
  messagingProvider: 'twilio' | 'whatsapp_business' | 'sendgrid';
  providerConnected: boolean;
}

export interface CalendarGap {
  staffId: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  suggestedServiceId?: string;
}
