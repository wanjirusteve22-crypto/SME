import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Service, StaffMember } from '../types';
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle, 
  ShieldCheck, 
  Download, 
  ArrowRight, 
  ChevronLeft,
  Sparkles,
  Lock,
  Phone,
  Mail,
  Check
} from 'lucide-react';

export const ClientBookingPortalView: React.FC = () => {
  const { services, staff, appointments, bookAppointment, config, setActiveTab } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<Service | null>(services[0]);
  const [selectedStaff, setSelectedStaff] = useState<string>('any');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-22');
  const [selectedTime, setSelectedTime] = useState<string>('11:00');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  // Available time slots
  const TIME_SLOTS = [
    '09:00', '09:45', '10:30', '11:15', '13:00', '13:45', '14:30', '15:15', '16:00', '16:45', '17:30'
  ];

  // Check if slot is taken on that date/staff
  const isSlotTaken = (time: string) => {
    return appointments.some(a => 
      a.date === selectedDate && 
      a.time === time && 
      a.status !== 'cancelled' &&
      (selectedStaff === 'any' || a.staffId === selectedStaff)
    );
  };

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(s => s.category === selectedCategory);

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !clientName || !clientPhone) return;

    // Determine assigned staff member if 'any'
    let assignedStaffId = selectedStaff;
    if (assignedStaffId === 'any') {
      assignedStaffId = staff[0].id;
    }

    const newApt = bookAppointment({
      clientId: `cli-${Date.now()}`,
      clientName,
      clientPhone,
      clientEmail: clientEmail || `${clientName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      serviceId: selectedService.id,
      staffId: assignedStaffId,
      date: selectedDate,
      time: selectedTime,
      durationMinutes: selectedService.durationMinutes,
      price: selectedService.price,
      status: 'confirmed',
      depositPaid: selectedService.depositRequired,
      depositAmount: selectedService.depositAmount,
    });

    setConfirmedBookingId(newApt.id);
    setStep(5);
  };

  // Generate and download real .ics calendar file
  const handleDownloadICS = () => {
    if (!selectedService) return;
    const staffObj = staff.find(s => s.id === (selectedStaff === 'any' ? staff[0].id : selectedStaff));
    const [year, month, day] = selectedDate.split('-');
    const [hours, minutes] = selectedTime.split(':');

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//BookFlow//Grand Union Atelier//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
SUMMARY:${selectedService.name} - The Grand Union
DESCRIPTION:${selectedService.description}\\nStylist: ${staffObj?.name || 'Grand Union Team'}
DTSTART:${year}${month}${day}T${hours}${minutes}00
DTEND:${year}${month}${day}T${Number(hours) + 1}${minutes}00
LOCATION:The Grand Union Atelier, 42 Mercer Street, New York, NY
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `appointment_${selectedDate}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Editorial Storefront Hero Header */}
      <div className="relative rounded-2xl overflow-hidden bg-neutral-900 text-white min-h-[220px] flex flex-col justify-end p-6 sm:p-8">
        <img
          src="/src/assets/images/salon_interior_luxe_1792604100369.jpg"
          alt="The Grand Union Atelier"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/40 to-transparent" />
        
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="text-xs font-semibold uppercase tracking-widest text-amber-300">
            Self-Service Booking Portal Preview
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            The Grand Union Barber & Atelier
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            42 Mercer Street, Soho · Precision craftsmanship, bespoke formulations, and guaranteed chair reservations.
          </p>
        </div>
      </div>

      {/* Booking Wizard Stepper */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 sm:p-8 shadow-xs">
        {step < 5 && (
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-neutral-100 text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= 1 ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-500'
              }`}>1</span>
              <span className={step === 1 ? 'font-bold text-neutral-900' : 'text-neutral-500'}>Service</span>
            </div>
            <span className="text-neutral-300">———</span>
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= 2 ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-500'
              }`}>2</span>
              <span className={step === 2 ? 'font-bold text-neutral-900' : 'text-neutral-500'}>Specialist</span>
            </div>
            <span className="text-neutral-300">———</span>
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= 3 ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-500'
              }`}>3</span>
              <span className={step === 3 ? 'font-bold text-neutral-900' : 'text-neutral-500'}>Time Slot</span>
            </div>
            <span className="text-neutral-300">———</span>
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= 4 ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-500'
              }`}>4</span>
              <span className={step === 4 ? 'font-bold text-neutral-900' : 'text-neutral-500'}>Confirmation</span>
            </div>
          </div>
        )}

        {/* STEP 1: SERVICE SELECTION */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Select a Treatment or Service</h2>
              <p className="text-xs text-neutral-500 mt-0.5">Choose your desired treatment from our atelier menu</p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'all', label: 'All Services' },
                { id: 'hair', label: 'Hair & Styling' },
                { id: 'beard', label: 'Beard & Shave' },
                { id: 'color', label: 'Color & Gloss' },
                { id: 'spa', label: 'Spa Therapy' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === cat.id 
                      ? 'bg-neutral-900 text-white shadow-xs' 
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Service Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredServices.map(srv => {
                const isSelected = selectedService?.id === srv.id;
                return (
                  <div
                    key={srv.id}
                    onClick={() => setSelectedService(srv)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-neutral-900 ring-2 ring-neutral-900 bg-neutral-50/70' 
                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-neutral-900">{srv.name}</h3>
                      <span className="font-mono text-sm font-bold text-neutral-900 tabular-nums shrink-0">
                        ${srv.price}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                      {srv.description}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{srv.durationMinutes} minutes</span>
                      </span>
                      {srv.depositRequired && (
                        <span className="text-[11px] text-neutral-600 font-medium">
                          ${srv.depositAmount} deposit required
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                disabled={!selectedService}
                onClick={() => setStep(2)}
                className="px-6 py-2.5 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-2"
              >
                <span>Continue to Specialist</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: STAFF SELECTION */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">Choose Your Specialist</h2>
                <p className="text-xs text-neutral-500 mt-0.5">Select your preferred artisan or choose first available</p>
              </div>
              <button onClick={() => setStep(1)} className="text-xs text-neutral-600 hover:text-neutral-900 flex items-center gap-1">
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* First Available Option */}
              <div
                onClick={() => setSelectedStaff('any')}
                className={`p-4 rounded-xl border text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[180px] ${
                  selectedStaff === 'any' ? 'border-neutral-900 ring-2 ring-neutral-900 bg-neutral-50/70' : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 mb-3">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-neutral-900">First Available</div>
                <div className="text-xs text-neutral-500 mt-1">Maximum scheduling flexibility</div>
              </div>

              {staff.map(st => (
                <div
                  key={st.id}
                  onClick={() => setSelectedStaff(st.id)}
                  className={`p-4 rounded-xl border text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[180px] ${
                    selectedStaff === st.id ? 'border-neutral-900 ring-2 ring-neutral-900 bg-neutral-50/70' : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <img
                    src={st.avatarUrl}
                    alt={st.name}
                    className="w-14 h-14 rounded-full object-cover border border-neutral-300 mb-3"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="text-sm font-bold text-neutral-900">{st.name}</div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">{st.role.split('&')[0]}</div>
                  <div className="text-[11px] text-neutral-700 font-mono mt-1 font-medium">★ {st.rating} rating</div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-between items-center">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs text-neutral-600 hover:text-neutral-900 font-medium"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2.5 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-2"
              >
                <span>Select Date & Time</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: DATE & TIME */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">Select Date & Time Slot</h2>
                <p className="text-xs text-neutral-500 mt-0.5">Real-time availability synced with our chair schedule</p>
              </div>
              <button onClick={() => setStep(2)} className="text-xs text-neutral-600 hover:text-neutral-900 flex items-center gap-1">
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Date Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-800 block">Choose Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  min="2026-10-21"
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm font-mono text-neutral-900 focus:outline-hidden"
                />
                <p className="text-[11px] text-neutral-500">
                  Select any weekday or weekend date to view available chairs.
                </p>
              </div>

              {/* Time Slots */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-800 block">Open Time Slots</label>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map(time => {
                    const taken = isSlotTaken(time);
                    const isSelected = selectedTime === time;

                    return (
                      <button
                        key={time}
                        disabled={taken}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 px-2 text-xs font-mono rounded-lg border transition-colors ${
                          taken 
                            ? 'bg-neutral-100 text-neutral-400 border-neutral-200 line-through cursor-not-allowed'
                            : isSelected
                            ? 'bg-neutral-900 text-white border-neutral-900 font-bold'
                            : 'bg-white text-neutral-800 border-neutral-200 hover:border-neutral-400'
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 text-xs text-neutral-600 hover:text-neutral-900 font-medium"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-6 py-2.5 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-2"
              >
                <span>Review & Enter Contact</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: CONTACT & DEPOSIT POLICY */}
        {step === 4 && (
          <form onSubmit={handleConfirmBooking} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">Guest Details & Reservation Protection</h2>
                <p className="text-xs text-neutral-500 mt-0.5">Please provide your contact information to receive SMS verification</p>
              </div>
              <button type="button" onClick={() => setStep(3)} className="text-xs text-neutral-600 hover:text-neutral-900 flex items-center gap-1">
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
            </div>

            {/* Booking Summary Box */}
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-neutral-900 text-sm">
                <span>{selectedService?.name}</span>
                <span className="font-mono tabular-nums">${selectedService?.price}</span>
              </div>
              <div className="text-neutral-600 flex items-center gap-3">
                <span>Date: <strong className="font-mono text-neutral-900">{selectedDate}</strong> at <strong className="font-mono text-neutral-900">{selectedTime}</strong></span>
                <span>·</span>
                <span>Specialist: <strong>{staff.find(s => s.id === selectedStaff)?.name || 'First Available'}</strong></span>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-neutral-800 block mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Nicholas Reed"
                  className="w-full p-2.5 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">Mobile Phone Number (For SMS reminders)</label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full p-2.5 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="nicholas@example.com"
                    className="w-full p-2.5 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Cancellation & Deposit Policy Notice */}
            <div className="p-4 bg-neutral-50/80 border border-neutral-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-neutral-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Chair Reservation Protection Policy</span>
              </div>
              <p className="text-neutral-600 leading-relaxed">
                By confirming, you agree to our 24-hour cancellation window. Cancellations within 24 hours forfeit the deposit (${selectedService?.depositRequired ? selectedService.depositAmount : config.defaultDepositAmount}). No-shows are charged 50% of the service.
              </p>
            </div>

            <div className="pt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 text-xs text-neutral-600 hover:text-neutral-900 font-medium"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Lock In Reservation</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 5: BOOKING SUCCESS & CALENDAR DOWNLOAD */}
        {step === 5 && (
          <div className="text-center py-6 space-y-6">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-emerald-700" />
            </div>

            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 font-mono">
                Reservation #{confirmedBookingId}
              </div>
              <h2 className="text-2xl font-bold text-neutral-900">
                Your Appointment is Confirmed!
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                Thank you, {clientName}. We have reserved your chair at The Grand Union Atelier on <strong className="text-neutral-900 font-mono">{selectedDate}</strong> at <strong className="text-neutral-900 font-mono">{selectedTime}</strong>.
              </p>
            </div>

            {/* Simulated Live SMS Confirmation Receipt */}
            <div className="max-w-md mx-auto p-4 bg-neutral-900 text-white rounded-xl text-left space-y-2 text-xs shadow-sm">
              <div className="flex items-center justify-between text-neutral-400 text-[11px]">
                <span className="flex items-center gap-1 font-mono">
                  <Phone className="w-3 h-3" />
                  SMS Sent to {clientPhone}
                </span>
                <span className="text-emerald-400 font-medium">Delivered · Twilio</span>
              </div>
              <p className="text-neutral-200 font-mono leading-relaxed text-[11px]">
                &ldquo;BookFlow Alert: Confirmed at The Grand Union for {selectedService?.name} on {selectedDate} at {selectedTime}. Reply C to confirm or tap to reschedule: https://bookflow.io/c/{confirmedBookingId}&rdquo;
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleDownloadICS}
                className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Add to Apple / Google Calendar (.ics)</span>
              </button>

              <button
                onClick={() => {
                  setStep(1);
                  setClientName('');
                  setClientPhone('');
                  setClientEmail('');
                }}
                className="px-4 py-2.5 border border-neutral-300 text-neutral-700 hover:bg-neutral-50 rounded-lg text-xs font-medium transition-colors"
              >
                Book Another Service
              </button>

              <button
                onClick={() => setActiveTab('schedule')}
                className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-lg text-xs font-medium transition-colors"
              >
                Return to Admin Schedule
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
