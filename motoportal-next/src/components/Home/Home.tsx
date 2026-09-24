import TagCategoryBlock from "./TagCategoryBlock/TagCategoryBlock";
import { campaignTags, motorcycleCategories, gearTags, gearCategories, bakimTags, bakimCategories, aksesuarTags, aksesuarCategories,} from "@/constant/homepageBlocks";

import Footer from "./Footer/Footer";

import PopularBrandsBar from "./PopularBrandsBar/PopularBrandsBar";

import Navbar from "./Navbar/Navbar";
import Hero from "./Hero/Hero";


const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <PopularBrandsBar />
      <TagCategoryBlock title="Taşıt Fırsatları" tags={campaignTags} categories={motorcycleCategories} />
       <TagCategoryBlock
        title="Ekipman Fırsatları"
        tags={gearTags}
        categories={gearCategories}
      />
      <TagCategoryBlock
        title="Bakım ve Temizlik Fırsatları"
        tags={bakimTags}
        categories={bakimCategories}
      />
      <TagCategoryBlock
        title="Aksesuar Fırsatları"
        tags={aksesuarTags}
        categories={aksesuarCategories}
      />
      <Footer />
    </>
  );
};

export default Home; 