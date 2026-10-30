export default function Skeleton({ className = "", ...props }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded bg-gray-200 motion-reduce:animate-none ${className}`.trim()}
      {...props}
    />
  );
}
