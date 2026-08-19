"use client";

import { useState } from "react";

import MainNav from "./MainNav";
import MobileNav from "./MobileNav";

const ResponsiveNav = () => {
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
      />
    </>
  );
};

export default ResponsiveNav;