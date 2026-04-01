import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen auth-bg flex items-center justify-center px-4">
      <div className="text-center relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-6">
          <svg
            className="w-8 h-8 text-indigo-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
          Auth Starter
        </h1>
        <p className="text-slate-400 mb-10 max-w-sm mx-auto leading-relaxed">
          A simple authentication system to kickstart your project
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="auth-btn px-8 py-3 rounded-lg text-sm tracking-wide"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="px-8 py-3 rounded-lg text-sm tracking-wide border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white transition-all"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
