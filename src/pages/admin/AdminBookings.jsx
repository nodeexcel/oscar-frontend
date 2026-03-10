import { useState, useEffect } from 'react';
import { getBookings } from '../../api/admin/bookings';
import { getApiErrorMessage } from '../../utils/apiErrors';
import { formatDateTimeForDisplay } from '../../utils/scheduleDisplay';
import { AdminPageHeader, AdminCard } from '../../components/admin/AdminPageLayout';

const BOOKING_COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'start_time', label: 'Start time', format: 'datetime' },
  { key: 'end_time', label: 'End time', format: 'datetime' },
  { key: 'status', label: 'Status', format: 'capitalize' },
  { key: 'source', label: 'Source', format: 'capitalize' },
  // { key: 'tenant_id', label: 'Tenant ID' },
  // { key: 'user_id', label: 'User ID' },
  { key: 'created_at', label: 'Created at', format: 'datetime' },
  { key: 'updated_at', label: 'Updated at', format: 'datetime' },
];

function formatCell(value, format) {
  if (value == null || value === '') return '—';
  if (format === 'datetime') return formatDateTimeForDisplay(value);
  if (format === 'capitalize') return String(value).charAt(0).toUpperCase() + String(value).slice(1).toLowerCase();
  return typeof value === 'object' ? JSON.stringify(value) : String(value);
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setError('');
    getBookings()
      .then((data) => {
        if (cancelled) return;
        setBookings(Array.isArray(data) ? data : data?.bookings ?? []);
      })
      .catch((err) => {
        if (!cancelled) setError(getApiErrorMessage(err, 'Failed to load bookings.'));
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="min-h-full">
        <AdminPageHeader title="Bookings" subtitle="All bookings for your business." />
        <AdminCard>
          <div className="p-8 flex items-center justify-center text-[#7D6B5E]">Loading…</div>
        </AdminCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full">
        <AdminPageHeader title="Bookings" subtitle="All bookings for your business." />
        <AdminCard>
          <div className="p-6 sm:p-8">
            <div className="p-4 rounded-xl bg-red-50/80 text-red-700 border border-red-200/80 text-sm">{error}</div>
          </div>
        </AdminCard>
      </div>
    );
  }

  const dataKeys = bookings.length ? Object.keys(bookings[0]) : [];
  const displayCols = BOOKING_COLUMNS.filter((col) => dataKeys.includes(col.key));

  return (
    <div className="min-h-full">
      <AdminPageHeader title="Bookings" subtitle="All bookings for your business." />
      <AdminCard>
        {bookings.length === 0 ? (
          <div className="p-8 text-center text-[#7D6B5E]">No bookings yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#E8DFD8] bg-[#F0EBE6]/80">
                  {displayCols.map((col) => (
                    <th key={col.key} className="px-5 py-4 font-semibold text-[#5C4A42] whitespace-nowrap">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((row, i) => (
                  <tr
                    key={row.id ?? i}
                    className="border-b border-[#E8DFD8]/80 last:border-0 hover:bg-[#F0EBE6]/60 transition-colors"
                  >
                    {displayCols.map((col) => (
                      <td key={col.key} className="px-5 py-4 text-[#5C4A42] whitespace-nowrap">
                        {formatCell(row[col.key], col.format)}
                      </td>
                    ))}
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
