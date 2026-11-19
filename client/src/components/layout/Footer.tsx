import { Link } from 'react-router-dom';
import { useSettings } from '@/context/SettingsContext';
import { Wordmark } from '@/components/Wordmark';
import { normaliseNumber } from '@/lib/whatsapp';

export function Footer() {
  const { settings } = useSettings();
  const whatsapp = normaliseNumber(settings.whatsappNumber);
  const instagram = settings.instagramUrl || 'https://www.instagram.com/team_blackswan_/';

  return (
    <footer className="mt-24 border-t border-gold-500/25 bg-obsidian">
      <div className="shell grid gap-12 py-14 md:grid-cols-[1.4fr_1fr_1fr_1.2fr] md:py-16">
        <div>
          <Wordmark size="md" asLink={false} className="items-start" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-ink-soft">
            {settings.about.intro ||
              'An abaya atelier from Mumbai — double chiffon, premium nida and velvet, made in small runs and finished by hand.'}
          </p>
          <p className="mt-5 text-[9px] uppercase tracking-micro text-gold-500/80">
            Studio visits by appointment
          </p>
        </div>

        <div>
          <p className="eyebrow">Collection</p>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
            <li><Link to="/shop" className="hover:text-gold-300">All abayas</Link></li>
            <li><Link to="/shop?sort=newest" className="hover:text-gold-300">Pre-orders</Link></li>
            <li><Link to="/category/velvet-evening" className="hover:text-gold-300">Velvet & evening</Link></li>
            <li><Link to="/category/double-chiffon" className="hover:text-gold-300">Double chiffon</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">Atelier</p>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
            <li><Link to="/about" className="hover:text-gold-300">Our story</Link></li>
            <li><Link to="/gallery" className="hover:text-gold-300">Lookbook</Link></li>
            <li><Link to="/reviews" className="hover:text-gold-300">Reviews</Link></li>
            <li><Link to="/contact" className="hover:text-gold-300">Appointments & delivery</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">Reach us</p>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
            {whatsapp ? (
              <li>
                <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-gold-300">
                  WhatsApp
                </a>
              </li>
            ) : null}
            <li>
              <a href={instagram} target="_blank" rel="noopener noreferrer" className="hover:text-gold-300">
                Instagram · @{settings.instagramHandle.replace(/^@/, '')}
              </a>
            </li>
            {settings.email ? (
              <li><a href={`mailto:${settings.email}`} className="hover:text-gold-300">{settings.email}</a></li>
            ) : null}
            <li>{settings.city}{settings.city ? ', India' : ''}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink/10">
        <div className="shell flex flex-col items-start justify-between gap-3 py-5 text-[9px] uppercase tracking-wide2 text-ink-faint sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} {settings.businessName}. All rights reserved.</span>
          <div className="flex items-center gap-5">
            <Link to="/contact" className="hover:text-gold-300">Policies</Link>
            <Link to="/admin" className="hover:text-gold-300">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
