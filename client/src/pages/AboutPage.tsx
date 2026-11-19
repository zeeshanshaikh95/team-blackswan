import { Link } from 'react-router-dom';
import { useSettings } from '@/context/SettingsContext';
import { Seo } from '@/components/seo/Seo';
import { assetUrl, FOUNDER_IMAGE } from '@/lib/brand';

export function AboutPage() {
  const { settings } = useSettings();
  const story =
    settings.about.story ||
    'Team BlackSwan started the way most small labels do — with a rail of abayas, a WhatsApp number and a handful of women who trusted us with their occasions.\n\nWe buy in person and in small runs. Double chiffon because it moves without clinging, premium nida because it holds its shape through a long day, velvet because some evenings deserve weight. Every piece is checked at the seam and finished by hand before it goes out.\n\nWe take orders over DM and meet customers by appointment in Mumbai, and at the exhibitions we announce on Instagram. If you are unsure between two sizes, send us your height — we would rather measure twice than have you send something back.';
  const paragraphs = story.split('\n').filter((paragraph) => paragraph.trim());

  return (
    <>
      <Seo
        title="The atelier — Team BlackSwan"
        description="Team BlackSwan is an abaya atelier in Mumbai — double chiffon, premium nida and velvet, cut to order in sizes 54–60."
        canonicalPath="/about"
      />

      <section className="relative overflow-hidden border-b border-gold-500/20">
        <div className="pointer-events-none absolute inset-0 grain opacity-50" />
        <div className="shell relative py-16 sm:py-24">
          <p className="eyebrow">The atelier</p>
          <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[0.98] text-balance sm:text-7xl">
            Black, gold, and cut to order.
          </h1>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-[9px] uppercase tracking-micro text-ink-faint">
            <span>{settings.city || 'Mumbai'}, India</span>
            <span>Small runs</span>
            <span>Sizes 54 — 60</span>
            <span>By appointment</span>
          </div>
        </div>
      </section>

      <section className="shell grid gap-10 py-14 lg:grid-cols-12 lg:gap-16 sm:py-20">
        <div className="lg:col-span-5">
          <div className="frame-gold aspect-[4/5] overflow-hidden bg-sand">
            <img
              src={settings.about.founderImageUrl || assetUrl(FOUNDER_IMAGE)}
              alt="Gold thread work in the Team BlackSwan atelier"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="mt-4 flex items-baseline justify-between border-t border-ink/10 pt-3">
            <p className="text-[9px] uppercase tracking-wide2 text-ink-faint">Zari, in progress</p>
            <p className="font-display text-lg text-gold-400">01</p>
          </div>
        </div>

        <div className="prose-editorial lg:col-span-6 lg:col-start-7">
          <p className="eyebrow">Our story</p>
          <h2 className="mb-6 mt-4 font-display text-4xl leading-tight text-ink">
            {settings.about.intro || 'A small team, a long rail of black.'}
          </h2>
          {paragraphs.slice(0, 1).map((paragraph) => (
            <p key="first" className="text-base">{paragraph}</p>
          ))}
          {paragraphs.slice(1).map((paragraph, index) => (
            <p key={`rest-${index}`}>{paragraph}</p>
          ))}

          <div className="mt-9 border-t border-gold-500/25 pt-6">
            <p className="text-[9px] uppercase tracking-micro text-gold-500/80">Abaya Atelier · Mumbai</p>
            <Link to="/shop" className="btn-solid mt-5">
              Enter the collection
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-ivory py-14 sm:py-20">
        <div className="shell">
          <p className="eyebrow">What we promise</p>
          <div className="mt-8 grid gap-px bg-ink/10 sm:grid-cols-3">
            {[
              ['Fabric first', 'Weight, drape and finish decide what stays on the rail. Nothing is ordered from a photograph alone.'],
              ['Measured twice', 'Every order is confirmed with your height and usual size before we cut. Pre-orders get a date, not a maybe.'],
              ['Answered by us', 'No bots, no call centre. The same two people who pack the parcel reply to your DM.'],
            ].map(([title, text], index) => (
              <div key={title} className="bg-ivory p-7 sm:p-8">
                <p className="text-[10px] tracking-wide2 text-gold-500/80">0{index + 1}</p>
                <h3 className="mt-4 font-display text-2xl text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="shell py-16 text-center sm:py-20">
        <p className="mx-auto max-w-2xl font-display text-3xl leading-snug text-balance text-ink sm:text-4xl">
          “An abaya is not a compromise. It is the whole outfit.”
        </p>
        <p className="mt-5 text-[9px] uppercase tracking-micro text-ink-faint">The atelier note</p>
      </section>
    </>
  );
}
