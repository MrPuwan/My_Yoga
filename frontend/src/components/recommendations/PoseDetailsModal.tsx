import { useEffect } from 'react';
import type { YogaPose } from '../../types/yoga-pose';
import { formatPainArea } from '../../utils/format-pain-area';

interface PoseDetailsModalProps {
  pose: YogaPose;
  onClose: () => void;
}

export default function PoseDetailsModal({
  pose,
  onClose,
}: PoseDetailsModalProps) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#101a14]/70 p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pose-details-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-[#fbfaf4] shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#d8decb] bg-[#fbfaf4] px-5 py-4 sm:px-6">
          <div>
            <h2
              id="pose-details-title"
              className="home-display text-2xl font-medium text-[#1f2a24]"
            >
              {pose.name}
            </h2>
            <p className="text-sm text-[#718267]">
              {formatLabel(pose.difficulty)} /{' '}
              {pose.durationSeconds
                ? `${pose.durationSeconds} seconds`
                : 'Duration not specified'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close pose details"
            className="rounded-md px-3 py-2 text-lg font-semibold text-[#718267] hover:bg-[#eaeee3]"
          >
            X
          </button>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          <section>
            <h3 className="font-semibold text-[#334139]">Description</h3>
            <p className="mt-2 leading-7 text-[#5b6b5e]">{pose.description}</p>
          </section>

          <DetailsList title="Instructions" items={pose.instructions} ordered />
          <DetailsList title="Benefits" items={pose.benefits} />
          <DetailsList title="Precautions" items={pose.precautions} />

          <TagSection title="Target areas" items={pose.targetAreas} />
          <TagSection
            title="Suitable pain areas"
            items={pose.suitablePainAreas.map(formatPainArea)}
            green
          />
        </div>
      </div>
    </div>
  );
}

function DetailsList({
  title,
  items,
  ordered = false,
}: {
  title: string;
  items: string[];
  ordered?: boolean;
}) {
  const List = ordered ? 'ol' : 'ul';
  return (
    <section>
      <h3 className="font-semibold text-[#334139]">{title}</h3>
      <List
        className={`mt-2 space-y-2 pl-5 leading-7 text-[#5b6b5e] ${
          ordered ? 'list-decimal' : 'list-disc'
        }`}
      >
        {items.map((item, index) => (
          <li key={`${title}-${index}`}>{item}</li>
        ))}
      </List>
    </section>
  );
}

function TagSection({
  title,
  items,
  green = false,
}: {
  title: string;
  items: string[];
  green?: boolean;
}) {
  return (
    <section>
      <h3 className="font-semibold text-[#334139]">{title}</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className={`rounded-full px-3 py-1 text-sm ${
              green
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-[#eaeee3] text-[#5b6b5e]'
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}

function formatLabel(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}
