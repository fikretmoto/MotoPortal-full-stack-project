"use client";

import { useState } from "react";

import type { CategoryNode } from "@/services/catalog";
import MainNav from "./MainNav";
import MobileNav from "./MobileNav";

type ResponsiveNavProps = {
  categoryTree: CategoryNode[];
};

const ResponsiveNav = ({ categoryTree }: ResponsiveNavProps) => {
  const [showNav, setShowNav] = useState(false);

  const toggleNavHandler = () => {
    setShowNav((previousState) => !previousState);
  };

  const closeNavHandler = () => {
    setShowNav(false);
  };

  return (
    <>
      <MainNav />

      <MobileNav
        showNav={showNav}
        toggleNav={toggleNavHandler}
        closeNav={closeNavHandler}
        categoryTree={categoryTree}
      />
    </>
  );
};

export default ResponsiveNav;