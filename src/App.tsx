import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { NoShowDefenseView } from './components/NoShowDefenseView';
import { OperationsScheduleView } from './components/OperationsScheduleView';
import { WaitlistRecoveryView } from './components/WaitlistRecoveryView';
import { RetentionVaultView } from './components/RetentionVaultView';
import { ClientBookingPortalView } from './components/ClientBookingPortalView';
import { NewAppointmentModal } from './components/NewAppointmentModal';
import { PosCheckoutModal } from './components/PosCheckoutModal';
import { Appointment } from './types';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [checkoutAppointment, setCheckoutAppointment] = useState<Appointment | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
      {/* 3-Zone Top Bar Contract */}
      <Header onOpenNewAppointment={() => setIsNewAppointmentOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'defense' && <NoShowDefenseView />}
        {activeTab === 'schedule' && (
          <OperationsScheduleView 
            onOpenCheckout={(apt) => setCheckoutAppointment(apt)}
            onOpenNewAppointment={() => setIsNewAppointmentOpen(true)}
          />
        )}
        {activeTab === 'recovery' && <WaitlistRecoveryView />}
        {activeTab === 'retention' && <RetentionVaultView />}
        {activeTab === 'portal' && <ClientBookingPortalView />}
      </main>

      {/* Clean quiet footer */}
      <footer className="border-t border-neutral-200 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            &copy; 2026 BookFlow Technologies. Commercial Salon & Grooming Retention Platform.
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setActiveTab('defense')} 
              className="hover:text-neutral-900 transition-colors"
            >
              No-Show Defense
            </button>
            <button 
              onClick={() => setActiveTab('recovery')} 
              className="hover:text-neutral-900 transition-colors"
            >
              Waitlist Engine
            </button>
            <button 
              onClick={() => setActiveTab('portal')} 
              className="hover:text-neutral-900 transition-colors"
            >
              Client Booking Portal
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <NewAppointmentModal 
        isOpen={isNewAppointmentOpen} 
        onClose={() => setIsNewAppointmentOpen(false)} 
      />

      <PosCheckoutModal 
        appointment={checkoutAppointment} 
        onClose={() => setCheckoutAppointment(null)} 
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
