export function ServiceIcon({ iconKey }) {
  const common = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5 };

  switch (iconKey) {
    case 'masonry':
      return (
        <svg {...common}>
          <rect x="2" y="4" width="8" height="5" />
          <rect x="10" y="4" width="8" height="5" opacity=".5" />
          <rect x="18" y="4" width="4" height="5" />
          <rect x="6" y="9" width="8" height="5" />
          <rect x="14" y="9" width="8" height="5" opacity=".5" />
          <rect x="2" y="9" width="4" height="5" />
          <rect x="2" y="14" width="8" height="5" />
          <rect x="10" y="14" width="8" height="5" opacity=".5" />
        </svg>
      );
    case 'bolt':
      return (
        <svg {...common} strokeLinejoin="round">
          <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
        </svg>
      );
    case 'plumbing':
      return (
        <svg {...common} strokeLinecap="round">
          <path d="M6 3v6a4 4 0 0 0 4 4v8" />
          <path d="M18 3v6a4 4 0 0 0-4 4" />
          <circle cx="10" cy="19" r="2" />
        </svg>
      );
    case 'tile':
      return (
        <svg {...common}>
          <rect x="2" y="2" width="9" height="9" />
          <rect x="13" y="2" width="9" height="9" />
          <rect x="2" y="13" width="9" height="9" />
          <rect x="13" y="13" width="9" height="9" />
        </svg>
      );
    case 'build':
      return (
        <svg {...common} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21 12 3l9 18" />
          <path d="M7 21v-6h10v6" />
        </svg>
      );
    case 'maintenance':
      return (
        <svg {...common} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3.2" />
          <path d="M12 3v2.4M12 18.6V21M21 12h-2.4M5.4 12H3M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7M18.4 18.4l-1.7-1.7M7.3 7.3 5.6 5.6" />
        </svg>
      );
    case 'plans':
      return (
        <svg {...common} strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 3v18l8-4 8 4V3" />
          <path d="M8 8h8M8 12h5" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}

export const ICON_OPTIONS = [
  { key: 'masonry', label: 'Albañilería' },
  { key: 'bolt', label: 'Electricidad' },
  { key: 'plumbing', label: 'Plomería' },
  { key: 'tile', label: 'Azulejos' },
  { key: 'build', label: 'Construcción' },
  { key: 'maintenance', label: 'Mantenimiento' },
  { key: 'plans', label: 'Planos' },
];
