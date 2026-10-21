import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WaitlistEntry } from '../types';
import { 
  Users, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Plus, 
  Zap, 
  UserPlus, 
  AlertCircle,
  Calendar,
  Send,
  Timer
} from 'lucide-react';

export const WaitlistRecoveryView: React.FC = () => {
  const { 
    waitlist, 
    appointments, 
    services, 
    staff, 
    addToWaitlist, 
    offerSlotToWaitlist, 
    claimWaitlistOffer,
    broadcastFlashOpening
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    serviceId: services[0]?.id || '',
    preferredStaffId: 'any',
    requestedDate: '2026-10-21',
    timeFlexibility: 'anytime' as WaitlistEntry['timeFlexibility'],
    priorityScore: 90
  });

  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Filter cancelled appointments available for recovery
  const openCancelledSlots = appointments.filter(a => a.status === 'cancelled');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.clientPhone) return;

    addToWaitlist(formData);
    setShowAddModal(false);
    setFormData({
      clientName: '',
      clientPhone: '',
      clientEmail: '',
      serviceId: services[0]?.id || '',
      preferredStaffId: 'any',
      requestedDate: '2026-10-21',
      timeFlexibility: 'anytime',
      priorityScore: 90
    });
    setActionNotice('Client added to priority waitlist queue.');
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleOfferSlot = (waitlistId: string, date: string, time: string, staffId: string) => {
    offerSlotToWaitlist(waitlistId, date, time, staffId);
    setActionNotice('15-minute reservation hold dispatched to customer via SMS.');
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleClaim = (waitlistId: string) => {
    const recovered = claimWaitlistOffer(waitlistId);
    if (recovered) {
      setActionNotice(`Slot confirmed! $${recovered.price} in revenue recovered.`);
      setTimeout(() => setActionNotice(null), 3500);
    }
  };

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
            Waitlist & Cancellation Recovery Engine
          </h1>
          <p className="mt-1 text-sm text-neutral-600 max-w-2xl leading-relaxed">
            Eliminate revenue leakage from last-minute cancellations and unfilled gaps. 
            When a client cancels, BookFlow matches waiting clients and offers priority slots with automated reservation holds.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors shrink-0 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Client to Waitlist</span>
        </button>
      </div>

      {actionNotice && (
        <div className="p-3 bg-neutral-900 text-white text-xs rounded-lg flex items-center justify-between animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-neutral-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Cancellation Recovery Pipeline: Matching Cancelled Slots with Waitlist Candidates */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-neutral-900">
              Active Cancellation Recovery Pipeline
            </h2>
            <span className="text-xs text-neutral-500 font-mono">
              ({openCancelledSlots.length} open slot{openCancelledSlots.length !== 1 ? 's' : ''})
            </span>
          </div>
          <span className="text-xs text-neutral-500">
            Auto-ranked by client loyalty and service duration match
          </span>
        </div>

        {openCancelledSlots.length === 0 ? (
          <div className="bg-white border border-neutral-200 rounded-lg p-6 text-center text-neutral-500 text-xs">
            No unfilled cancellations currently. All scheduled chairs are locked or completed.
          </div>
        ) : (
          <div className="space-y-4">
            {openCancelledSlots.map((slot) => {
              const staffMember = staff.find(s => s.id === slot.staffId);
              const slotService = services.find(s => s.id === slot.serviceId);
              
              // Find matching waitlist candidates
              const matches = waitlist
                .filter(w => w.status === 'waiting' || (w.status === 'offered' && w.offeredSlot?.date === slot.date))
                .sort((a, b) => b.priorityScore - a.priorityScore);

              return (
                <div key={slot.id} className="bg-white border border-neutral-200 rounded-lg p-5 shadow-xs space-y-4">
                  {/* Slot Details Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-red-50 text-red-700 rounded-lg">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-semibold text-red-700 uppercase tracking-wider">
                            Cancelled Opening
                          </span>
                          <span className="text-neutral-400">·</span>
                          <span className="font-mono text-neutral-700 font-bold">{slot.date} at {slot.time}</span>
                        </div>
                        <div className="text-sm font-bold text-neutral-900 mt-0.5">
                          {slotService?.name} with {staffMember?.name}
                        </div>
                        <div className="text-xs text-neutral-500 mt-0.5">
                          Prior client: {slot.clientName} ({slot.cancellationReason || 'Late schedule change'})
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col sm:items-end justify-between items-center">
                      <div className="font-mono text-base font-bold text-neutral-900 tabular-nums">
                        ${slot.price}
                      </div>
                      <span className="text-[11px] text-neutral-500">Unrecovered loss if unfilled</span>
                    </div>
                  </div>

                  {/* Top Matched Candidates from Waitlist */}
                  <div>
                    <div className="text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                      Matching Waitlist Candidates in Queue ({matches.length})
                    </div>

                    {matches.length === 0 ? (
                      <div className="p-4 bg-neutral-50 rounded-lg text-xs text-neutral-500 flex items-center justify-between">
                        <span>No exact match found in current queue for this service and chair.</span>
                        <button
                          onClick={() => broadcastFlashOpening(slot.date, slot.time, slot.staffId, 15)}
                          className="px-3 py-1.5 bg-neutral-900 text-white rounded text-xs font-medium hover:bg-neutral-800"
                        >
                          Send Flash Gap Broadcast (15% Off)
                        </button>
                      </div>
                    ) : (
                      <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-lg overflow-hidden">
                        {matches.map((candidate) => {
                          const candidateSrv = services.find(s => s.id === candidate.serviceId);
                          const isOffered = candidate.status === 'offered';

                          return (
                            <div key={candidate.id} className="p-4 bg-white flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-neutral-50/50 transition-colors">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-neutral-900">{candidate.clientName}</span>
                                  <span className="text-xs text-neutral-400">·</span>
                                  <span className="text-xs text-neutral-600 font-mono">{candidate.clientPhone}</span>
                                  <span className="text-xs text-neutral-400">·</span>
                                  <span className="text-xs font-mono font-medium text-neutral-700">
                                    Score: {candidate.priorityScore}/100
                                  </span>
                                </div>
                                <div className="text-xs text-neutral-500 flex items-center gap-2">
                                  <span>Requested: {candidateSrv?.name}</span>
                                  <span className="text-neutral-400">·</span>
                                  <span>Flexibility: {candidate.timeFlexibility}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                {isOffered ? (
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5 text-xs text-amber-700 font-mono bg-amber-50 px-2.5 py-1.5 rounded border border-amber-200">
                                      <Timer className="w-3.5 h-3.5" />
                                      <span>Hold expires in 14m</span>
                                    </div>
                                    <button
                                      onClick={() => handleClaim(candidate.id)}
                                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>Confirm Claim ($ {slot.price})</span>
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => handleOfferSlot(candidate.id, slot.date, slot.time, slot.staffId)}
                                    className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5"
                                  >
                                    <Send className="w-3.5 h-3.5" />
                                    <span>Dispatch 15m Reservation Hold</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* All Waitlist Queue Table */}
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <div className="p-5 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-neutral-900">
              Customer Waitlist Queue
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Clients awaiting notifications when earlier or preferred chairs open
            </p>
          </div>
          <div className="text-xs font-mono text-neutral-500">
            {waitlist.filter(w => w.status === 'waiting').length} clients currently waiting
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-600 uppercase font-semibold border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Service Requested</th>
                <th className="py-3 px-4">Preferred Staff</th>
                <th className="py-3 px-4">Requested Date</th>
                <th className="py-3 px-4">Flexibility</th>
                <th className="py-3 px-4">Priority Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-800">
              {waitlist.map((item) => {
                const srv = services.find(s => s.id === item.serviceId);
                const st = staff.find(s => s.id === item.preferredStaffId);

                return (
                  <tr key={item.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-neutral-900 whitespace-nowrap">
                      <div>{item.clientName}</div>
                      <div className="text-neutral-500 font-mono text-[11px]">{item.clientPhone}</div>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-700">
                      {srv?.name || 'Custom'}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-700">
                      {item.preferredStaffId === 'any' ? 'First Available' : st?.name}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-neutral-600 whitespace-nowrap">
                      {item.requestedDate}
                    </td>
                    <td className="py-3.5 px-4 capitalize text-neutral-600">
                      {item.timeFlexibility}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-900 tabular-nums">
                      {item.priorityScore}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {item.status === 'waiting' && <span className="text-neutral-600">Waiting</span>}
                      {item.status === 'offered' && <span className="text-amber-700 font-medium">Hold Active</span>}
                      {item.status === 'booked' && <span className="text-emerald-700 font-semibold">Booked</span>}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {item.status === 'offered' ? (
                        <button
                          onClick={() => handleClaim(item.id)}
                          className="px-2.5 py-1 bg-emerald-700 text-white rounded text-xs font-semibold hover:bg-emerald-800 transition-colors"
                        >
                          Confirm Claim
                        </button>
                      ) : item.status === 'waiting' ? (
                        <span className="text-neutral-400 text-[11px]">Ready for Match</span>
                      ) : (
                        <span className="text-neutral-400 text-[11px]">Reclaimed</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Client to Waitlist */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-neutral-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900">Add Customer to Priority Waitlist</h3>
              <button onClick={() => setShowAddModal(false)} className="text-neutral-400 hover:text-neutral-600">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-neutral-800 block mb-1">Customer Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="e.g. Jordan Mitchell"
                  className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900 focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">Phone Number (SMS)</label>
                  <input
                    type="tel"
                    required
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900 focus:outline-hidden focus:ring-1 focus:ring-neutral-900 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900 focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-800 block mb-1">Service Requested</label>
                <select
                  value={formData.serviceId}
                  onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900 focus:outline-hidden bg-white"
                >
                  {services.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} (${s.price} · {s.durationMinutes}m)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">Preferred Stylist</label>
                  <select
                    value={formData.preferredStaffId}
                    onChange={(e) => setFormData({ ...formData, preferredStaffId: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900 focus:outline-hidden bg-white"
                  >
                    <option value="any">First Available</option>
                    {staff.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">Target Date</label>
                  <input
                    type="date"
                    value={formData.requestedDate}
                    onChange={(e) => setFormData({ ...formData, requestedDate: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-800 block mb-1">Time Flexibility</label>
                <div className="grid grid-cols-4 gap-1">
                  {(['morning', 'afternoon', 'evening', 'anytime'] as const).map(flex => (
                    <button
                      type="button"
                      key={flex}
                      onClick={() => setFormData({ ...formData, timeFlexibility: flex })}
                      className={`py-1.5 px-2 rounded border text-center capitalize transition-colors ${
                        formData.timeFlexibility === flex 
                          ? 'bg-neutral-900 text-white border-neutral-900' 
                          : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                      }`}
                    >
                      {flex}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 text-neutral-600 hover:text-neutral-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-900 text-white rounded font-semibold hover:bg-neutral-800 transition-colors"
                >
                  Enqueue to Waitlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
