import CategoryNav from "./CategoryNav";
import MainNav from "./MainNav";
import MobileNav from "./MobileNav";
import TopBar from "./TopBar";

const Navbar = () => {
  return (
    <header className="relative z-20 bg-white text-neutral-950">
      <TopBar />
      <MainNav />
      <CategoryNav />
      <MobileNav />
    </header>
  );
};

export default Navbar;
