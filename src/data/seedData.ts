import { Service, StaffMember, Appointment, WaitlistEntry, ClientProfile, ReminderConfig } from '../types';

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-1',
    name: 'Signature Skin Fade & Hot Towel Finish',
    category: 'hair',
    durationMinutes: 45,
    price: 55,
    description: 'Bespoke razor fade, custom shear texturizing, tea-tree scalp rinse, and essential-oil infused hot steam towel.',
    depositRequired: true,
    depositAmount: 25,
  },
  {
    id: 'srv-2',
    name: 'Master Scissor Cut & Bespoke Styling',
    category: 'hair',
    durationMinutes: 60,
    price: 75,
    description: 'Precision scissor architecture, directional layering, blow-dry styling with organic pomade or clay.',
    depositRequired: true,
    depositAmount: 25,
  },
  {
    id: 'srv-3',
    name: 'Artisan Beard Sculpt & Vapor Conditioning',
    category: 'beard',
    durationMinutes: 30,
    price: 40,
    description: 'Foil-shave edge definition, warm sandalwood conditioning steam, straight-razor cheek alignment, and botanical balm.',
    depositRequired: false,
    depositAmount: 0,
  },
  {
    id: 'srv-4',
    name: 'Full Balayage, Gloss & Olaplex Treatment',
    category: 'color',
    durationMinutes: 120,
    price: 195,
    description: 'Hand-painted dimensional contouring, custom neutralizing toner/gloss, and bonded keratin restorative treatment.',
    depositRequired: true,
    depositAmount: 50,
  },
  {
    id: 'srv-5',
    name: 'Deep Tissue Cranial & Cervical Therapy',
    category: 'spa',
    durationMinutes: 45,
    price: 85,
    description: 'Therapeutic neck, shoulder, and scalp acupressure using cold-pressed eucalyptus oil to relieve tension.',
    depositRequired: true,
    depositAmount: 30,
  },
  {
    id: 'srv-6',
    name: 'Express Beard Lineup (Quick Add-on)',
    category: 'beard',
    durationMinutes: 20,
    price: 25,
    description: 'Rapid neck and cheek line perfection. Perfect for filling brief calendar intervals.',
    depositRequired: false,
    depositAmount: 0,
  },
  {
    id: 'srv-7',
    name: 'Tonal Gloss Refresh & Blowout',
    category: 'color',
    durationMinutes: 30,
    price: 50,
    description: 'Quick demi-permanent shine seal to lock color between full balayage appointments.',
    depositRequired: false,
    depositAmount: 0,
  }
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'Marcus Thorne',
    role: 'Master Barber & Founder',
    avatarUrl: '/src/assets/images/avatar_marcus_barber_1792604101574.jpg',
    specialties: ['Skin Fades', 'Hot Towel Shave', 'Beard Sculpting'],
    workingHours: '09:00 - 18:00',
    commissionRate: 0.55,
    rating: 4.98,
    chairNumber: 1,
  },
  {
    id: 'staff-2',
    name: 'Elena Rostova',
    role: 'Senior Stylist & Color Director',
    avatarUrl: '/src/assets/images/avatar_elena_stylist_1792604101084.jpg',
    specialties: ['Balayage', 'Color Correction', 'Precision Bobs'],
    workingHours: '10:00 - 19:00',
    commissionRate: 0.50,
    rating: 4.95,
    chairNumber: 2,
  },
  {
    id: 'staff-3',
    name: 'Sarah Jenkins',
    role: 'Holistic Spa & Scalp Specialist',
    avatarUrl: '/src/assets/images/avatar_devon_therapist_1792604101421.jpg',
    specialties: ['Cranial Acupressure', 'Deep Scalp Detox', 'Neck Release'],
    workingHours: '09:30 - 17:30',
    commissionRate: 0.45,
    rating: 4.92,
    chairNumber: 3,
  }
];

