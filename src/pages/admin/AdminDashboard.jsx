import { useState, useEffect, useMemo } from 'react';
import { getWorkingHours } from '../../api/admin/workingHours';
import { getUsers } from '../../api/admin/users';
import { getBookings } from '../../api/admin/bookings';
import { getApiErrorMessage } from '../../utils/apiErrors';
import { normalizeSchedule, getScheduleSummary } from '../../utils/scheduleDisplay';

function ClockIcon() {
  return (
    <svg className="w-5 h-5 text-[#8B6B5C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="w-5 h-5 text-[#8B6B5C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="w-5 h-5 text-[#8B6B5C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function StatCard({ title, value, loading, icon: Icon }) {
  return (
    <div className="p-6 rounded-2xl bg-[#F8F4F0] shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#7D6B5E] mb-0.5">{title}</p>
          <p className="text-2xl font-semibold text-[#5C4A42] tabular-nums">
            {loading ? '—' : value}
          </p>
        </div>
        {Icon && <Icon />}
      </div>
    </div>
  );
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function getCalendarDays(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startPad = first.getDay();
  const daysInMonth = last.getDate();
  const total = Math.ceil((startPad + daysInMonth) / 7) * 7;
  const days = [];
  for (let i = 0; i < startPad; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d));
  while (days.length < total) days.push(null);
  return days;
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function AdminDashboard() {
  const [stats, setStats] = useState({ workingHours: null, users: null, bookings: null });
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const calendarDays = useMemo(
    () => getCalendarDays(calendarMonth.getFullYear(), calendarMonth.getMonth()),
    [calendarMonth]
  );

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getWorkingHours().then((d) => {
        setSchedule(normalizeSchedule(d));
        return Array.isArray(d) ? d : d?.schedule ?? [];
      }).catch(() => []),
      getUsers().then((d) => (Array.isArray(d) ? d : d?.users ?? [])).catch(() => []),
      getBookings().then((d) => (Array.isArray(d) ? d : d?.bookings ?? [])).catch(() => []),
    ])
      .then(([scheduleList, users, bookings]) => {
        if (cancelled) return;
        setStats({
          workingHours: Array.isArray(scheduleList) ? scheduleList.length : 0,
          users: Array.isArray(users) ? users.length : 0,
          bookings: Array.isArray(bookings) ? bookings.length : 0,
        });
      })
      .catch((err) => {
        if (!cancelled) setError(getApiErrorMessage(err, 'Failed to load stats.'));
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const selectedDaySchedule = schedule ? schedule[selectedDate.getDay()] : null;
  const selectedLabel = isSameDay(selectedDate, new Date())
    ? 'Today'
    : selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {error && (
        <div className="mb-5 py-3 px-4 rounded-xl bg-red-50/80 text-red-700 text-sm shrink-0">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 shrink-0">
        <StatCard
          title="Working days"
          value={stats.workingHours !== null ? `${stats.workingHours} of 7` : '—'}
          loading={loading}
          icon={ClockIcon}
        />
        <StatCard
          title="Users"
          value={stats.users ?? '—'}
          loading={loading}
          icon={UsersIcon}
        />
        <StatCard
          title="Bookings"
          value={stats.bookings ?? '—'}
          loading={loading}
          icon={CalendarIcon}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-7 overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-[#F8F4F0] to-[#F0EBE6] shadow-md ring-1 ring-[#E8DFD8]/60 flex flex-col min-h-0">
          <div className="p-5 sm:p-6 flex-1 min-h-0 flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <button
                type="button"
                onClick={() => setCalendarMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1))}
                className="p-2.5 rounded-xl text-[#5C4A42] hover:bg-white/70 transition-colors"
                aria-label="Previous month"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-lg font-semibold text-[#5C4A42]">
                {MONTH_NAMES[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
              </span>
              <button
                type="button"
                onClick={() => setCalendarMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1))}
                className="p-2.5 rounded-xl text-[#5C4A42] hover:bg-white/70 transition-colors"
                aria-label="Next month"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1.5 mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <div key={i} className="text-center text-xs font-semibold text-[#7D6B5E] py-1.5">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {calendarDays.map((date, i) => {
                if (!date) return <div key={`e-${i}`} className="aspect-square" />;
                const isSelected = isSameDay(date, selectedDate);
                const isToday = isSameDay(date, new Date());
                const isCurrentMonth = date.getMonth() === calendarMonth.getMonth();
                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    onClick={() => setSelectedDate(date)}
                    className={`aspect-square rounded-xl text-sm font-semibold transition-all duration-150 ${
                      !isCurrentMonth
                        ? 'text-[#E8DFD8] cursor-default'
                        : isSelected
                          ? 'bg-[#8B6B5C] text-[#F8F4F0] shadow-md scale-105'
                          : isToday
                            ? 'bg-white/90 text-[#5C4A42] shadow-sm ring-1 ring-[#8B6B5C]/40 hover:bg-white'
                            : 'text-[#5C4A42] hover:bg-white/70 rounded-xl'
                    }`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col min-h-0">
          <div className="w-full flex-1 flex flex-col rounded-[1.25rem] overflow-hidden bg-[#F8F4F0] shadow-md ring-1 ring-[#E8DFD8]/60 border-l-4 border-l-[#8B6B5C] min-h-0">
            <div className="flex-1 p-6 flex flex-col justify-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8B6B5C] mb-1">
                Selected day
              </p>
              <p className="text-xl font-bold text-[#5C4A42] mb-4">{selectedLabel}</p>
              {loading || !schedule ? (
                <p className="text-[#7D6B5E]">Loading…</p>
              ) : (
                <p className="text-[#5C4A42] text-[17px] leading-snug">
                  {getScheduleSummary(selectedDaySchedule)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
