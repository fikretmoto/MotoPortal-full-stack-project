import TagCategoryBlock from "./TagCategoryBlock/TagCategoryBlock";
import {
  campaignTags,
  motorcycleCategories,
  gearTags,
  gearCategories,
  bakimTags,
  bakimCategories,
  aksesuarTags,
  aksesuarCategories,
} from "@/constant/homepageBlocks";
import type { CategorySlugCard } from "@/constant/homepageBlocks";
import { getCategories } from "@/services/catalog";
import { getCategoryHref } from "@/lib/category-path";

import Footer from "./Footer/Footer";
import PopularBrandsBar from "./PopularBrandsBar/PopularBrandsBar";
import Hero from "./Hero/Hero";

const Home = async () => {
  const categories = await getCategories();

  // Slug'lı kartları, ağaçtaki gerçek yolu olan href'li kartlara çevirir
  const withHref = (cards: CategorySlugCard[]) =>
    cards.map((card) => ({
      name: card.name,
      image: card.image,
      href: getCategoryHref(card.slug, categories),
    }));

  return (
    <>
      <Hero />
      <PopularBrandsBar />
      <TagCategoryBlock
        title="Taşıt Fırsatları"
        tags={campaignTags}
        categories={withHref(motorcycleCategories)}
      />
      <TagCategoryBlock
        title="Ekipman Fırsatları"
        tags={gearTags}
        categories={withHref(gearCategories)}
      />
      <TagCategoryBlock
        title="Bakım ve Temizlik Fırsatları"
        tags={bakimTags}
        categories={withHref(bakimCategories)}
      />
      <TagCategoryBlock
        title="Aksesuar Fırsatları"
        tags={aksesuarTags}
        categories={withHref(aksesuarCategories)}
      />
      <Footer />
    </>
  );
};

export default Home;