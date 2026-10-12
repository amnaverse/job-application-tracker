import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout, { AuthInput } from '../components/AuthLayout';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create account">
      <form onSubmit={handleSubmit}>
        {error && <p className="bg-red-500/20 text-red-100 text-sm p-2 rounded mb-3">{error}</p>}

        <AuthInput icon="user" type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <AuthInput icon="mail" type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <AuthInput icon="lock" type="password" name="password" placeholder="Password (min 6 characters)" value={form.password} onChange={handleChange} required minLength={6} />

        <button
  type="submit"
  disabled={loading}
  className="w-full mt-2 bg-linear-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/40 active:scale-95 transition text-white text-xs tracking-[0.25em] py-3 rounded-md disabled:opacity-60"
>
  {loading ? 'CREATING...' : 'SIGN UP'}
</button>

        <p className="text-sm text-white/70 mt-4 text-center">
          Already have an account? <Link to="/login" className="text-violet-200 hover:underline">Log in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}