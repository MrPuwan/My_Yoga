interface DynamicStringFieldsProps {
  label: string;
  itemLabel: string;
  values: string[];
  onChange: (values: string[]) => void;
}

export default function DynamicStringFields({
  label,
  itemLabel,
  values,
  onChange,
}: DynamicStringFieldsProps) {
  const update = (index: number, value: string) => {
    onChange(values.map((item, itemIndex) => (itemIndex === index ? value : item)));
  };

  const remove = (index: number) => {
    onChange(values.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold text-slate-700">{label}</legend>
      {values.map((value, index) => (
        <div className="flex gap-2" key={`${label}-${index}`}>
          <input
            value={value}
            onChange={(event) => update(index, event.target.value)}
            placeholder={`${itemLabel} ${index + 1}`}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          <button
            type="button"
            onClick={() => remove(index)}
            disabled={values.length === 1}
            className="rounded-md border border-slate-300 px-3 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...values, ''])}
        className="text-sm font-medium text-indigo-600 hover:underline"
      >
        + Add {itemLabel.toLowerCase()}
      </button>
    </fieldset>
  );
}
