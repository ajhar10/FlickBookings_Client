import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";

const Login = () => {
  const [credential, setCredential] = useState({
    username: undefined,
    password: undefined,
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setCredential((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  const { loading, error, dispatch } = useContext(AuthContext);
  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post(
        "http://localhost:8800/api/auth/login",
        credential
      );
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      navigate("/");
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.res.data });
    }
  };

  return (
    <div className="login">
      <div className="login__container">
        <input
          type="text"
          placeholder="username"
          onChange={handleChange}
          id="username"
          className="login__input"
        />
        <input
          type="password"
          placeholder="password"
          onChange={handleChange}
          id="password"
          className="login__input"
        />
        <button
          disabled={loading}
          onClick={handleClick}
          type="button"
          className="login__button"
        >
          Login
        </button>
        {error && <span>{error.message}</span>}
      </div>
    </div>
  );
};

export default Login;
