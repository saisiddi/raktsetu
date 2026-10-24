import Link from "next/link";

const actionClass =
  "mt-4 inline-block rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark focus:outline-2 focus:outline-offset-2 focus:outline-brand-dark";

function DropIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="h-8 w-8"
    >
      <path d="M12 2.5c-3.2 4.1-6 7.4-6 11a6 6 0 0 0 12 0c0-3.6-2.8-6.9-6-11z" />
    </svg>
  );
}

/**
 * Centered card for "nothing to show here" cases.
 * Pass `icon` to swap the default blood drop. For the action, use either
 * `actionHref` (renders a link) or `onAction` (renders a button), along with
 * `actionLabel`. Leave all three out for no action.
 */
export default function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  actionHref,
  onAction,
}) {
  return (
    <div
      role="status"
      className="rounded-lg border border-gray-200 bg-white px-6 py-10 text-center shadow-sm"
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-light text-brand">
        {icon ?? <DropIcon />}
      </div>
      <h2 className="mt-4 text-lg font-semibold text-gray-900">{title}</h2>
      {message && (
        <p className="mx-auto mt-2 max-w-md text-sm text-gray-700">{message}</p>
      )}
      {actionLabel && actionHref && (
        <Link href={actionHref} className={actionClass}>
          {actionLabel}
        </Link>
      )}
      {actionLabel && !actionHref && onAction && (
        <button type="button" onClick={onAction} className={actionClass}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
