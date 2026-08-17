import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import NewArrivals from "../components/NewArrivals";
import PopularCategories from "../components/PopularCategories";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <PopularCategories />
      <NewArrivals />
    </div>
  );
};

export default Home;
