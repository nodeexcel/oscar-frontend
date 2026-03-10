import { useState, useEffect } from 'react';
import { getUsers } from '../../api/admin/users';
import { getApiErrorMessage } from '../../utils/apiErrors';
import { AdminPageHeader, AdminCard } from '../../components/admin/AdminPageLayout';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setError('');
    getUsers()
      .then((data) => {
        if (cancelled) return;
        setUsers(Array.isArray(data) ? data : data?.users ?? []);
      })
      .catch((err) => {
        if (!cancelled) setError(getApiErrorMessage(err, 'Failed to load users.'));
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="min-h-full">
        <AdminPageHeader title="Users" subtitle="Users in your business." />
        <AdminCard>
          <div className="p-8 flex items-center justify-center text-[#7D6B5E]">Loading…</div>
        </AdminCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full">
        <AdminPageHeader title="Users" subtitle="Users in your business." />
        <AdminCard>
          <div className="p-6 sm:p-8">
            <div className="p-4 rounded-xl bg-red-50/80 text-red-700 border border-red-200/80 text-sm">{error}</div>
          </div>
        </AdminCard>
      </div>
    );
  }

  const columns = users.length ? Object.keys(users[0]) : [];
  const displayKeys = columns.filter((k) => !/^(password|hashed|token)/i.test(k));

  return (
    <div className="min-h-full">
      <AdminPageHeader title="Users" subtitle="Users in your business." />
      <AdminCard>
        {users.length === 0 ? (
          <div className="p-8 text-center text-[#7D6B5E]">No users yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#E8DFD8] bg-[#F0EBE6]/80">
                  {displayKeys.map((key) => (
                    <th key={key} className="px-5 py-4 font-semibold text-[#5C4A42] capitalize">
                      {key.replace(/_/g, ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((row, i) => (
                  <tr
                    key={row.id ?? i}
                    className="border-b border-[#E8DFD8]/80 last:border-0 hover:bg-[#F0EBE6]/60 transition-colors"
                  >
                    {displayKeys.map((key) => (
                      <td key={key} className="px-5 py-4 text-[#5C4A42]">
                        {typeof row[key] === 'object' && row[key] !== null
                          ? JSON.stringify(row[key])
                          : String(row[key] ?? '—')}
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