export const INITIAL_CLIENTS: ClientProfile[] = [
  {
    id: 'cli-1',
    name: 'David Vance',
    phone: '+1 (555) 382-9014',
    email: 'david.vance@example.com',
    reliabilityScore: 98,
    totalVisits: 14,
    totalSpend: 770,
    lastVisitDate: '2026-10-01',
    serviceCadenceDays: 21, // every 3 weeks (due right now!)
    noShowCount: 0,
    lateCancelCount: 0,
    requiresDeposit: false,
    technicalNotes: {
      haircutGuards: '#1.5 high skin fade, blend into #3 lever open, texture shear on top, natural hairline without razor pushback.',
      stylingNotes: 'Prefers matte sea-salt spray and minimal paste.',
      allergies: 'None reported'
    }
  },
  {
    id: 'cli-2',
    name: 'Liam Henderson',
    phone: '+1 (555) 729-4112',
    email: 'liam.h@example.com',
    reliabilityScore: 94,
    totalVisits: 8,
    totalSpend: 520,
    lastVisitDate: '2026-09-24',
    serviceCadenceDays: 28,
    noShowCount: 0,
    lateCancelCount: 1,
    requiresDeposit: false,
    technicalNotes: {
      haircutGuards: 'Mid drop-fade, #0.5 around ear contour, square neckline.',
      stylingNotes: 'High-hold clay with matte finish.'
    }
  },
  {
    id: 'cli-3',
    name: 'Sophia Chen',
    phone: '+1 (555) 914-6330',
    email: 'sophia.chen@example.com',
    reliabilityScore: 100,
    totalVisits: 6,
    totalSpend: 1170,
    lastVisitDate: '2026-09-08',
    serviceCadenceDays: 45, // due soon for color touch up
    noShowCount: 0,
    lateCancelCount: 0,
    requiresDeposit: false,
    technicalNotes: {
      colorFormula: 'Roots: Wella Koleston 6/0 (30g) + 6% 20vol (30g). Highlights: Freelights with 9% 30vol + Olaplex No. 1. Gloss: Color Touch 9/16 + 1.9% for 12 mins.',
      allergies: 'Sensitive to heavy synthetic fragrances, always use paraben-free shampoo.'
    }
  },
  {
    id: 'cli-4',
    name: 'Jason Bradley',
    phone: '+1 (555) 604-8199',
    email: 'jbradley@example.com',
    reliabilityScore: 68, // Low reliability!
    totalVisits: 5,
    totalSpend: 220,
    lastVisitDate: '2026-09-12',
    serviceCadenceDays: 30,
    noShowCount: 2, // 2 prior no-shows
    lateCancelCount: 1,
    requiresDeposit: true, // Auto-enforces deposit!
    technicalNotes: {
      haircutGuards: 'Taper cut #2 on sides, trim 1 inch on top.',
      stylingNotes: 'Card on file deposit required before booking confirmation.'
    }
  },
  {
    id: 'cli-5',
    name: 'Olivia Martinez',
    phone: '+1 (555) 441-2900',
    email: 'olivia.m@example.com',
    reliabilityScore: 96,
    totalVisits: 11,
    totalSpend: 935,
    lastVisitDate: '2026-10-04',
    serviceCadenceDays: 28,
    noShowCount: 0,
    lateCancelCount: 0,
    requiresDeposit: false,
    technicalNotes: {
      massagePreferences: 'Firm pressure on trapezius and suboccipitals, avoid lavender oils, prefer eucalyptus & cedarwood.'
    }
  }
];

