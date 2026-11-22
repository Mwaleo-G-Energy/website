import Image from "next/image";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";
import FooterShopLinks from "@/components/FooterShopLinks";
import { SHOP_LOCALITY, WHATSAPP_URL } from "@/lib/contact";

const heading = "mb-4 text-sm font-semibold uppercase tracking-wider text-white";
const link = "block py-1.5 text-sm text-gray-400 transition-colors hover:text-white";
const newTab = <span className="sr-only"> (opens in a new tab)</span>;
const Footer = () => {
  return (
    <footer className="mt-16 border-t border-white/10 bg-black text-gray-400">
      <div className="px-4 py-12 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[1.6fr_1fr_1fr_1.3fr]">
          <div className="col-span-2 text-center md:col-span-1 md:text-center">
            <Link href="/" className="mx-auto block w-fit">
              <Image
                src="/mwaleo-logo-horizontal-reverse.svg"
                alt={SITE_NAME}
                width={970}
                height={400}
                sizes="200px"
                className="h-auto w-full max-w-[12.5rem]"
              />
            </Link>
          </div>

          <nav aria-label="Shop" className="text-center md:text-left">
            <h2 className={heading}>Shop</h2>
            <FooterShopLinks />
          </nav>

          <nav aria-label="Explore" className="text-center md:text-left">
            <h2 className={heading}>Explore</h2>
            <ul>
              <li><Link href="/" className={link}>Homepage</Link></li>
              <li><Link href="/shop" className={link}>Shop</Link></li>
              <li><Link href="/contact" className={link}>Contact</Link></li>
            </ul>
          </nav>

          <div className="col-span-2 text-center md:col-span-1 md:text-left">
            <h2 className={heading}>Visit us</h2>
            <address className="text-sm not-italic">
              <p>{SHOP_LOCALITY}</p>
              {WHATSAPP_URL && (
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={link}>WhatsApp</a>
              )}
            </address>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm">
          <p className="text-center md:text-left">© {SITE_NAME}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
