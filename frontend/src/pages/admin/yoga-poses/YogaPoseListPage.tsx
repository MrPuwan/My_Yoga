import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  deactivateYogaPose,
  getYogaPoses,
} from '../../../services/yoga-poses.service';
import {
  DIFFICULTIES,
  PAIN_AREAS,
  type Difficulty,
  type PainArea,
  type YogaPose,
} from '../../../types/yoga-pose';
import { getApiErrorMessage } from '../../../utils/api-error';

const PAGE_SIZE = 10;

export default function YogaPoseListPage() {
  const [poses, setPoses] = useState<YogaPose[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty | ''>('');
  const [painArea, setPainArea] = useState<PainArea | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deactivatingId, setDeactivatingId] = useState<string | null>(null);

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
      });
      setPoses(response.data);
      setTotal(response.meta.total);
      setTotalPages(response.meta.totalPages);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to load yoga poses.'));
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

  const deactivate = async (pose: YogaPose) => {
    if (!window.confirm(`Deactivate "${pose.name}"?`)) return;

    setDeactivatingId(pose.id);
    setError('');
    try {
      await deactivateYogaPose(pose.id);
      await loadPoses();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to deactivate this pose.'));
    } finally {
      setDeactivatingId(null);
    }
  };

  return (
    <section className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Yoga Pose Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">{total} poses found</p>
        </div>
        <Link
          to="/admin/yoga-poses/new"
          className="rounded-xl bg-[#c0812e] px-5 py-2.5 text-center font-semibold text-[#1a261f] transition hover:bg-[#a66e24]"
        >
          Add New Pose
        </Link>
      </div>

      <div className="rounded-lg bg-white p-4 shadow-sm">
        <form onSubmit={applySearch} className="grid gap-3 md:grid-cols-4">
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by pose name"
            className="rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500"
          />
          <select
            value={difficulty}
            onChange={(event) => {
              setDifficulty(event.target.value as Difficulty | '');
              setPage(1);
            }}
            className="rounded-md border border-slate-300 bg-white px-3 py-2"
          >
            <option value="">All difficulties</option>
            {DIFFICULTIES.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <select
            value={painArea}
            onChange={(event) => {
              setPainArea(event.target.value as PainArea | '');
              setPage(1);
            }}
            className="rounded-md border border-slate-300 bg-white px-3 py-2"
          >
            <option value="">All pain areas</option>
            {PAIN_AREAS.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-md bg-slate-800 px-4 py-2 font-medium text-white hover:bg-slate-900"
          >
            Search
          </button>
        </form>
      </div>

      {error && (
        <div role="alert" className="rounded-md bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3 font-semibold">Pose name</th>
              <th className="px-4 py-3 font-semibold">Difficulty</th>
              <th className="px-4 py-3 font-semibold">Suitable pain areas</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-500">Loading poses...</td></tr>
            ) : poses.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-500">No yoga poses found.</td></tr>
            ) : (
              poses.map((pose) => (
                <tr key={pose.id} className="text-slate-700">
                  <td className="px-4 py-3 font-medium text-slate-900">{pose.name}</td>
                  <td className="px-4 py-3">{pose.difficulty}</td>
                  <td className="px-4 py-3">{pose.suitablePainAreas.join(', ') || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      pose.isActive
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {pose.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <Link
                      to={`/admin/yoga-poses/${pose.id}/edit`}
                      className="font-medium text-indigo-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => void deactivate(pose)}
                      disabled={!pose.isActive || deactivatingId === pose.id}
                      className="ml-4 font-medium text-red-600 hover:underline disabled:text-slate-400 disabled:no-underline"
                    >
                      {deactivatingId === pose.id ? 'Deactivating...' : 'Deactivate'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          disabled={page <= 1 || loading}
          onClick={() => setPage((current) => current - 1)}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm disabled:opacity-40"
        >
          Previous
        </button>
        <span className="text-sm text-slate-600">
          Page {page} of {Math.max(totalPages, 1)}
        </span>
        <button
          type="button"
          disabled={page >= totalPages || loading}
          onClick={() => setPage((current) => current + 1)}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </section>
  );
}