// Today's date reference in 2026
const TODAY = '2026-10-21';

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    clientId: 'cli-1',
    clientName: 'David Vance',
    clientPhone: '+1 (555) 382-9014',
    clientEmail: 'david.vance@example.com',
    serviceId: 'srv-1',
    staffId: 'staff-1',
    date: TODAY,
    time: '09:00',
    durationMinutes: 45,
    price: 55,
    status: 'completed',
    depositPaid: true,
    depositAmount: 25,
    reminders: [
      {
        id: 'rem-1',
        type: 'email',
        timingLabel: '48h Confirmation',
        sentAt: '2026-10-19 09:00',
        status: 'delivered',
        contentPreview: 'Your appointment with Marcus Thorne is confirmed for Wed 9:00 AM.'
      },
      {
        id: 'rem-2',
        type: 'sms',
        timingLabel: '24h SMS Confirmation',
        sentAt: '2026-10-20 09:00',
        status: 'read',
        contentPreview: 'BookFlow Alert: Reply C to confirm or click here to manage: https://bookflow.io/c/apt-101'
      }
    ],
    checkoutData: {
      servicesTotal: 55,
      retailTotal: 28, // Styling clay
      tipAmount: 15,
      depositDeduction: 25,
      finalPaid: 73,
      paymentMethod: 'card',
      completedAt: '2026-10-21 09:48'
    }
  },
  {
    id: 'apt-102',
    clientId: 'cli-4',
    clientName: 'Jason Bradley',
    clientPhone: '+1 (555) 604-8199',
    clientEmail: 'jbradley@example.com',
    serviceId: 'srv-1',
    staffId: 'staff-1',
    date: TODAY,
    time: '10:00',
    durationMinutes: 45,
    price: 55,
    status: 'no_show',
    depositPaid: true,
    depositAmount: 25, // Deposit forfeited, protected $25 of the $55 loss!
    reminders: [
      {
        id: 'rem-3',
        type: 'sms',
        timingLabel: '24h SMS Confirmation',
        sentAt: '2026-10-20 10:00',
        status: 'delivered',
        contentPreview: 'Reminder: Marcus Thorne at 10:00 AM. Unconfirmed slots may be reallocated.'
      },
      {
        id: 'rem-4',
        type: 'sms',
        timingLabel: '2h Arrival Alert',
        sentAt: '2026-10-21 08:00',
        status: 'delivered',
        contentPreview: 'Day-of reminder: 10:00 AM appointment. Street parking available.'
      }
    ],
    notes: 'Did not arrive. Deposit forfeited per 24h cancellation agreement.'
  },
  {
    id: 'apt-103',
    clientId: 'cli-3',
    clientName: 'Sophia Chen',
    clientPhone: '+1 (555) 914-6330',
    clientEmail: 'sophia.chen@example.com',
    serviceId: 'srv-4',
    staffId: 'staff-2',
    date: TODAY,
    time: '10:30',
    durationMinutes: 120,
    price: 195,
    status: 'confirmed',
    depositPaid: true,
    depositAmount: 50,
    reminders: [
      {
        id: 'rem-5',
        type: 'email',
        timingLabel: '48h Reminder & Prep',
        sentAt: '2026-10-19 10:30',
        status: 'delivered',
        contentPreview: 'Please arrive with clean dry hair for your balayage session.'
      },
      {
        id: 'rem-6',
        type: 'sms',
        timingLabel: '24h SMS Confirmation',
        sentAt: '2026-10-20 10:30',
        status: 'delivered',
        contentPreview: 'Confirmed with Elena Rostova for 10:30 AM.'
      }
    ]
  },
  {
    id: 'apt-104',
    clientId: 'cli-2',
    clientName: 'Liam Henderson',
    clientPhone: '+1 (555) 729-4112',
    clientEmail: 'liam.h@example.com',
    serviceId: 'srv-1',
    staffId: 'staff-1',
    date: TODAY,
    time: '13:00',
    durationMinutes: 45,
    price: 55,
    status: 'confirmed',
    depositPaid: true,
    depositAmount: 25,
    reminders: [
      {
        id: 'rem-7',
        type: 'sms',
        timingLabel: '24h SMS Confirmation',
        sentAt: '2026-10-20 13:00',
        status: 'delivered',
        contentPreview: 'Reminder: 1:00 PM today with Marcus Thorne.'
      }
    ]
  },
  {
    id: 'apt-105',
    clientId: 'cli-5',
    clientName: 'Olivia Martinez',
    clientPhone: '+1 (555) 441-2900',
    clientEmail: 'olivia.m@example.com',
    serviceId: 'srv-5',
    staffId: 'staff-3',
    date: TODAY,
    time: '14:00',
    durationMinutes: 45,
    price: 85,
    status: 'pending_confirmation',
    depositPaid: true,
    depositAmount: 30,
    reminders: [
      {
        id: 'rem-8',
        type: 'sms',
        timingLabel: '24h SMS Confirmation',
        sentAt: '2026-10-20 14:00',
        status: 'delivered',
        contentPreview: 'Pending Confirmation: Tap here to confirm your 2:00 PM session.'
      }
    ]
  },
  {
    id: 'apt-106',
    clientId: 'cli-demo-cancel',
    clientName: 'Alexander Hayes',
    clientPhone: '+1 (555) 819-3310',
    clientEmail: 'a.hayes@example.com',
    serviceId: 'srv-2',
    staffId: 'staff-1',
    date: TODAY,
    time: '15:00',
    durationMinutes: 60,
    price: 75,
    status: 'cancelled', // This cancelled slot provides immediate active demonstration of the cancellation recovery engine!
    depositPaid: false,
    depositAmount: 0,
    cancellationReason: 'Flight delayed arriving from Chicago',
    cancelledAt: '2026-10-21 08:30',
    reminders: [],
    notes: 'Cancelled with 6.5h notice. Slot available for automated waitlist claim!'
  },
  {
    id: 'apt-107',
    clientId: 'cli-demo-recover',
    clientName: 'Nadia Laurent',
    clientPhone: '+1 (555) 234-8899',
    clientEmail: 'nadia.l@example.com',
    serviceId: 'srv-7',
    staffId: 'staff-2',
    date: TODAY,
    time: '16:00',
    durationMinutes: 30,
    price: 50,
    status: 'confirmed',
    depositPaid: true,
    depositAmount: 25,
    isRecoveredSlot: true, // Recovered from an earlier morning cancellation!
    reminders: [
      {
        id: 'rem-9',
        type: 'sms',
        timingLabel: 'Waitlist Instant Match',
        sentAt: '2026-10-21 09:15',
        status: 'delivered',
        contentPreview: 'A priority opening became available with Elena Rostova at 4:00 PM. Claimed & Confirmed.'
      }
    ],
    notes: 'Successfully recovered from waitlist queue ($50 revenue saved).'
  }
];

