import type { Metadata } from "next";
import StoreHome from "@/components/Store/StoreHome";

export const metadata: Metadata = {
  title: "MotoPortal Mağaza | Giyim ve Daha Fazlası",
  description:
    "MotoPortal Mağaza'da giyim ve farklı ürün kategorilerini keşfet.",
  alternates: {
    canonical: "/magaza",
  },
};

export default function StorePage() {
  return <StoreHome />;
}
