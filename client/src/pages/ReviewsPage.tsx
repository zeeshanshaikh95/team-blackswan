import { Link } from 'react-router-dom';
import { publicApi } from '@/api/endpoints';
import { useApi } from '@/hooks/useApi';
import { useSettings } from '@/context/SettingsContext';
import { Seo } from '@/components/seo/Seo';
import { Stars } from '@/components/Stars';
import { EmptyState } from '@/components/EmptyState';
import { buildOrderLink, buildSingleProductMessage } from '@/lib/whatsapp';

export function ReviewsPage() {
  const { settings } = useSettings();
  const { data, loading, error } = useApi(() => publicApi.listReviews(), []);

  const shareLink = buildOrderLink(
    settings,
    buildSingleProductMessage(settings, {
      productName: 'my order',
      variantName: null,
      quantity: 1,
      price: null,
    })
  );

  return (
    <>
      <Seo
        title="Reviews — Team BlackSwan"
        description="Words from women who wear Team BlackSwan — sizing notes, fabric impressions and the pieces they keep returning to."
        canonicalPath="/reviews"
      />

      <section className="border-b border-ink/10">
        <div className="shell py-14 sm:py-20">
          <p className="eyebrow">In their words</p>
          <h1 className="mt-4 max-w-2xl font-display text-5xl leading-[0.98] text-balance sm:text-7xl">
            Worn, and written about.
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-ink-soft">
            Every note below is from a customer, published only once they have agreed to it.
          </p>
        </div>
      </section>

      <div className="shell py-12 sm:py-16">
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="skeleton h-48" />
            ))}
          </div>
        ) : error ? (
          <EmptyState tone="error" title="Reviews could not load" description={error} />
        ) : !data?.reviews.length ? (
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <EmptyState
                title="The first notes are on their way"
                description="We publish customer words only after they are shared with us directly. If you have worn a Team BlackSwan piece, we would love to hear how it felt."
                action={
                  shareLink ? (
                    <a
                      href={shareLink.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-line"
                    >
                      Send us your note
                    </a>
                  ) : null
                }
              />
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <p className="eyebrow">A note on honesty</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                We do not write reviews for customers, and we do not edit them. What appears here is what
                was sent to us — good, critical or simply practical.
              </p>
              <Link to="/shop" className="link-quiet mt-4 inline-block text-sm">
                Browse the collection
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.reviews.map((review) => (
              <figure key={review._id} className="panel flex flex-col p-6">
                <Stars rating={review.rating} />
                <blockquote className="mt-4 flex-1 text-sm leading-[1.9] text-ink-soft">
                  “{review.text}”
                </blockquote>
                {review.image ? (
                  <img
                    src={review.image}
                    alt={`Customer photo from ${review.customerName}`}
                    loading="lazy"
                    className="mt-5 aspect-[4/3] w-full object-cover"
                  />
                ) : null}
                <figcaption className="mt-5 border-t border-ink/10 pt-4 text-[10px] uppercase tracking-wide2 text-ink-faint">
                  {review.customerName}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
