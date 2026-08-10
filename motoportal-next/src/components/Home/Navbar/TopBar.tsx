import { socialLinks, topBarContent } from "@/constant/constant";

const TopBar = () => {
  return (
    <div className="border-b border-neutral-200 bg-neutral-950 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-2.5 text-[11px] sm:text-xs">
        <span className="truncate text-white/80">
          {topBarContent.message}
        </span>

        <div className="flex items-center gap-3">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-white/70 transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
