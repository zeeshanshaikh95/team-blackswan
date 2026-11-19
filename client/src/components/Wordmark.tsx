import { Link } from 'react-router-dom';
import { assetUrl } from '@/lib/brand';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  withTagline?: boolean;
  onDark?: boolean;
  asLink?: boolean;
  className?: string;
}

const MARK: Record<NonNullable<Props['size']>, string> = {
  sm: 'h-9 w-9',
  md: 'h-11 w-11',
  lg: 'h-16 w-16',
};

const TYPE: Record<NonNullable<Props['size']>, string> = {
  sm: 'text-[13px] tracking-[0.34em]',
  md: 'text-base tracking-[0.32em]',
  lg: 'text-2xl tracking-[0.28em] sm:text-3xl',
};

/**
 * The house lockup: the brand's own Instagram emblem (never redrawn, recoloured
 * or stretched) beside the name, set in wide display caps with a gold rule.
 */
export function Wordmark({
  size = 'md',
  withTagline = true,
  onDark = true,
  asLink = true,
  className = '',
}: Props) {
  const content = (
    <span className={`flex items-center gap-3 ${className}`}>
      <img
        src={assetUrl('/brand/logo.jpg')}
        alt="Team BlackSwan"
        className={`${MARK[size]} shrink-0 object-cover`}
        loading="eager"
      />
      <span className="flex flex-col leading-none">
        <span className={`font-display uppercase text-ink ${TYPE[size]}`}>Team BlackSwan</span>
        {withTagline ? (
          <>
            <span className="mt-2 h-px w-full bg-gold-500/40" />
            <span
              className={`mt-2 text-[8px] uppercase tracking-micro ${
                onDark ? 'text-ink-faint' : 'text-ink-faint'
              }`}
            >
              Abaya Atelier · Mumbai
            </span>
          </>
        ) : null}
      </span>
    </span>
  );

  if (!asLink) return content;

  return (
    <Link to="/" aria-label="Team BlackSwan — home" className="shrink-0">
      {content}
    </Link>
  );
}
