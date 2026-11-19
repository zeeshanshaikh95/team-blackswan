import { Link } from 'react-router-dom';
import { publicApi } from '@/api/endpoints';
import { useApi } from '@/hooks/useApi';
import { useSettings } from '@/context/SettingsContext';
import { HeroSlider } from '@/components/HeroSlider';
import { ProductCard } from '@/components/ProductCard';
import { SectionIntro } from '@/components/SectionIntro';
import { Seo } from '@/components/seo/Seo';
import { EmptyState } from '@/components/EmptyState';
import { Stars } from '@/components/Stars';
import { assetUrl, FOUNDER_IMAGE } from '@/lib/brand';
import { buildOrderLink, buildSingleProductMessage } from '@/lib/whatsapp';

const MARQUEE = [
  'Double chiffon',
  'Premium nida',
  'Velvet & pearl',
  'Lace trims',
  'Sizes 54 — 60',
  'By appointment',
];

const NOTES = [
  {
    title: 'Cut to order',
    text: 'Sizes 54 to 60, confirmed with you before we cut. Pre-orders open on every new drop.',
  },
  {
    title: 'Chosen by hand',
    text: 'Fabric first, then the fall. Nothing enters the rail that we would not wear ourselves.',
  },
  {
    title: 'By appointment',
    text: 'Studio visits in Mumbai and exhibition dates announced on Instagram every week.',
  },
];

