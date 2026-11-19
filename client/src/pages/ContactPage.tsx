import { useSettings } from '@/context/SettingsContext';
import { Seo } from '@/components/seo/Seo';
import { buildOrderLink, buildSingleProductMessage, normaliseNumber } from '@/lib/whatsapp';

export function ContactPage() {
  const { settings } = useSettings();
  const whatsapp = normaliseNumber(settings.whatsappNumber);

  const orderLink = buildOrderLink(
    settings,
    buildSingleProductMessage(settings, {
      productName: 'an outfit',
      variantName: null,
      quantity: 1,
      price: null,
    })
  );

  const channels = [
    {
      label: 'WhatsApp',
      value: whatsapp ? 'Message us' : 'Add a number in Admin → Settings',
      href: whatsapp ? `https://wa.me/${whatsapp}` : null,
      note: 'Sizing, availability and delivery, answered personally.',
    },
    {
      label: 'Instagram',
      value: `@${settings.instagramHandle.replace(/^@/, '')}`,
      href: settings.instagramUrl || 'https://www.instagram.com/team_blackswan_/',
      note: 'DMs are open — the fastest way to see what is in the studio.',
    },
    {
      label: 'Email',
      value: settings.email || 'Coming soon',
      href: settings.email ? `mailto:${settings.email}` : null,
      note: 'For wholesale, exhibitions and press.',
    },
  ];

  return (
    <>
      <Seo
        title="Contact — Team BlackSwan"
        description="Reach Team BlackSwan in Mumbai on WhatsApp or Instagram for sizing, availability and delivery across India."
        canonicalPath="/contact"
      />

      <section className="border-b border-ink/10">
        <div className="shell py-14 sm:py-20">
          <p className="eyebrow">Contact</p>
          <h1 className="mt-4 max-w-2xl font-display text-5xl leading-[0.98] text-balance sm:text-7xl">
            Ask us anything before you order.
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-ink-soft">
            A person reads every message. Tell us the occasion, your usual size and the date you need
            it by — we will tell you honestly what will work.
          </p>
        </div>
      </section>

      <div className="shell grid gap-px bg-ink/10 py-12 sm:py-16 md:grid-cols-3">
        {channels.map((channel) => (
          <div key={channel.label} className="bg-bone p-6 sm:p-8">
            <p className="eyebrow">{channel.label}</p>
            {channel.href ? (
              <a
                href={channel.href}
                target={channel.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="mt-4 block font-display text-2xl hover:opacity-70"
              >
                {channel.value}
              </a>
            ) : (
              <p className="mt-4 font-display text-2xl text-ink-faint">{channel.value}</p>
            )}
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{channel.note}</p>
          </div>
        ))}
      </div>

      <section className="shell grid gap-10 pb-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="font-display text-3xl">Delivery & care of your order</h2>
          <div className="prose-editorial mt-4">
            {settings.policies.shipping ? (
              <p className="whitespace-pre-line">{settings.policies.shipping}</p>
            ) : (
              <p>
                We ship across India. Once your order is confirmed on WhatsApp, we share the dispatch date
                and tracking details directly — no automated emails, just a message from us.
              </p>
            )}
            {settings.policies.returns ? (
              <p className="whitespace-pre-line">{settings.policies.returns}</p>
            ) : (
              <p>
                If something is not right, message us within 48 hours of delivery with photographs of the
                piece and packaging. Exchanges are subject to the piece being unworn with tags intact.
              </p>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 lg:col-start-9">
          <div className="panel p-6">
            <p className="eyebrow">Studio</p>
            <p className="mt-3 font-display text-2xl">{settings.city || 'Mumbai'}, India</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Visits by appointment and at exhibitions. Follow us for the next stall — we announce every
              one on Instagram.
            </p>
            {orderLink ? (
              <a
                href={orderLink.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-solid mt-5 w-full"
              >
                {orderLink.channel === 'whatsapp' ? 'Start on WhatsApp' : 'Start on Instagram'}
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
