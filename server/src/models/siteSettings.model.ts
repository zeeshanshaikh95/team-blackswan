import mongoose, { Schema, model, type Model } from 'mongoose';

export interface IHeroSlide {
  imageUrl: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  ctaLabel: string;
  ctaHref: string;
  active: boolean;
}

export const HERO_SLIDES_DEFAULT: IHeroSlide[] = [
  {
    imageUrl: '/images/hero-black.jpg',
    eyebrow: 'Black & gold',
    headline: 'Evenings, dressed in black and gold',
    subheadline:
      'An atelier of abayas from Mumbai — double chiffon, premium nida and velvet, cut to order and finished by hand.',
    ctaLabel: 'Enter the collection',
    ctaHref: '/shop',
    active: true,
  },
  {
    imageUrl: '/images/hero-velvet.jpg',
    eyebrow: 'The velvet edit',
    headline: 'Velvet, with pearls down the front',
    subheadline:
      'Navy, bronze and plum — button-down velvet abayas for weddings, festive nights and the occasions that ask for more.',
    ctaLabel: 'Shop velvet',
    ctaHref: '/shop?sort=newest',
    active: true,
  },
  {
    imageUrl: '/images/hero-chiffon.jpg',
    eyebrow: 'Double chiffon',
    headline: 'Weightless, and never sheer',
    subheadline:
      'Two layers of fine chiffon with a graceful fall — for everyday elegance and the long evenings in between.',
    ctaLabel: 'Shop chiffon',
    ctaHref: '/shop?sort=bestseller',
    active: true,
  },
];

export const WHATSAPP_TEMPLATE_DEFAULT =
  'Assalamu alaikum Team BlackSwan! 🦢\n' +
  'I would like to order the following:\n' +
  '{{ITEMS}}\n' +
  'Estimated total: {{TOTAL}}\n\n' +
  'Please confirm sizes, colours and delivery.';

export const WHATSAPP_TEMPLATE_SINGLE_DEFAULT =
  'Assalamu alaikum Team BlackSwan! 🦢\n' +
  'I would like to enquire about:\n' +
  '• {{PRODUCT}}\n' +
  '{{VARIANT_LINE}}{{QTY_LINE}}Price: {{PRICE}}\n\n' +
  'Please share availability and delivery details.';

export interface ISiteSettings {
  businessName: string;
  tagline: string;
  whatsappNumber: string;
  instagramUrl: string;
  instagramHandle: string;
  email: string;
  city: string;
  mapsUrl: string;
  whatsappTemplate: string;
  whatsappSingleProductTemplate: string;
  heroSlides: IHeroSlide[];
  about: {
    intro: string;
    story: string;
    founderImageUrl: string;
  };
  announcements: {
    enabled: boolean;
    text: string;
  };
  policies: {
    shipping: string;
    returns: string;
  };
  updatedAt: Date;
}

const slideSchema = new Schema<IHeroSlide>(
  {
    imageUrl: { type: String, default: '' },
    eyebrow: { type: String, default: '' },
    headline: { type: String, default: '' },
    subheadline: { type: String, default: '' },
    ctaLabel: { type: String, default: 'Shop the collection' },
    ctaHref: { type: String, default: '/shop' },
    active: { type: Boolean, default: true },
  },
  { _id: false }
);

const siteSettingsSchema = new Schema<ISiteSettings>(
  {
    businessName: { type: String, default: 'Team BlackSwan' },
    tagline: { type: String, default: 'Abaya Atelier · Mumbai' },
    whatsappNumber: { type: String, default: '' },
    instagramUrl: { type: String, default: 'https://www.instagram.com/team_blackswan_/' },
    instagramHandle: { type: String, default: 'team_blackswan_' },
    email: { type: String, default: '' },
    city: { type: String, default: 'Mumbai' },
    mapsUrl: { type: String, default: '' },
    whatsappTemplate: { type: String, default: WHATSAPP_TEMPLATE_DEFAULT },
    whatsappSingleProductTemplate: { type: String, default: WHATSAPP_TEMPLATE_SINGLE_DEFAULT },
    heroSlides: { type: [slideSchema], default: () => HERO_SLIDES_DEFAULT },
    about: {
      intro: { type: String, default: '' },
      story: { type: String, default: '' },
      founderImageUrl: { type: String, default: '/images/about-atelier.jpg' },
    },
    announcements: {
      enabled: { type: Boolean, default: true },
      text: {
        type: String,
        default: 'Pre-orders open · Studio visits by appointment · DM to reserve',
      },
    },
    policies: {
      shipping: { type: String, default: '' },
      returns: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ?? model<ISiteSettings>('SiteSettings', siteSettingsSchema);
