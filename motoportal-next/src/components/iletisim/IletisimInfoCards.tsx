import { MapPin, Phone, Mail, Clock, Camera, ArrowUpRight } from "lucide-react";

const iconChipClassName =
  "flex h-[44px] w-[44px] flex-none items-center justify-center rounded-[10px] bg-[oklch(95%_0.03_45)] text-[oklch(50%_0.17_35)]";

const labelClassName =
  "text-[13px] font-semibold tracking-[0.6px] text-[oklch(42%_0.015_60)] uppercase";

const cardClassName =
  "flex gap-[16px] rounded-[14px] border border-border bg-white p-[20px]";

const IletisimInfoCards = () => {
  return (
    <div className="flex min-w-0 flex-1 basis-[360px] flex-col gap-[16px]">
      <h2 className="m-0 mb-[4px] font-[family-name:var(--font-barlow-condensed)] text-[32px] font-bold">
        İletişim bilgileri
      </h2>

      <div className={`${cardClassName} items-start`}>
        <div className={iconChipClassName}>
          <MapPin size={22} aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-[4px]">
          <div className={labelClassName}>Adres</div>
          <address className="text-[17px] leading-[1.5] not-italic">
            Mansuroğlu Mah., Dumlupınar Cad. 265,
            <br />
            1. Sokak No:1/A
            <br />
            35535 Bayraklı / İzmir
          </address>
        </div>
      </div>

      <div className={`${cardClassName} items-start`}>
        <div className={iconChipClassName}>
          <Phone size={22} aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-[4px]">
          <div className={labelClassName}>Telefon ve WhatsApp</div>
          <a
            href="tel:+905534512259"
            className="text-[17px] font-semibold no-underline"
          >
            0553 451 22 59
          </a>
        </div>
      </div>

      <div className={`${cardClassName} items-start`}>
        <div className={iconChipClassName}>
          <Mail size={22} aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-[4px]">
          <div className={labelClassName}>E-posta</div>
          <a
            href="mailto:info@motoportal.com.tr"
            className="text-[17px] font-semibold no-underline"
          >
            info@motoportal.com.tr
          </a>
        </div>
      </div>

      <div className={`${cardClassName} items-start`}>
        <div className={iconChipClassName}>
          <Clock size={22} aria-hidden="true" />
        </div>
        <div className="flex flex-1 flex-col gap-[6px]">
          <div className={labelClassName}>Çalışma saatleri</div>
          <div className="flex items-center justify-between gap-[12px] text-[16px]">
            <span>Pazartesi – Cumartesi</span>
            <span className="font-semibold">[SAAT – SAAT]</span>
          </div>
          <div className="flex items-center justify-between gap-[12px] text-[16px]">
            <span>Pazar</span>
            <span className="font-semibold">[AÇIK / KAPALI]</span>
          </div>
        </div>
      </div>

      <a
        href="https://www.instagram.com/motoportaltr"
        target="_blank"
        rel="noopener noreferrer"
        className={`${cardClassName} items-center text-foreground no-underline`}
      >
        <div className={iconChipClassName}>
          <Camera size={22} aria-hidden="true" />
        </div>
        <div className="flex flex-1 flex-col gap-[2px]">
          <div className={labelClassName}>Instagram</div>
          <div className="text-[17px] font-semibold">@motoportaltr</div>
        </div>
        <ArrowUpRight
          size={20}
          aria-hidden="true"
          className="text-[oklch(42%_0.015_60)]"
        />
      </a>
    </div>
  );
};

export default IletisimInfoCards;
