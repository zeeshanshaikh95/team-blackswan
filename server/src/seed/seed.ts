/**
 * Seeds the database.
 *
 *   npm run seed          → bootstrap admin + settings, then add the starter
 *                           catalogue only when no products exist yet
 *   npm run seed:reset    → wipe catalogue records and re-create them
 *
 * Product names, fabrics, sizes and copy come from the brand's own public
 * Instagram posts. Price is a nullable field end to end: blank means "price on
 * request", exactly how the studio quotes today over DM.
 */
import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { Category } from '../models/category.model.js';
import { GalleryItem } from '../models/galleryItem.model.js';
import { Product } from '../models/product.model.js';
import { Review } from '../models/review.model.js';
import { bootstrap } from './bootstrap.js';

const reset = process.argv.includes('--reset');
const INSTAGRAM = 'https://www.instagram.com/team_blackswan_/';

const categories = [
  {
    name: 'Double Chiffon',
    slug: 'double-chiffon',
    description: 'Two layers of fine chiffon with a graceful fall — everyday elegance and occasion alike.',
    image: '/images/p-chiffon.jpg',
    displayOrder: 1,
  },
  {
    name: 'Nida Essentials',
    slug: 'nida-essentials',
    description: 'Premium nida, lace-finished and cut to our full size range, 54 to 60.',
    image: '/images/p-nida.jpg',
    displayOrder: 2,
  },
  {
    name: 'Velvet & Evening',
    slug: 'velvet-evening',
    description: 'Button-down velvet in navy, bronze and plum — for weddings and festive nights.',
    image: '/images/p-velvet.jpg',
    displayOrder: 3,
  },
  {
    name: 'Embroidered Edit',
    slug: 'embroidered-edit',
    description: 'Hand-worked florals and thread-work on a nida base.',
    image: '/images/p-embroidered.jpg',
    displayOrder: 4,
  },
  {
    name: 'Lace & Print',
    slug: 'lace-print',
    description: 'Lace-trimmed chiffon and printed everyday abayas in soft, wearable colours.',
    image: '/images/p-lace.jpg',
    displayOrder: 5,
  },
];

const sizesToVariants = (sizes: string[]) =>
  sizes.map((name) => ({ name, price: null as number | null, stockStatus: 'in_stock' as const }));

const ABYA_SIZES = ['54', '56', '58', '60'];

