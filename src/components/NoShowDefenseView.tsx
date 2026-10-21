import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  DollarSign, 
  Send, 
  Settings2, 
  Zap, 
  Lock,
  Smartphone,
  Mail,
  HelpCircle,
  FileText
} from 'lucide-react';

export const NoShowDefenseView: React.FC = () => {
  const { 
    metrics, 
    appointments, 
    waitlist, 
    config, 
    updateReminderConfig, 
    simulateInstantRecovery,
    sendManualReminder,
    confirmAppointment
  } = useApp();

  const [simulatedSuccess, setSimulatedSuccess] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<'twilio' | 'whatsapp_business' | 'sendgrid'>(config.messagingProvider);

  // Find demo cancelled slot and matching waitlist candidate
  const cancelledSlot = appointments.find(a => a.status === 'cancelled');
  const matchedCandidate = waitlist.find(w => w.status === 'waiting' && w.serviceId === (cancelledSlot?.serviceId || 'srv-2'));

  const handleSimulate = () => {
    if (cancelledSlot && matchedCandidate) {
      simulateInstantRecovery(cancelledSlot.id, matchedCandidate.id);
      setSimulatedSuccess(true);
      setTimeout(() => setSimulatedSuccess(false), 4000);
    }
  };

  // Aggregate all delivered reminders across all appointments for the provider audit log
  const allReminders = appointments.flatMap(apt => 
    apt.reminders.map(rem => ({
      ...rem,
      clientName: apt.clientName,
      clientPhone: apt.clientPhone,
      appointmentTime: `${apt.date} ${apt.time}`,
      appointmentStatus: apt.status
    }))
  ).sort((a, b) => b.sentAt.localeCompare(a.sentAt));

  return (
    <div className="space-y-8">
      {/* Editorial Overview Section */}
      <div className="border-b border-neutral-200 pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
          No-Show Defense & Financial Protection
        </h1>
        <p className="mt-2 text-sm text-neutral-600 max-w-3xl leading-relaxed">
          Appointment no-shows cost service businesses an average of 15% to 22% in unrecoverable revenue each month. 
          BookFlow prevents revenue leakage through timed multi-channel reminders, mandatory deposits for high-risk guests, 
          and immediate waitlist backfills.
        </p>
      </div>

      {/* KPI Financial Metric Strip - Clean tabular alignment, zero pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 p-5 rounded-lg shadow-xs">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Unprotected No-Show Loss
          </div>
          <div className="mt-2 text-3xl font-bold text-neutral-900 font-mono tabular-nums">
            ${metrics.noShowLoss}
          </div>
          <div className="mt-2 text-xs text-neutral-500 flex items-center gap-1.5">
            <span>Direct empty chair loss this month</span>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 p-5 rounded-lg shadow-xs">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Deposit Policy Protection
          </div>
          <div className="mt-2 text-3xl font-bold text-emerald-700 font-mono tabular-nums">
            ${metrics.depositProtected}
          </div>
          <div className="mt-2 text-xs text-neutral-500 flex items-center gap-1.5">
            <span>Retained via required prepayment rules</span>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 p-5 rounded-lg shadow-xs">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Recovered Slot Revenue
          </div>
          <div className="mt-2 text-3xl font-bold text-neutral-900 font-mono tabular-nums">
            ${metrics.recoveredRevenue}
          </div>
          <div className="mt-2 text-xs text-neutral-500 flex items-center gap-1.5">
            <span>Reclaimed by fast waitlist backfill</span>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 p-5 rounded-lg shadow-xs">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Net Slot Recovery Rate
          </div>
          <div className="mt-2 text-3xl font-bold text-neutral-900 font-mono tabular-nums">
            {metrics.recoveryRate}%
          </div>
          <div className="mt-2 text-xs text-neutral-500 flex items-center gap-1.5">
            <span>Percentage of cancelled slots rebooked</span>
          </div>
        </div>
      </div>

      {/* Interactive Simulation Callout: Test the full Recovery Engine */}
      <div className="bg-neutral-900 text-white rounded-xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 tracking-wide uppercase">
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Real-World Scenario Simulator</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              Watch BookFlow Reclaim Lost Revenue in Real-Time
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {cancelledSlot ? (
                <>
                  Alexander Hayes cancelled a <strong className="text-white">$75 Master Scissor Cut</strong> slot for today at 3:00 PM. 
                  Candidate <strong>Camilla Valenti</strong> is waiting in the queue for that exact stylist. 
                  Trigger the 1-click recovery pipeline to offer and claim the slot instantly.
                </>
              ) : (
                <>
                  All cancelled slots are currently filled! You can cancel any scheduled appointment from the Chair Schedule 
                  tab to observe the automated waitlist matching protocol.
                </>
              )}
            </p>
          </div>

          <div className="shrink-0">
            {cancelledSlot && matchedCandidate ? (
              <button
                onClick={handleSimulate}
                disabled={simulatedSuccess}
                className="w-full sm:w-auto px-5 py-3 text-xs font-semibold bg-white text-neutral-950 rounded-lg hover:bg-neutral-100 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{simulatedSuccess ? 'Slot Successfully Reclaimed ($75 Saved)!' : 'Run 1-Click Recovery ($75 Slot)'}</span>
              </button>
            ) : (
              <div className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg text-xs font-mono text-center">
                Recovery Pipeline Active
              </div>
            )}
          </div>
        </div>

        {simulatedSuccess && (
          <div className="mt-4 pt-4 border-t border-neutral-800 text-xs text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Success: Slot reassigned to Camilla Valenti. Automated confirmation SMS dispatched with instant arrival instructions.</span>
          </div>
        )}
      </div>

      {/* Two Column Layout: Automated Schedules & Deposit Policies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Automated Reminder Architecture */}
        <div className="bg-white border border-neutral-200 rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                Multi-Channel Reminder Sequence
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Timed cadences that enforce client arrival and unblock empty chairs
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
              Provider Active
            </span>
          </div>

          <div className="space-y-4">
            {/* 48-Hour Email */}
            <div className="flex items-start justify-between gap-4 p-4 border border-neutral-200 rounded-lg bg-neutral-50/50">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-neutral-200 text-neutral-700 rounded-md shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-900">48-Hour Email Notice & Prep</div>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                    Includes calendar (.ics) sync, service prep instructions (e.g. hair wash guidelines, allergy checks), and 24h cancellation deadline notice.
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input 
                  type="checkbox" 
                  checked={config.enable48hEmail} 
                  onChange={(e) => updateReminderConfig({ enable48hEmail: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-neutral-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-neutral-900"></div>
              </label>
            </div>

            {/* 24-Hour SMS Interactive Confirmation */}
            <div className="flex items-start justify-between gap-4 p-4 border border-neutral-200 rounded-lg bg-neutral-50/50">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-neutral-200 text-neutral-700 rounded-md shrink-0">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-900">24-Hour Interactive SMS Confirmation</div>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                    Client replies &apos;C&apos; or taps secure 1-click link to confirm. Unconfirmed slots after 12h alert reception to prevent ghost reservations.
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input 
                  type="checkbox" 
                  checked={config.enable24hSMS} 
                  onChange={(e) => updateReminderConfig({ enable24hSMS: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-neutral-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-neutral-900"></div>
              </label>
            </div>

            {/* 2-Hour Day-Of SMS */}
            <div className="flex items-start justify-between gap-4 p-4 border border-neutral-200 rounded-lg bg-neutral-50/50">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-neutral-200 text-neutral-700 rounded-md shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-900">2-Hour Day-Of Arrival Alert</div>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                    Navigation link, studio street parking instructions, and self-check-in link for when they step through the door.
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input 
                  type="checkbox" 
                  checked={config.enable2hDayOf} 
                  onChange={(e) => updateReminderConfig({ enable2hDayOf: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-neutral-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-neutral-900"></div>
              </label>
            </div>
          </div>

          {/* Provider Selection */}
          <div className="pt-2 border-t border-neutral-100">
            <label className="text-xs font-semibold text-neutral-700 block mb-2">
              Integrated Dispatch Provider
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => { setSelectedProvider('twilio'); updateReminderConfig({ messagingProvider: 'twilio' }); }}
                className={`py-2 px-3 text-xs font-medium rounded border transition-colors ${
                  selectedProvider === 'twilio' ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                Twilio SMS
              </button>
              <button
                onClick={() => { setSelectedProvider('whatsapp_business'); updateReminderConfig({ messagingProvider: 'whatsapp_business' }); }}
                className={`py-2 px-3 text-xs font-medium rounded border transition-colors ${
                  selectedProvider === 'whatsapp_business' ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                WhatsApp Biz
              </button>
              <button
                onClick={() => { setSelectedProvider('sendgrid'); updateReminderConfig({ messagingProvider: 'sendgrid' }); }}
                className={`py-2 px-3 text-xs font-medium rounded border transition-colors ${
                  selectedProvider === 'sendgrid' ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                SendGrid
              </button>
            </div>
            <div className="mt-2 text-xs text-neutral-500">
              Provider delivery receipts are cryptographically verified before logging confirmation status.
            </div>
          </div>
        </div>

        {/* Deposit Policy & Financial Protection Rules */}
        <div className="bg-white border border-neutral-200 rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                Deposit & Cancellation Policy Engine
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Automatically enforce prepayment based on customer risk scoring
              </p>
            </div>
            <Lock className="w-4 h-4 text-neutral-500" />
          </div>

          <div className="space-y-5">
            <div className="p-4 border border-neutral-200 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-neutral-900">
                  Enforce Deposit for High-Risk Clients
                </span>
                <input
                  type="checkbox"
                  checked={config.requireDepositForUnreliable}
                  onChange={(e) => updateReminderConfig({ requireDepositForUnreliable: e.target.checked })}
                  className="rounded text-neutral-900 focus:ring-neutral-900 h-4 w-4"
                />
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Clients whose reliability score falls below the threshold must pay a non-refundable deposit to lock in their chair.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-medium text-neutral-500 block">Risk Score Trigger</label>
                  <div className="mt-1 flex items-center gap-1">
                    <span className="text-xs text-neutral-400">&lt;</span>
                    <input
                      type="number"
                      value={config.unreliableThresholdScore}
                      onChange={(e) => updateReminderConfig({ unreliableThresholdScore: Number(e.target.value) })}
                      className="w-20 px-2 py-1 text-xs font-mono tabular-nums border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-hidden"
                    />
                    <span className="text-xs text-neutral-500">%</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-500 block">Default Deposit Amount</label>
                  <div className="mt-1 flex items-center gap-1">
                    <span className="text-xs text-neutral-400">$</span>
                    <input
                      type="number"
                      value={config.defaultDepositAmount}
                      onChange={(e) => updateReminderConfig({ defaultDepositAmount: Number(e.target.value) })}
                      className="w-20 px-2 py-1 text-xs font-mono tabular-nums border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Waitlist Auto-Offer Rule */}
            <div className="p-4 border border-neutral-200 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-neutral-900">
                  Instant Waitlist Dispatch on Cancellation
                </span>
                <input
                  type="checkbox"
                  checked={config.autoOfferWaitlistOnCancel}
                  onChange={(e) => updateReminderConfig({ autoOfferWaitlistOnCancel: e.target.checked })}
                  className="rounded text-neutral-900 focus:ring-neutral-900 h-4 w-4"
                />
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                When an appointment is cancelled, BookFlow scans the customer waitlist for matching service & staff preferences and sends an immediate 15-minute reservation claim offer.
              </p>
            </div>

            {/* Policy Disclosure Preview */}
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg space-y-2">
              <div className="text-xs font-semibold text-neutral-900 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-neutral-600" />
                <span>Customer-Facing Policy Language (Embedded at Checkout)</span>
              </div>
              <p className="text-xs text-neutral-600 italic leading-relaxed">
                &ldquo;We respect your time and reserve our chair exclusively for you. Cancellations with less than 24 hours notice will forfeit the ${config.defaultDepositAmount} deposit. No-shows are charged 50% of the scheduled service.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Delivery & Dispatch Audit Log */}
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <div className="p-5 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-neutral-900">
              Provider Delivery Audit & Confirmation Receipts
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Strict delivery confirmation logs for regulatory compliance and dispute resolution
            </p>
          </div>
          <div className="text-xs text-neutral-500 font-mono">
            {allReminders.length} dispatched events recorded
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-600 uppercase font-semibold border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Channel / Type</th>
                <th className="py-3 px-4">Scheduled Slot</th>
                <th className="py-3 px-4">Message Content</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Delivery Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-800">
              {allReminders.slice(0, 7).map((rem, idx) => (
                <tr key={`${rem.id}-${idx}`} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-neutral-900 whitespace-nowrap">
                    <div>{rem.clientName}</div>
                    <div className="text-neutral-500 font-mono text-[11px]">{rem.clientPhone}</div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-medium text-neutral-800 uppercase text-[10px] tracking-wider">
                      {rem.type}
                    </span>
                    <div className="text-neutral-500 text-[11px]">{rem.timingLabel}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-neutral-700 whitespace-nowrap">
                    {rem.appointmentTime}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-600 max-w-xs truncate">
                    {rem.contentPreview}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-neutral-500 whitespace-nowrap">
                    {rem.sentAt}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {rem.status === 'delivered' || rem.status === 'read' ? (
                      <span className="text-emerald-700 font-semibold inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verified {rem.status === 'read' ? 'Read' : 'Delivered'}</span>
                      </span>
                    ) : (
                      <span className="text-amber-700 font-medium inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Dispatched (Pending)</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
