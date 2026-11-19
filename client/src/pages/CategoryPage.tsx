import { Link, useParams } from 'react-router-dom';
import { publicApi } from '@/api/endpoints';
import { useApi } from '@/hooks/useApi';
import { ProductCard } from '@/components/ProductCard';
import { EmptyState } from '@/components/EmptyState';
import { Seo } from '@/components/seo/Seo';

export function CategoryPage() {
  const { slug = '' } = useParams();
  const { data, loading, error, refetch } = useApi(
    () => publicApi.getCategory(slug),
    [slug]
  );

  if (error) {
    return (
      <div className="shell py-24">
        <EmptyState
          tone="error"
          title="That edit could not be found"
          description={error}
          action={
            <Link to="/shop" className="btn-line">
              Back to the shop
            </Link>
          }
        />
      </div>
    );
  }

  const category = data?.category;

  return (
    <>
      <Seo
        title={`${category?.name ?? 'Collection'} — Team BlackSwan`}
        description={category?.description || 'Explore the Team BlackSwan collection.'}
        canonicalPath={`/category/${slug}`}
        image={category?.image}
      />

      <section className="relative overflow-hidden bg-ink">
        <div className="absolute inset-0">
          {category?.image ? (
            <img src={category.image} alt="" className="h-full w-full object-cover opacity-60" />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/55 to-obsidian/20" />
        </div>
        <div className="shell relative flex min-h-[42vh] flex-col justify-end py-14 sm:min-h-[48vh]">
          <Link to="/shop" className="text-[10px] uppercase tracking-micro text-ivory/60 hover:text-ivory">
            ← All pieces
          </Link>
          <h1 className="mt-4 font-display text-5xl leading-none text-ivory sm:text-7xl">
            {loading ? 'Loading…' : category?.name}
          </h1>
          {category?.description ? (
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-ivory/70">{category.description}</p>
          ) : null}
        </div>
      </section>

      <div className="shell py-12 sm:py-16">
        {loading ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="skeleton aspect-[3/4]" />
            ))}
          </div>
        ) : !data?.products.length ? (
          <EmptyState
            title="This edit is being completed"
            description="Pieces will appear here as soon as they are ready. Message us and we'll share what's in the studio."
            action={
              <button type="button" className="btn-line" onClick={refetch}>
                Check again
              </button>
            }
          />
        ) : (
          <>
            <div className="mb-8 flex items-baseline justify-between border-b border-ink/10 pb-5">
              <p className="eyebrow">{data.products.length} pieces</p>
              <Link to="/shop" className="text-[10px] uppercase tracking-wide2 text-ink-soft hover:text-ink">
                Shop everything
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-14">
              {data.products.map((product, index) => (
                <ProductCard key={product._id} product={product} priority={index < 4} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
