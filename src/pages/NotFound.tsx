import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button } from "react-bootstrap";

import { logout } from "../store/userSlice";
import style from "../styles/NotFound.module.scss";

const NotFound: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(logout());
  }, []);
  const handleLogout = () => {
    navigate("/login");
  };
  return (
    <div className={style.notFoundContainer}>
      <div className={style.eyes}>
        <div className={style.eye}></div>
        <div className={style.eye}></div>
      </div>
      <h1>Looks Like You're Lost</h1>
      <p>
        <strong>404 error</strong>
      </p>
      <Button onClick={handleLogout} className={style.homeButton}>
        Back To Login
      </Button>
    </div>
  );
};

export default NotFound;
