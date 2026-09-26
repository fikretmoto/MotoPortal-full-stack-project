import { getCategoryTree } from "@/services/catalog";
import UtilityBar from "./UtilityBar";
import CategoryNav from "./CategoryNav";
import ResponsiveNav from "./ResponsiveNav";
import TopBar from "./TopBar";

const Navbar = async () => {
  const categoryTree = await getCategoryTree();

  return (
    <header className="relative z-50 bg-[#050505] text-white">
      <UtilityBar />
      <TopBar />
      <ResponsiveNav categoryTree={categoryTree} />
      <CategoryNav categoryTree={categoryTree} />
    </header>
  );
};

export default Navbar;