export function HomePage() {
  const { settings } = useSettings();
  const newIn = useApi(() => publicApi.listProducts({ sort: 'newest' }).then((r) => r.products), []);
  const bestsellers = useApi(() => publicApi.listProducts({ sort: 'bestseller' }).then((r) => r.products), []);
  const categories = useApi(() => publicApi.listCategories().then((r) => r.categories), []);
  const reviews = useApi(() => publicApi.listReviews().then((r) => r.reviews), []);
  const gallery = useApi(() => publicApi.listGallery().then((r) => r.items), []);

  const orderLink = buildOrderLink(
    settings,
    buildSingleProductMessage(settings, {
      productName: 'your collection',
      variantName: null,
      quantity: 1,
      price: null,
    })
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: settings.businessName,
    description: settings.about.intro || 'An abaya atelier in Mumbai.',
    address: { '@type': 'PostalAddress', addressLocality: settings.city || 'Mumbai', addressCountry: 'IN' },
    ...(settings.instagramUrl ? { sameAs: [settings.instagramUrl] } : {}),
  };

  return (
    <>
      <Seo
        title="Team BlackSwan — Abaya Atelier"
        description="Team BlackSwan — an abaya atelier in Mumbai. Double chiffon, premium nida, velvet and embroidered abayas in sizes 54–60. Shop by appointment, order over DM."
        canonicalPath="/"
        jsonLd={jsonLd}
      />

      <HeroSlider />

      {/* Marquee strip */}
      <section className="overflow-hidden border-b border-gold-500/20 bg-ivory py-3.5">
        <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap">
          {[...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE].map((item, index) => (
            <span key={`${item}-${index}`} className="flex items-center gap-8">
              <span className="text-[9px] uppercase tracking-micro text-ink-soft">{item}</span>
              <span className="h-1 w-1 rotate-45 bg-gold-500/70" />
            </span>
          ))}
        </div>
      </section>

      {/* Collections */}
      <section className="shell py-16 sm:py-24">
        <SectionIntro
          eyebrow="Shop by edit"
          title="Five rails, one atelier"
          description="Chiffon for the everyday, nida for the long days, velvet for the nights that ask for more."
          linkTo="/shop"
          linkLabel="The full collection"
        />

        {categories.loading ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="skeleton aspect-[4/5]" />
            ))}
          </div>
        ) : !categories.data?.length ? (
          <div className="mt-10">
            <EmptyState title="The rails are being prepared" description="Collections appear here once the catalogue is published." />
          </div>
        ) : (
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.data.slice(0, 5).map((category, index) => (
              <Link
                key={category._id}
                to={`/category/${category.slug}`}
                className={`group relative block overflow-hidden border border-ink/10 bg-sand ${
                  index === 0 ? 'sm:col-span-2 lg:col-span-2 lg:row-span-2' : ''
                }`}
              >
                <div className={index === 0 ? 'aspect-[4/5] sm:aspect-[16/13] lg:aspect-[4/5]' : 'aspect-[4/5]'}>
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      loading="lazy"
                      className="h-full w-full object-cover opacity-90 transition-all duration-[1200ms] ease-editorial group-hover:scale-[1.04] group-hover:opacity-100"
                    />
                  ) : null}
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent" />
                <div className="pointer-events-none absolute inset-3 border border-gold-500/0 transition-colors duration-500 group-hover:border-gold-500/40" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                  <div>
                    <p className="text-[9px] uppercase tracking-micro text-gold-400">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <h3 className={`mt-2 font-display leading-tight text-ink ${index === 0 ? 'text-3xl sm:text-4xl' : 'text-2xl'}`}>
                      {category.name}
                    </h3>
                  </div>
                  <span className="mb-1 flex h-9 w-9 items-center justify-center border border-ink/30 text-ink transition-colors duration-300 group-hover:border-gold-400 group-hover:text-gold-300">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* New in */}
      <section className="border-y border-ink/10 bg-ivory py-16 sm:py-24">
        <div className="shell">
          <div className="flex flex-col gap-4 border-b border-ink/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Pre-orders open</p>
              <h2 className="mt-3 font-display text-3xl leading-tight sm:text-[2.7rem]">New to the rail</h2>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-[10px] uppercase tracking-wide2 text-ink-faint">
                {newIn.data?.length ? `${newIn.data.length} pieces` : 'Loading'}
              </span>
              <Link to="/shop?sort=newest" className="btn-line py-2.5">
                Shop new in
              </Link>
            </div>
          </div>

          {newIn.loading ? (
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="skeleton aspect-[3/4]" />
              ))}
            </div>
          ) : newIn.error ? (
            <div className="mt-10">
              <EmptyState
                tone="error"
                title="We couldn't load the collection"
                description={newIn.error}
                action={<button type="button" className="btn-line" onClick={newIn.refetch}>Try again</button>}
              />
            </div>
          ) : !newIn.data?.length ? (
            <div className="mt-10">
              <EmptyState
                title="The next drop is being photographed"
                description="New abayas appear here as soon as they are ready. The DM is always open in the meantime."
              />
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
              {newIn.data.slice(0, 4).map((product, index) => (
                <ProductCard key={product._id} product={product} priority={index < 2} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Atelier story */}
      <section className="shell grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-12 lg:gap-16">
        <div className="relative lg:col-span-6">
          <div className="frame-gold aspect-[4/5] overflow-hidden bg-sand">
            <img
              src={settings.about.founderImageUrl || assetUrl(FOUNDER_IMAGE)}
              alt="Gold thread work in the Team BlackSwan atelier"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <p className="mt-3 text-[9px] uppercase tracking-micro text-ink-faint">
            Zari work, in progress — the studio
          </p>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <p className="eyebrow">The atelier</p>
          <h2 className="mt-4 font-display text-4xl leading-[1.08] text-balance sm:text-5xl">
            A small team, a long rail of black
          </h2>
          <p className="mt-6 text-sm leading-[1.95] text-ink-soft">
            {settings.about.intro ||
              'Team BlackSwan began with a rail of abayas and a simple standard: the fabric has to feel as good as it looks. We keep the runs small, cut to order, and answer every message ourselves.'}
          </p>

          <div className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
            {NOTES.map((note, index) => (
              <div key={note.title} className="flex gap-5 py-4">
                <span className="mt-1 text-[10px] tracking-wide2 text-gold-500/80">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="font-display text-lg leading-none text-ink">{note.title}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{note.text}</p>
                </div>
              </div>
            ))}
          </div>

          <Link to="/about" className="btn-line mt-8">
            Read our story
          </Link>
        </div>
      </section>

      {/* Bestsellers — dark band */}
      <section className="border-y border-gold-500/20 bg-obsidian py-16 sm:py-24">
        <div className="shell">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Loved most</p>
              <h2 className="mt-3 font-display text-3xl leading-tight sm:text-[2.7rem]">
                The abayas she comes back for
              </h2>
            </div>
            <Link to="/shop?sort=bestseller" className="btn-line self-start py-2.5">
              Shop bestsellers
            </Link>
          </div>

          {bestsellers.loading ? (
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="skeleton aspect-[3/4]" />
              ))}
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
              {(bestsellers.data ?? []).slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lookbook */}
      {gallery.data?.length ? (
        <section className="py-16 sm:py-24">
          <div className="shell">
            <SectionIntro
              eyebrow={`@${settings.instagramHandle.replace(/^@/, '')}`}
              title="From the rail, on the feed"
              linkTo="/gallery"
              linkLabel="Open the lookbook"
            />
          </div>
          <div className="mt-10 grid grid-cols-3 gap-px bg-ink/10 sm:grid-cols-6">
            {gallery.data.slice(0, 6).map((item) => (
              <a
                key={item._id}
                href={item.externalUrl || settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden bg-sand"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.caption || 'Team BlackSwan on Instagram'}
                    loading="lazy"
                    className="h-full w-full object-cover opacity-85 transition-all duration-700 ease-editorial group-hover:scale-105 group-hover:opacity-100"
                  />
                ) : null}
                <span className="absolute inset-0 border border-gold-500/0 transition-colors duration-500 group-hover:border-gold-500/50" />
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {/* Reviews */}
      {reviews.data?.length ? (
        <section className="shell pb-16 sm:pb-24">
          <SectionIntro eyebrow="In their words" title="Worn and written about" linkTo="/reviews" linkLabel="All reviews" />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {reviews.data.slice(0, 3).map((review) => (
              <figure key={review._id} className="panel flex flex-col border-gold-500/20 p-6">
                <Stars rating={review.rating} />
                <blockquote className="mt-4 flex-1 font-display text-xl leading-snug text-ink">“{review.text}”</blockquote>
                <figcaption className="mt-5 border-t border-ink/10 pt-4 text-[9px] uppercase tracking-wide2 text-ink-faint">
                  {review.customerName}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {/* Closing CTA */}
      <section className="relative overflow-hidden border-t border-gold-500/25 bg-obsidian py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 grain opacity-40" />
        <div className="shell relative grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow">By appointment</p>
            <h2 className="mt-4 font-display text-4xl leading-[1.05] text-ink text-balance sm:text-6xl">
              Tell us the occasion. We will cut for it.
            </h2>
            <p className="mt-6 max-w-md text-sm leading-[1.9] text-ink-soft">
              Send a message with the date, your size and the fabric you have in mind — we will send
              back what is on the rail, what is on pre-order, and what we can finish in time.
            </p>
          </div>
          <div className="flex flex-col gap-3 lg:col-span-4 lg:col-start-9">
            {orderLink ? (
              <a
                href={orderLink.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-solid w-full"
              >
                {orderLink.channel === 'whatsapp' ? 'Message us on WhatsApp' : 'Message us on Instagram'}
              </a>
            ) : null}
            <Link to="/contact" className="btn-line w-full">
              Book a studio visit
            </Link>
            <p className="mt-2 text-[9px] uppercase tracking-micro text-ink-faint">
              {settings.city ? `${settings.city} · ` : ''}Delivery across India
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
