import Link from "next/link";

export const PRODUCT_GRID_ANCHOR_ID = "urun-listesi";

// Backend'deki ProductPageNumberPagination.page_size ile ayni deger
// -- totalPages hesaplamak icin.
export const PRODUCTS_PAGE_SIZE = 24;

type Props = {
  currentPage: number;
  totalPages: number;
  // Server-rendered sayfalarda (kategori/etiket) zorunlu -- her sayfa
  // numarası gerçek bir <Link href>'e karşılık gelir. Client-state
  // tabanlı sayfalarda (marka) kullanılmaz, onNavigate devreye girer.
  buildHref?: (page: number) => string;
  onNavigate?: (page: number) => void;
};

function buildPageList(currentPage: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set<number>([
    1,
    2,
    totalPages - 1,
    totalPages,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ]);

  const sorted = Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  const result: (number | "...")[] = [];
  let previous: number | null = null;

  for (const page of sorted) {
    if (previous !== null && page - previous > 1) {
      result.push("...");
    }
    result.push(page);
    previous = page;
  }

  return result;
}

const itemClassName =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-medium transition";
const activeClassName = `${itemClassName} bg-primary text-primary-foreground`;
const inactiveClassName = `${itemClassName} text-foreground hover:bg-muted`;
const disabledClassName = `${itemClassName} cursor-not-allowed text-fg-subtle`;

export default function Pagination({
  currentPage,
  totalPages,
  buildHref,
  onNavigate,
}: Props) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = buildPageList(currentPage, totalPages);

  const renderPageControl = (
    page: number,
    label: React.ReactNode,
    className: string,
    disabled: boolean
  ) => {
    if (onNavigate) {
      return (
        <button
          type="button"
          disabled={disabled}
          onClick={() => onNavigate(page)}
          className={className}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {label}
        </button>
      );
    }

    if (disabled) {
      return <span className={className}>{label}</span>;
    }

    return (
      <Link
        href={`${buildHref!(page)}#${PRODUCT_GRID_ANCHOR_ID}`}
        className={className}
        aria-current={page === currentPage ? "page" : undefined}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav
      aria-label="Sayfalama"
      className="mt-8 flex flex-wrap items-center justify-center gap-1"
    >
      {renderPageControl(
        currentPage - 1,
        "Önceki",
        currentPage === 1 ? disabledClassName : inactiveClassName,
        currentPage === 1
      )}

      {pages.map((page, index) =>
        page === "..." ? (
          <span key={`ellipsis-${index}`} className={disabledClassName}>
            …
          </span>
        ) : (
          <span key={page}>
            {renderPageControl(
              page,
              page,
              page === currentPage ? activeClassName : inactiveClassName,
              false
            )}
          </span>
        )
      )}

      {renderPageControl(
        currentPage + 1,
        "Sonraki",
        currentPage === totalPages ? disabledClassName : inactiveClassName,
        currentPage === totalPages
      )}
    </nav>
  );
}
