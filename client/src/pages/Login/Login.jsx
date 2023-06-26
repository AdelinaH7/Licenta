import React, { useState } from "react";
import styles from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const history = useNavigate();

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await fetch("http://localhost:8080/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
        .then((response) => {
          if (response.ok) {
            localStorage.setItem("loggedIn", "da");
            return response.json();
          } else {
            throw new Error("Invalid email or password");
          }
        })
        .then((data) => {
          const userId = data.user.user_id;
          console.log("userId:" + userId);

          const isAdmin = data.user.isAdmin;
          console.log("isAdmin:", isAdmin); // Debugging statement

          localStorage.setItem("id", userId);
          localStorage.setItem("isAdmin", isAdmin);
        });
      //history("/profile");
      if (localStorage.getItem("isAdmin") === "true") {
        history("/admin");
      } else {
        history("/profile");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Welcome back!</h1>
      <form onSubmit={handleFormSubmit}>
        <label className={styles.formLabel}>
          Email
          <input
            className={styles.formInput}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        <label className={styles.formLabel}>
          Password
          <input
            className={styles.formInput}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        <span className={styles.error}>{error}</span>

        <button className={styles.button} type="submit">
          Log in
        </button>

        <Link to="/register" className={styles.link}>
          <p className={styles.already}>Don't have an account? Register here</p>
        </Link>
      </form>
    </div>
  );
}

export default Login;
