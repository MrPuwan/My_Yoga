import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import YogaPoseForm from '../../../components/admin/YogaPoseForm';
import { createYogaPose } from '../../../services/yoga-poses.service';
import type { YogaPosePayload } from '../../../types/yoga-pose';
import { getApiErrorMessage } from '../../../utils/api-error';

export default function CreateYogaPosePage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const submit = async (values: YogaPosePayload) => {
    setSubmitting(true);
    setError('');
    try {
      const { isActive: _isActive, ...createValues } = values;
      await createYogaPose(createValues);
      navigate('/admin/yoga-poses', { replace: true });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to create this pose.'));
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
        <h1 className="mt-3 text-3xl font-bold text-slate-800">Add Yoga Pose</h1>
      </div>
      <YogaPoseForm submitting={submitting} error={error} onSubmit={submit} />
    </section>
  );
}
