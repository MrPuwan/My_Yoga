import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import fallbackImage from '../../assets/hero.png';
import { useAuth } from '../../context/AuthContext';
import { getMyHealthProfile } from '../../services/health-profile.service';
import { getMyRecommendations } from '../../services/recommendations.service';
import type { HealthProfile } from '../../types/health-profile';
import type { Recommendation } from '../../types/recommendation';
import { getApiErrorMessage } from '../../utils/api-error';

type DashboardState = 'loading' | 'ready' | 'missing-profile' | 'error';

export default function UserDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<HealthProfile | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [state, setState] = useState<DashboardState>('loading');
  const [error, setError] = useState('');
  const [recommendationError, setRecommendationError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      setState('loading');
      setError('');
      try {
        const currentProfile = await getMyHealthProfile();
        if (!currentProfile) {
          setState('missing-profile');
          return;
        }

        setProfile(currentProfile);
        setState('ready');

        try {
          const result = await getMyRecommendations();
          setRecommendations(result);
        } catch (requestError) {
          setRecommendationError(
            getApiErrorMessage(
              requestError,
              'Recommendations are temporarily unavailable.',
            ),
          );
        }
      } catch (requestError) {
        setError(
          getApiErrorMessage(requestError, 'Unable to load your dashboard.'),
        );
        setState('error');
      }
    };

    void loadDashboard();
  }, []);

  if (state === 'loading') {
    return <DashboardSkeleton />;
  }

  if (state === 'error') {
    return (
      <StatusCard
        title="Dashboard unavailable"
        message={error}
      />
    );
  }

  if (state === 'missing-profile') {
    return <ProfileOnboarding name={user?.fullName || 'there'} />;
  }

  if (!profile) return null;

  const topRecommendation = recommendations[0];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <header>
        <p className="home-kicker text-xs font-semibold uppercase tracking-[0.2em] text-[#a66e24]">
          Your practice overview
        </p>
        <h1 className="home-display mt-3 text-3xl font-medium text-[#1f2a24] sm:text-4xl">
          Welcome back, {user?.fullName}
        </h1>
        <p className="mt-2 text-[#5b6b5e]">
          Your current health profile and recommended next pose.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <ProfileMetric label="BMI" value={String(profile.bmi)} featured />
        <ProfileMetric label="BMI category" value={profile.bmiCategory} />
        <ProfileMetric label="Pain area" value={formatValue(profile.painArea)} />
        <ProfileMetric
          label="Activity level"
          value={profile.activityLevel || 'Not specified'}
        />
        <ProfileMetric
          label="Last updated"
          value={formatDate(profile.updatedAt)}
        />
      </section>

      <section>
        <h2 className="home-display text-2xl font-medium text-[#1f2a24]">
          Quick actions
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <QuickAction
            to="/recommendations"
            title="View Recommendations"
            copy="See all poses matched to your profile."
            primary
          />
          <QuickAction
            to="/health-profile"
            title="Update Health Profile"
            copy="Keep your measurements and activity current."
          />
          <QuickAction
            to="/yoga-poses"
            title="Browse Yoga Poses"
            copy="Explore the available active pose library."
          />
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="home-kicker text-xs uppercase tracking-[0.18em] text-[#718267]">
              Best current match
            </p>
            <h2 className="home-display mt-2 text-2xl font-medium text-[#1f2a24]">
              Top recommendation
            </h2>
          </div>
          {topRecommendation && (
            <Link
              to="/recommendations"
              className="hidden text-sm font-semibold text-[#a66e24] hover:underline sm:block"
            >
              View all
            </Link>
          )}
        </div>

        {recommendationError ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
            {recommendationError}
          </div>
        ) : topRecommendation ? (
          <TopRecommendation recommendation={topRecommendation} />
        ) : (
          <div className="rounded-2xl border border-[#d8decb] bg-[#fbfaf4] p-6">
            <h3 className="font-semibold text-[#334139]">
              No matching recommendations yet
            </h3>
            <p className="mt-2 text-sm text-[#5b6b5e]">
              There are currently no active poses matching your profile.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function ProfileOnboarding({ name }: { name: string }) {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="overflow-hidden rounded-3xl bg-[#fbfaf4] shadow-sm ring-1 ring-[#d8decb]">
        <div className="bg-[#1a261f] px-6 py-10 text-[#eaeee3] sm:px-10">
          <p className="home-kicker text-xs uppercase tracking-[0.2em] text-[#a9b7a9]">
            One step left
          </p>
          <h1 className="home-display mt-3 text-3xl font-medium sm:text-4xl">
            Welcome, {name}
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-[#b9c4b8]">
            Complete your health profile so MyYoga can match active poses to
            your pain area, activity level, and BMI category.
          </p>
        </div>

        <div className="p-6 sm:p-10">
          <h2 className="home-display text-2xl font-medium text-[#1f2a24]">
            Set up your recommendations
          </h2>
          <div className="mt-7 space-y-5">
            <ProgressStep
              number="01"
              title="Account created"
              status="Completed"
              completed
            />
            <ProgressStep
              number="02"
              title="Complete health profile"
              status="Current step"
              current
            />
            <ProgressStep
              number="03"
              title="View yoga recommendations"
              status="Locked until profile completion"
            />
          </div>

          <Link
            to="/health-profile"
            className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-[#233329] px-6 py-3 font-semibold text-white hover:bg-[#1a261f] sm:w-auto"
          >
            Complete Health Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProgressStep({
  number,
  title,
  status,
  completed = false,
  current = false,
}: {
  number: string;
  title: string;
  status: string;
  completed?: boolean;
  current?: boolean;
}) {
  return (
    <div className="flex items-center gap-4">
      <span
        className={`home-kicker flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
          completed
            ? 'bg-emerald-100 text-emerald-700'
            : current
              ? 'bg-[#c0812e] text-[#1a261f]'
              : 'bg-slate-100 text-slate-400'
        }`}
      >
        {completed ? 'OK' : number}
      </span>
      <div>
        <p className={`font-semibold ${current ? 'text-[#1f2a24]' : 'text-[#5b6b5e]'}`}>
          {title}
        </p>
        <p className="text-xs text-[#718267]">{status}</p>
      </div>
    </div>
  );
}

function ProfileMetric({
  label,
  value,
  featured = false,
}: {
  label: string;
  value: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-5 ${
        featured
          ? 'bg-[#1a261f] text-[#eaeee3]'
          : 'border border-[#d8decb] bg-[#fbfaf4] text-[#1f2a24]'
      }`}
    >
      <p className={`text-xs font-semibold uppercase tracking-wide ${
        featured ? 'text-[#a9b7a9]' : 'text-[#718267]'
      }`}>
        {label}
      </p>
      <p className={`mt-2 font-semibold ${featured ? 'text-3xl' : 'text-lg'}`}>
        {value}
      </p>
    </div>
  );
}

function QuickAction({
  to,
  title,
  copy,
  primary = false,
}: {
  to: string;
  title: string;
  copy: string;
  primary?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`rounded-2xl p-5 transition hover:-translate-y-0.5 hover:shadow-md ${
        primary
          ? 'bg-[#c0812e] text-[#1a261f]'
          : 'border border-[#d8decb] bg-[#fbfaf4] text-[#1f2a24]'
      }`}
    >
      <h3 className="font-semibold">{title}</h3>
      <p className={`mt-2 text-sm leading-6 ${
        primary ? 'text-[#3d321f]' : 'text-[#5b6b5e]'
      }`}>
        {copy}
      </p>
    </Link>
  );
}

function TopRecommendation({
  recommendation,
}: {
  recommendation: Recommendation;
}) {
  const { yogaPose, matchScore, reason } = recommendation;
  return (
    <article className="grid overflow-hidden rounded-2xl bg-[#fbfaf4] shadow-sm ring-1 ring-[#d8decb] md:grid-cols-[260px_1fr]">
      <img
        src={yogaPose.imageUrl || fallbackImage}
        alt={yogaPose.name}
        className="h-56 w-full object-cover md:h-full"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = fallbackImage;
        }}
      />
      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[#a66e24]">
              {yogaPose.difficulty}
            </p>
            <h3 className="home-display mt-1 text-3xl font-medium text-[#1f2a24]">
              {yogaPose.name}
            </h3>
          </div>
          <span className="rounded-full bg-[#eaeee3] px-3 py-1 text-sm font-bold text-[#334139]">
            {matchScore} pts
          </span>
        </div>
        <p className="mt-4 leading-7 text-[#5b6b5e]">{reason}</p>
        <Link
          to="/recommendations"
          className="mt-6 inline-flex rounded-xl bg-[#233329] px-5 py-2.5 font-semibold text-white hover:bg-[#1a261f]"
        >
          View Recommendations
        </Link>
      </div>
    </article>
  );
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse space-y-7">
      <div className="h-10 w-72 rounded bg-[#d8decb]" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="h-28 rounded-2xl bg-[#e1e5d8]" />
        ))}
      </div>
      <div className="h-64 rounded-2xl bg-[#e1e5d8]" />
    </div>
  );
}

function StatusCard({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl bg-[#fbfaf4] p-8 text-center ring-1 ring-[#d8decb]">
      <h1 className="home-display text-3xl font-medium text-[#1f2a24]">{title}</h1>
      <p className="mt-3 text-[#5b6b5e]">{message}</p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="mt-6 inline-flex rounded-xl bg-[#233329] px-5 py-2.5 font-semibold text-white"
      >
        Try again
      </button>
    </div>
  );
}

function formatValue(value: string) {
  if (value === 'NONE') return 'No specific pain';
  return value.charAt(0) + value.slice(1).toLowerCase();
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}
