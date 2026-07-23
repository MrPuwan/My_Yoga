import axios from 'axios';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import fallbackImage from '../../assets/hero.png';
import PoseDetailsModal from '../../components/recommendations/PoseDetailsModal';
import { getMyRecommendations } from '../../services/recommendations.service';
import type { Recommendation } from '../../types/recommendation';
import type { YogaPose } from '../../types/yoga-pose';
import { getApiErrorMessage } from '../../utils/api-error';

type PageState = 'loading' | 'success' | 'missing-profile' | 'error';

const primaryButtonClass =
  'inline-flex items-center justify-center rounded-xl bg-[#233329] px-5 py-3 font-semibold text-white transition hover:bg-[#1a261f]';
const secondaryButtonClass =
  'inline-flex items-center justify-center rounded-xl border border-[#b8c3af] bg-[#fbfaf4] px-5 py-3 font-semibold text-[#334139] transition hover:bg-[#eaeee3]';

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [state, setState] = useState<PageState>('loading');
  const [error, setError] = useState('');
  const [selectedPose, setSelectedPose] = useState<YogaPose | null>(null);

  const loadRecommendations = useCallback(async () => {
    setState('loading');
    setError('');
    try {
      setRecommendations(await getMyRecommendations());
      setState('success');
    } catch (requestError) {
      if (
        axios.isAxiosError(requestError) &&
        requestError.response?.status === 404
      ) {
        setState('missing-profile');
      } else {
        setError(
          getApiErrorMessage(
            requestError,
            'Unable to load your recommendations.',
          ),
        );
        setState('error');
      }
    }
  }, []);

  useEffect(() => {
    void loadRecommendations();
  }, [loadRecommendations]);

  return (
    <div className="-m-4 min-h-[calc(100vh-4rem)] bg-[#eaeee3] px-4 py-8 text-[#1f2a24] sm:-m-6 sm:px-6 sm:py-12">
      <section className="mx-auto max-w-7xl space-y-8">
        <RecommendationHeader />

        {state === 'loading' && <RecommendationSkeleton />}

        {state === 'missing-profile' && (
          <GuidancePanel
            step="Profile required"
            title="Complete your health profile first"
            message="Your pain area, activity level, height, and weight provide the starting point for safe rule-based pose matching."
          >
            <Link to="/health-profile" className={primaryButtonClass}>
              Complete Health Profile
            </Link>
          </GuidancePanel>
        )}

        {state === 'error' && (
          <GuidancePanel
            step="Something went wrong"
            title="Recommendations are temporarily unavailable"
            message={error}
          >
            <button
              type="button"
              onClick={() => void loadRecommendations()}
              className={primaryButtonClass}
            >
              Try Again
            </button>
          </GuidancePanel>
        )}

        {state === 'success' && recommendations.length === 0 && (
          <GuidancePanel
            step="No active matches"
            title="No matching recommendations yet"
            message="Your profile is ready, but the active pose library does not currently contain a suitable match. You can still explore active poses or review your profile."
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/yoga-poses" className={primaryButtonClass}>
                Browse Yoga Poses
              </Link>
              <Link to="/health-profile" className={secondaryButtonClass}>
                Review Health Profile
              </Link>
            </div>
          </GuidancePanel>
        )}

        {state === 'success' && recommendations.length > 0 && (
          <>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="home-kicker text-xs uppercase tracking-[0.18em] text-[#718267]">
                  Ranked for your profile
                </p>
                <h2 className="home-display mt-2 text-2xl font-medium sm:text-3xl">
                  {recommendations.length} recommended{' '}
                  {recommendations.length === 1 ? 'pose' : 'poses'}
                </h2>
              </div>
              <Link
                to="/health-profile"
                className="text-sm font-semibold text-[#a66e24] hover:underline"
              >
                Update matching details
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {recommendations.map((recommendation, index) => (
                <RecommendationCard
                  key={recommendation.yogaPose.id}
                  recommendation={recommendation}
                  rank={index + 1}
                  onView={() => setSelectedPose(recommendation.yogaPose)}
                />
              ))}
            </div>
          </>
        )}

        <MatchingExplanation />
      </section>

      {selectedPose && (
        <PoseDetailsModal
          pose={selectedPose}
          onClose={() => setSelectedPose(null)}
        />
      )}
    </div>
  );
}

