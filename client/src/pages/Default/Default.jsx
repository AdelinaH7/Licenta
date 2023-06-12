import React from "react";
import { Link } from "react-router-dom";
import styles from "./Default.module.css";

function Default() {
  return (
    <div className={styles.container}>
      <div className={styles.default}>
        <h1 className={styles.heading}>Welcome to Your Movie List</h1>

        <div className={styles.buttons}>
          <Link to="/register">
            <p className={styles.button}>Register</p>
          </Link>
          <Link to="/login">
            <p className={styles.button}>Log in</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Default;
