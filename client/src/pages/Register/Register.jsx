import React, { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./Register.module.css";
import { Link } from "react-router-dom";
import { useEffect } from "react";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthday, setBirthday] = useState(null);
  const [picture, setPicture] = useState(null);
  const [errors, setErrors] = useState({});
  const [isChecked, setIsChecked] = useState(false);

  function convertToBase64(file, callback) {
    const reader = new FileReader();

    reader.onloadend = () => {
      callback(reader.result);
    };

    reader.readAsDataURL(file);
  }

  useEffect(() => {
    if (picture != null) {
      const data = new FormData();
      data.append("file", picture);
      axios
        .post("http://localhost:8080/api/upload/", data, {
          // receive two    parameter endpoint url ,form data
        })
        .then((res) => {
          // then print response status
          console.log(res.statusText);
        });
    }
  }, [picture]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      try {
        convertToBase64(picture, async (base64String) => {
          console.log(base64String);
          const response = await axios.post("http://localhost:8080/api/user", {
            username,
            email,
            password,
            birthday,
            pictureName: base64String,
          });
          console.log(response.data);
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const validate = () => {
    const errors = {};
    if (!username.trim()) {
      errors.username = "Username is required";
    } else if (username.length < 3 || username.length > 20) {
      errors.username = "Username must be between 3 and 20 characters long";
    }
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Email is invalid";
    }
    if (!password.trim()) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    } else if (!/[A-Z]/.test(password)) {
      errors.password = "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(password)) {
      errors.password = "Password must contain at least one lowercase letter";
    } else if (!/\d/.test(password)) {
      errors.password = "Password must contain at least one number";
    } else if (!/[!@#$%^&*]/.test(password)) {
      errors.password =
        "Password must contain at least one special character (!@#$%^&*)";
    }
    if (!birthday) {
      errors.birthday = "Birthday is required";
    } else if (new Date().getFullYear() - birthday.getFullYear() < 18) {
      errors.birthday = "You must be 18 years or older to register";
    }
    return errors;
  };

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Register your account</h1>
      <form>
        <label className={styles.formLabel}>
          Username
          <input
            className={styles.formInput}
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          {errors.username && (
            <span className={styles.error}>{errors.username}</span>
          )}
        </label>

        <label className={styles.formLabel}>
          Email
          <input
            className={styles.formInput}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          {errors.email && <span className={styles.error}>{errors.email}</span>}
        </label>

        <label className={styles.formLabel}>
          Password
          <input
            className={styles.formInput}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {errors.password && (
            <span className={styles.error}>{errors.password}</span>
          )}
        </label>

        <label className={styles.formLabel}>
          Birthday
          <DatePicker
            className={styles.formInput}
            selected={birthday}
            onChange={(birthday) => setBirthday(birthday)}
          />
          {errors.birthday && (
            <span className={styles.error}>{errors.birthday}</span>
          )}
        </label>

        <div className={styles.formInput}>
          <label className={styles.formLabel}>
            Profile picture
            <input
              type="file"
              onChange={(event) => setPicture(event.target.files[0])}
            />
            {picture && (
              <img
                className={styles.picture}
                src={URL.createObjectURL(picture)}
              />
            )}
          </label>
        </div>

        <div className={styles.checkboxContainer}>
          <label className={styles.formLabel}>I agree with GDPR</label>
          <input
            className={styles.checkbox}
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
        </div>

        <button className={styles.button} onClick={handleSubmit}>
          Register
        </button>

        <Link to="/login" className={styles.link}>
          <p className={styles.already}>Already have an account? Login here</p>
        </Link>
      </form>
    </div>
  );
}

export default Register;
