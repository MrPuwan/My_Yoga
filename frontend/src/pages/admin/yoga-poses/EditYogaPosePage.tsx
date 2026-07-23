import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import YogaPoseForm from '../../../components/admin/YogaPoseForm';
import {
  getYogaPose,
  updateYogaPose,
} from '../../../services/yoga-poses.service';
import type { YogaPosePayload } from '../../../types/yoga-pose';
import { getApiErrorMessage } from '../../../utils/api-error';

export default function EditYogaPosePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<YogaPosePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setError('Invalid yoga pose ID.');
        setLoading(false);
        return;
      }
      try {
        const pose = await getYogaPose(id);
        setInitialValues({
          name: pose.name,
          description: pose.description,
          instructions: pose.instructions,
          benefits: pose.benefits,
          precautions: pose.precautions,
          difficulty: pose.difficulty,
          imageUrl: pose.imageUrl || '',
          durationSeconds: pose.durationSeconds ?? undefined,
          targetAreas: pose.targetAreas,
          suitablePainAreas: pose.suitablePainAreas,
          isActive: pose.isActive,
        });
      } catch (requestError) {
        setError(getApiErrorMessage(requestError, 'Unable to load this pose.'));
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id]);

  const submit = async (values: YogaPosePayload) => {
    if (!id) return;
    setSubmitting(true);
    setError('');
    try {
      await updateYogaPose(id, values);
      navigate('/admin/yoga-poses', { replace: true });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to update this pose.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-5xl rounded-lg bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6">
        <Link to="/admin/yoga-poses" className="text-sm text-indigo-600 hover:underline">
          &larr; Back to Yoga Poses
        </Link>
        <h1 className="mt-3 text-3xl font-bold text-slate-800">Edit Yoga Pose</h1>
      </div>
      {loading ? (
        <p className="py-10 text-center text-slate-500">Loading pose...</p>
      ) : initialValues ? (
        <YogaPoseForm
          initialValues={initialValues}
          isEditing
          submitting={submitting}
          error={error}
          onSubmit={submit}
        />
      ) : (
        <div role="alert" className="rounded-md bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}
    </section>
  );
}
