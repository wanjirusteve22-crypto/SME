import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Appointment, StaffMember } from '../types';
import { 
  Calendar, 
  Clock, 
  User, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Phone, 
  Mail, 
  Send, 
  CreditCard,
  Sparkles,
  Zap
} from 'lucide-react';

interface OperationsScheduleViewProps {
  onOpenCheckout: (appointment: Appointment) => void;
  onOpenNewAppointment: () => void;
}

export const OperationsScheduleView: React.FC<OperationsScheduleViewProps> = ({ 
  onOpenCheckout,
  onOpenNewAppointment
}) => {
  const { 
    appointments, 
    staff, 
    services, 
    clients,
    selectedDate, 
    setSelectedDate,
    confirmAppointment,
    cancelAppointment,
    markNoShow,
    sendManualReminder,
    findGapsForDate,
    broadcastFlashOpening
  } = useApp();

  const [selectedStaffFilter, setSelectedStaffFilter] = useState<string>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('');
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [reminderSentMessage, setReminderSentMessage] = useState<string | null>(null);

  // Filter appointments for selected date
  const dayAppointments = appointments.filter(a => a.date === selectedDate);
  const gaps = findGapsForDate(selectedDate, selectedStaffFilter === 'all' ? undefined : selectedStaffFilter);

  const filteredStaff = selectedStaffFilter === 'all' 
    ? staff 
    : staff.filter(s => s.id === selectedStaffFilter);

  const handleSendReminder = (type: 'sms' | 'email') => {
    if (selectedAppointment) {
      sendManualReminder(selectedAppointment.id, type);
      setReminderSentMessage(`Verified ${type.toUpperCase()} confirmation reminder dispatched.`);
      setTimeout(() => setReminderSentMessage(null), 3000);
    }
  };

  const handleConfirm = () => {
    if (selectedAppointment) {
      confirmAppointment(selectedAppointment.id);
      setSelectedAppointment(prev => prev ? { ...prev, status: 'confirmed' } : null);
    }
  };

  const handleCancelSubmit = () => {
    if (selectedAppointment && cancelReason.trim()) {
      cancelAppointment(selectedAppointment.id, cancelReason);
      setIsCancelling(false);
      setSelectedAppointment(null);
      setCancelReason('');
    }
  };

  const handleNoShow = () => {
    if (selectedAppointment) {
      markNoShow(selectedAppointment.id);
      setSelectedAppointment(prev => prev ? { ...prev, status: 'no_show' } : null);
    }
  };

  const getService = (serviceId: string) => services.find(s => s.id === serviceId);
  const getClient = (clientPhone: string) => clients.find(c => c.phone === clientPhone);

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Chair & Staff Operations Schedule
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Real-time chair occupancy, gap detection, and rapid appointment status controls
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Date Picker */}
          <div className="flex items-center gap-2 bg-white border border-neutral-300 rounded-lg px-3 py-1.5 text-xs">
            <Calendar className="w-3.5 h-3.5 text-neutral-500" />
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="font-mono text-xs bg-transparent focus:outline-hidden text-neutral-800"
            />
          </div>

          {/* Staff Filter Tabs */}
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg">
            <button
              onClick={() => setSelectedStaffFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                selectedStaffFilter === 'all' ? 'bg-white text-neutral-950 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              All Chairs
            </button>
            {staff.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedStaffFilter(s.id)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  selectedStaffFilter === s.id ? 'bg-white text-neutral-950 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {s.name.split(' ')[0]}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenNewAppointment}
            className="px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-medium hover:bg-neutral-800 transition-colors"
          >
            + Quick Slot
          </button>
        </div>
      </div>

      {/* Calendar Gap Detection Banner (Problem B: Empty Slots & Lost Revenue) */}
      {gaps.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-amber-950 uppercase tracking-wide">
                  Revenue Leakage Alert: {gaps.length} Orphaned Chair Gap{gaps.length > 1 ? 's' : ''} Detected
                </div>
                <div className="text-xs text-amber-800 mt-0.5">
                  Gaps between appointments waste stylist time. Convert them into quick add-ons or flash openings.
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {gaps.map((gap, idx) => {
                const staffMember = staff.find(s => s.id === gap.staffId);
                const suggestedSrv = services.find(s => s.id === gap.suggestedServiceId);
                return (
                  <button
                    key={idx}
                    onClick={() => broadcastFlashOpening(gap.date, gap.startTime, gap.staffId, 15)}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded-md transition-colors flex items-center gap-1.5"
                  >
                    <Zap className="w-3 h-3" />
                    <span>
                      Fill {staffMember?.name.split(' ')[0]} {gap.startTime}-{gap.endTime} ({gap.durationMinutes}m)
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Multi-Staff Chair Columns */}
      <div className={`grid grid-cols-1 ${filteredStaff.length > 1 ? 'md:grid-cols-3' : 'md:grid-cols-1'} gap-6`}>
        {filteredStaff.map((staffMember) => {
          const staffApts = dayAppointments
            .filter(a => a.staffId === staffMember.id)
            .sort((a, b) => a.time.localeCompare(b.time));

          return (
            <div key={staffMember.id} className="bg-white border border-neutral-200 rounded-lg flex flex-col overflow-hidden">
              {/* Chair Column Header */}
              <div className="p-4 border-b border-neutral-200 bg-neutral-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={staffMember.avatarUrl} 
                    alt={staffMember.name}
                    className="w-10 h-10 rounded-full object-cover border border-neutral-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 leading-tight">
                      {staffMember.name}
                    </h3>
                    <div className="text-[11px] text-neutral-500">
                      Chair #{staffMember.chairNumber} · {staffMember.role.split('&')[0]}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-semibold text-neutral-800 tabular-nums">
                    {staffApts.filter(a => a.status !== 'cancelled').length} Bookings
                  </div>
                  <div className="text-[11px] text-neutral-500 font-mono">
                    {staffMember.workingHours}
                  </div>
                </div>
              </div>

              {/* Appointment Slot Cards List */}
              <div className="p-4 space-y-3 flex-1 min-h-[360px]">
                {staffApts.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
                    <Clock className="w-8 h-8 text-neutral-300 mb-2 stroke-1" />
                    <span className="text-xs text-neutral-500 font-medium">No appointments scheduled</span>
                    <span className="text-[11px] text-neutral-400 mt-1">This chair is available for walk-ins or waitlist booking</span>
                  </div>
                ) : (
                  staffApts.map((apt) => {
                    const srv = getService(apt.serviceId);
                    const isSelected = selectedAppointment?.id === apt.id;

                    return (
                      <div
                        key={apt.id}
                        onClick={() => setSelectedAppointment(apt)}
                        className={`p-3.5 rounded-lg border text-left cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-neutral-900 ring-1 ring-neutral-900 bg-neutral-50/80 shadow-xs' 
                            : apt.status === 'cancelled'
                            ? 'border-dashed border-red-200 bg-red-50/30 opacity-70'
                            : apt.status === 'no_show'
                            ? 'border-dashed border-amber-300 bg-amber-50/40'
                            : apt.status === 'completed'
                            ? 'border-neutral-200 bg-neutral-50/30'
                            : 'border-neutral-200 bg-white hover:border-neutral-400 shadow-xs'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-neutral-900 tabular-nums">
                              {apt.time}
                            </span>
                            <span className="text-xs text-neutral-400">·</span>
                            <span className="text-xs text-neutral-500 font-mono">
                              {apt.durationMinutes}m
                            </span>
                          </div>

                          {/* Status as Clean Text (Zero-Pill Rule) */}
                          <div className="text-[11px] font-semibold tracking-wide">
                            {apt.status === 'confirmed' && (
                              <span className="text-emerald-700">Confirmed</span>
                            )}
                            {apt.status === 'pending_confirmation' && (
                              <span className="text-amber-700">Needs Confirmation</span>
                            )}
                            {apt.status === 'completed' && (
                              <span className="text-neutral-500">Completed</span>
                            )}
                            {apt.status === 'cancelled' && (
                              <span className="text-red-700 font-medium">Cancelled</span>
                            )}
                            {apt.status === 'no_show' && (
                              <span className="text-amber-800 font-medium">No-Show</span>
                            )}
                          </div>
                        </div>

                        <div className="mt-2 text-sm font-semibold text-neutral-900">
                          {apt.clientName}
                        </div>

                        <div className="text-xs text-neutral-600 line-clamp-1 mt-0.5">
                          {srv?.name || 'Custom Service'}
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                          <span className="font-mono tabular-nums text-neutral-700 font-medium">
                            ${apt.price}
                          </span>
                          
                          <div className="flex items-center gap-2">
                            {apt.isRecoveredSlot && (
                              <span className="text-emerald-700 text-[11px] font-medium flex items-center gap-0.5">
                                <Sparkles className="w-3 h-3 text-emerald-600" />
                                <span>Recovered</span>
                              </span>
                            )}
                            {apt.depositPaid ? (
                              <span className="text-emerald-700 text-[11px] font-mono">
                                ${apt.depositAmount} Deposit
                              </span>
                            ) : (
                              <span className="text-neutral-400 text-[11px]">No Deposit</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Appointment Detail & Fast Actions Modal / Drawer */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full border border-neutral-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Appointment Workspace
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mt-0.5">
                  {selectedAppointment.clientName}
                </h3>
              </div>
              <button 
                onClick={() => { setSelectedAppointment(null); setIsCancelling(false); }}
                className="text-neutral-400 hover:text-neutral-600 p-1"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              {/* Timing & Stylist */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-neutral-50 rounded-lg text-xs">
                <div>
                  <span className="text-neutral-500 block">Date & Time</span>
                  <span className="font-mono font-semibold text-neutral-900">
                    {selectedAppointment.date} at {selectedAppointment.time} ({selectedAppointment.durationMinutes} min)
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Service Specialist</span>
                  <span className="font-semibold text-neutral-900">
                    {staff.find(s => s.id === selectedAppointment.staffId)?.name}
                  </span>
                </div>
              </div>

              {/* Service & Price */}
              <div className="flex items-center justify-between py-2 border-b border-neutral-100 text-xs">
                <div>
                  <div className="font-semibold text-neutral-900">
                    {getService(selectedAppointment.serviceId)?.name}
                  </div>
                  <div className="text-neutral-500 mt-0.5">
                    {selectedAppointment.depositPaid 
                      ? `Prepaid deposit of $${selectedAppointment.depositAmount} secured.` 
                      : 'No upfront deposit on file.'}
                  </div>
                </div>
                <div className="text-right font-mono text-sm font-bold text-neutral-900 tabular-nums">
                  ${selectedAppointment.price}
                </div>
              </div>

              {/* Client Contact & Risk Profile */}
              {(() => {
                const client = getClient(selectedAppointment.clientPhone);
                return (
                  <div className="p-3 border border-neutral-200 rounded-lg space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Client Contact & History</span>
                      <span className="font-mono font-semibold text-neutral-900">
                        {client ? `${client.reliabilityScore}% Reliability Score` : 'New Guest'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-neutral-700">
                      <span className="flex items-center gap-1 font-mono">
                        <Phone className="w-3.5 h-3.5 text-neutral-400" />
                        {selectedAppointment.clientPhone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-neutral-400" />
                        {selectedAppointment.clientEmail}
                      </span>
                    </div>
                    {client?.technicalNotes.haircutGuards && (
                      <div className="pt-2 border-t border-neutral-100 text-neutral-600 italic">
                        <strong>Formula/Guard Notes:</strong> {client.technicalNotes.haircutGuards}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Feedback messages */}
              {reminderSentMessage && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>{reminderSentMessage}</span>
                </div>
              )}

              {/* Cancellation Form if toggled */}
              {isCancelling ? (
                <div className="p-3 bg-red-50/50 border border-red-200 rounded-lg space-y-3">
                  <label className="text-xs font-semibold text-red-900 block">
                    Reason for Cancellation (Stored for analytics):
                  </label>
                  <input
                    type="text"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="e.g. Schedule conflict, feeling unwell, flight delay"
                    className="w-full px-3 py-2 text-xs border border-red-300 rounded focus:outline-hidden bg-white text-neutral-900"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setIsCancelling(false)}
                      className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleCancelSubmit}
                      disabled={!cancelReason.trim()}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded transition-colors disabled:opacity-50"
                    >
                      Confirm Cancellation & Offer to Waitlist
                    </button>
                  </div>
                </div>
              ) : (
                /* Primary Actions Grid */
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {selectedAppointment.status !== 'completed' && selectedAppointment.status !== 'cancelled' && (
                    <button
                      onClick={() => {
                        onOpenCheckout(selectedAppointment);
                        setSelectedAppointment(null);
                      }}
                      className="col-span-2 py-2.5 px-4 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Complete Appointment & POS Checkout</span>
                    </button>
                  )}

                  {selectedAppointment.status === 'pending_confirmation' && (
                    <button
                      onClick={handleConfirm}
                      className="py-2 px-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded text-xs font-medium hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Confirm Status</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleSendReminder('sms')}
                    className="py-2 px-3 border border-neutral-300 rounded text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Send SMS Reminder</span>
                  </button>

                  {selectedAppointment.status !== 'completed' && selectedAppointment.status !== 'cancelled' && (
                    <>
                      <button
                        onClick={handleNoShow}
                        className="py-2 px-3 border border-amber-300 text-amber-800 bg-amber-50 rounded text-xs font-medium hover:bg-amber-100 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Mark No-Show</span>
                      </button>

                      <button
                        onClick={() => setIsCancelling(true)}
                        className="py-2 px-3 border border-red-200 text-red-700 rounded text-xs font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5 text-red-600" />
                        <span>Cancel Booking</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
