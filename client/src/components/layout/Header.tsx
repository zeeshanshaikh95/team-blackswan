import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';
import { Wordmark } from '@/components/Wordmark';

const NAV_ITEMS = [
  { to: '/shop', label: 'The collection' },
  { to: '/category/velvet-evening', label: 'Velvet' },
  { to: '/category/double-chiffon', label: 'Chiffon' },
  { to: '/gallery', label: 'Lookbook' },
  { to: '/about', label: 'The atelier' },
  { to: '/contact', label: 'Appointments' },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count, openCart } = useCart();
  const { settings } = useSettings();
  const location = useLocation();

  useEffect(() => setMenuOpen(false), [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-bone/92 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? 'shadow-lift' : ''
      }`}
    >
      {settings.announcements.enabled && settings.announcements.text ? (
        <div className="border-b border-gold-500/20 bg-obsidian px-4 py-2 text-center text-[9px] uppercase tracking-micro text-gold-200/90">
          {settings.announcements.text}
        </div>
      ) : null}

      <div className="shell flex h-[78px] items-center justify-between gap-4 border-b border-ink/10 sm:h-[88px]">
        <Wordmark size="sm" withTagline={false} />

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative text-[10px] uppercase tracking-wide2 transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-px after:bg-gold-400 after:transition-all after:duration-300 ${
                  isActive
                    ? 'text-ink after:w-full'
                    : 'text-ink-soft after:w-0 hover:text-ink hover:after:w-full'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <a
            href={settings.instagramUrl || 'https://www.instagram.com/team_blackswan_/'}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hidden p-2 text-ink-soft transition-colors hover:text-gold-300 sm:block"
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.3">
              <rect x="3.5" y="3.5" width="17" height="17" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
            </svg>
          </a>

          <button
            type="button"
            onClick={openCart}
            className="relative p-2 text-ink transition-colors hover:text-gold-300"
            aria-label={`Open bag (${count} items)`}
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.3">
              <path d="M5 8h14l-1 12H6L5 8z" />
              <path d="M9 8a3 3 0 016 0" />
            </svg>
            {count > 0 ? (
              <span className="absolute -right-0.5 -top-1 flex h-4 min-w-[1rem] items-center justify-center bg-gold-500 px-1 text-[9px] font-semibold text-obsidian">
                {count}
              </span>
            ) : null}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="p-2 text-ink lg:hidden"
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M4 8h16M4 16h16" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          className="max-h-[calc(100vh-6rem)] overflow-y-auto border-b border-gold-500/20 bg-obsidian px-5 pb-8 pt-2 lg:hidden"
          aria-label="Mobile"
        >
          {NAV_ITEMS.map((item, index) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-baseline justify-between border-b border-ink/8 py-4 font-display text-2xl ${
                  isActive ? 'text-gold-300' : 'text-ink'
                }`
              }
            >
              {item.label}
              <span className="text-[9px] tracking-wide2 text-ink-faint">
                {String(index + 1).padStart(2, '0')}
              </span>
            </NavLink>
          ))}
          <Link to="/reviews" className="mt-5 inline-block text-[10px] uppercase tracking-wide2 text-ink-soft">
            Reviews
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
