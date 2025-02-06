import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../../features/auth/authSlice";
import { AppDispatch, RootState } from "../../../app/store";
import { useEffect } from "react";
import { useGetUserByIdQuery } from "../../../features/user/usersSlice";
import Cookies from "js-cookie";

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

  const userData = useSelector((state: RootState) => state.auth.user?.data);

  return (
    <div>
      <h1>Home</h1>
      {userData ? (
        <div>
          <h2>Welcome, {userData.username}</h2>
          <p>Email: {userData.email}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Home;
