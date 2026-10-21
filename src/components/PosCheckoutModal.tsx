import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Appointment } from '../types';
import { CreditCard, CheckCircle2, DollarSign, Plus, Check } from 'lucide-react';

interface PosCheckoutModalProps {
  appointment: Appointment | null;
  onClose: () => void;
}

const RETAIL_PRODUCTS = [
  { id: 'ret-1', name: 'Artisan Matte Clay (50ml)', price: 28 },
  { id: 'ret-2', name: 'Cold-Pressed Beard Elixir (30ml)', price: 24 },
  { id: 'ret-3', name: 'Restorative Keratin Gloss Mist', price: 32 },
];

export const PosCheckoutModal: React.FC<PosCheckoutModalProps> = ({ appointment, onClose }) => {
  const { completeAppointment, services, staff } = useApp();

  const [selectedRetailIds, setSelectedRetailIds] = useState<string[]>([]);
  const [tipPercent, setTipPercent] = useState<number>(20);
  const [customTip, setCustomTip] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'card_on_file'>('card');
  const [isDone, setIsDone] = useState(false);

  if (!appointment) return null;

  const srv = services.find(s => s.id === appointment.serviceId);
  const st = staff.find(s => s.id === appointment.staffId);

  const servicePrice = appointment.price;
  const retailTotal = selectedRetailIds.reduce((sum, id) => {
    const item = RETAIL_PRODUCTS.find(p => p.id === id);
    return sum + (item ? item.price : 0);
  }, 0);

  const subtotal = servicePrice + retailTotal;
  const tipAmount = customTip !== '' 
    ? Number(customTip) || 0 
    : Math.round(servicePrice * (tipPercent / 100));

  const depositDeduction = appointment.depositPaid ? appointment.depositAmount : 0;
  const finalBalanceDue = Math.max(0, subtotal + tipAmount - depositDeduction);

  const handleToggleProduct = (id: string) => {
    setSelectedRetailIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleFinishCheckout = () => {
    completeAppointment(appointment.id, {
      servicesTotal: servicePrice,
      retailTotal,
      tipAmount,
      depositDeduction,
      finalPaid: finalBalanceDue,
      paymentMethod,
      completedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    });
    setIsDone(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full border border-neutral-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Point of Sale & Checkout
            </div>
            <h3 className="text-base font-bold text-neutral-900 mt-0.5">
              {appointment.clientName} · {srv?.name}
            </h3>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">✕</button>
        </div>

        {isDone ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-lg font-bold text-neutral-900">Payment Processed</h4>
            <p className="text-xs text-neutral-500">
              ${finalBalanceDue} paid via {paymentMethod.replace('_', ' ')}. Digital receipt sent to {appointment.clientPhone}.
            </p>
          </div>
        ) : (
          <div className="p-5 space-y-5 text-xs">
            {/* Retail Add-ons */}
            <div>
              <label className="font-semibold text-neutral-800 block mb-2">
                Retail Products & Add-ons
              </label>
              <div className="space-y-1.5">
                {RETAIL_PRODUCTS.map(product => {
                  const isChecked = selectedRetailIds.includes(product.id);
                  return (
                    <div
                      key={product.id}
                      onClick={() => handleToggleProduct(product.id)}
                      className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                        isChecked ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100 text-neutral-800'
                      }`}
                    >
                      <span className="font-medium">{product.name}</span>
                      <span className="font-mono tabular-nums font-semibold">+${product.price}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tip Selection */}
            <div>
              <label className="font-semibold text-neutral-800 block mb-2">
                Gratuity / Tip for {st?.name.split(' ')[0]}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[15, 20, 25].map(pct => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => { setTipPercent(pct); setCustomTip(''); }}
                    className={`py-2 text-center rounded border font-mono tabular-nums transition-colors ${
                      customTip === '' && tipPercent === pct
                        ? 'bg-neutral-900 text-white border-neutral-900 font-bold'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    {pct}% (${Math.round(servicePrice * (pct / 100))})
                  </button>
                ))}
                <input
                  type="number"
                  placeholder="Custom $"
                  value={customTip}
                  onChange={(e) => setCustomTip(e.target.value)}
                  className="px-2 py-1 text-center border border-neutral-200 rounded font-mono text-xs focus:outline-hidden"
                />
              </div>
            </div>

            {/* Itemized Calculation Summary */}
            <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-lg space-y-1.5 font-mono">
              <div className="flex justify-between text-neutral-600">
                <span>Service Fee ({srv?.name})</span>
                <span className="tabular-nums">${servicePrice}</span>
              </div>
              {retailTotal > 0 && (
                <div className="flex justify-between text-neutral-600">
                  <span>Retail Products</span>
                  <span className="tabular-nums">+${retailTotal}</span>
                </div>
              )}
              {tipAmount > 0 && (
                <div className="flex justify-between text-neutral-600">
                  <span>Gratuity Tip</span>
                  <span className="tabular-nums">+${tipAmount}</span>
                </div>
              )}
              {depositDeduction > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Prepaid Deposit Deducted</span>
                  <span className="tabular-nums">-${depositDeduction}</span>
                </div>
              )}
              <div className="pt-2 border-t border-neutral-200 flex justify-between text-sm font-bold text-neutral-900">
                <span>Total Balance Due</span>
                <span className="tabular-nums">${finalBalanceDue}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-2">
              {(['card', 'cash', 'card_on_file'] as const).map(method => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`py-2 text-center capitalize rounded border text-xs font-medium transition-colors ${
                    paymentMethod === method 
                      ? 'bg-neutral-900 text-white border-neutral-900' 
                      : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  {method.replace('_', ' ')}
                </button>
              ))}
            </div>

            <button
              onClick={handleFinishCheckout}
              className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Charge & Close Ticket (${finalBalanceDue})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
