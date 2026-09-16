import Link from "next/link";
import { Mail, Phone } from "lucide-react";

const UtilityBar = () => {
  return (
    <div className="hidden bg-[oklch(16%_0.02_50)] text-[oklch(75%_0.01_60)] lg:block">
      <div className="mx-auto flex h-9 max-w-[1560px] items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* SOL: İLETİŞİM */}
        <div className="flex items-center gap-6 text-[12px]">
          
           <a href="tel:+905534512259"
            className="flex items-center gap-2 transition hover:text-white"
          >
            <Phone className="h-3.5 w-3.5 text-[oklch(62%_0.19_35)]" />
            <span>0 553 451 22 59</span>
          </a>

          
         <a href="mailto:info@motoportal.com.tr"
            className="flex items-center gap-2 transition hover:text-white"
          >
            <Mail className="h-3.5 w-3.5 text-[oklch(62%_0.19_35)]" />
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