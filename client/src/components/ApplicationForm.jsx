import { useState } from 'react';

const STATUSES = ['Applied', 'Interview', 'Offer', 'Rejected'];
const toDateInput = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');

const input =
  'w-full bg-white/10 border border-white/15 rounded-lg px-3 py-2 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-violet-400 [color-scheme:dark]';
const label = 'block text-sm text-violet-100/80 mb-1';

export default function ApplicationForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    company: initial?.company || '',
    role: initial?.role || '',
    link: initial?.link || '',
    status: initial?.status || 'Applied',
    appliedDate: toDateInput(initial?.appliedDate) || new Date().toISOString().slice(0, 10),
    followUpDate: toDateInput(initial?.followUpDate),
    notes: initial?.notes || '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave({ ...form, followUpDate: form.followUpDate || null });
    setSaving(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="fade-up bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-xl mb-5"
    >
      <h2 className="font-semibold text-white mb-4">{initial ? 'Edit application' : 'Add application'}</h2>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className={label}>Company *</label>
          <input name="company" value={form.company} onChange={handleChange} required className={input} />
        </div>
        <div>
          <label className={label}>Role *</label>
          <input name="role" value={form.role} onChange={handleChange} required className={input} />
        </div>
        <div>
          <label className={label}>Job link</label>
          <input name="link" value={form.link} onChange={handleChange} className={input} />
        </div>
        <div>
          <label className={label}>Status</label>
          <select name="status" value={form.status} onChange={handleChange} className={input}>
            {STATUSES.map((s) => (
              <option key={s} className="bg-[#1d1330]">{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Applied date</label>
          <input type="date" name="appliedDate" value={form.appliedDate} onChange={handleChange} className={input} />
        </div>
        <div>
          <label className={label}>Follow-up date</label>
          <input type="date" name="followUpDate" value={form.followUpDate} onChange={handleChange} className={input} />
        </div>
      </div>

      <label className={`${label} mt-3`}>Notes</label>
      <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} className={input} />

      <div className="flex gap-2 mt-4">
        <button
          type="submit" disabled={saving}
          className="bg-linear-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-5 py-2 rounded-lg shadow-lg shadow-violet-900/40 transition disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button" onClick={onCancel}
          className="px-5 py-2 rounded-lg border border-white/20 text-white/80 hover:bg-white/10 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}