import { getCategoryTree } from "@/services/catalog";
import type { CurrentUser } from "@/services/auth";
import UtilityBar from "./UtilityBar";
import CategoryNav from "./CategoryNav";
import ResponsiveNav from "./ResponsiveNav";
import TopBar from "./TopBar";

type NavbarProps = {
  user: CurrentUser | null;
};

const Navbar = async ({ user }: NavbarProps) => {
  const categoryTree = await getCategoryTree();

  return (
    <header className="relative z-50 bg-[#050505] text-white">
      <UtilityBar />
      <TopBar />
      <ResponsiveNav categoryTree={categoryTree} user={user} />
      <CategoryNav categoryTree={categoryTree} />
    </header>
  );
};

export default Navbar;