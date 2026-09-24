import TagCategoryBlock from "./TagCategoryBlock/TagCategoryBlock";
import { campaignTags, motorcycleCategories, gearTags, gearCategories, bakimTags, bakimCategories,} from "@/constant/homepageBlocks";

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
      <Footer />
    </>
  );
};

export default Home; 