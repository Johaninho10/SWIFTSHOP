import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import PopularCategories from "../components/PopularCategories";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <PopularCategories />
    </div>
  );
};

export default Home;
