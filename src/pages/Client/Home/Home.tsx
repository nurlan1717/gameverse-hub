import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../../features/auth/authSlice";
import { AppDispatch, RootState } from "../../../app/store";
import { useEffect } from "react";
import { useGetUserByIdQuery } from "../../../features/user/usersSlice";
import Cookies from "js-cookie";
import game from "../../../assets/images/statics/gamepult.png"
import TrendingGames from "./Trendinggames";

const Home = () => {
  const id = Cookies.get("id");
  const dispatch = useDispatch<AppDispatch>();
  const { data: currentUser, isSuccess } = useGetUserByIdQuery(id as string, {
    skip: !id,
  });
  useEffect(() => {
    if (isSuccess && currentUser) {
      dispatch(setCredentials(currentUser));
    }
  }, [currentUser, isSuccess, dispatch]);


  // const userData = useSelector((state: RootState) => state.auth.user?.data);

  return (
    <>
      <section className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center text-white">


        <div className="absolute inset-0 bg-[#070320] bg-opacity-20">
          <div
            className="absolute inset-0 bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url(${game})`, backgroundSize: "contain", backgroundRepeat: "no-repeat" }}

          ></div>
        </div>

        <div className="flex-c align-start text-start relative z-10 w-full px-6 md:px-16">
          <p className="text-yellow-400 font-semibold">GameVerse Hub</p>
          <h2 className="text-4xl md:text-5xl font-bold mt-2">
            Work that we <br /> produce for <span className="text-blue-300">our clients</span>
          </h2>
          <p className="text-gray-300 mt-4 w-1/2">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            Lorem Ipsum has been the industry's standard.
          </p>
          <button className="mt-6 px-6 py-3 bg-red-500 hover:bg-red-600 rounded-full text-white font-semibold transition duration-300">
            Get more details
          </button>
        </div>
      </section >
      <section>
        <TrendingGames />
      </section>
      </>
  );
};

export default Home;
