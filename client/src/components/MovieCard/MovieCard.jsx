import React, { useState, useEffect } from "react";
import styles from "./MovieCard.module.css";
import { Buffer } from "buffer";

function MovieCard() {
  const [movies, setMovies] = useState([]);
  const [scores, setScores] = useState({});
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieResponse = await fetch(
          `http://localhost:8080/api/juncMovie/movies/${localStorage.getItem(
            "id"
          )}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!movieResponse.ok) {
          throw new Error("Failed to fetch movie data");
        }

        const scoreResponse = await fetch(
          `http://localhost:8080/api/juncMovie/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!scoreResponse.ok) {
          throw new Error("Failed to fetch score data");
        }

        const movieData = await movieResponse.json();
        const scoreData = await scoreResponse.json();

        const updatedScores = scoreData.reduce((acc, scoreItem) => {
          acc[scoreItem.movie_id] = scoreItem.score;
          return acc;
        }, {});

        const updatedMovies = movieData.map((movie) => {
          if (movie.picture && movie.picture.data) {
            const base64String = Buffer.from(movie.picture.data).toString(
              "utf8"
            );
            return { ...movie, picture: base64String };
          } else {
            return movie;
          }
        });

        const updatedFavorites = movieData.reduce((acc, movieItem) => {
          acc[movieItem.movie_id] = movieItem.isFavourite;
          return acc;
        }, {});

        setMovies(updatedMovies);
        setScores(updatedScores);
        setFavorites(updatedFavorites);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const updateFavoriteStatus = async (movieId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/juncMovie/${localStorage.getItem(
          "id"
        )}/${movieId}/favorite`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isFavourite: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update favorite status");
      }
      console.log("Favorite status updated successfully:", movieId, newStatus);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFavoriteStatusChange = async (movieId, newStatus) => {
    updateFavoriteStatus(movieId, newStatus);
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [movieId]: newStatus,
    }));
  };

  const deleteMovie = async (movieId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/juncMovie/${localStorage.getItem(
          "id"
        )}/${movieId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete movie");
      }

      setMovies((prevMovies) =>
        prevMovies.filter((movie) => movie.movie_id !== movieId)
      );
      console.log("Movie deleted successfully:", movieId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleScoreChange = async (event, movieId) => {
    const newScore = parseInt(event.target.value, 10);
    setScores((prevScores) => ({ ...prevScores, [movieId]: newScore }));
    updateScore(movieId, newScore);
  };

  const handleUnwatched = async (movieId) => {
    deleteMovie(movieId);
  };

  const updateScore = async (movieId, newScore) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/juncMovie/${localStorage.getItem(
          "id"
        )}/${movieId}/score`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ score: newScore }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update score");
      }
      console.log("Score updated successfully:", movieId, newScore);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      {movies.map((movie) => (
        <MovieItem
          key={movie.movie_id}
          movie={movie}
          isFavorite={favorites[movie.movie_id] || false}
          score={scores[movie.movie_id] || ""}
          onScoreChange={handleScoreChange}
          onFavoriteStatusChange={handleFavoriteStatusChange}
          onUnwatched={handleUnwatched}
        />
      ))}
    </div>
  );
}

function MovieItem({
  movie,
  score,
  isFavorite,
  onScoreChange,
  onUnwatched,
  onFavoriteStatusChange,
  onFavoriteChange,
}) {
  const { movie_id, name, picture } = movie;

  return (
    <div className={styles.card}>
      <img src={picture} alt={name} className={styles.image} />
      <h2 className={styles.title}>{name}</h2>
      <div className={styles.buttons}>
        <button
          className={styles.buttonUnwatched}
          onClick={() => onUnwatched(movie_id)}
        >
          Unwatched
        </button>
        <button
          className={styles.buttonFavorite}
          onClick={() => onFavoriteStatusChange(movie_id, !isFavorite)}
        >
          {isFavorite ? "Unfavorite" : "Favorite"}
        </button>
      </div>
      <select
        className={styles.selected}
        value={score}
        onChange={(event) => onScoreChange(event, movie_id)}
      >
        <option value="">Select score</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
      </select>
      <div>Your score: {score}</div>
    </div>
  );
}

export default MovieCard;
