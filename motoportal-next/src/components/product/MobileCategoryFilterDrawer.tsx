"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CategorySidebarContent from "./CategorySidebarContent";
import type { AttributeGroupWithAttributes, Brand, Category } from "@/services/catalog";

type Props = {
  sidebarItems: Category[];
  sidebarHeaderCategory: Category;
  activeCategoryId: number;
  isVehicle: boolean;
  attributeGroups: AttributeGroupWithAttributes[];
  categoryBrands: Brand[];
};

export default function MobileCategoryFilterDrawer(props: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-10 -mx-6 mb-4 border-b border-line bg-background px-6 py-2 lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-line bg-card py-2.5 text-sm font-bold text-foreground"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtrele / Kategoriler
        </button>

        <SheetContent side="bottom" className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filtrele / Kategoriler</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-6">
            <CategorySidebarContent {...props} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
