import Brands from "./Brands/Brands";
import Categories from "./Categories/Categories";
import FeaturedProducts from "./FeaturedProducts/FeaturedProducts";
import Hero from "./Hero/Hero";
import Navbar from "./Navbar/Navbar";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Brands />
    </>
  );
};

export default Home;
