import { useDispatch } from 'react-redux';
import './App.css'
import { AppDispatch } from './app/store';
import { useGetUserByIdQuery } from './features/user/usersSlice';
import AppRouter from './router'
import { useEffect } from 'react';
import { setCredentials } from './features/auth/authSlice';
import Cookies from "js-cookie";
import { HelmetProvider } from 'react-helmet-async';

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
      <HelmetProvider>
        <div className="App">
          <AppRouter />
        </div>
      </HelmetProvider>
    </>
  )
}

export default App
