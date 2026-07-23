import { useEffect, useState, type FormEvent } from 'react';
import {
  createHealthProfile,
  getMyHealthProfile,
  updateHealthProfile,
} from '../../services/health-profile.service';
import type {
  HealthProfile,
  HealthProfilePayload,
} from '../../types/health-profile';
import { PAIN_AREAS, type PainArea } from '../../types/yoga-pose';
import { getApiErrorMessage } from '../../utils/api-error';

interface FormValues {
  age: string;
  gender: string;
  height: string;
  weight: string;
  painArea: PainArea | '';
  activityLevel: string;
  medicalConditions: string;
}

const emptyForm: FormValues = {
  age: '',
  gender: '',
  height: '',
  weight: '',
  painArea: '',
  activityLevel: '',
  medicalConditions: '',
};

const inputClass =
  'mt-2 w-full rounded-xl border border-[#cbd3c1] bg-white px-4 py-3 text-[#1f2a24] outline-none transition placeholder:text-[#9aa597] focus:border-[#8aa07e] focus:ring-4 focus:ring-[#8aa07e]/15';

export default function HealthProfilePage() {
  const [profile, setProfile] = useState<HealthProfile | null>(null);
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const currentProfile = await getMyHealthProfile();
        setProfile(currentProfile);
        if (currentProfile) {
          setForm({
            age: String(currentProfile.age),
            gender: currentProfile.gender,
            height: String(currentProfile.height),
            weight: String(currentProfile.weight),
            painArea: currentProfile.painArea,
            activityLevel: currentProfile.activityLevel || '',
            medicalConditions: currentProfile.medicalConditions || '',
          });
        }
      } catch (requestError) {
        setError(
          getApiErrorMessage(requestError, 'Unable to load your health profile.'),
        );
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, []);

  const setField = <Key extends keyof FormValues>(
    key: Key,
    value: FormValues[Key],
  ) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const age = Number(form.age);
    const height = Number(form.height);
    const weight = Number(form.weight);

    if (!Number.isInteger(age) || age < 1 || age > 120) {
      setError('Age must be a whole number between 1 and 120.');
      return;
    }
    if (!Number.isFinite(height) || height <= 0) {
      setError('Height must be a positive number.');
      return;
    }
    if (!Number.isFinite(weight) || weight <= 0) {
      setError('Weight must be a positive number.');
      return;
    }
    if (!form.gender.trim()) {
      setError('Gender is required.');
      return;
    }
    if (!form.painArea || !PAIN_AREAS.includes(form.painArea)) {
      setError('Select a valid pain area.');
      return;
    }

    const payload: HealthProfilePayload = {
      age,
      height,
      weight,
      gender: form.gender.trim(),
      painArea: form.painArea,
      activityLevel: form.activityLevel.trim() || (profile ? '' : undefined),
      medicalConditions:
        form.medicalConditions.trim() || (profile ? '' : undefined),
    };

    setSubmitting(true);
    try {
      const savedProfile = profile
        ? await updateHealthProfile(payload)
        : await createHealthProfile(payload);
      setProfile(savedProfile);
      setSuccess(profile ? 'Health profile updated.' : 'Health profile created.');
    } catch (requestError) {
      setError(
        getApiErrorMessage(requestError, 'Unable to save your health profile.'),
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="-m-4 min-h-[calc(100vh-4rem)] bg-[#eaeee3] px-4 py-10 sm:-m-6 sm:px-6">
        <div className="mx-auto max-w-6xl animate-pulse space-y-6">
          <div className="h-8 w-52 rounded bg-[#d8decb]" />
          <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="h-64 rounded-2xl bg-[#d8decb]" />
            <div className="h-96 rounded-2xl bg-white/70" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="-m-4 min-h-[calc(100vh-4rem)] bg-[#eaeee3] px-4 py-8 text-[#1f2a24] sm:-m-6 sm:px-6 sm:py-12">
      <section className="mx-auto max-w-6xl">
        <header className="mb-8 max-w-2xl">
          <p className="home-kicker text-xs font-semibold uppercase tracking-[0.2em] text-[#a66e24]">
            Your wellness baseline
          </p>
          <h1 className="home-display mt-3 text-3xl font-medium sm:text-4xl">
            Health Profile
          </h1>
          <p className="mt-3 leading-7 text-[#5b6b5e]">
            {profile
              ? 'Keep these details current so your pose matches reflect where you are today.'
              : 'Tell us a little about yourself to unlock your rule-based pose recommendations.'}
          </p>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="space-y-5 lg:sticky lg:top-24">
            {profile ? (
              <div className="overflow-hidden rounded-2xl bg-[#1a261f] p-6 text-[#eaeee3] shadow-lg">
                <p className="home-kicker text-xs uppercase tracking-[0.18em] text-[#a9b7a9]">
                  Your calculated BMI
                </p>
                <div className="mt-5 flex items-end gap-3">
                  <span className="home-display text-6xl font-medium">
                    {profile.bmi}
                  </span>
                  <span className="mb-2 rounded-full bg-[#c0812e] px-3 py-1 text-sm font-semibold text-[#1a261f]">
                    {profile.bmiCategory}
                  </span>
                </div>
                <p className="mt-5 text-sm leading-6 text-[#b9c4b8]">
                  BMI is calculated by the backend from your latest height and
                  weight. It is used only as one simple recommendation rule.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl bg-[#1a261f] p-6 text-[#eaeee3] shadow-lg">
                <div className="flex size-12 items-center justify-center rounded-full bg-[#c0812e] text-xl font-bold text-[#1a261f]">
                  1
                </div>
                <h2 className="home-display mt-5 text-2xl font-medium">
                  Complete your profile
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#b9c4b8]">
                  Once saved, your BMI and BMI category will appear here
                  automatically.
                </p>
              </div>
            )}

            <div className="rounded-2xl border border-[#d8decb] bg-[#fbfaf4] p-5">
              <h2 className="font-semibold text-[#334139]">
                How your details are used
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-[#5b6b5e]">
                <InfoItem text="Pain area helps find matching poses." />
                <InfoItem text="Activity level controls suitable difficulty." />
                <InfoItem text="Height and weight calculate your BMI." />
              </ul>
              <p className="mt-5 border-t border-[#d8decb] pt-4 text-xs leading-5 text-[#718267]">
                This profile supports wellness recommendations and does not
                provide a medical diagnosis.
              </p>
            </div>
          </aside>

          <form
            onSubmit={submit}
            className="overflow-hidden rounded-2xl bg-[#fbfaf4] shadow-sm ring-1 ring-[#d8decb]"
          >
            <div className="border-b border-[#d8decb] px-5 py-5 sm:px-8">
              <h2 className="home-display text-2xl font-medium">
                {profile ? 'Update your details' : 'Add your details'}
              </h2>
              <p className="mt-1 text-sm text-[#718267]">
                Fields marked required must be completed before saving.
              </p>
            </div>

            <div className="space-y-7 px-5 py-6 sm:px-8 sm:py-8">
              {error && (
                <div
                  role="alert"
                  className="flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  <span className="font-bold" aria-hidden="true">!</span>
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div
                  role="status"
                  className="flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                >
                  <span className="font-bold" aria-hidden="true">OK</span>
                  <span>{success}</span>
                </div>
              )}

              <FormSection
                number="01"
                title="Basic information"
                description="Your age and gender help describe your profile."
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block text-sm font-semibold text-[#334139]">
                    Age <Required />
            <input
              type="number"
              min="1"
              max="120"
              step="1"
              value={form.age}
              onChange={(event) => setField('age', event.target.value)}
              className={inputClass}
            />
                  </label>

                  <label className="block text-sm font-semibold text-[#334139]">
                    Gender <Required />
            <select
              value={form.gender}
              onChange={(event) => setField('gender', event.target.value)}
              className={inputClass}
            >
              <option value="">Select gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
                  </label>
                </div>
              </FormSection>

              <FormSection
                number="02"
                title="Body measurements"
                description="These values are used to calculate BMI after saving."
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block text-sm font-semibold text-[#334139]">
                    Height <span className="font-normal text-[#718267]">(cm)</span> <Required />
            <input
              type="number"
              min="1"
              step="0.1"
              value={form.height}
              onChange={(event) => setField('height', event.target.value)}
              className={inputClass}
            />
                  </label>

                  <label className="block text-sm font-semibold text-[#334139]">
                    Weight <span className="font-normal text-[#718267]">(kg)</span> <Required />
            <input
              type="number"
              min="1"
              step="0.1"
              value={form.weight}
              onChange={(event) => setField('weight', event.target.value)}
              className={inputClass}
            />
                  </label>
                </div>
              </FormSection>

              <FormSection
                number="03"
                title="Movement and comfort"
                description="This information has the strongest effect on pose matching."
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block text-sm font-semibold text-[#334139]">
                    Pain area <Required />
            <select
              value={form.painArea}
              onChange={(event) =>
                setField('painArea', event.target.value as PainArea | '')
              }
              className={inputClass}
            >
              <option value="">Select pain area</option>
              {PAIN_AREAS.map((painArea) => (
                <option key={painArea} value={painArea}>
                  {formatPainArea(painArea)}
                </option>
              ))}
            </select>
                  </label>

                  <label className="block text-sm font-semibold text-[#334139]">
                    Activity level
            <select
              value={form.activityLevel}
              onChange={(event) => setField('activityLevel', event.target.value)}
              className={inputClass}
            >
              <option value="">Select activity level (optional)</option>
              <option value="Sedentary">Sedentary</option>
              <option value="Lightly active">Lightly active</option>
              <option value="Moderately active">Moderately active</option>
              <option value="Very active">Very active</option>
            </select>
                  </label>
                </div>
              </FormSection>

              <FormSection
                number="04"
                title="Additional context"
                description="Optional notes can capture relevant medical conditions."
              >
                <label className="block text-sm font-semibold text-[#334139]">
                  Medical conditions
          <textarea
            rows={4}
            value={form.medicalConditions}
            onChange={(event) => setField('medicalConditions', event.target.value)}
            placeholder="Optional medical conditions or relevant notes"
            className={inputClass}
          />
                </label>
              </FormSection>
            </div>

            <div className="flex flex-col gap-3 border-t border-[#d8decb] bg-white/60 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <p className="text-xs text-[#718267]">
                BMI is recalculated every time you save.
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#233329] px-6 py-3 font-semibold text-white transition hover:bg-[#1a261f] focus:outline-none focus:ring-4 focus:ring-[#8aa07e]/30 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {submitting && (
                  <span className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                )}
                {submitting
                  ? 'Saving...'
                  : profile
                    ? 'Update Health Profile'
                    : 'Create Health Profile'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

function FormSection({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset>
      <legend className="flex items-start gap-3">
        <span className="home-kicker flex size-8 shrink-0 items-center justify-center rounded-full bg-[#eaeee3] text-xs font-semibold text-[#718267]">
          {number}
        </span>
        <span>
          <span className="block font-semibold text-[#334139]">{title}</span>
          <span className="mt-0.5 block text-xs font-normal text-[#718267]">
            {description}
          </span>
        </span>
      </legend>
      <div className="mt-4">{children}</div>
    </fieldset>
  );
}

function Required() {
  return <span className="text-[#a66e24]" aria-label="required">*</span>;
}

function InfoItem({ text }: { text: string }) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#eaeee3] text-[10px] font-bold text-[#718267]">
        OK
      </span>
      {text}
    </li>
  );
}

function formatPainArea(painArea: PainArea) {
  if (painArea === 'NONE') return 'No specific pain';
  return painArea.charAt(0) + painArea.slice(1).toLowerCase();
}
