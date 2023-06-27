import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faEdit } from "@fortawesome/free-solid-svg-icons";

import styles from "./Profile.module.css";
import { Link } from "react-router-dom";
import { Buffer } from "buffer";
import logo from "../../assets/logo.png";

function Profile() {
  const [userData, setUserData] = useState({});
  const [profilePicture, setProfilePicture] = useState("");
  const [lastMovieUpdates, setLastMovieUpdates] = useState([]);
  const [totalDurationDays, setTotalDurationDays] = useState(0);
  const [lastShowUpdates, setLastShowUpdates] = useState([]);
  const [totalEpisodesWatched, setTotalEpisodesWatched] = useState(0);
  const [updatedUsername, setUpdatedUsername] = useState("");
  const [editingUsername, setEditingUsername] = useState(false);
  const [meanScore, setMeanScore] = useState(0);
  const [totalMovies, setTotalMovies] = useState(0);
  const [totalShows, setTotalShows] = useState(0);
  const [meanScoreShows, setMeanScoreShows] = useState(0);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [favoriteShows, setFavoriteShows] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/user/${localStorage.getItem("id")}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        const base64String = Buffer.from(data.picture.data).toString("utf8");
        setProfilePicture(base64String);
        setUserData(data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchLastMovieUpdates = async () => {
      try {
        const userId = localStorage.getItem("id");
        const response = await fetch(
          `http://localhost:8080/api/juncMovie/movies/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setLastMovieUpdates(data.slice(-3));

        // Calculate total duration in minutes
        const totalDurationMinutes = data.reduce(
          (acc, movie) => acc + movie.duration,
          0
        );
        // Convert total duration to days
        const totalDurationDays = Math.floor(totalDurationMinutes / 1440); // Assuming 1 day = 1440 minutes
        setTotalDurationDays(totalDurationDays); // Set the total duration in days state
      } catch (err) {
        console.log(err);
      }
    };

    const fetchLastShowUpdates = async () => {
      try {
        const userId = localStorage.getItem("id");
        const response = await fetch(
          `http://localhost:8080/api/juncShow/shows/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setLastShowUpdates(data.slice(-3));
        // Calculate total number of episodes watched
        const totalEpisodesWatched = data.reduce(
          (acc, show) => acc + show.episodes,
          0
        );
        setTotalEpisodesWatched(totalEpisodesWatched);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchMeanScore = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/juncMovie", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        const userId = parseInt(localStorage.getItem("id"), 10); // Convert to number
        const userMovies = data.filter((movie) => movie.user_id === userId);
        const favoriteMovies = userMovies.filter((movie) => movie.isFavourite);
        const scores = userMovies.map((movie) => movie.score);
        const sum = scores.reduce((acc, score) => acc + score, 0);
        const mean = scores.length > 0 ? sum / scores.length : 0;
        const totalMovies = userMovies.length;
        console.log(favoriteMovies);

        setMeanScore(mean);
        setFavoriteMovies(favoriteMovies);
        setTotalMovies(totalMovies);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchMeanScoreShows = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/juncShow", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        const userId = parseInt(localStorage.getItem("id"), 10); // Convert to number
        const userShows = data.filter((show) => show.user_id === userId);
        const scores = userShows.map((show) => show.score);
        const sum = scores.reduce((acc, score) => acc + score, 0);
        const mean = scores.length > 0 ? sum / scores.length : 0;
        const totalShows = userShows.length;

        setMeanScoreShows(mean);
        setTotalShows(totalShows);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchFavoriteShows = async () => {
      try {
        const userId = localStorage.getItem("id");
        const response = await fetch(`http://localhost:8080/api/juncShow`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        const favoriteShows = data.filter(
          (show) => show.user_id === userId && show.isFavourite
        );
        setFavoriteShows(favoriteShows);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUserData();
    fetchLastMovieUpdates();
    fetchLastShowUpdates();
    fetchMeanScore();
    fetchMeanScoreShows();
    fetchFavoriteShows();
  }, []);

  const handleUsernameClick = () => {
    setEditingUsername(true);
  };

  const handleUsernameChange = (e) => {
    setUpdatedUsername(e.target.value);
  };

  const handleUsernameUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/user/${localStorage.getItem("id")}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: updatedUsername }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setUpdatedUsername("");
        setEditingUsername(false);
      } else {
        console.log("Username update failed");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.content}>
      <div className={styles.container}>
        <div className={styles.containerLeft}>
          <div className={styles.userProfile}>
            <div className={styles.userImage}>
              <img
                className={styles.profilePic}
                src={profilePicture}
                alt="Profile"
              ></img>
            </div>
            <ul className={styles.status}>
              <li>
                {editingUsername ? (
                  <div className={styles.usernameUpdate}>
                    <input
                      type="text"
                      value={updatedUsername}
                      onChange={handleUsernameChange}
                      className={styles.usernameInput}
                    />
                    <button
                      onClick={handleUsernameUpdate}
                      className={styles.updateButton}
                    >
                      <FontAwesomeIcon
                        icon={faSave}
                        className={styles.updateIcon}
                      />
                    </button>
                  </div>
                ) : (
                  <span className={styles.title}>
                    {userData.username}
                    <button
                      className={styles.editButton}
                      onClick={handleUsernameClick}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  </span>
                )}
              </li>

              <li>
                <span>{userData.birthday}</span>
              </li>
            </ul>
            <div className={styles.buttons}>
              <Link to="/myMovies">
                <p className={styles.button}>Movie List</p>
              </Link>
              <Link to="/myShows">
                <p className={styles.button}>Show List</p>
              </Link>
            </div>
          </div>
        </div>
        <div className={styles.containerRight}>
          <div className={styles.aboutMe}>
            <img className={styles.banner} src={logo} alt="Banner"></img>
          </div>
          <div className={styles.userStatisticsContainer}>
            <h2>Statistics</h2>
            <div className={styles.userStatisticsFirst}>
              <div className={styles.statsMoviesOrShows}>
                <h3>Movie Stats</h3>
                <div className={styles.statScore}>
                  <span>Total Movies: {totalMovies}</span>
                  <span>Days Watched: {totalDurationDays}</span>
                  <span>Mean Score: {meanScore.toFixed(2)}</span>
                </div>
              </div>
              <div className={styles.updatesMoviesOrShows}>
                <h3>Last Movies Updates</h3>
                <ul>
                  {lastMovieUpdates.map((movie) => (
                    <li key={movie.movie_id}>{movie.name}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={styles.userStatisticsSecond}>
              <div className={styles.statsMoviesOrShows}>
                <h3>Shows Stats</h3>
                <div className={styles.statScore}>
                  <span>Total Shows: {totalShows}</span>
                  <span>Episodes Watched: {totalEpisodesWatched}</span>
                  <span>Mean Score: {meanScoreShows.toFixed(2)}</span>
                </div>
              </div>
              <div className={styles.updatesMoviesOrShows}>
                <h3>Last Shows Updates</h3>
                <ul>
                  {lastShowUpdates.map((show) => (
                    <li key={show.show_id}>{show.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
