import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getApiErrorMessage } from '../../utils/api-error';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        confirmPassword,
      });
      navigate('/dashboard', { replace: true });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to register.'));
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-[#cbd3c1] bg-white py-3 pl-11 pr-4 font-normal text-[#1f2a24] outline-none transition placeholder:text-[#9aa597] focus:border-[#8aa07e] focus:ring-4 focus:ring-[#8aa07e]/15';

  return (
    <div className="-m-4 flex min-h-[calc(100vh-4rem)] items-start justify-center bg-[#eaeee3] px-3 py-4 sm:-m-6 sm:px-6 sm:py-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl bg-[#fbfaf4] shadow-[0_24px_70px_-28px_rgba(26,38,31,0.45)] ring-1 ring-[#d8decb] sm:rounded-3xl lg:grid-cols-[1.15fr_0.85fr]">
        <div className="px-5 py-7 sm:px-10 sm:py-10 lg:px-12">
          <div className="mx-auto max-w-xl">
            <Link
              to="/"
              className="home-kicker inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#718267] hover:text-[#1f2a24]"
            >
              <span aria-hidden="true">&lt;-</span>
              Back to home
            </Link>

            <div className="mt-6">
              <p className="home-kicker text-xs font-semibold uppercase tracking-[0.2em] text-[#a66e24]">
                Begin your practice
              </p>
              <h1 className="home-display mt-2 text-3xl font-medium text-[#1f2a24] sm:mt-3 sm:text-4xl">
                Create your account
              </h1>
              <p className="mt-3 text-[#5b6b5e]">
                Set up your secure account, then add your health profile to
                receive personalized pose matches.
              </p>
            </div>

            <form className="mt-6 space-y-4" onSubmit={submit} noValidate>
              {error && (
                <div
                  role="alert"
                  className="flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  <span aria-hidden="true" className="font-bold">!</span>
                  <span>{error}</span>
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full name">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#718267]">
                    <UserIcon />
                  </span>
                  <input
                    type="text"
                    autoComplete="name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Your full name"
                    aria-invalid={Boolean(error)}
                    className={inputClass}
                  />
                </Field>

                <Field label="Email address">
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
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Password">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#718267]">
                    <LockIcon />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 8 characters"
                    aria-invalid={Boolean(error)}
                    className={`${inputClass} pr-12`}
                  />
                  <PasswordToggle
                    visible={showPassword}
                    onToggle={() => setShowPassword((current) => !current)}
                  />
                </Field>

                <Field label="Confirm password">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#718267]">
                    <LockIcon />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Repeat your password"
                    aria-invalid={Boolean(error)}
                    className={`${inputClass} pr-12`}
                  />
                  <PasswordToggle
                    visible={showPassword}
                    onToggle={() => setShowPassword((current) => !current)}
                  />
                </Field>
              </div>

              <p className="text-xs leading-5 text-[#718267]">
                Use at least 8 characters. Your password is securely hashed by
                the server and is never displayed in your profile.
              </p>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#233329] px-4 py-3.5 font-semibold text-white shadow-sm transition hover:bg-[#1a261f] focus:outline-none focus:ring-4 focus:ring-[#8aa07e]/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <span aria-hidden="true">-&gt;</span>
                  </>
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-4" aria-hidden="true">
              <span className="h-px flex-1 bg-[#d8decb]" />
              <span className="home-kicker text-[10px] uppercase tracking-[0.16em] text-[#8a9688]">
                Already registered?
              </span>
              <span className="h-px flex-1 bg-[#d8decb]" />
            </div>

            <Link
              to="/login"
              className="block w-full rounded-xl border border-[#b8c3af] px-4 py-3 text-center font-semibold text-[#334139] transition hover:border-[#8aa07e] hover:bg-[#eaeee3]/70"
            >
              Sign in to your account
            </Link>
          </div>
        </div>

        <aside className="relative hidden overflow-hidden bg-[#1a261f] p-8 text-[#eaeee3] lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -left-24 -top-24 size-64 rounded-full border border-[#8aa07e]/30" />
          <div className="absolute -left-10 -top-10 size-64 rounded-full border border-[#c0812e]/30" />
          <div className="relative">
            <span className="home-kicker text-xs uppercase tracking-[0.2em] text-[#a9b7a9]">
              A thoughtful beginning
            </span>
            <h2 className="home-display mt-5 text-4xl font-medium leading-tight">
              Your profile is the starting point, not an afterthought.
            </h2>
            <p className="mt-5 leading-7 text-[#b9c4b8]">
              MyYoga uses your pain area, activity level, and profile details
              to explain why each active pose is recommended.
            </p>
          </div>

          <div className="relative space-y-5">
            <RegistrationStep number="01" text="Create your secure account" />
            <RegistrationStep number="02" text="Complete your health profile" />
            <RegistrationStep number="03" text="Review your matched poses" />
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-semibold text-[#334139]">
      {label}
      <span className="relative mt-2 block">{children}</span>
    </label>
  );
}

function RegistrationStep({ number, text }: { number: string; text: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="home-kicker flex size-9 shrink-0 items-center justify-center rounded-full border border-[#8aa07e]/50 text-xs text-[#d69a49]">
        {number}
      </span>
      <span className="text-sm text-[#d2d9ce]">{text}</span>
    </div>
  );
}

function PasswordToggle({
  visible,
  onToggle,
}: {
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={visible ? 'Hide passwords' : 'Show passwords'}
      aria-pressed={visible}
      className="absolute inset-y-0 right-0 flex items-center px-4 text-[#718267] hover:text-[#1f2a24]"
    >
      <EyeIcon hidden={visible} />
    </button>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="size-5" aria-hidden="true">
      <path d="M10 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-6 7c.5-3.2 2.5-5 6-5s5.5 1.8 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
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
