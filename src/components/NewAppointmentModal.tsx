import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus } from 'lucide-react';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({ isOpen, onClose }) => {
  const { services, staff, clients, selectedDate, bookAppointment } = useApp();

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [serviceId, setServiceId] = useState(services[0]?.id || '');
  const [staffId, setStaffId] = useState(staff[0]?.id || '');
  const [date, setDate] = useState(selectedDate);
  const [time, setTime] = useState('11:00');
  const [depositPaid, setDepositPaid] = useState(true);

  if (!isOpen) return null;

  const selectedService = services.find(s => s.id === serviceId) || services[0];

  const handleClientSelect = (clientId: string) => {
    const c = clients.find(client => client.id === clientId);
    if (c) {
      setClientName(c.name);
      setClientPhone(c.phone);
      setClientEmail(c.email);
      if (c.requiresDeposit) {
        setDepositPaid(true);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) return;

    bookAppointment({
      clientId: `cli-${Date.now()}`,
      clientName,
      clientPhone,
      clientEmail: clientEmail || `${clientName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      serviceId,
      staffId,
      date,
      time,
      durationMinutes: selectedService.durationMinutes,
      price: selectedService.price,
      status: 'confirmed',
      depositPaid: selectedService.depositRequired ? depositPaid : false,
      depositAmount: selectedService.depositAmount,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full border border-neutral-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
          <h3 className="text-base font-bold text-neutral-900">Book New Appointment Slot</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Quick Client Autocomplete */}
          <div>
            <label className="font-semibold text-neutral-800 block mb-1">
              Select Existing Client (Or enter new guest below)
            </label>
            <select
              onChange={(e) => handleClientSelect(e.target.value)}
              className="w-full p-2 border border-neutral-300 rounded text-neutral-900 bg-white"
            >
              <option value="">-- Choose Existing Client --</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone} · {c.reliabilityScore}% reliability)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-neutral-800 block mb-1">Guest Name</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Jordan Price"
                className="w-full p-2 border border-neutral-300 rounded text-neutral-900 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="font-semibold text-neutral-800 block mb-1">Phone Number</label>
              <input
                type="tel"
                required
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full p-2 border border-neutral-300 rounded text-neutral-900 focus:outline-hidden font-mono"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-neutral-800 block mb-1">Service</label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full p-2 border border-neutral-300 rounded text-neutral-900 bg-white"
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
              <label className="font-semibold text-neutral-800 block mb-1">Artisan / Specialist</label>
              <select
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                className="w-full p-2 border border-neutral-300 rounded text-neutral-900 bg-white"
              >
                {staff.map(st => (
                  <option key={st.id} value={st.id}>{st.name} (Chair #{st.chairNumber})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-semibold text-neutral-800 block mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border border-neutral-300 rounded text-neutral-900 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-neutral-800 block mb-1">Start Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2 border border-neutral-300 rounded text-neutral-900 font-mono"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={depositPaid}
                  onChange={(e) => setDepositPaid(e.target.checked)}
                  className="rounded text-neutral-900 focus:ring-neutral-900 h-4 w-4"
                />
                <span className="font-medium text-neutral-800">
                  Prepaid Deposit (${selectedService.depositAmount})
                </span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-neutral-600 hover:text-neutral-900 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-neutral-900 text-white rounded font-semibold hover:bg-neutral-800 transition-colors"
            >
              Confirm Reservation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
