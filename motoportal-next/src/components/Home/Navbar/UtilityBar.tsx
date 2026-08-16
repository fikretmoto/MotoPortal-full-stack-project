import Link from "next/link";
import { Mail, Phone } from "lucide-react";

const UtilityBar = () => {
  return (
    <div className="hidden border-b border-white/10 bg-[#09090b] text-white/65 lg:block">
      <div className="mx-auto flex h-9 max-w-[1560px] items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* SOL: İLETİŞİM */}
        <div className="flex items-center gap-6 text-[12px]">
          <a
            href="tel:+905534512259"
            className="flex items-center gap-2 transition hover:text-white"
          >
            <Phone className="h-3.5 w-3.5 text-[#0062C8]" />
            <span>0 553 451 22 59</span>
          </a>

          <a
            href="mailto:info@motoportal.com.tr"
            className="flex items-center gap-2 transition hover:text-white"
          >
            <Mail className="h-3.5 w-3.5 text-[#0062C8]" />
            <span>info@motoportal.com.tr</span>
          </a>
        </div>

        {/* SAĞ: YARDIMCI LİNKLER */}
        <nav
          aria-label="Yardımcı bağlantılar"
          className="flex items-center text-[12px]"
        >
          <Link
            href="/hakkimizda"
            className="border-r border-white/10 px-4 transition hover:text-white"
          >
            Hakkımızda
          </Link>

          <Link
            href="/iletisim"
            className="border-r border-white/10 px-4 transition hover:text-white"
          >
            İletişim
          </Link>

          <Link
            href="/siparis-takibi"
            className="border-r border-white/10 px-4 transition hover:text-white"
          >
            Sipariş Takibi
          </Link>

          <Link
            href="/yardim"
            className="pl-4 transition hover:text-white"
          >
            Yardım Merkezi
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default UtilityBar;