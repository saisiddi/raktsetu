// A labelled select with its error message, wired the same way as TextField.
// The first entry is an empty "—" choice, followed by `options`. Any other prop
// (value, onChange, onBlur) goes to the select.
export default function SelectField({
  id,
  label,
  error,
  options,
  ...selectProps
}) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={id}
        {...selectProps}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-2 focus:outline-offset-2 focus:outline-brand"
      >
        <option value="">—</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} className="mt-1 text-sm text-brand-dark">
          {error}
        </p>
      )}
    </div>
  );
}
