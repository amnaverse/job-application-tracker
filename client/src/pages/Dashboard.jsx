import { useEffect, useMemo, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import ApplicationForm from '../components/ApplicationForm';
import CoverLetterModal from '../components/CoverLetterModal';

const STATUSES = ['Applied', 'Interview', 'Offer', 'Rejected'];
const BADGE = {
  Applied: 'bg-sky-400/15 text-sky-200 border-sky-400/30',
  Interview: 'bg-amber-400/15 text-amber-200 border-amber-400/30',
  Offer: 'bg-emerald-400/15 text-emerald-200 border-emerald-400/30',
  Rejected: 'bg-rose-400/15 text-rose-200 border-rose-400/30',
};
const ICON = { Applied: '📨', Interview: '🎤', Offer: '🎉', Rejected: '✖️' };

const daysSince = (d) => Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
const fmt = (d) => (d ? new Date(d).toLocaleDateString() : '-');
const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [letterFor, setLetterFor] = useState(null);

  const handleError = (err) => {
    if (err.response?.status === 401) return logout();
    setError(err.response?.data?.message || 'Something went wrong');
  };

  const loadApps = async () => {
    try {
      const { data } = await api.get('/applications');
      setApps(data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApps();
  }, []);

  const handleSave = async (data) => {
    setError('');
    try {
      if (editing) await api.put(`/applications/${editing._id}`, data);
      else await api.post('/applications', data);
      setShowForm(false);
      setEditing(null);
      await loadApps();
    } catch (err) {
      handleError(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await api.delete(`/applications/${id}`);
      setApps(apps.filter((a) => a._id !== id));
    } catch (err) {
      handleError(err);
    }
  };

  const filtered = useMemo(
    () =>
      apps.filter(
        (a) =>
          (statusFilter === 'All' || a.status === statusFilter) &&
          a.company.toLowerCase().includes(search.toLowerCase())
      ),
    [apps, search, statusFilter]
  );

  const counts = STATUSES.reduce((acc, s) => ({ ...acc, [s]: apps.filter((a) => a.status === s).length }), {});
  const needFollowUp = apps.filter((a) => a.status === 'Applied' && daysSince(a.appliedDate) >= 5);

  const glass = 'bg-white/10 backdrop-blur-md border border-white/10 shadow-xl';
  const lift =
    'transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-white/15 hover:border-violet-300/30 hover:shadow-2xl hover:shadow-violet-900/40';

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#150f22] p-4 sm:p-6">
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-violet-700/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 rounded-full bg-fuchsia-700/30 blur-3xl" />

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className={`fade-up ${glass} p-5 rounded-2xl flex items-center justify-between mb-5`}>
          <div>
            <p className="text-sm text-violet-200/70">{greeting()},</p>
            <h1 className="text-2xl sm:text-3xl font-bold">
  <span className="bg-linear-to-r from-violet-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
    {user?.name}
  </span>{' '}
  👋
</h1>
            <p className="text-xs text-white/50 mt-1">Track every application, never miss a follow-up.</p>
          </div>
          <button
            onClick={logout}
            className="text-sm text-white/80 border border-white/20 px-4 py-2 rounded-lg hover:bg-white/10 transition"
          >
            Log out
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
          {[['Total', apps.length, '📋'], ...STATUSES.map((s) => [s, counts[s], ICON[s]])].map(([name, n, icon], i) => (
            <div
              key={name}
              style={{ animationDelay: `${i * 70}ms` }}
              className={`fade-up ${glass} ${lift} p-4 rounded-2xl text-center`}
            >
              <p className="text-lg">{icon}</p>
              <p className="text-2xl font-bold text-white">{n}</p>
              <p className="text-xs text-violet-200/70">{name}</p>
            </div>
          ))}
        </div>

        {needFollowUp.length > 0 && (
          <div className="fade-up bg-amber-400/10 border border-amber-300/30 text-amber-100 text-sm p-3 rounded-xl mb-5">
            ⏰ Follow-up needed (no update in 5+ days): {needFollowUp.map((a) => a.company).join(', ')}
          </div>
        )}

        {error && <p className="bg-red-500/20 text-red-100 text-sm p-2 rounded mb-3">{error}</p>}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-2 mb-5">
          <input
            placeholder="Search by company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-white/10 border border-white/15 rounded-lg px-3 py-2.5 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-violet-400"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white/10 border border-white/15 rounded-lg px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-violet-400"
          >
            <option className="bg-[#1d1330]">All</option>
            {STATUSES.map((s) => (
              <option key={s} className="bg-[#1d1330]">
                {s}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            className="bg-linear-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-violet-900/40 transition hover:-translate-y-0.5"
          >
            + Add application
          </button>
        </div>

        {/* AI cover letter popup */}
        {letterFor && <CoverLetterModal application={letterFor} onClose={() => setLetterFor(null)} />}

        {showForm && (
          <ApplicationForm
            key={editing?._id || 'new'}
            initial={editing}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
          />
        )}

        {/* List */}
        {loading ? (
          <p className="text-center text-white/60">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className={`fade-up text-center text-white/70 ${glass} p-8 rounded-2xl`}>
            {apps.length === 0 ? 'No applications yet. Add your first one! 🚀' : 'No applications match your search.'}
          </p>
        ) : (
          <div className="space-y-3">
            {filtered.map((a, i) => (
              <div
                key={a._id}
                style={{ animationDelay: `${i * 60}ms` }}
                className={`fade-up ${glass} ${lift} p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-white text-lg">{a.company}</h3>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border ${BADGE[a.status]}`}>{a.status}</span>
                  </div>
                  <p className="text-sm text-violet-100/80">{a.role}</p>
                  <p className="text-xs text-white/50 mt-1">
                    Applied: {fmt(a.appliedDate)} {a.followUpDate && `• Follow-up: ${fmt(a.followUpDate)}`}
                  </p>
                  {a.notes && <p className="text-xs text-white/50 mt-1">📝 {a.notes}</p>}
                  {a.link && (
                    <a
                      href={a.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-violet-300 hover:text-violet-200 hover:underline"
                    >
                      Open job link ↗
                    </a>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setLetterFor(a)}
                    className="text-sm px-4 py-1.5 rounded-lg border border-violet-300/40 text-violet-200 hover:bg-violet-400/10 transition"
                  >
                    ✨ Cover letter
                  </button>
                  <button
                    onClick={() => {
                      setEditing(a);
                      setShowForm(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-sm px-4 py-1.5 rounded-lg border border-white/20 text-white/85 hover:bg-white/10 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(a._id)}
                    className="text-sm px-4 py-1.5 rounded-lg border border-rose-300/40 text-rose-200 hover:bg-rose-400/10 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}