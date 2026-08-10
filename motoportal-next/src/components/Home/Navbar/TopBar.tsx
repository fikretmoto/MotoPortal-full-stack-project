import { topBarContent } from "@/constant/constant";

const TopBar = () => {
  return (
    <div className="border-b border-neutral-200 bg-neutral-950 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3 text-sm">
        <span className="font-semibold tracking-[0.18em] uppercase">
          {topBarContent.brandName}
        </span>

        <span className="text-right text-white/70">
          {topBarContent.message}
        </span>
      </div>
    </div>
  );
};

export default TopBar;
