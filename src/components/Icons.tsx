// Small inline icons so the landing page needs no icon library.
type P = { className?: string };
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export const SchoolIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M3 9l9-5 9 5-9 5-9-5z" />
    <path d="M7 11.5V16c0 1.5 2.2 3 5 3s5-1.5 5-3v-4.5" />
    <path d="M21 9v6" />
  </svg>
);

export const HomeIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M4 11l8-7 8 7" />
    <path d="M6 10v10h12V10" />
    <path d="M10 20v-5h4v5" />
  </svg>
);

export const HospitalIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <rect x="4" y="4" width="16" height="16" rx="3" />
    <path d="M12 8v8M8 12h8" />
  </svg>
);

export const BoltIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M13 3L5 13h6l-1 8 8-10h-6l1-8z" />
  </svg>
);

export const LockIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <rect x="5" y="10" width="14" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 018 0v3" />
  </svg>
);

export const SearchIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <circle cx="11" cy="11" r="6" />
    <path d="M20 20l-4.5-4.5" />
  </svg>
);

export const ReceiptIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z" />
    <path d="M9 8h6M9 12h6" />
  </svg>
);

export const CheckIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export const XIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const ArrowIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const ReturnIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M9 14l-5-5 5-5" />
    <path d="M4 9h11a5 5 0 010 10h-3" />
  </svg>
);
