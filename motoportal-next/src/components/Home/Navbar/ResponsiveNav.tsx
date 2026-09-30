"use client";

import { useState } from "react";

import type { CategoryNode } from "@/services/catalog";
import type { CurrentUser } from "@/services/auth";
import MainNav from "./MainNav";
import MobileNav from "./MobileNav";

type ResponsiveNavProps = {
  categoryTree: CategoryNode[];
  user: CurrentUser | null;
};

const ResponsiveNav = ({ categoryTree, user }: ResponsiveNavProps) => {
  const [showNav, setShowNav] = useState(false);

  const toggleNavHandler = () => {
    setShowNav((previousState) => !previousState);
  };

  const closeNavHandler = () => {
    setShowNav(false);
  };

  return (
    <>
      <MainNav user={user} />

      <MobileNav
        showNav={showNav}
        toggleNav={toggleNavHandler}
        closeNav={closeNavHandler}
        categoryTree={categoryTree}
        user={user}
      />
    </>
  );
};

export default ResponsiveNav;