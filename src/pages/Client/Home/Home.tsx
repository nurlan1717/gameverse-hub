import { useEffect } from "react";
import { useFetchGamesQuery } from "../../../features/games/gamesSlice";
import MyGamesSlider from "./MySwiper";
import { Search } from "lucide-react";


const Home = () => {

  const { data, isLoading, refetch: fetchGames } = useFetchGamesQuery();

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const myGames = data?.data || [];

  return (
    <>
      <section className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-[#101014] bg-opacity-20">
          <div className="flex align-center items-center mx-auto w-2/3 mt-5 mb-5 gap-6 bg-[#101014] px-4 py-2" >
            <div className="relative">
              <input
                type="text"
                placeholder="Search store"
                className="bg-[#202024] text-white px-4 py-2 rounded-full pl-10 outline-none w-60"
              />
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search />
              </span>
            </div>
            <nav className="flex gap-4  text-white">
              <a href="#" className="font-semibold">Discover</a>
              <a href="#" className="text-gray-400 hover:text-white">Browse</a>
              <a href="#" className="text-gray-400 hover:text-white">News</a>
            </nav>
          </div>

          <div>
            <div>
              {isLoading ? (
                <div className="bg-[#101014] min-h-screen py-8">
                  <div className="container mx-auto px-4">
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
                  </div>
                </div>
              ) : myGames.length > 0 ? (
                <MyGamesSlider games={myGames} />
              ) : (
                <p className="text-white">No games available</p>
              )}
            </div>
            <div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;