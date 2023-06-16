import React, { useState, useEffect } from "react";
import styles from "./Profile.module.css";
import { Link } from "react-router-dom";
import childe from "../../assets/childe.jpg";
import { Buffer } from "buffer";

function Profile() {
  const [userData, setUserData] = useState({});
  const [profilePicture, setProfilePicture] = useState("");
  const [lastMovieUpdates, setLastMovieUpdates] = useState([]);
  const [lastShowUpdates, setLastShowUpdates] = useState([]);

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
        setLastMovieUpdates(data.slice(-3)); // Get the last three movies
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
        setLastShowUpdates(data.slice(-3)); // Get the last three shows
      } catch (err) {
        console.log(err);
      }
    };

    fetchUserData();
    fetchLastMovieUpdates();
    fetchLastShowUpdates();
  }, []);

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
                <span className={styles.username}>{userData.username}</span>
              </li>
              <li>
                <span>Birthday: </span>
                <span>{userData.birthday}</span>
              </li>
              <li>
                <span>Gender: </span>
                <span>to do</span>
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
            <img className={styles.banner} src={childe} alt="Banner"></img>
          </div>
          <div className={styles.userStatisticsContainer}>
            <h2>Statistics</h2>
            <div className={styles.userStatisticsFirst}>
              <div className={styles.statsMoviesOrShows}>
                <h3>Movie Stats</h3>
                <div className={styles.statScore}>
                  <span>Days:</span>
                  <span>Mean Score:</span>
                </div>
                <div className={styles.statGraph}></div>
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
                  <span>Days: </span>
                  <span>Mean Score: </span>
                </div>
                <div className={styles.statGraph}></div>
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

          <div className={styles.favoritesContainer}>
            <h2>Favorites</h2>
            <h3>Movies</h3>
            <div className={styles.favSlide}></div>
            <h3>Shows</h3>
            <div className={styles.favSlide}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
