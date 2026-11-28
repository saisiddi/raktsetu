// A labelled input with its error message. `id` ties the label, the input and
// the error together. Any other prop (type, value, onChange, onBlur, min) goes
// to the input.
export default function TextField({ id, label, error, ...inputProps }) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type="text"
        {...inputProps}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-2 focus:outline-offset-2 focus:outline-brand"
      />
      {error && (
        <p id={errorId} className="mt-1 text-sm text-brand-dark">
          {error}
        </p>
      )}
    </div>
  );
}
