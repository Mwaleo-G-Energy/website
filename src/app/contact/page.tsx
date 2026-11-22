import { pageShare } from "@/lib/seo";
import ContactForm from "@/components/ContactForm";
import { SHOP_LOCALITY, WHATSAPP_URL } from "@/lib/contact";

export const metadata = {
  title: "Contact",
  description: "Contact Mwaleo Green Energy in Nairobi about Felicity Solar equipment, quotes and orders.",
  alternates: { canonical: "/contact" },
  openGraph: pageShare("/contact"),
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-16">
      <h1 className="font-display text-4xl font-extrabold md:text-5xl">Contact Mwaleo Green Energy</h1>
      <p className="mt-4 text-lg text-gray-700">{SHOP_LOCALITY}</p>
      {WHATSAPP_URL && (
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center rounded bg-brand-gold px-5 py-3 font-medium text-brand-black hover:bg-brand-gold-dark">
          Chat on WhatsApp
        </a>
      )}
      <section className="mt-10 rounded bg-brand-cream p-6" aria-labelledby="send-message">
        <h2 id="send-message" className="mb-4 font-display text-2xl font-bold">Send us a message</h2>
        <ContactForm />
      </section>
    </main>
  );
}