const products = [
  {
    name: 'Double Chiffon Plain Abaya',
    slug: 'double-chiffon-plain-abaya',
    description:
      'Timeless elegance in every layer. A lightweight double chiffon abaya with a graceful flow — soft enough for everyday, considered enough for an evening. Available in a range of colours.',
    price: null,
    compareAtPrice: null,
    fabric: 'Double chiffon (two-layer) · plain finish · straight cut',
    care: 'Gentle hand wash separately in cold water. Line dry in shade and steam lightly. Do not bleach.',
    colour: 'Camel beige',
    categorySlug: 'double-chiffon',
    images: ['/images/p-chiffon.jpg'],
    variants: sizesToVariants(ABYA_SIZES),
    bestseller: true,
    featured: true,
    newArrival: true,
    displayOrder: 1,
  },
  {
    name: 'Nida Lace-Front Abaya',
    slug: 'nida-lace-front-abaya',
    description:
      'Premium nida with a scalloped lace panel running the length of the front. Comfortable, quietly formal, and cut to the studio’s full size range.',
    price: null,
    compareAtPrice: null,
    fabric: 'Premium nida · lace-trimmed front panel and cuffs',
    care: 'Dry clean recommended. Cool iron on the reverse, never directly on the lace.',
    colour: 'Pearl ivory',
    categorySlug: 'nida-essentials',
    images: ['/images/p-nida.jpg'],
    variants: sizesToVariants(ABYA_SIZES),
    bestseller: true,
    featured: true,
    newArrival: true,
    displayOrder: 2,
  },
  {
    name: 'Velvet Button-Down Abaya',
    slug: 'velvet-button-down-abaya',
    description:
      'Luxury, elegance and timeless style in every piece. A velvet abaya with a pearl button placket, finished for weddings, festive occasions, outings and special gatherings.',
    price: null,
    compareAtPrice: null,
    fabric: 'Velvet · pearl button placket · V neckline',
    care: 'Dry clean only. Steam rather than iron, and store on a padded hanger.',
    colour: 'Navy · bronze · plum',
    categorySlug: 'velvet-evening',
    images: ['/images/p-velvet.jpg'],
    variants: [
      { name: 'Navy', price: null as number | null, stockStatus: 'in_stock' as const },
      { name: 'Bronze', price: null as number | null, stockStatus: 'in_stock' as const },
      { name: 'Plum', price: null as number | null, stockStatus: 'in_stock' as const },
    ],
    bestseller: true,
    featured: true,
    newArrival: true,
    displayOrder: 3,
  },
  {
    name: 'Lace-Trim Chiffon Abaya',
    slug: 'lace-trim-chiffon-abaya',
    description:
      'Soft chiffon with a lace trim at the cuff and hem, cut with a deep V and a wrap-front detail. A lighter option for daytime events and long evenings.',
    price: null,
    compareAtPrice: null,
    fabric: 'Chiffon · lace trim · wrap-front detail',
    care: 'Hand wash cold, do not wring. Steam lightly to release creases.',
    colour: 'Sky blue · blush pink',
    categorySlug: 'lace-print',
    images: ['/images/p-lace.jpg'],
    variants: [
      { name: 'Sky blue', price: null as number | null, stockStatus: 'in_stock' as const },
      { name: 'Blush pink', price: null as number | null, stockStatus: 'in_stock' as const },
    ],
    bestseller: false,
    featured: true,
    newArrival: true,
    displayOrder: 4,
  },
  {
    name: 'Embroidered Noir Abaya',
    slug: 'embroidered-noir-abaya',
    description:
      'A black nida abaya with multicolour floral thread-work along the neckline and a single pearl button. Understated from across the room, detailed up close.',
    price: null,
    compareAtPrice: null,
    fabric: 'Nida base · multicolour thread embroidery · pearl button',
    care: 'Dry clean only. Handle the embroidered neckline with care.',
    colour: 'Black',
    categorySlug: 'embroidered-edit',
    images: ['/images/p-embroidered.jpg'],
    variants: sizesToVariants(ABYA_SIZES),
    bestseller: true,
    featured: false,
    newArrival: false,
    displayOrder: 5,
  },
];

const gallery = [
  { image: '/images/p-velvet.jpg', caption: 'Velvet, three ways', externalUrl: INSTAGRAM, displayOrder: 1 },
  { image: '/images/p-nida.jpg', caption: 'Nida with lace', externalUrl: INSTAGRAM, displayOrder: 2 },
  { image: '/images/p-chiffon.jpg', caption: 'The double chiffon rail', externalUrl: INSTAGRAM, displayOrder: 3 },
  { image: '/images/gallery-lifestyle.jpg', caption: 'Out of office', externalUrl: INSTAGRAM, displayOrder: 4 },
  { image: '/images/p-lace.jpg', caption: 'Sky and blush', externalUrl: INSTAGRAM, displayOrder: 5 },
  { image: '/images/p-embroidered.jpg', caption: 'Noir, with florals', externalUrl: INSTAGRAM, displayOrder: 6 },
];

async function main(): Promise<void> {
  await connectDatabase();
  await bootstrap();

  const existingProducts = await Product.countDocuments();
  if (existingProducts > 0 && !reset) {
    console.log(`[seed] ${existingProducts} products already present — catalogue seed skipped`);
  } else {
    if (reset) {
      await Promise.all([
        Product.deleteMany({}),
        Category.deleteMany({}),
        Review.deleteMany({}),
        GalleryItem.deleteMany({}),
      ]);
      console.log('[seed] catalogue cleared');
    }

    const categoryIds = new Map<string, mongoose.Types.ObjectId>();
    for (const category of categories) {
      const created = await Category.create(category);
      categoryIds.set(category.slug, created._id as mongoose.Types.ObjectId);
    }
    console.log(`[seed] ${categories.length} categories created`);

    for (const product of products) {
      const { categorySlug, ...rest } = product;
      await Product.create({
        ...rest,
        category: categoryIds.get(categorySlug) ?? null,
      });
    }
    console.log(`[seed] ${products.length} products created`);

    await GalleryItem.create(gallery);
    console.log(`[seed] ${gallery.length} gallery images created`);

    console.log('[seed] reviews are left empty — add real customer words in Admin → Reviews');
  }

  await disconnectDatabase();
  console.log('[seed] done');
}

main().catch(async (err) => {
  console.error('[seed] failed', err);
  await disconnectDatabase().catch(() => undefined);
  process.exit(1);
});
