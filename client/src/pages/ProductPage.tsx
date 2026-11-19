import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { publicApi } from '@/api/endpoints';
import { useApi } from '@/hooks/useApi';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';
import { useToast } from '@/context/ToastContext';
import { ProductCard } from '@/components/ProductCard';
import { EmptyState } from '@/components/EmptyState';
import { Seo } from '@/components/seo/Seo';
import { trackEvent } from '@/lib/analytics';
import { formatPrice } from '@/lib/format';
import { buildOrderLink, buildSingleProductMessage } from '@/lib/whatsapp';

export function ProductPage() {
  const { slug = '' } = useParams();
  const { data, loading, error } = useApi(() => publicApi.getProduct(slug), [slug]);
  const related = useApi(() => publicApi.getRelated(slug), [slug]);
  const { addItem, openCart } = useCart();
  const { settings } = useSettings();
  const { toast } = useToast();

  const product = data?.product;
  const [activeImage, setActiveImage] = useState(0);
  const [variantName, setVariantName] = useState<string | null>(null);

  useEffect(() => {
    setActiveImage(0);
    setVariantName(null);
  }, [slug]);

  useEffect(() => {
    if (product) trackEvent({ type: 'product_view', productSlug: product.slug });
  }, [product?.slug, product]);

  const selectedVariant = useMemo(
    () => product?.variants.find((variant) => variant.name === variantName) ?? product?.variants[0] ?? null,
    [product, variantName]
  );

  if (loading) {
    return (
      <div className="shell grid gap-10 py-14 lg:grid-cols-2">
        <div className="skeleton aspect-[3/4]" />
        <div className="space-y-4">
          <div className="skeleton h-6 w-1/3" />
          <div className="skeleton h-12 w-2/3" />
          <div className="skeleton h-24 w-full" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="shell py-24">
        <EmptyState
          tone="error"
          title="This piece is no longer listed"
          description={error || 'It may have been sold or retired from the collection.'}
          action={
            <Link to="/shop" className="btn-line">
              Browse the collection
            </Link>
          }
        />
      </div>
    );
  }

  const images = product.images.length ? product.images : [''];
  const outOfStock = product.stockStatus === 'out_of_stock' || selectedVariant?.stockStatus === 'out_of_stock';
  const price = selectedVariant?.price ?? product.price;

  const orderLink = buildOrderLink(
    settings,
    buildSingleProductMessage(settings, {
      productName: product.name,
      variantName: selectedVariant?.name ?? null,
      quantity: 1,
      price,
    })
  );

  return (
    <>
      <Seo
        title={product.seoTitle || `${product.name} — Team BlackSwan`}
        description={product.seoDescription || product.description.slice(0, 160)}
        canonicalPath={`/product/${product.slug}`}
        image={product.images[0]}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.description,
          image: product.images,
          brand: { '@type': 'Brand', name: 'Team BlackSwan' },
          ...(product.price !== null
            ? {
                offers: {
                  '@type': 'Offer',
                  priceCurrency: 'INR',
                  price: product.price,
                  availability: outOfStock ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
                },
              }
            : {}),
        }}
      />

      <nav className="shell flex items-center gap-2 py-5 text-[10px] uppercase tracking-wide2 text-ink-faint">
        <Link to="/shop" className="hover:text-ink">Shop</Link>
        <span>/</span>
        {product.category ? (
          <>
            <Link to={`/category/${product.category.slug}`} className="hover:text-ink">
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        ) : null}
        <span className="text-ink-soft">{product.name}</span>
      </nav>

      <div className="shell grid gap-10 pb-16 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div>
          <div className="relative aspect-[3/4] overflow-hidden bg-sand/40">
            {images[activeImage] ? (
              <img
                src={images[activeImage]}
                alt={product.name}
                className="h-full w-full animate-fade-in object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="font-display text-5xl text-ink/20">{product.name.slice(0, 2)}</span>
              </div>
            )}

            <div className="absolute left-0 top-0 flex flex-col gap-px">
              {product.newArrival ? <span className="badge-dark">New in</span> : null}
              {product.bestseller ? <span className="badge-line">Bestseller</span> : null}
            </div>

            {images.length > 1 ? (
              <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 bg-gradient-to-t from-obsidian/75 to-transparent p-4">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-label={`Show image ${index + 1}`}
                    className={`h-1 w-8 transition-colors ${
                      index === activeImage ? 'bg-ivory' : 'bg-ivory/40 hover:bg-ivory/70'
                    }`}
                  />
                ))}
              </div>
            ) : null}
          </div>

          {images.length > 1 ? (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {images.map((image, index) => (
                <button
                  key={`thumb-${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`aspect-[3/4] overflow-hidden border bg-sand/40 transition-colors ${
                    index === activeImage ? 'border-ink' : 'border-transparent hover:border-ink/30'
                  }`}
                >
                  {image ? <img src={image} alt="" className="h-full w-full object-cover" /> : null}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/* Details */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">{product.category?.name ?? 'Team BlackSwan'}</p>
          <h1 className="mt-3 font-display text-4xl leading-[1.05] sm:text-5xl">{product.name}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="text-lg">{formatPrice(price)}</p>
            {product.compareAtPrice ? (
              <p className="text-sm text-ink-faint line-through">{formatPrice(product.compareAtPrice)}</p>
            ) : null}
            {product.colour ? (
              <p className="text-[10px] uppercase tracking-wide2 text-ink-faint">{product.colour}</p>
            ) : null}
          </div>

          <p className="mt-6 text-sm leading-[1.85] text-ink-soft">{product.description}</p>

          {product.variants.length ? (
            <div className="mt-8">
              <div className="flex items-baseline justify-between">
                <p className="eyebrow">Size / option</p>
                <p className="text-[10px] text-ink-faint">Need help? Message us and we'll advise.</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.variants.map((variant) => {
                  const isActive = (selectedVariant?.name ?? null) === variant.name;
                  return (
                    <button
                      key={variant.name}
                      type="button"
                      onClick={() => setVariantName(variant.name)}
                      aria-pressed={isActive}
                      className={`min-w-[3.25rem] border px-3.5 py-2.5 text-xs transition-colors ${
                        isActive
                          ? 'border-ink bg-ink text-ivory'
                          : 'border-ink/20 text-ink hover:border-ink'
                      } ${variant.stockStatus === 'out_of_stock' ? 'line-through opacity-50' : ''}`}
                    >
                      {variant.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-2.5">
            <button
              type="button"
              disabled={outOfStock}
              onClick={() => {
                addItem(product, selectedVariant?.name ?? null);
                toast(`${product.name} added to your bag`);
                openCart();
              }}
              className="btn-solid w-full"
            >
              {outOfStock ? 'Sold out' : 'Add to bag'}
            </button>

            {orderLink && !outOfStock ? (
              <a
                href={orderLink.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent({ type: 'whatsapp_click', productSlug: product.slug })}
                className="btn-line w-full"
              >
                {orderLink.channel === 'whatsapp' ? 'Order this piece on WhatsApp' : 'Enquire on Instagram'}
              </a>
            ) : null}
          </div>

          <div className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
            {[
              ['Fabric & finish', product.fabric],
              ['Care', product.care],
              ['Delivery', settings.policies.shipping],
              ['Exchanges', settings.policies.returns],
            ]
              .filter(([, value]) => Boolean(value))
              .map(([label, value]) => (
                <details key={label} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-[11px] uppercase tracking-wide2 text-ink">
                    {label}
                    <span className="text-ink-faint transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-soft">{value}</p>
                </details>
              ))}
          </div>
        </div>
      </div>

      {related.data?.products.length ? (
        <section className="border-t border-ink/10 py-16">
          <div className="shell">
            <div className="flex items-end justify-between">
              <h2 className="font-display text-3xl">You may also like</h2>
              <Link to="/shop" className="text-[10px] uppercase tracking-wide2 text-ink-soft hover:text-ink">
                All pieces
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
              {related.data.products.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
