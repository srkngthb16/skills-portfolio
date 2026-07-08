interface IconProps {
  className?: string;
}

export function GitHubIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.42 0 12.1c0 5.35 3.44 9.88 8.21 11.48.6.11.82-.27.82-.59 0-.29-.01-1.06-.02-2.08-3.34.74-4.04-1.63-4.04-1.63-.55-1.4-1.33-1.78-1.33-1.78-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.25 1.84 1.25 1.07 1.86 2.8 1.32 3.48 1.01.11-.79.42-1.32.76-1.63-2.67-.31-5.47-1.36-5.47-6.03 0-1.33.47-2.42 1.24-3.28-.12-.31-.54-1.57.12-3.28 0 0 1.01-.33 3.3 1.25a11.3 11.3 0 0 1 6.01 0c2.29-1.58 3.3-1.25 3.3-1.25.66 1.71.24 2.97.12 3.28.77.86 1.24 1.95 1.24 3.28 0 4.68-2.8 5.72-5.48 6.02.43.38.81 1.13.81 2.28 0 1.65-.02 2.98-.02 3.38 0 .32.22.71.83.59A12.11 12.11 0 0 0 24 12.1C24 5.42 18.63 0 12 0Z" />
    </svg>
  );
}

export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.75C24 .78 23.2 0 22.22 0Z" />
    </svg>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2.5" />
      <path d="m3 6.5 8.3 6a1.2 1.2 0 0 0 1.4 0L21 6.5" />
    </svg>
  );
}
