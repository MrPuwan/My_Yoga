import { useState, type FormEvent } from 'react';
import {
  DIFFICULTIES,
  type PainArea,
  type YogaPosePayload,
} from '../../types/yoga-pose';
import DynamicStringFields from './DynamicStringFields';
import YogaPoseImageField from './YogaPoseImageField';
import { usePainAreas } from '../../hooks/usePainAreas';

interface YogaPoseFormProps {
  initialValues?: YogaPosePayload;
  isEditing?: boolean;
  error?: string;
  submitting: boolean;
  onSubmit: (values: YogaPosePayload) => Promise<void>;
}

const emptyValues: YogaPosePayload = {
  name: '',
  description: '',
  instructions: [''],
  benefits: [''],
  precautions: [''],
  difficulty: 'BEGINNER',
  imageUrl: '',
  durationSeconds: undefined,
  targetAreas: [''],
  suitablePainAreas: [],
  isActive: true,
};

const inputClass =
  'mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100';

export default function YogaPoseForm({
  initialValues = emptyValues,
  isEditing = false,
  error,
  submitting,
  onSubmit,
}: YogaPoseFormProps) {
  const {
    names: painAreas,
    loading: painAreasLoading,
    error: painAreasError,
  } = usePainAreas();
  const [values, setValues] = useState<YogaPosePayload>(initialValues);
  const [validationError, setValidationError] = useState('');
  const [imageUploading, setImageUploading] = useState(false);

  const setField = <Key extends keyof YogaPosePayload>(
    key: Key,
    value: YogaPosePayload[Key],
  ) => setValues((current) => ({ ...current, [key]: value }));

  const togglePainArea = (painArea: PainArea) => {
    setField(
      'suitablePainAreas',
      values.suitablePainAreas.includes(painArea)
        ? values.suitablePainAreas.filter((item) => item !== painArea)
        : [...values.suitablePainAreas, painArea],
    );
  };

  const cleanList = (items: string[]) =>
    items.map((item) => item.trim()).filter(Boolean);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError('');

    if (imageUploading) {
      setValidationError('Wait for the image upload to finish before saving.');
      return;
    }

    const payload: YogaPosePayload = {
      ...values,
      name: values.name.trim(),
      description: values.description.trim(),
      imageUrl: values.imageUrl?.trim() || undefined,
      instructions: cleanList(values.instructions),
      benefits: cleanList(values.benefits),
      precautions: cleanList(values.precautions),
      targetAreas: cleanList(values.targetAreas),
    };

    if (!payload.name || !payload.description) {
      setValidationError('Name and description are required.');
      return;
    }
    if (
      !payload.instructions.length ||
      !payload.benefits.length ||
      !payload.precautions.length ||
      !payload.targetAreas.length
    ) {
      setValidationError(
        'Add at least one instruction, benefit, precaution, and target area.',
      );
      return;
    }
    if (!payload.suitablePainAreas.length) {
      setValidationError('Select at least one suitable pain area.');
      return;
    }
    if (
      payload.durationSeconds !== undefined &&
      (!Number.isInteger(payload.durationSeconds) || payload.durationSeconds <= 0)
    ) {
      setValidationError('Duration must be a positive whole number.');
      return;
    }
    if (payload.imageUrl) {
      try {
        new URL(payload.imageUrl);
      } catch {
        setValidationError('Image URL must be a valid URL.');
        return;
      }
    }

    await onSubmit(payload);
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      {(validationError || error || painAreasError) && (
        <div role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {validationError || error || painAreasError}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Name
          <input
            value={values.name}
            onChange={(event) => setField('name', event.target.value)}
            className={inputClass}
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Difficulty
          <select
            value={values.difficulty}
            onChange={(event) =>
              setField('difficulty', event.target.value as YogaPosePayload['difficulty'])
            }
            className={inputClass}
          >
            {DIFFICULTIES.map((difficulty) => (
              <option value={difficulty} key={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Description
        <textarea
          rows={4}
          value={values.description}
          onChange={(event) => setField('description', event.target.value)}
          className={inputClass}
        />
      </label>

      <div className="grid gap-6 lg:grid-cols-2">
        <DynamicStringFields
          label="Instructions"
          itemLabel="Step"
          values={values.instructions}
          onChange={(items) => setField('instructions', items)}
        />
        <DynamicStringFields
          label="Benefits"
          itemLabel="Benefit"
          values={values.benefits}
          onChange={(items) => setField('benefits', items)}
        />
        <DynamicStringFields
          label="Precautions"
          itemLabel="Precaution"
          values={values.precautions}
          onChange={(items) => setField('precautions', items)}
        />
        <DynamicStringFields
          label="Target areas"
          itemLabel="Target area"
          values={values.targetAreas}
          onChange={(items) => setField('targetAreas', items)}
        />
      </div>

      <YogaPoseImageField
        imageUrl={values.imageUrl || ''}
        onImageUrlChange={(url) => setField('imageUrl', url)}
        onUploadingChange={setImageUploading}
      />

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Duration in seconds
          <input
            type="number"
            min="1"
            step="1"
            value={values.durationSeconds ?? ''}
            onChange={(event) =>
              setField(
                'durationSeconds',
                event.target.value ? Number(event.target.value) : undefined,
              )
            }
            className={inputClass}
          />
        </label>
      </div>

      <fieldset>
        <legend className="text-sm font-semibold text-slate-700">
          Suitable pain areas
        </legend>
        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {painAreas.map((painArea) => (
            <label
              key={painArea}
              className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700"
            >
              <input
                type="checkbox"
                checked={values.suitablePainAreas.includes(painArea)}
                onChange={() => togglePainArea(painArea)}
                className="size-4 accent-indigo-600"
              />
              {painArea}
            </label>
          ))}
          {painAreasLoading && (
            <p className="col-span-full text-sm text-slate-500">
              Loading pain areas...
            </p>
          )}
        </div>
      </fieldset>

      {isEditing && (
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={values.isActive ?? true}
            onChange={(event) => setField('isActive', event.target.checked)}
            className="size-4 accent-indigo-600"
          />
          Active
        </label>
      )}

      <button
        type="submit"
        disabled={submitting || imageUploading || painAreasLoading || Boolean(painAreasError)}
        className="rounded-md bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {imageUploading
          ? 'Waiting for image upload...'
          : submitting
            ? 'Saving...'
            : isEditing
              ? 'Update Pose'
              : 'Create Pose'}
      </button>
    </form>
  );
}
