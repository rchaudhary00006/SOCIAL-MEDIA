import React, { useRef, useEffect } from "react";
import Login from "./pages/login/Login";
import { Route, Routes } from "react-router-dom";
import Signup from "./pages/signup/Signup";
import Home from "./pages/home/Home";
import RequireUser from "./components/RequireUser";
import Feed from "./components/Feed/Feed";
import Profile from "./components/Profile/Profile";
import UpdateProfile from "./components/UpdateProfile/UpdateProfile";
import LoadingBar from "react-top-loading-bar";
import { useSelector } from "react-redux";
import OnlyIfLoggedIn from "./components/OnlyIfLoggedIn";
import toast, { Toaster } from "react-hot-toast";

export const TOAST_SUCCESS = "toast_success";
export const TOAST_FAILURE = "toast_failure";
function App() {
  const loadingRef = useRef(null);
  const isLoading = useSelector((state) => state.appConfigReducer.isLoading);
  const toastData = useSelector((state) => state.appConfigReducer.toastData);
  useEffect(() => {
    if (isLoading) {
      loadingRef.current?.continuousStart();
    } else {
      loadingRef.current?.complete();
    }
  }, [isLoading]);

  useEffect(() => {
    switch (toastData.type) {
      case TOAST_SUCCESS:
        // console.log("Post Liked");
        toast.success(toastData.message);
        break;
      case TOAST_FAILURE:
        toast.error(toastData.message);
        break;

   
    }
  }, [toastData]);
  return (
    <div className="App">
      <LoadingBar color="#000" ref={loadingRef} />
      <div><Toaster/></div>
      <Routes>
        {/* Agar user logged in nhi hai to wo home page pe nhi jaa skta ----> We are using Protected Routes Here */}
        <Route element={<RequireUser />}>
          <Route path="/" element={<Home />}>
            <Route path="/" element={<Feed />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/updateProfile" element={<UpdateProfile />} />
          </Route>
        </Route>
        <Route element={<OnlyIfLoggedIn />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
