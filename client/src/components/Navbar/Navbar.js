import React from "react";
import Avatar from "../Avatar/Avatar";
import "./Navbar.scss";
import { useNavigate } from "react-router-dom";
import { AiOutlineLogout } from "react-icons/ai";
import {  useSelector } from "react-redux";
import { axiosClient } from "../../utils/axiosClient";
import { KEY_ACCESS_TOKEN } from "../../utils/localStorageManager";

const Navbar = () => {
  const navigate = useNavigate();

  const myProfile = useSelector((state) => state.appConfigReducer.myProfile);


  async function handleLogoutClick() {
    try {
      await axiosClient.post("/auth/logout");
      localStorage.removeItem(KEY_ACCESS_TOKEN);
      navigate('/login')
      
    } catch (error) {
      
    }
  }

  return (
    <>
      <div className="Navbar">
        <div className="container">
          <h2 className="banner hover-link" onClick={() => navigate("/")}>
            Social Media
          </h2>
          <div className="right-side">
            <div
              className="profile hover-link"
              onClick={() => navigate(`/profile/${myProfile?._id}`)}
            >
              <Avatar src={myProfile?.avatar?.url} className="nav-img" />
            </div>
            <div className="logout hover-link">
              <AiOutlineLogout onClick={handleLogoutClick} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
