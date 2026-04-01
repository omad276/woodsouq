interface WoodSouqLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function WoodSouqLogo({ size = 'md', showText = true }: WoodSouqLogoProps) {
  const sizes = {
    sm: { icon: 24, text: 'text-lg', gap: 'gap-1.5' },
    md: { icon: 32, text: 'text-xl', gap: 'gap-2' },
    lg: { icon: 40, text: 'text-2xl', gap: 'gap-2.5' },
  };

  const { icon, text, gap } = sizes[size];

  return (
    <div className={`flex items-center ${gap}`}>
      {/* W-shaped wood planks logo */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Gold accent line at top */}
        <rect x="2" y="2" width="36" height="3" rx="1" fill="#C89B6D" />

        {/* 5 vertical planks forming W shape */}
        {/* Plank 1 - left tall */}
        <rect x="4" y="7" width="5" height="28" rx="1" fill="#5C3A1E" />

        {/* Plank 2 - left-center diagonal down */}
        <rect x="11" y="7" width="5" height="22" rx="1" fill="#8B5A2B" />

        {/* Plank 3 - center (middle of W, shorter) */}
        <rect x="18" y="7" width="4" height="16" rx="1" fill="#5C3A1E" />

        {/* Plank 4 - right-center diagonal down */}
        <rect x="24" y="7" width="5" height="22" rx="1" fill="#8B5A2B" />

        {/* Plank 5 - right tall */}
        <rect x="31" y="7" width="5" height="28" rx="1" fill="#5C3A1E" />
      </svg>

      {showText && (
        <span className={text}>
          <span className="font-bold" style={{ color: '#5C3A1E', fontFamily: 'Georgia, serif' }}>
            Wood
          </span>
          <span style={{ color: '#8B5A2B', fontFamily: 'Georgia, serif' }}>
            Souq
          </span>
        </span>
      )}
    </div>
  );
}
