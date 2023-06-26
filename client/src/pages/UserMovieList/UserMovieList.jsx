import React from "react";
import MovieCard from "../../components/MovieCard/MovieCard";
import styles from "./UserMovieList.module.css";

function UserMovieList() {
  return (
    <div className={styles.container}>
      UserMovieList
      <MovieCard />
    </div>
  );
}

export default UserMovieList;
