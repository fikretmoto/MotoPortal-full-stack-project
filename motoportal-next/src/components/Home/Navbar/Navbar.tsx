import UtilityBar from "./UtilityBar";
import CategoryNav from "./CategoryNav";
import ResponsiveNav from "./ResponsiveNav";
import TopBar from "./TopBar";
import PopularBrandsBar from "./PopularBrandsBar";

const Navbar = () => {
  return (
    <header className="relative z-50 bg-[#050505] text-white">
      <UtilityBar />
      <TopBar />
      <ResponsiveNav />
      <CategoryNav />
      <PopularBrandsBar />
    </header>
  );
};

export default Navbar;