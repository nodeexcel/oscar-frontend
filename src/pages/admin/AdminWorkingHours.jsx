import { useState, useEffect, useMemo } from 'react';
import { getWorkingHours, updateWorkingHours } from '../../api/admin/workingHours';
import { getApiErrorMessage } from '../../utils/apiErrors';
import { parseTimeFromApi, timeToApi, getScheduleSummary, normalizeSchedule, defaultDay } from '../../utils/scheduleDisplay';
import { AdminPageHeader } from '../../components/admin/AdminPageLayout';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function EditIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

export default function AdminWorkingHours() {
  const [schedule, setSchedule] = useState(() => Array.from({ length: 7 }, (_, i) => defaultDay(i)));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editingDayOfWeek, setEditingDayOfWeek] = useState(null);

  const todayDayOfWeek = useMemo(() => new Date().getDay(), []);

  const restOfWeekOrder = useMemo(
    () => Array.from({ length: 6 }, (_, i) => (todayDayOfWeek + 1 + i) % 7),
    [todayDayOfWeek]
  );

  useEffect(() => {
    let cancelled = false;
    setError('');
    getWorkingHours()
      .then((data) => {
        if (cancelled) return;
        setSchedule(normalizeSchedule(data));
      })
      .catch((err) => {
        if (!cancelled) setError(getApiErrorMessage(err, 'Failed to load working hours.'));
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const updateDay = (dayOfWeek, field, value) => {
    setSchedule((prev) => {
      const next = [...prev];
      next[dayOfWeek] = { ...next[dayOfWeek], [field]: value };
      return next;
    });
  };

  const handleSave = async () => {
    setError('');
    setSaving(true);
    try {
      await updateWorkingHours({
        schedule: schedule.map(({ day_of_week, start_time, end_time, slot_duration_minutes, is_active }) => ({
          day_of_week,
          start_time,
          end_time,
          slot_duration_minutes,
          is_active,
        })),
      });
      setEditingDayOfWeek(null);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to save working hours.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-full">
        <AdminPageHeader
          title="Working hours"
          subtitle="Set your weekly availability. This schedule repeats every week until you change it."
        />
        <div className="rounded-xl bg-[#F8F4F0] p-8 flex items-center justify-center text-[#7D6B5E]">
          Loading…
        </div>
      </div>
    );
  }

  const todaySchedule = schedule[todayDayOfWeek];

  return (
    <div className="min-h-full">
      <AdminPageHeader
        title="Working hours"
        subtitle="Set your weekly availability. This schedule repeats every week until you change it."
      />

      {error && (
        <div className="mb-5 py-3 px-4 rounded-xl bg-red-50/80 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-stretch">
        <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
          <div className="rounded-xl bg-[#F0EBE6] flex items-center justify-center p-6 shrink-0" aria-hidden>
            <svg className="w-24 h-24 text-[#8B6B5C]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="1.5" />
              <line x1="16" y1="2" x2="16" y2="6" strokeWidth="1.5" />
              <line x1="8" y1="2" x2="8" y2="6" strokeWidth="1.5" />
              <line x1="3" y1="10" x2="21" y2="10" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="rounded-xl bg-[#F8F4F0] overflow-hidden relative flex-1 min-h-0 flex flex-col">
            <div className="absolute top-4 right-4">
              <button
                type="button"
                onClick={() => setEditingDayOfWeek(editingDayOfWeek === todayDayOfWeek ? null : todayDayOfWeek)}
                className="p-2 rounded-lg text-[#7D6B5E] hover:bg-[#E8DFD8] hover:text-[#5C4A42] transition-colors"
                aria-label="Edit today"
              >
                <EditIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 sm:p-8">
              <h2 className="text-sm font-medium text-[#7D6B5E] mb-1">Today</h2>
              <p className="text-xl font-semibold text-[#5C4A42] mb-4">
                {DAY_NAMES[todayDayOfWeek]}
              </p>
              {editingDayOfWeek === todayDayOfWeek ? (
                <DayEditForm
                  day={todaySchedule}
                  dayOfWeek={todayDayOfWeek}
                  onUpdate={updateDay}
                  onSave={handleSave}
                  onCancel={() => setEditingDayOfWeek(null)}
                  saving={saving}
                />
              ) : (
                <div className="text-[#5C4A42]">
                  <p className="text-lg">{getScheduleSummary(todaySchedule)}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-[#F8F4F0] p-5 flex flex-col min-h-0 overflow-hidden">
          <h2 className="text-sm font-medium text-[#7D6B5E] mb-3 shrink-0">Rest of week</h2>
          <ul className="space-y-2 overflow-auto min-h-0">
            {restOfWeekOrder.map((dayOfWeek) => {
              const day = schedule[dayOfWeek];
              const isEditing = editingDayOfWeek === dayOfWeek;
              return (
                <li key={dayOfWeek}>
                  {isEditing ? (
                    <div className="p-4 rounded-lg bg-white/80 border border-[#E8DFD8]">
                      <DayEditForm
                        day={day}
                        dayOfWeek={dayOfWeek}
                        onUpdate={updateDay}
                        onSave={handleSave}
                        onCancel={() => setEditingDayOfWeek(null)}
                        saving={saving}
                        compact
                      />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEditingDayOfWeek(dayOfWeek)}
                      className="w-full text-left px-4 py-3 rounded-lg bg-white/60 hover:bg-[#E8DFD8] transition-colors flex items-center justify-between gap-2"
                    >
                      <span className="font-medium text-[#5C4A42]">{DAY_NAMES[dayOfWeek]}</span>
                      <span className="text-sm text-[#7D6B5E] truncate">{getScheduleSummary(day)}</span>
                      <EditIcon className="w-4 h-4 text-[#7D6B5E] shrink-0" />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

function DayEditForm({ day, dayOfWeek, onUpdate, onSave, onCancel, saving, compact }) {
  return (
    <div className={compact ? 'space-y-3' : 'space-y-4'}>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={!!day.is_active}
          onChange={(e) => onUpdate(dayOfWeek, 'is_active', e.target.checked)}
          className="rounded border-[#E8DFD8] text-[#8B6B5C] focus:ring-[#8B6B5C]"
        />
        <span className="text-sm text-[#5C4A42]">Available</span>
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#7D6B5E]">Start</span>
          <input
            type="time"
            value={parseTimeFromApi(day.start_time)}
            onChange={(e) => onUpdate(dayOfWeek, 'start_time', timeToApi(e.target.value))}
            className="px-3 py-2 rounded-lg bg-white text-[#5C4A42] border border-[#E8DFD8] focus:outline-none focus:ring-2 focus:ring-[#8B6B5C]/30"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#7D6B5E]">End</span>
          <input
            type="time"
            value={parseTimeFromApi(day.end_time)}
            onChange={(e) => onUpdate(dayOfWeek, 'end_time', timeToApi(e.target.value))}
            className="px-3 py-2 rounded-lg bg-white text-[#5C4A42] border border-[#E8DFD8] focus:outline-none focus:ring-2 focus:ring-[#8B6B5C]/30"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#7D6B5E]">Slot</span>
          <select
            value={day.slot_duration_minutes ?? 30}
            onChange={(e) => onUpdate(dayOfWeek, 'slot_duration_minutes', Number(e.target.value))}
            className="px-3 py-2 rounded-lg bg-white text-[#5C4A42] border border-[#E8DFD8] focus:outline-none focus:ring-2 focus:ring-[#8B6B5C]/30"
          >
            {[15, 30, 45, 60].map((m) => (
              <option key={m} value={m}>{m} min</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="px-4 py-2 text-sm font-semibold text-[#F8F4F0] bg-[#8B6B5C] rounded-lg hover:bg-[#7D6B5E] disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-[#5C4A42] bg-[#E8DFD8] rounded-lg hover:bg-[#ddd]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
