import TagCategoryBlock from "./TagCategoryBlock/TagCategoryBlock";
import { campaignTags, motorcycleCategories, gearTags, gearCategories,} from "@/constant/homepageBlocks";

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
      <Footer />
    </>
  );
};

export default Home; 