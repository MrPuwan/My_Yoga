import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getApiErrorMessage } from '../../utils/api-error';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }

    setSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      const destination =
        (location.state as { from?: { pathname?: string } } | null)?.from
          ?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to log in.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="-m-4 flex min-h-[calc(100vh-4rem)] items-start justify-center bg-[#eaeee3] px-3 py-4 sm:-m-6 sm:px-6 sm:py-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl bg-[#fbfaf4] shadow-[0_24px_70px_-28px_rgba(26,38,31,0.45)] ring-1 ring-[#d8decb] sm:rounded-3xl lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative hidden overflow-hidden bg-[#1a261f] p-10 text-[#eaeee3] lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-24 size-64 rounded-full border border-[#8aa07e]/30" />
          <div className="absolute -right-10 -top-10 size-64 rounded-full border border-[#c0812e]/30" />
          <div className="relative">
            <span className="home-kicker text-xs uppercase tracking-[0.2em] text-[#a9b7a9]">
              Your practice, remembered
            </span>
            <h2 className="home-display mt-5 text-4xl font-medium leading-tight">
              Return to a practice shaped around you.
            </h2>
            <p className="mt-5 max-w-sm leading-7 text-[#b9c4b8]">
              Sign in to review your health profile, explore matched poses,
              and continue from where you left off.
            </p>
          </div>

          <div className="relative space-y-4 text-sm text-[#d2d9ce]">
            <Feature text="Personal health profile" />
            <Feature text="Rule-based pose recommendations" />
            <Feature text="Clear match reasons and precautions" />
          </div>
        </aside>

        <div className="px-5 py-7 sm:px-12 sm:py-10">
          <div className="mx-auto max-w-md">
            <Link
              to="/"
              className="home-kicker inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#718267] hover:text-[#1f2a24]"
            >
              <span aria-hidden="true">&lt;-</span>
              Back to home
            </Link>

            <div className="mt-6 sm:mt-8">
              <p className="home-kicker text-xs font-semibold uppercase tracking-[0.2em] text-[#a66e24]">
                Member access
              </p>
              <h1 className="home-display mt-2 text-3xl font-medium text-[#1f2a24] sm:mt-3 sm:text-4xl">
                Welcome back
              </h1>
              <p className="mt-3 text-[#5b6b5e]">
                Enter your details to continue to MyYoga.
              </p>
            </div>

            <form className="mt-6 space-y-4 sm:mt-8 sm:space-y-5" onSubmit={submit} noValidate>
              {error && (
                <div
                  role="alert"
                  className="flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  <span aria-hidden="true" className="font-bold">!</span>
                  <span>{error}</span>
                </div>
              )}

              <label className="block text-sm font-semibold text-[#334139]">
                Email address
                <span className="relative mt-2 block">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#718267]">
                    <EmailIcon />
                  </span>
                  <input
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    aria-invalid={Boolean(error)}
                    className="w-full rounded-xl border border-[#cbd3c1] bg-white py-3 pl-11 pr-4 font-normal text-[#1f2a24] outline-none transition placeholder:text-[#9aa597] focus:border-[#8aa07e] focus:ring-4 focus:ring-[#8aa07e]/15"
                  />
                </span>
              </label>

              <label className="block text-sm font-semibold text-[#334139]">
                Password
                <span className="relative mt-2 block">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#718267]">
                    <LockIcon />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    aria-invalid={Boolean(error)}
                    className="w-full rounded-xl border border-[#cbd3c1] bg-white py-3 pl-11 pr-12 font-normal text-[#1f2a24] outline-none transition placeholder:text-[#9aa597] focus:border-[#8aa07e] focus:ring-4 focus:ring-[#8aa07e]/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-[#718267] hover:text-[#1f2a24]"
                  >
                    <EyeIcon hidden={showPassword} />
                  </button>
                </span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#233329] px-4 py-3.5 font-semibold text-white shadow-sm transition hover:bg-[#1a261f] focus:outline-none focus:ring-4 focus:ring-[#8aa07e]/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <span aria-hidden="true">-&gt;</span>
                  </>
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3 sm:my-8 sm:gap-4" aria-hidden="true">
              <span className="h-px flex-1 bg-[#d8decb]" />
              <span className="home-kicker text-[10px] uppercase tracking-[0.16em] text-[#8a9688]">
                New to MyYoga?
              </span>
              <span className="h-px flex-1 bg-[#d8decb]" />
            </div>

            <Link
              to="/register"
              className="block w-full rounded-xl border border-[#b8c3af] px-4 py-3 text-center font-semibold text-[#334139] transition hover:border-[#8aa07e] hover:bg-[#eaeee3]/70"
            >
              Create an account
            </Link>

            <p className="mt-6 text-center text-xs leading-5 text-[#718267]">
              Your access token is stored locally and sent only to the MyYoga
              API for authenticated requests.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-6 items-center justify-center rounded-full bg-[#c0812e]/15 text-[#d69a49]">
        OK
      </span>
      {text}
    </div>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="size-5" aria-hidden="true">
      <path d="M3 5.5h14v9H3v-9Z M3.5 6l6.5 5 6.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="size-5" aria-hidden="true">
      <path d="M5 9h10v8H5V9Zm2-1V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EyeIcon({ hidden }: { hidden: boolean }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="size-5" aria-hidden="true">
      <path d="M2.5 10s2.7-4 7.5-4 7.5 4 7.5 4-2.7 4-7.5 4-7.5-4-7.5-4Z M10 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="currentColor" strokeWidth="1.4" />
      {hidden && <path d="m3 3 14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />}
    </svg>
  );
}
