import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { formatPrice, truncate } from '@/lib/format';
import type { Product } from '@/types';

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { addItem } = useCart();
  const outOfStock = product.stockStatus === 'out_of_stock';
  const secondary = product.images[1];

  return (
    <article className="group">
      <div className="relative overflow-hidden bg-sand/40">
        <Link to={`/product/${product.slug}`} aria-label={`View ${product.name}`} className="block">
          <div className="relative aspect-[3/4]">
            {product.images[0] ? (
              <>
                <img
                  src={product.images[0]}
                  alt={product.name}
                  loading={priority ? 'eager' : 'lazy'}
                  className={`h-full w-full object-cover transition-all duration-[900ms] ease-editorial group-hover:scale-[1.03] ${
                    secondary ? 'group-hover:opacity-0' : ''
                  }`}
                />
                {secondary ? (
                  <img
                    src={secondary}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  />
                ) : null}
              </>
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="font-display text-3xl text-ink/25">{product.name.slice(0, 2)}</span>
              </div>
            )}
          </div>
        </Link>

        <div className="absolute left-0 top-0 flex flex-col gap-px">
          {product.newArrival ? <span className="badge-dark">New in</span> : null}
          {product.bestseller ? <span className="badge-line">Bestseller</span> : null}
          {outOfStock ? <span className="badge-line">Sold out</span> : null}
        </div>

        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-ivory/95 px-3 py-2.5 transition-transform duration-300 ease-editorial group-hover:translate-y-0">
          <button
            type="button"
            disabled={outOfStock}
            onClick={() => addItem(product)}
            className="w-full text-[10px] uppercase tracking-wide2 text-ink transition-opacity hover:opacity-60 disabled:opacity-40"
          >
            {outOfStock ? 'Sold out' : 'Add to bag'}
          </button>
        </div>
      </div>

      <div className="pt-3">
        <Link to={`/product/${product.slug}`} className="block">
          <h3 className="font-display text-lg leading-snug text-ink hover:opacity-70">
            {truncate(product.name, 52)}
          </h3>
        </Link>
        <div className="mt-1 flex items-baseline justify-between gap-3">
          <p className="text-[11px] uppercase tracking-wide2 text-ink-faint">
            {product.category?.name ?? (product.colour || 'Team BlackSwan')}
          </p>
          <p className="text-xs text-ink-soft">{formatPrice(product.price)}</p>
        </div>
      </div>
    </article>
  );
}
