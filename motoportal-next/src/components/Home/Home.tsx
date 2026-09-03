import TagCategoryBlock from "./TagCategoryBlock/TagCategoryBlock";
import { campaignTags, motorcycleCategories } from "@/constant/homepageBlocks";

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
      <TagCategoryBlock tags={campaignTags} categories={motorcycleCategories} />
      <Footer />
    </>
  );
};

export default Home; 