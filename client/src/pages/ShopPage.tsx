import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { publicApi, type Product } from '@/api/endpoints';
import { useApi } from '@/hooks/useApi';
import { ProductCard } from '@/components/ProductCard';
import { EmptyState } from '@/components/EmptyState';
import { Seo } from '@/components/seo/Seo';

type SortKey = 'featured' | 'bestseller' | 'newest' | 'price_asc' | 'price_desc';

const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: 'featured', label: 'Curated' },
  { value: 'newest', label: 'Newest first' },
  { value: 'bestseller', label: 'Bestsellers' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
];

export function ShopPage() {
  const [params, setParams] = useSearchParams();
  const initialSort = (params.get('sort') as SortKey) || 'featured';

  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState<SortKey>(initialSort);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(search.trim()), 320);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const next = new URLSearchParams(params);
    if (sort === 'featured') next.delete('sort');
    else next.set('sort', sort);
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  const categories = useApi(() => publicApi.listCategories().then((r) => r.categories), []);
  const products = useApi<Product[]>(
    () =>
      publicApi
        .listProducts({ search: debounced, category, sort })
        .then((r) => r.products)
        .then((list) =>
          sort === 'bestseller' ? list.filter((product) => product.bestseller) : list
        ),
    [debounced, category, sort]
  );

  const activeCategory = categories.data?.find((item) => item.slug === category);

  return (
    <>
      <Seo
        title={`${activeCategory ? `${activeCategory.name} — ` : ''}The collection — Team BlackSwan`}
        description="Browse the Team BlackSwan collection — double chiffon, premium nida, velvet and embroidered abayas in sizes 54–60, delivered across India."
        canonicalPath={activeCategory ? `/category/${activeCategory.slug}` : '/shop'}
      />

      <section className="border-b border-ink/10">
        <div className="shell py-12 sm:py-16">
          <p className="eyebrow">The abaya rail</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <h1 className="font-display text-4xl leading-none sm:text-6xl">
              {activeCategory ? activeCategory.name : 'Every piece'}
            </h1>
            <p className="text-[10px] uppercase tracking-wide2 text-ink-faint">
              {products.loading ? 'Loading' : `${products.data?.length ?? 0} pieces`}
            </p>
          </div>
          {activeCategory?.description ? (
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">{activeCategory.description}</p>
          ) : null}
        </div>
      </section>

      <div className="shell py-8">
        <div className="flex flex-col gap-4 border-b border-ink/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1">
            <button
              type="button"
              onClick={() => setCategory('')}
              className={`shrink-0 border px-3.5 py-2 text-[10px] uppercase tracking-wide2 transition-colors ${
                category === ''
                  ? 'border-ink bg-ink text-ivory'
                  : 'border-ink/15 text-ink-soft hover:border-ink/40 hover:text-ink'
              }`}
            >
              All
            </button>
            {(categories.data ?? []).map((item) => (
              <button
                key={item._id}
                type="button"
                onClick={() => setCategory(item.slug)}
                className={`shrink-0 border px-3.5 py-2 text-[10px] uppercase tracking-wide2 transition-colors ${
                  category === item.slug
                    ? 'border-ink bg-ink text-ivory'
                    : 'border-ink/15 text-ink-soft hover:border-ink/40 hover:text-ink'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <label className="relative flex-1 lg:w-56">
              <span className="sr-only">Search the collection</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search fabric, colour…"
                className="w-full border border-ink/15 bg-transparent px-3 py-2 pr-8 text-sm placeholder:text-ink-faint focus:border-ink focus:outline-none"
              />
              <svg
                viewBox="0 0 24 24"
                className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              >
                <circle cx="11" cy="11" r="6.5" />
                <path d="M16 16l4 4" strokeLinecap="round" />
              </svg>
            </label>

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              aria-label="Sort pieces"
              className="border border-ink/15 bg-transparent px-3 py-2 text-[10px] uppercase tracking-wide2 text-ink focus:border-ink focus:outline-none"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-10">
          {products.loading ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="skeleton aspect-[3/4]" />
              ))}
            </div>
          ) : products.error ? (
            <EmptyState
              tone="error"
              title="We couldn't load the collection"
              description={products.error}
              action={
                <button type="button" className="btn-line" onClick={products.refetch}>
                  Try again
                </button>
              }
            />
          ) : !products.data?.length ? (
            <EmptyState
              title={debounced ? 'Nothing matches that search' : 'No pieces here yet'}
              description={
                debounced
                  ? 'Try a colour, a fabric or a shorter word — or browse all pieces.'
                  : 'This edit is being prepared. Meanwhile, the full collection is one tap away.'
              }
              action={
                <button
                  type="button"
                  className="btn-line"
                  onClick={() => {
                    setSearch('');
                    setCategory('');
                  }}
                >
                  Clear filters
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-14">
              {products.data.map((product, index) => (
                <ProductCard key={product._id} product={product} priority={index < 4} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
