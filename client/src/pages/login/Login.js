import React, { useState } from "react";
import "./Login.scss";
import { Link, useNavigate } from "react-router-dom";
import { axiosClient } from "../../utils/axiosClient";
import { KEY_ACCESS_TOKEN } from "../../utils/localStorageManager";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const result = await axiosClient.post("/auth/login", {
        email,
        password,
      });
      localStorage.setItem(KEY_ACCESS_TOKEN , result.data.result.accessToken);
      navigate('/'); //After login navigating to the home page
      // console.log(result);

    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="Login">
      <div className="login-box">
        <h2 className="heading">Login</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <input type="submit" className="submit" />
        </form>
        <p className="subheading">
          Do not have an account?<Link to={"/signup"}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
