import UtilityBar from "./UtilityBar";
import CategoryNav from "./CategoryNav";
import MainNav from "./MainNav";
import MobileNav from "./MobileNav";
import TopBar from "./TopBar";
import PopularBrandsBar from "./PopularBrandsBar";

const Navbar = () => {
  return (
    <header className="relative z-50 bg-[#050505] text-white">
       <UtilityBar />
      <TopBar />
      <MainNav />
      <CategoryNav />
      <PopularBrandsBar />
      <MobileNav />
    </header>
  );
};

export default Navbar;
