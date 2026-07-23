import { useCallback, useEffect, useState, type FormEvent } from 'react';
import fallbackImage from '../../assets/hero.png';
import PoseDetailsModal from '../../components/recommendations/PoseDetailsModal';
import { getYogaPoses } from '../../services/yoga-poses.service';
import {
  DIFFICULTIES,
  PAIN_AREAS,
  type Difficulty,
  type PainArea,
  type YogaPose,
} from '../../types/yoga-pose';
import { getApiErrorMessage } from '../../utils/api-error';

const PAGE_SIZE = 9;

export default function YogaPoseLibraryPage() {
  const [poses, setPoses] = useState<YogaPose[]>([]);
  const [selectedPose, setSelectedPose] = useState<YogaPose | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty | ''>('');
  const [painArea, setPainArea] = useState<PainArea | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPoses = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getYogaPoses({
        page,
        limit: PAGE_SIZE,
        search: search || undefined,
        difficulty: difficulty || undefined,
        painArea: painArea || undefined,
        isActive: true,
      });
      setPoses(response.data.filter((pose) => pose.isActive));
      setTotal(response.meta.total);
      setTotalPages(response.meta.totalPages);
    } catch (requestError) {
      setError(
        getApiErrorMessage(requestError, 'Unable to load the yoga pose library.'),
      );
    } finally {
      setLoading(false);
    }
  }, [page, search, difficulty, painArea]);

  useEffect(() => {
    void loadPoses();
  }, [loadPoses]);

  const applySearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearch('');
    setDifficulty('');
    setPainArea('');
    setPage(1);
  };

  const hasFilters = Boolean(search || difficulty || painArea);

  return (
    <div className="-m-4 min-h-[calc(100vh-4rem)] bg-[#eaeee3] px-4 py-8 sm:-m-6 sm:px-6 sm:py-12">
      <section className="mx-auto max-w-7xl space-y-7">
        <header className="max-w-3xl">
          <p className="home-kicker text-xs font-semibold uppercase tracking-[0.2em] text-[#a66e24]">
            Explore the pose library
          </p>
          <h1 className="home-display mt-3 text-3xl font-medium text-[#1f2a24] sm:text-4xl">
            Yoga Poses
          </h1>
          <p className="mt-3 leading-7 text-[#5b6b5e]">
            Browse active poses, review their precautions, and find movements
            suited to specific pain areas.
          </p>
        </header>

        <div className="rounded-2xl bg-[#fbfaf4] p-4 shadow-sm ring-1 ring-[#d8decb] sm:p-5">
          <form
            onSubmit={applySearch}
            className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_auto]"
          >
            <label className="sr-only" htmlFor="pose-search">
              Search by pose name
            </label>
            <input
              id="pose-search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by pose name"
              className="rounded-xl border border-[#cbd3c1] bg-white px-4 py-3 text-[#1f2a24] outline-none focus:border-[#8aa07e] focus:ring-4 focus:ring-[#8aa07e]/15"
            />

            <label className="sr-only" htmlFor="difficulty-filter">
              Filter by difficulty
            </label>
            <select
              id="difficulty-filter"
              value={difficulty}
              onChange={(event) => {
                setDifficulty(event.target.value as Difficulty | '');
                setPage(1);
              }}
              className="rounded-xl border border-[#cbd3c1] bg-white px-4 py-3 text-[#1f2a24]"
            >
              <option value="">All difficulties</option>
              {DIFFICULTIES.map((item) => (
                <option key={item} value={item}>
                  {formatLabel(item)}
                </option>
              ))}
            </select>

            <label className="sr-only" htmlFor="pain-filter">
              Filter by pain area
            </label>
            <select
              id="pain-filter"
              value={painArea}
              onChange={(event) => {
                setPainArea(event.target.value as PainArea | '');
                setPage(1);
              }}
              className="rounded-xl border border-[#cbd3c1] bg-white px-4 py-3 text-[#1f2a24]"
            >
              <option value="">All pain areas</option>
              {PAIN_AREAS.map((item) => (
                <option key={item} value={item}>
                  {formatPainArea(item)}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="rounded-xl bg-[#233329] px-6 py-3 font-semibold text-white hover:bg-[#1a261f]"
            >
              Search
            </button>
          </form>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 text-sm font-semibold text-[#a66e24] hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-[#5b6b5e]">
            {loading ? 'Loading poses...' : `${total} active poses found`}
          </p>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <h2 className="home-display text-2xl font-medium text-red-900">
              Pose library unavailable
            </h2>
            <p className="mt-2 text-sm text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => void loadPoses()}
              className="mt-5 rounded-xl bg-red-700 px-5 py-2.5 font-semibold text-white hover:bg-red-800"
            >
              Try again
            </button>
          </div>
        ) : loading ? (
          <PoseGridSkeleton />
        ) : poses.length === 0 ? (
          <div className="rounded-2xl bg-[#fbfaf4] p-10 text-center ring-1 ring-[#d8decb]">
            <h2 className="home-display text-2xl font-medium text-[#1f2a24]">
              No poses found
            </h2>
            <p className="mt-2 text-[#5b6b5e]">
              Try changing your search or filters.
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-xl bg-[#233329] px-5 py-2.5 font-semibold text-white"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {poses.map((pose) => (
              <PoseCard
                key={pose.id}
                pose={pose}
                onView={() => setSelectedPose(pose)}
              />
            ))}
          </div>
        )}

        {!error && totalPages > 0 && (
          <nav
            aria-label="Yoga pose pagination"
            className="flex items-center justify-between rounded-2xl bg-[#fbfaf4] p-4 ring-1 ring-[#d8decb]"
          >
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((current) => current - 1)}
              className="rounded-xl border border-[#cbd3c1] px-4 py-2 text-sm font-semibold text-[#334139] disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm text-[#5b6b5e]">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((current) => current + 1)}
              className="rounded-xl border border-[#cbd3c1] px-4 py-2 text-sm font-semibold text-[#334139] disabled:opacity-40"
            >
              Next
            </button>
          </nav>
        )}
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

function PoseCard({ pose, onView }: { pose: YogaPose; onView: () => void }) {
  const shortDescription =
    pose.description.length > 130
      ? `${pose.description.slice(0, 127)}...`
      : pose.description;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-[#fbfaf4] shadow-sm ring-1 ring-[#d8decb]">
      <img
        src={pose.imageUrl || fallbackImage}
        alt={pose.name}
        className="h-44 w-full object-cover sm:h-52"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = fallbackImage;
        }}
      />
      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h2 className="home-display text-xl font-medium text-[#1f2a24] sm:text-2xl">
            {pose.name}
          </h2>
          <span className="rounded-full bg-[#eaeee3] px-2.5 py-1 text-[11px] font-bold text-[#5b6b5e]">
            {formatLabel(pose.difficulty)}
          </span>
        </div>

        <p className="mt-2 text-xs font-semibold text-[#a66e24]">
          {pose.durationSeconds
            ? `${pose.durationSeconds} seconds`
            : 'Duration not specified'}
        </p>
        <p className="mt-3 text-sm leading-6 text-[#5b6b5e]">
          {shortDescription}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {pose.suitablePainAreas.map((area) => (
            <span
              key={area}
              className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs text-emerald-700"
            >
              {formatPainArea(area)}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={onView}
          className="mt-auto pt-4 text-left text-sm font-semibold text-[#a66e24] hover:underline sm:mt-5"
        >
          View Details
        </button>
      </div>
    </article>
  );
}

function PoseGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="h-80 animate-pulse rounded-2xl bg-[#d8decb]"
        />
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