function RecommendationHeader() {
  return (
    <header className="relative overflow-hidden rounded-3xl bg-[#1a261f] px-6 py-10 text-[#eaeee3] sm:px-10 sm:py-12">
      <div className="absolute -right-20 -top-24 size-64 rounded-full border border-[#8aa07e]/25" />
      <div className="absolute -right-6 -top-14 size-64 rounded-full border border-[#c0812e]/25" />
      <div className="relative max-w-3xl">
        <p className="home-kicker text-xs uppercase tracking-[0.2em] text-[#a9b7a9]">
          Your personalized practice
        </p>
        <h1 className="home-display mt-3 text-3xl font-medium sm:text-5xl">
          Yoga recommendations shaped by your profile
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-[#b9c4b8]">
          Each active pose is ranked using your pain area, activity level, and
          BMI category, with a clear explanation of why it was selected.
        </p>
      </div>
    </header>
  );
}

function RecommendationCard({
  recommendation,
  rank,
  onView,
}: {
  recommendation: Recommendation;
  rank: number;
  onView: () => void;
}) {
  const { yogaPose, matchScore, reason } = recommendation;
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-[#fbfaf4] shadow-sm ring-1 ring-[#d8decb] transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative">
        <img
          src={yogaPose.imageUrl || fallbackImage}
          alt={yogaPose.name}
          className="h-52 w-full object-cover"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = fallbackImage;
          }}
        />
        <span className="absolute left-4 top-4 rounded-full bg-[#1a261f]/90 px-3 py-1 text-xs font-semibold text-white">
          Match #{rank}
        </span>
        <span className="absolute right-4 top-4 rounded-full bg-[#c0812e] px-3 py-1 text-sm font-bold text-[#1a261f]">
          {matchScore} pts
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-[#a66e24]">
          {formatLabel(yogaPose.difficulty)} /{' '}
          {yogaPose.durationSeconds
            ? `${yogaPose.durationSeconds} sec`
            : 'Flexible duration'}
        </p>
        <h2 className="home-display mt-2 text-2xl font-medium">
          {yogaPose.name}
        </h2>

        <div className="mt-3 flex flex-wrap gap-2">
          {yogaPose.suitablePainAreas.map((area) => (
            <span
              key={area}
              className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
            >
              {formatPainArea(area)}
            </span>
          ))}
        </div>

        <div className="mt-4 rounded-xl bg-[#eaeee3] p-4">
          <p className="home-kicker text-[10px] uppercase tracking-[0.16em] text-[#718267]">
            Why this matches
          </p>
          <p className="mt-2 text-sm leading-6 text-[#4e5d51]">{reason}</p>
        </div>

        <button
          type="button"
          onClick={onView}
          className="mt-5 w-full rounded-xl border border-[#8aa07e] px-4 py-2.5 font-semibold text-[#334139] transition hover:bg-[#eaeee3]"
        >
          View Pose Details
        </button>
      </div>
    </article>
  );
}

function GuidancePanel({
  step,
  title,
  message,
  children,
}: {
  step: string;
  title: string;
  message: string;
  children: ReactNode;
}) {
  return (
    <div className="grid overflow-hidden rounded-3xl bg-[#fbfaf4] shadow-sm ring-1 ring-[#d8decb] md:grid-cols-[0.7fr_1.3fr]">
      <div className="flex min-h-52 items-center justify-center bg-[#dfe6d6] p-8">
        <div className="home-breathe-core flex size-32 items-center justify-center rounded-full bg-[#233329] text-center text-[#eaeee3]">
          <span className="home-display text-2xl italic">breathe</span>
        </div>
      </div>
      <div className="flex flex-col justify-center p-7 sm:p-10">
        <p className="home-kicker text-xs uppercase tracking-[0.18em] text-[#a66e24]">
          {step}
        </p>
        <h2 className="home-display mt-3 text-3xl font-medium">{title}</h2>
        <p className="mt-3 max-w-xl leading-7 text-[#5b6b5e]">{message}</p>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

function MatchingExplanation() {
  const rules = [
    ['Pain area', 'Exact matches receive the strongest ranking.'],
    ['Activity level', 'Difficulty is adjusted to your current activity.'],
    ['General wellness', 'Poses marked NONE may support broader practice.'],
  ];
  return (
    <aside className="rounded-2xl border border-[#d8decb] bg-[#fbfaf4] p-6 sm:p-8">
      <p className="home-kicker text-xs uppercase tracking-[0.18em] text-[#718267]">
        How matching works
      </p>
      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        {rules.map(([title, copy], index) => (
          <div key={title} className="flex gap-3">
            <span className="home-kicker flex size-8 shrink-0 items-center justify-center rounded-full bg-[#eaeee3] text-xs text-[#718267]">
              0{index + 1}
            </span>
            <div>
              <h3 className="font-semibold text-[#334139]">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-[#5b6b5e]">{copy}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 border-t border-[#d8decb] pt-4 text-xs leading-5 text-[#718267]">
        These recommendations support wellness and are not medical diagnosis
        or treatment advice.
      </p>
    </aside>
  );
}

function RecommendationSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl bg-[#fbfaf4] ring-1 ring-[#d8decb]"
        >
          <div className="h-52 animate-pulse bg-[#d8decb]" />
          <div className="space-y-4 p-5">
            <div className="h-5 w-24 animate-pulse rounded bg-[#d8decb]" />
            <div className="h-8 w-3/4 animate-pulse rounded bg-[#d8decb]" />
            <div className="h-24 animate-pulse rounded-xl bg-[#e3e7db]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function formatLabel(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

function formatPainArea(value: string) {
  if (value === 'NONE') return 'General wellness';
  return formatLabel(value);
}
