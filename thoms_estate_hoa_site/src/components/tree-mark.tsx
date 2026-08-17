export function TreeMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M32 50V38"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M32 16c-7 6-12 12-12 19 0 4.2 3 7.5 7.2 8.6C28.6 40.4 30.4 36 32 32c1.6 4 3.4 8.4 4.8 11.6 4.2-1.1 7.2-4.4 7.2-8.6 0-7-5-13-12-19Z"
        fill="currentColor"
      />
      <path
        d="M22 48h20"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
