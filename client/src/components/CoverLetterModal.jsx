import { useState } from 'react';
import api from '../api';

const DEFAULT_SKILLS =
  'BS Software Engineering graduate, React.js, Node.js, Express.js, MongoDB, JWT authentication, 5 live projects';

const field =
  'w-full bg-white/10 border border-white/15 rounded-lg px-3 py-2 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-violet-400';

export default function CoverLetterModal({ application, onClose }) {
  const [skills, setSkills] = useState(() => localStorage.getItem('coverSkills') || DEFAULT_SKILLS);
  const [jobDescription, setJobDescription] = useState('');
  const [letter, setLetter] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');
    setLetter('');
    setCopied(false);
    setLoading(true);
    try {
      localStorage.setItem('coverSkills', skills);
      const { data } = await api.post('/ai/cover-letter', {
        applicationId: application._id,
        skills,
        jobDescription,
      });
      setLetter(data.coverLetter);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reach the server');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="fade-up w-full max-w-xl overflow-y-auto bg-[#1d1330] border border-white/10 rounded-2xl p-5 shadow-2xl"
        style={{ maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-semibold text-white text-lg">✨ AI Cover Letter</h2>
            <p className="text-xs text-white/50">
              {application.company} • {application.role}
            </p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white text-xl">
            ×
          </button>
        </div>

        <form onSubmit={handleGenerate}>
          <label className="block text-sm text-violet-100/80 mb-1">Your skills and background</label>
          <textarea
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            required
            rows={3}
            maxLength={1000}
            className={`${field} mb-3`}
          />

          <label className="block text-sm text-violet-100/80 mb-1">Job description</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            required
            rows={6}
            maxLength={5000}
            placeholder="Paste the job description here..."
            className={field}
          />

          {error && <p className="bg-red-500/20 text-red-100 text-sm p-2 rounded mt-3">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-linear-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white py-2.5 rounded-lg transition disabled:opacity-60"
          >
            {loading ? 'Writing your cover letter...' : 'Generate'}
          </button>
        </form>

        {letter && (
          <div className="fade-up mt-4 bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white">Your cover letter</h3>
              <button
                onClick={handleCopy}
                className="text-xs px-3 py-1 rounded-lg border border-white/20 text-white/85 hover:bg-white/10"
              >
                {copied ? 'Copied ✓' : 'Copy'}
              </button>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-violet-50/90">{letter}</p>
            <p className="text-xs text-white/40 mt-3">
              AI can make mistakes. Please review and edit before sending.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}