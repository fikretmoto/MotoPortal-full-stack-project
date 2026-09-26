"use client";

import { useState } from "react";
import { LayoutGrid } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import TagCategoryList from "./TagCategoryList";
import type { Category } from "@/services/catalog";

type Props = {
  categories: Category[];
};

export default function MobileTagCategoryDrawer({ categories }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-10 -mx-1.5 mb-4 border-b border-line bg-background px-1.5 py-2 lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-line bg-card py-2.5 text-sm font-bold text-foreground"
        >
          <LayoutGrid className="h-4 w-4" />
          Kategoriler
        </button>

        <SheetContent side="bottom" className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Kategoriler</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-6">
            <TagCategoryList categories={categories} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
