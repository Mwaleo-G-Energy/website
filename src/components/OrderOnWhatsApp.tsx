import { orderUrl } from "@/lib/whatsappOrder";
import { WhatsAppIcon } from "@/components/icons";

// An alternative to checking out on the site: the shopper starts a WhatsApp chat with the shop, with the product already in it.
const OrderOnWhatsApp = ({ name, price, url, hasOptions }: { name: string; price?: number; url: string; hasOptions?: boolean }) => {
  const href = orderUrl({ name, price, url, hasOptions });
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Get a WhatsApp quote: ${name} (opens in a new tab)`}
      className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 text-base font-semibold text-gray-900 transition-colors hover:border-brand-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
    >
      <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
      Get a WhatsApp quote
    </a>
  );
};

export default OrderOnWhatsApp;
