import Brands from "./Brands/Brands";
import Categories from "./Categories/Categories";
import Footer from "./Footer/Footer";
import FeaturedProducts from "./FeaturedProducts/FeaturedProducts";
import HomepageBands from "./HomepageBands/HomepageBands";
import Navbar from "./Navbar/Navbar";

const Home = () => {
  return (
    <>
      <Navbar />
      <Categories />
      <FeaturedProducts />
      <HomepageBands />
      <Brands />
      <Footer />
    </>
  );
};

export default Home;