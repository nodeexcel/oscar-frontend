import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyBookings } from '../../api/users';
import { cancelBooking } from '../../api/bookings';
import { getApiErrorMessage } from '../../utils/apiErrors';
import { formatDateTimeForDisplay } from '../../utils/scheduleDisplay';
import { AdminPageHeader, AdminCard } from '../../components/admin/AdminPageLayout';

function formatStatus(s) {
  if (!s) return '—';
  return String(s).charAt(0).toUpperCase() + String(s).slice(1).toLowerCase();
}

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  const load = () => {
    setError('');
    setLoading(true);
    getMyBookings()
      .then((data) => setBookings(Array.isArray(data) ? data : []))
      .catch((err) => setError(getApiErrorMessage(err, 'Failed to load bookings.')))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCancel = (id) => {
    setError('');
    setCancellingId(id);
    cancelBooking(id)
      .then(() => load())
      .catch((err) => setError(getApiErrorMessage(err, 'Failed to cancel booking.')))
      .finally(() => setCancellingId(null));
  };

  const canCancel = (b) =>
    b.status === 'pending' || b.status === 'confirmed' || !b.status;

  if (loading) {
    return (
      <div className="min-h-full">
        <AdminPageHeader title="My Bookings" subtitle="View and manage your bookings." />
        <AdminCard>
          <div className="p-8 flex items-center justify-center text-[#7D6B5E]">Loading…</div>
        </AdminCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full">
        <AdminPageHeader title="My Bookings" subtitle="View and manage your bookings." />
        <AdminCard>
          <div className="p-6 sm:p-8">
            <div className="mb-4 py-3 px-4 rounded-xl bg-red-50/80 text-red-700 text-sm">{error}</div>
            <button
              type="button"
              onClick={load}
              className="px-4 py-2.5 text-sm font-semibold text-[#F8F4F0] bg-[#8B6B5C] rounded-xl hover:bg-[#7D6B5E] transition-colors"
            >
              Try again
            </button>
          </div>
        </AdminCard>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <AdminPageHeader title="My Bookings" subtitle="View and manage your bookings." />
      {error && (
        <div className="mb-4 py-3 px-4 rounded-xl bg-red-50/80 text-red-700 text-sm">{error}</div>
      )}
      <AdminCard>
        {bookings.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-[#7D6B5E] mb-4">You have no bookings yet.</p>
            <Link
              to="/dashboard"
              className="inline-block px-5 py-2.5 text-[15px] font-semibold text-[#F8F4F0] bg-[#8B6B5C] rounded-xl hover:bg-[#7D6B5E] transition-colors no-underline"
            >
              Book a slot
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#E8DFD8] bg-[#F0EBE6]/80">
                  <th className="px-5 py-4 font-semibold text-[#5C4A42] whitespace-nowrap">Start</th>
                  <th className="px-5 py-4 font-semibold text-[#5C4A42] whitespace-nowrap">End</th>
                  <th className="px-5 py-4 font-semibold text-[#5C4A42] whitespace-nowrap">Status</th>
                  <th className="px-5 py-4 font-semibold text-[#5C4A42] whitespace-nowrap">Created</th>
                  <th className="px-5 py-4 font-semibold text-[#5C4A42] whitespace-nowrap w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-[#E8DFD8]/80 last:border-0 hover:bg-[#F0EBE6]/60 transition-colors"
                  >
                    <td className="px-5 py-4 text-[#5C4A42] whitespace-nowrap">
                      {formatDateTimeForDisplay(row.start_time)}
                    </td>
                    <td className="px-5 py-4 text-[#5C4A42] whitespace-nowrap">
                      {formatDateTimeForDisplay(row.end_time)}
                    </td>
                    <td className="px-5 py-4 text-[#5C4A42] whitespace-nowrap">
                      {formatStatus(row.status)}
                    </td>
                    <td className="px-5 py-4 text-[#5C4A42] whitespace-nowrap">
                      {formatDateTimeForDisplay(row.created_at)}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {canCancel(row) ? (
                        <button
                          type="button"
                          onClick={() => handleCancel(row.id)}
                          disabled={cancellingId === row.id}
                          className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-60"
                        >
                          {cancellingId === row.id ? 'Cancelling…' : 'Cancel'}
                        </button>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  );
}
