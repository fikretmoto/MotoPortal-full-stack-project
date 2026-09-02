import Brands from "./Brands/Brands";
import Categories from "./Categories/Categories";
import Footer from "./Footer/Footer";
import FeaturedProducts from "./FeaturedProducts/FeaturedProducts";
import HomepageBands from "./HomepageBands/HomepageBands";
import Navbar from "./Navbar/Navbar";
import Hero from "./Hero/Hero";
import PopularBrandsBar from "./PopularBrandsBar/PopularBrandsBar";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <PopularBrandsBar />
      <Categories />
      <FeaturedProducts />
      <HomepageBands />
      <Brands />
      <Footer />
    </>
  );
};

export default Home;