import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("id");
    navigate("/login");
  };

  const isLoggedIn = localStorage.getItem("loggedIn") === "da";

  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <Link to="/">
          <p className={styles.title}>My Movie List</p>
        </Link>
        <div className={styles.buttons}>
          <Link to="/movies">
            <p className={styles.button}>Movies</p>
          </Link>
          <Link to="/shows">
            <p className={styles.button}>Shows</p>
          </Link>
          {isLoggedIn && (
            <Link to="/profile">
              <p className={styles.button}>Profile</p>
            </Link>
          )}
          {isLoggedIn && (
            <button className={styles.button} onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
