import React from 'react';
import { useApp } from '../context/AppContext';
import { Plus, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onOpenNewAppointment: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewAppointment }) => {
  const { activeTab, setActiveTab, resetToDefaults } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <span 
              onClick={() => setActiveTab('defense')}
              className="text-xl font-bold tracking-tight text-neutral-900 cursor-pointer select-none"
            >
              BookFlow
            </span>
            <span className="hidden sm:inline-block text-xs text-neutral-600 font-medium tracking-wide">
              Operations & Retention
            </span>
          </div>

          {/* Zone 2: 4-5 concise single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            <button
              onClick={() => setActiveTab('defense')}
              className={`whitespace-nowrap pb-0.5 transition-colors ${
                activeTab === 'defense'
                  ? 'text-neutral-950 font-semibold border-b-2 border-neutral-900'
                  : 'text-neutral-700 hover:text-neutral-950'
              }`}
            >
              Revenue Defense
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`whitespace-nowrap pb-0.5 transition-colors ${
                activeTab === 'schedule'
                  ? 'text-neutral-950 font-semibold border-b-2 border-neutral-900'
                  : 'text-neutral-700 hover:text-neutral-950'
              }`}
            >
              Chair Schedule
            </button>
            <button
              onClick={() => setActiveTab('recovery')}
              className={`whitespace-nowrap pb-0.5 transition-colors ${
                activeTab === 'recovery'
                  ? 'text-neutral-950 font-semibold border-b-2 border-neutral-900'
                  : 'text-neutral-700 hover:text-neutral-950'
              }`}
            >
              Waitlist Recovery
            </button>
            <button
              onClick={() => setActiveTab('retention')}
              className={`whitespace-nowrap pb-0.5 transition-colors ${
                activeTab === 'retention'
                  ? 'text-neutral-950 font-semibold border-b-2 border-neutral-900'
                  : 'text-neutral-700 hover:text-neutral-950'
              }`}
            >
              Client Vault
            </button>
            <button
              onClick={() => setActiveTab('portal')}
              className={`whitespace-nowrap pb-0.5 transition-colors ${
                activeTab === 'portal'
                  ? 'text-neutral-950 font-semibold border-b-2 border-neutral-900'
                  : 'text-neutral-700 hover:text-neutral-950'
              }`}
            >
              Client Booking Portal
            </button>
          </nav>

          {/* Zone 3: 1 primary action button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={resetToDefaults}
              title="Reset Demo Data"
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenNewAppointment}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors whitespace-nowrap shrink-0 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New Appointment</span>
            </button>
          </div>
        </div>

        {/* Mobile Tab Navigation Bar */}
        <div className="flex lg:hidden overflow-x-auto gap-4 py-2 border-t border-neutral-100 text-xs font-medium scrollbar-none">
          <button
            onClick={() => setActiveTab('defense')}
            className={`whitespace-nowrap px-2 py-1 rounded ${activeTab === 'defense' ? 'bg-neutral-900 text-white' : 'text-neutral-700'}`}
          >
            Revenue Defense
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`whitespace-nowrap px-2 py-1 rounded ${activeTab === 'schedule' ? 'bg-neutral-900 text-white' : 'text-neutral-700'}`}
          >
            Chair Schedule
          </button>
          <button
            onClick={() => setActiveTab('recovery')}
            className={`whitespace-nowrap px-2 py-1 rounded ${activeTab === 'recovery' ? 'bg-neutral-900 text-white' : 'text-neutral-700'}`}
          >
            Waitlist Recovery
          </button>
          <button
            onClick={() => setActiveTab('retention')}
            className={`whitespace-nowrap px-2 py-1 rounded ${activeTab === 'retention' ? 'bg-neutral-900 text-white' : 'text-neutral-700'}`}
          >
            Client Vault
          </button>
          <button
            onClick={() => setActiveTab('portal')}
            className={`whitespace-nowrap px-2 py-1 rounded ${activeTab === 'portal' ? 'bg-neutral-900 text-white' : 'text-neutral-700'}`}
          >
            Client Booking
          </button>
        </div>
      </div>
    </header>
  );
};
