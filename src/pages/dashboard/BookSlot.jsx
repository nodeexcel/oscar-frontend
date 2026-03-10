import { useState, useEffect, useCallback } from 'react';
import { getSlots, createBooking } from '../../api/bookings';
import { getApiErrorMessage } from '../../utils/apiErrors';
import { formatSlotRange } from '../../utils/scheduleDisplay';
import { AdminPageHeader, AdminCard } from '../../components/admin/AdminPageLayout';

function toDateString(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function BookSlot() {
  const [date, setDate] = useState(() => toDateString(new Date()));
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchSlots = useCallback(() => {
    if (!date) return;
    setError('');
    setLoading(true);
    getSlots(date)
      .then((data) => setSlots(Array.isArray(data) ? data : []))
      .catch((err) => setError(getApiErrorMessage(err, 'Failed to load slots.')))
      .finally(() => setLoading(false));
  }, [date]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const handleBook = (slot) => {
    setError('');
    setSuccess('');
    setCreating(slot);
    createBooking({ start_time: slot.start_time, end_time: slot.end_time })
      .then(() => {
        setSuccess('Booking confirmed.');
        fetchSlots();
      })
      .catch((err) => setError(getApiErrorMessage(err, 'Failed to create booking.')))
      .finally(() => setCreating(null));
  };

  const minDate = toDateString(new Date());

  return (
    <div className="min-h-full">
      <AdminPageHeader
        title="Book a slot"
        subtitle="Choose a date and available time slot."
      />
      <AdminCard className="mb-6">
        <div className="p-5 sm:p-6">
          {error && (
            <div className="mb-4 py-3 px-4 rounded-xl bg-red-50/80 text-red-700 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 py-3 px-4 rounded-xl bg-green-50 text-green-700 text-sm">
              {success}
            </div>
          )}
          <label htmlFor="book-date" className="block text-sm font-semibold text-[#5C4A42] mb-2">
            Date
          </label>
          <input
            id="book-date"
            type="date"
            value={date}
            min={minDate}
            onChange={(e) => setDate(e.target.value)}
            className="w-full max-w-xs px-4 py-2.5 rounded-xl border border-[#E8DFD8] bg-white text-[#5C4A42] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#8B6B5C]/50 focus:border-[#8B6B5C]"
          />
        </div>
      </AdminCard>

      <AdminCard>
        <div className="px-5 py-3 border-b border-[#E8DFD8]/80">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#8B6B5C]">
            Available slots
          </h2>
        </div>
        <div className="p-5 sm:p-6">
          {loading ? (
            <div className="py-8 flex items-center justify-center text-[#7D6B5E]">
              Loading…
            </div>
          ) : slots.length === 0 ? (
            <p className="py-8 text-center text-[#7D6B5E]">
              No slots available for this date.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {slots.map((slot, i) => {
                const key = slot.start_time + slot.end_time + i;
                const isCreating = creating && creating.start_time === slot.start_time;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleBook(slot)}
                    disabled={!!creating}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-[#5C4A42] bg-[#E8DFD8]/80 hover:bg-[#E8DFD8] border border-[#E8DFD8] hover:border-[#8B6B5C]/40 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isCreating ? 'Booking…' : formatSlotRange(slot.start_time, slot.end_time)}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </AdminCard>
    </div>
  );
}
