import { useDispatch } from 'react-redux';
import './App.css'
import { AppDispatch } from './app/store';
import { useGetUserByIdQuery } from './features/user/usersSlice';
import AppRouter from './router'
import { useEffect } from 'react';
import { setCredentials } from './features/auth/authSlice';
import Cookies from "js-cookie";
import { motion } from "framer-motion";

function App() {
  const id = Cookies.get("id");
  const dispatch = useDispatch<AppDispatch>();
  const { data: currentUser, isSuccess } = useGetUserByIdQuery(id as string, { skip: !id });

  useEffect(() => {
    if (isSuccess && currentUser) {
      dispatch(setCredentials(currentUser));
    }
  }, [currentUser, isSuccess, dispatch]);

  return (
    <>
      <div className="App">
        <AppRouter />
      </div>
    </>
  )
}

export default App
