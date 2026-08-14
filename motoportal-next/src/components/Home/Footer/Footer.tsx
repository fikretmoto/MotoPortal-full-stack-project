import Link from "next/link";
import {
  Send,
} from "lucide-react";

import {
  footerContent,
  footerGroups,
  footerPaymentItems,
  socialLinks,
} from "@/constant/constant";

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0c] text-white">
      <div className="mx-auto max-w-[1560px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 border-b border-white/10 pb-10 lg:grid-cols-[1.2fr_repeat(3,0.8fr)_1fr_1fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-[radial-gradient(circle_at_top,#3f3f46,#09090b_65%)] text-lg font-black tracking-tight">
                MP
              </div>
              <div>
                <div className="flex items-end gap-1 text-[1.9rem] font-black uppercase tracking-tight">
                  <span className="text-white">Moto</span>
                  <span className="text-[#e10600]">Portal</span>
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.36em] text-white/60">
                  .COM.TR
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-white/72">
              {footerContent.description}
            </p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-[1.4rem] font-black uppercase tracking-tight text-white">
                {group.title}
              </h3>
              <div className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="block text-sm text-white/76 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div>
            <h3 className="text-[1.4rem] font-black uppercase tracking-tight text-white">
              {footerContent.newsletterTitle}
            </h3>
            <p className="mt-4 text-sm leading-7 text-white/72">
              {footerContent.newsletterDescription}
            </p>
            <form className="mt-5 flex overflow-hidden rounded-xl border border-white/10 bg-white">
              <input
                type="email"
                placeholder={footerContent.newsletterPlaceholder}
                className="h-12 min-w-0 flex-1 bg-white px-4 text-sm text-neutral-900 outline-none placeholder:text-neutral-500"
              />
              <button
                type="button"
                className="inline-flex h-12 w-12 items-center justify-center bg-[#e10600] text-white transition hover:bg-[#c90500]"
                aria-label="Bultene kaydol"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

          <div>
            <h3 className="text-[1.4rem] font-black uppercase tracking-tight text-white">
              Sosyal Medya
            </h3>
            <div className="mt-5 flex flex-wrap gap-3">
              {socialLinks.map((link) => {
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/18 px-4 text-sm font-semibold text-white/85 transition hover:border-white/40 hover:text-white"
                    aria-label={link.label}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
            <p className="mt-5 text-sm leading-7 text-white/72">
              Bizi takip edin, hiçbir yeniliği kaçırmayın.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5 pt-6 text-sm text-white/62 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 MotoPortal.com.tr - Tüm hakları saklıdır.</p>
          <div className="flex flex-wrap items-center gap-5 text-sm font-semibold uppercase tracking-[0.08em] text-white/72">
            {footerPaymentItems.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
