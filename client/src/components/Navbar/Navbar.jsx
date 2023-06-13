import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("id");
    localStorage.removeItem("isAdmin");
    navigate("/login");
  };

  const isLoggedIn = localStorage.getItem("loggedIn") === "da";
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <Link to="/">
          <p className={styles.title}>
            {isAdmin ? (
              <>
                My Movie List's <span className={styles.adminText}>Admin</span>
              </>
            ) : (
              "My Movie List"
            )}
          </p>
        </Link>
        <div className={styles.buttons}>
          <Link to="/movies">
            <p className={styles.button}>Movies</p>
          </Link>
          <Link to="/shows">
            <p className={styles.button}>Shows</p>
          </Link>
          {isLoggedIn && (
            <Link to={isAdmin ? "/admin" : "/profile"}>
              <p className={styles.button}>
                {isAdmin ? "Admin Page" : "Profile"}
              </p>
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
