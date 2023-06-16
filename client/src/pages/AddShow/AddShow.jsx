import React, { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./AddShow.module.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AddShow() {
  const [name, setName] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseDate, setReleaseDate] = useState(null);
  const [episodes, setEpisodes] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [picture, setPicture] = useState(null);
  const navigate = useNavigate();

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
      axios.post("http://localhost:8080/api/upload/", data, {}).then((res) => {
        console.log(res.statusText);
      });
    }
  }, [picture]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      convertToBase64(picture, async (base64String) => {
        console.log(base64String);
        const response = await axios.post("http://localhost:8080/api/show", {
          name,
          genre,
          releaseDate,
          episodes,
          synopsis,
          pictureName: base64String,
        });
        console.log(response.data);
        navigate("/admin");
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Add Show</h1>
      <form className={styles.form}>
        <label className={styles.formLabel}>
          Name:
          <input
            className={styles.formInput}
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>

        <label className={styles.formLabel}>
          Genre:
          <input
            className={styles.formInput}
            type="text"
            value={genre}
            onChange={(event) => setGenre(event.target.value)}
          />
        </label>

        <label className={styles.formLabel}>
          Release Date:
          <DatePicker
            className={styles.formInput}
            selected={releaseDate}
            onChange={(date) => setReleaseDate(date)}
          />
        </label>

        <label className={styles.formLabel}>
          Number of episodes:
          <input
            className={styles.formInput}
            type="text"
            value={episodes}
            onChange={(event) => setEpisodes(event.target.value)}
          />
        </label>

        <label className={styles.formLabel}>
          Synopsis:
          <input
            className={styles.formInput}
            type="text"
            value={synopsis}
            onChange={(event) => setSynopsis(event.target.value)}
          />
        </label>

        <label className={styles.formLabel}>
          Picture:
          <input
            className={styles.formInput}
            type="file"
            onChange={(event) => setPicture(event.target.files[0])}
          />
        </label>

        <button className={styles.button} onClick={handleSubmit}>
          Add a show
        </button>
      </form>
    </div>
  );
}

export default AddShow;
