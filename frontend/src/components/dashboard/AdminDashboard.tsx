import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getYogaPoses } from '../../services/yoga-poses.service';
import { getApiErrorMessage } from '../../utils/api-error';

interface PoseCounts {
  total: number;
  active: number;
  inactive: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [counts, setCounts] = useState<PoseCounts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const [all, active, inactive] = await Promise.all([
          getYogaPoses({ page: 1, limit: 1 }),
          getYogaPoses({ page: 1, limit: 1, isActive: true }),
          getYogaPoses({ page: 1, limit: 1, isActive: false }),
        ]);
        setCounts({
          total: all.meta.total,
          active: active.meta.total,
          inactive: inactive.meta.total,
        });
      } catch (requestError) {
        setError(
          getApiErrorMessage(
            requestError,
            'Unable to load yoga-pose summary.',
          ),
        );
      } finally {
        setLoading(false);
      }
    };

    void loadCounts();
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <header className="rounded-3xl bg-[#1a261f] px-6 py-9 text-[#eaeee3] sm:px-10">
        <p className="home-kicker text-xs uppercase tracking-[0.2em] text-[#a9b7a9]">
          Administration
        </p>
        <h1 className="home-display mt-3 text-3xl font-medium sm:text-4xl">
          Welcome, {user?.fullName}
        </h1>
        <p className="mt-3 text-[#b9c4b8]">
          Manage the yoga-pose library and its active availability.
        </p>
      </header>

      {error && (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
          {error}
        </div>
      )}

      <section>
        <h2 className="home-display text-2xl font-medium text-[#1f2a24]">
          Yoga pose summary
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <AdminMetric
            label="Total yoga poses"
            value={counts?.total}
            loading={loading}
          />
          <AdminMetric
            label="Active yoga poses"
            value={counts?.active}
            loading={loading}
            tone="active"
          />
          <AdminMetric
            label="Inactive yoga poses"
            value={counts?.inactive}
            loading={loading}
            tone="inactive"
          />
        </div>
      </section>

      <section>
        <h2 className="home-display text-2xl font-medium text-[#1f2a24]">
          Quick actions
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <AdminAction
            to="/admin/yoga-poses/new"
            title="Add Yoga Pose"
            copy="Create a new pose with instructions, benefits, precautions, and an image."
            primary
          />
          <AdminAction
            to="/admin/yoga-poses"
            title="Manage Yoga Poses"
            copy="Search, filter, edit, activate, or deactivate poses in the library."
          />
        </div>
      </section>

      <div className="rounded-2xl border border-[#d8decb] bg-[#fbfaf4] p-6">
        <h2 className="font-semibold text-[#334139]">Library ordering</h2>
        <p className="mt-2 text-sm leading-6 text-[#5b6b5e]">
          The current pose API returns its list alphabetically. Recently added
          poses are not shown here because the API does not currently expose a
          created-date sort option.
        </p>
      </div>
    </div>
  );
}

function AdminMetric({
  label,
  value,
  loading,
  tone = 'default',
}: {
  label: string;
  value?: number;
  loading: boolean;
  tone?: 'default' | 'active' | 'inactive';
}) {
  const colors = {
    default: 'bg-[#fbfaf4] text-[#1f2a24] border-[#d8decb]',
    active: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    inactive: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <div className={`rounded-2xl border p-6 ${colors[tone]}`}>
      <p className="text-sm font-semibold opacity-70">{label}</p>
      {loading ? (
        <div className="mt-4 h-10 w-16 animate-pulse rounded bg-current opacity-10" />
      ) : (
        <p className="home-display mt-3 text-5xl font-medium">{value ?? 0}</p>
      )}
    </div>
  );
}

function AdminAction({
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
      className={`rounded-2xl p-6 transition hover:-translate-y-0.5 hover:shadow-md ${
        primary
          ? 'bg-[#c0812e] text-[#1a261f]'
          : 'border border-[#d8decb] bg-[#fbfaf4] text-[#1f2a24]'
      }`}
    >
      <h3 className="home-display text-2xl font-medium">{title}</h3>
      <p className={`mt-2 text-sm leading-6 ${
        primary ? 'text-[#3d321f]' : 'text-[#5b6b5e]'
      }`}>
        {copy}
      </p>
      <span className="mt-5 inline-block text-sm font-bold">Open -&gt;</span>
    </Link>
  );
}
