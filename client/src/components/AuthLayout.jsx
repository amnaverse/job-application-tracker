const ICONS = {
  user: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0',
  mail: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75',
  lock: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z',
};

function Icon({ name, className = 'w-5 h-5' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d={ICONS[name]} />
    </svg>
  );
}

export function AuthInput({ icon, ...props }) {
  return (
    <div className="flex mb-3 bg-white overflow-hidden rounded-md transition duration-300 hover:shadow-lg hover:shadow-violet-500/30 focus-within:ring-2 focus-within:ring-violet-400 focus-within:-translate-y-0.5">
      <span className="w-10 flex items-center justify-center bg-[#2a1d40] text-white/80">
        <Icon name={icon} className="w-4 h-4" />
      </span>
      <input
        {...props}
        className="flex-1 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none"
      />
    </div>
  );
}

export default function AuthLayout({ title, children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#150f22] flex items-center justify-center px-4">
      <div className="float-slow absolute -top-24 -left-24 w-md h-112 rounded-full bg-violet-600/50 blur-3xl" />
<div className="float-slower absolute bottom-0 right-0 w-104 h-104 rounded-full bg-fuchsia-600/40 blur-3xl" />
<div className="float-slow absolute top-1/3 left-1/2 w-72 h-72 rounded-full bg-indigo-500/30 blur-3xl" />


      <div className="fade-up relative w-full max-w-sm mt-10">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-[#1d1330] border border-white/10 shadow-lg flex items-center justify-center text-white z-10">
          <Icon name="user" className="w-9 h-9" />
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl px-6 pt-14 pb-6 shadow-2xl transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:bg-white/10 hover:border-violet-300/60 hover:shadow-violet-500/40">
  <h1 className="text-white text-center text-lg font-semibold tracking-wide mb-4">{title}</h1>
  {children}
</div>
      </div>
    </div>
  );
}