import { useEffect } from "react";
import { useFetchGamesQuery } from "../../../features/games/gamesSlice";
import MyGamesSlider from "./MySwiper";
import HomeSections from "./HomeSection";
import { motion } from "framer-motion";
import GamesSection from "./GamesSection";

const Home = () => {
  const { data, isLoading, refetch: fetchGames } = useFetchGamesQuery();

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const myGames = data?.data || [];

  return (
    <>
      <motion.div
        initial={{ scale: 0.2, filter: "blur(10px)", opacity: 0 }}
        animate={{ scale: 1, filter: "blur(0px)", opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-[#101014] bg-opacity-90">
          <div className="container mx-auto px-4 mt-8">
            {isLoading ? (
              <div className="animate-pulse space-y-6">
                <div className="h-10 bg-[#1F1F23] rounded w-1/3"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="bg-[#1F1F23] rounded-lg p-4">
                      <div className="h-48 bg-[#2A2A2E] rounded-lg mb-4"></div>
                      <div className="h-6 bg-[#2A2A2E] rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-[#2A2A2E] rounded w-full mb-4"></div>
                      <div className="h-10 bg-[#2A2A2E] rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : myGames.length > 0 ? (
              <MyGamesSlider games={myGames} />
            ) : (
              <p className="text-white text-center">No games available</p>
            )}
          </div>
        </div>
      </motion.div>
      <div>
        <GamesSection />
      </div>

      <section className="relative w-full py-12 bg-[#101014]">
        <div className="container mx-auto px-4">
          <HomeSections />
        </div>
      </section>
    </>
  );
};

export default Home;