import type { Metadata } from "next";
import Home from "@/components/Home/Home";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return <Home />;
}
