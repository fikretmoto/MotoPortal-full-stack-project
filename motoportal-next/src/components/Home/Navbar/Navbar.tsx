import CategoryNav from "./CategoryNav";
import MainNav from "./MainNav";
import MobileNav from "./MobileNav";
import TopBar from "./TopBar";

const Navbar = () => {
  return (
    <header className="relative z-50 bg-[#050505] text-white">
      <TopBar />
      <MainNav />
      <CategoryNav />
      <MobileNav />
    </header>
  );
};

export default Navbar;
