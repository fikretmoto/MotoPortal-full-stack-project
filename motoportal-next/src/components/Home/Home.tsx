import Brands from "./Brands/Brands";
import Categories from "./Categories/Categories";
import Footer from "./Footer/Footer";
import FeaturedProducts from "./FeaturedProducts/FeaturedProducts";
import Navbar from "./Navbar/Navbar";

const Home = () => {
  return (
    <>
      <Navbar />
      <Categories />
      <FeaturedProducts />
      <Brands />
      <Footer />
    </>
  );
};

export default Home;