export const INITIAL_WAITLIST: WaitlistEntry[] = [
  {
    id: 'wait-1',
    clientName: 'Ethan Cole',
    clientPhone: '+1 (555) 772-9104',
    clientEmail: 'ethan.cole@example.com',
    serviceId: 'srv-1', // Skin fade
    preferredStaffId: 'staff-1', // Marcus
    requestedDate: TODAY,
    timeFlexibility: 'afternoon',
    priorityScore: 92,
    createdAt: '2026-10-20 18:30',
    status: 'waiting'
  },
  {
    id: 'wait-2',
    clientName: 'Camilla Valenti',
    clientPhone: '+1 (555) 302-8811',
    clientEmail: 'c.valenti@example.com',
    serviceId: 'srv-2', // Master Cut
    preferredStaffId: 'staff-1', // Marcus (Matches the 15:00 cancelled slot perfectly!)
    requestedDate: TODAY,
    timeFlexibility: 'afternoon',
    priorityScore: 96,
    createdAt: '2026-10-21 07:10',
    status: 'waiting'
  },
  {
    id: 'wait-3',
    clientName: 'Julian Sterling',
    clientPhone: '+1 (555) 612-4402',
    clientEmail: 'julian.s@example.com',
    serviceId: 'srv-5', // Cranial Therapy
    preferredStaffId: 'staff-3', // Sarah
    requestedDate: TODAY,
    timeFlexibility: 'evening',
    priorityScore: 84,
    createdAt: '2026-10-21 08:00',
    status: 'waiting'
  },
  {
    id: 'wait-4',
    clientName: 'Maya Patel',
    clientPhone: '+1 (555) 883-1299',
    clientEmail: 'maya.p@example.com',
    serviceId: 'srv-4', // Balayage
    preferredStaffId: 'staff-2', // Elena
    requestedDate: '2026-10-22',
    timeFlexibility: 'morning',
    priorityScore: 90,
    createdAt: '2026-10-19 14:20',
    status: 'waiting'
  }
];

export const INITIAL_REMINDER_CONFIG: ReminderConfig = {
  enable48hEmail: true,
  enable24hSMS: true,
  enable2hDayOf: true,
  requireDepositForUnreliable: true,
  unreliableThresholdScore: 80,
  defaultDepositAmount: 25,
  autoOfferWaitlistOnCancel: true,
  flashDiscountPercent: 15,
  messagingProvider: 'twilio',
  providerConnected: true
};
