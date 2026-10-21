import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ClientProfile } from '../types';
import { 
  Users, 
  Clock, 
  RotateCw, 
  ShieldAlert, 
  CheckCircle, 
  FileText, 
  Scissors, 
  Send, 
  AlertTriangle,
  Phone,
  Mail,
  Sparkles,
  Edit2,
  Save
} from 'lucide-react';

export const RetentionVaultView: React.FC = () => {
  const { clients, updateClientNotes } = useApp();

  const [selectedClient, setSelectedClient] = useState<ClientProfile>(clients[0]);
  const [editingNotes, setEditingNotes] = useState(false);
  const [formNotes, setFormNotes] = useState(selectedClient?.technicalNotes || {});
  const [dispatchAlert, setDispatchAlert] = useState<string | null>(null);

  // Calculate overdue rebookings
  // Current date is 2026-10-21
  const today = new Date('2026-10-21').getTime();

  const clientsWithDueStatus = clients.map(client => {
    const lastVisit = new Date(client.lastVisitDate).getTime();
    const daysSince = Math.floor((today - lastVisit) / (1000 * 60 * 60 * 24));
    const isOverdue = daysSince >= client.serviceCadenceDays;
    const daysOverdue = daysSince - client.serviceCadenceDays;

    return {
      ...client,
      daysSince,
      isOverdue,
      daysOverdue
    };
  });

  const overdueList = clientsWithDueStatus.filter(c => c.isOverdue);

  const handleSelectClient = (client: ClientProfile) => {
    setSelectedClient(client);
    setFormNotes(client.technicalNotes || {});
    setEditingNotes(false);
  };

  const handleSaveNotes = () => {
    if (selectedClient) {
      updateClientNotes(selectedClient.id, formNotes);
      setSelectedClient(prev => ({
        ...prev,
        technicalNotes: formNotes
      }));
      setEditingNotes(false);
      setDispatchAlert('Formula & guard records updated in client technical vault.');
      setTimeout(() => setDispatchAlert(null), 3000);
    }
  };

  const handleSendRebookInvite = (clientName: string, clientPhone: string) => {
    setDispatchAlert(`Rebooking invite dispatched to ${clientName} (${clientPhone}) via SMS.`);
    setTimeout(() => setDispatchAlert(null), 3500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-neutral-200">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
          Client Retention & Technical Formula Vault
        </h1>
        <p className="mt-1 text-sm text-neutral-600 max-w-3xl leading-relaxed">
          Retaining existing clients is 5x cheaper than acquiring new ones. 
          Track client service frequency to trigger automated rebooking reminders, store precise haircut guard specs and hair dye formulas, and manage reliability scores.
        </p>
      </div>

      {dispatchAlert && (
        <div className="p-3 bg-neutral-900 text-white text-xs rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{dispatchAlert}</span>
          </div>
          <button onClick={() => setDispatchAlert(null)} className="text-neutral-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Due for Rebooking Banner Section */}
      <div className="bg-white border border-neutral-200 rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <RotateCw className="w-4 h-4 text-neutral-900" />
              <span>Automated Rebooking Engine ({overdueList.length} Due for Touch-Up)</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Identified based on each client&apos;s regular haircut or color cadence
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {overdueList.map(c => (
            <div key={c.id} className="p-4 border border-amber-200 bg-amber-50/40 rounded-lg space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">{c.name}</h3>
                  <div className="text-xs text-neutral-500 font-mono mt-0.5">{c.phone}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-amber-800 tabular-nums">
                    +{c.daysOverdue} days overdue
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    Cycle: Every {c.serviceCadenceDays}d
                  </div>
                </div>
              </div>

              <div className="text-xs text-neutral-600 line-clamp-1">
                Last visit: {c.lastVisitDate} · {c.totalVisits} total lifetime visits
              </div>

              <button
                onClick={() => handleSendRebookInvite(c.name, c.phone)}
                className="w-full py-2 px-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>1-Click Rebooking SMS</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Client Directory & Formula Technical Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Client List with Reliability Indicators */}
        <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-lg overflow-hidden flex flex-col">
          <div className="p-4 border-b border-neutral-200 bg-neutral-50/50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900">
              Client Reliability Directory
            </h3>
            <span className="text-xs text-neutral-500 font-mono">
              {clients.length} profiles
            </span>
          </div>

          <div className="divide-y divide-neutral-100 overflow-y-auto max-h-[560px]">
            {clients.map(client => {
              const isSelected = selectedClient?.id === client.id;
              const isHighRisk = client.reliabilityScore < 80;

              return (
                <div
                  key={client.id}
                  onClick={() => handleSelectClient(client)}
                  className={`p-4 cursor-pointer text-left transition-colors ${
                    isSelected ? 'bg-neutral-100/80 border-l-2 border-neutral-900' : 'hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-neutral-900">{client.name}</span>
                    <span className={`text-xs font-mono font-bold tabular-nums ${isHighRisk ? 'text-amber-800' : 'text-emerald-700'}`}>
                      {client.reliabilityScore}% Reliability
                    </span>
                  </div>

                  <div className="text-xs text-neutral-500 flex items-center gap-2 mt-1">
                    <span className="font-mono">{client.phone}</span>
                    <span>·</span>
                    <span>{client.totalVisits} visits</span>
                    <span>·</span>
                    <span className="font-mono">${client.totalSpend} spend</span>
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-[11px]">
                    {client.noShowCount > 0 && (
                      <span className="text-amber-800 font-medium">
                        {client.noShowCount} No-Show{client.noShowCount > 1 ? 's' : ''}
                      </span>
                    )}
                    {client.requiresDeposit && (
                      <span className="text-neutral-700 font-medium">
                        Deposit Required
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Client's Formula & Treatment Record */}
        <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
            <div>
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Technical Service Record
              </div>
              <h2 className="text-xl font-bold text-neutral-900 mt-0.5">
                {selectedClient.name}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {editingNotes ? (
                <button
                  onClick={handleSaveNotes}
                  className="px-3 py-1.5 bg-neutral-900 text-white rounded text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Record</span>
                </button>
              ) : (
                <button
                  onClick={() => setEditingNotes(true)}
                  className="px-3 py-1.5 border border-neutral-300 text-neutral-700 rounded text-xs font-semibold hover:bg-neutral-50 transition-colors flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Notes</span>
                </button>
              )}
            </div>
          </div>

          {/* Client Reliability Summary Strip */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-neutral-50 rounded-lg text-xs">
            <div>
              <span className="text-neutral-500 block">Reliability Score</span>
              <span className="text-base font-bold text-neutral-900 font-mono tabular-nums">
                {selectedClient.reliabilityScore}%
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block">Historical No-Shows</span>
              <span className="text-base font-bold text-neutral-900 font-mono tabular-nums">
                {selectedClient.noShowCount}
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block">Prepayment Policy</span>
              <span className="text-xs font-semibold text-neutral-900 mt-1 block">
                {selectedClient.requiresDeposit ? 'Mandatory Deposit ($25)' : 'Standard Booking'}
              </span>
            </div>
          </div>

          {/* Formula & Technical Guard Details */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-neutral-800 block mb-1">
                Haircut Clipper Guards, Taper & Scissor Architecture
              </label>
              {editingNotes ? (
                <textarea
                  rows={3}
                  value={formNotes.haircutGuards || ''}
                  onChange={(e) => setFormNotes({ ...formNotes, haircutGuards: e.target.value })}
                  placeholder="e.g. #1.5 skin fade, blend into #3 lever open, texture shear on crown..."
                  className="w-full p-2.5 text-xs border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-hidden font-mono"
                />
              ) : (
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded text-xs text-neutral-800 font-mono leading-relaxed">
                  {selectedClient.technicalNotes.haircutGuards || 'No guard specifications recorded.'}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-800 block mb-1">
                Hair Color Formula & Formulation Ratios
              </label>
              {editingNotes ? (
                <textarea
                  rows={3}
                  value={formNotes.colorFormula || ''}
                  onChange={(e) => setFormNotes({ ...formNotes, colorFormula: e.target.value })}
                  placeholder="e.g. Roots: Wella Koleston 6/0 (30g) + 6% 20vol (30g)..."
                  className="w-full p-2.5 text-xs border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-hidden font-mono"
                />
              ) : (
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded text-xs text-neutral-800 font-mono leading-relaxed">
                  {selectedClient.technicalNotes.colorFormula || 'No color formulations recorded.'}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-800 block mb-1">
                Acupressure & Massage Pressure Preferences
              </label>
              {editingNotes ? (
                <textarea
                  rows={2}
                  value={formNotes.massagePreferences || ''}
                  onChange={(e) => setFormNotes({ ...formNotes, massagePreferences: e.target.value })}
                  placeholder="e.g. Firm pressure on trapezius, cedarwood oils only..."
                  className="w-full p-2.5 text-xs border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-hidden"
                />
              ) : (
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded text-xs text-neutral-800 leading-relaxed">
                  {selectedClient.technicalNotes.massagePreferences || 'No custom pressure preferences recorded.'}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-800 block mb-1">
                Allergies & Chemical Sensitivities
              </label>
              {editingNotes ? (
                <input
                  type="text"
                  value={formNotes.allergies || ''}
                  onChange={(e) => setFormNotes({ ...formNotes, allergies: e.target.value })}
                  placeholder="e.g. Paraben sensitivity, avoid heavy fragrance"
                  className="w-full p-2 text-xs border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-hidden"
                />
              ) : (
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded text-xs text-neutral-800 font-medium">
                  {selectedClient.technicalNotes.allergies || 'None reported.'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
