import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Fragment, useContext, useEffect, useState } from "react";
import axios from "axios";
import "./assets/App.css";
import MovieList from "./pages/MovieList/MovieList";
import ShowList from "./pages/ShowList/ShowList";
import Profile from "./pages/Profile/Profile";
import Navbar from "./components/Navbar/Navbar";
import Default from "./pages/Default/Default";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <div className="app">
      <Router>
        <Fragment>
          <Navbar />
          <Routes>
            <Route path="/movies" element={<MovieList />} />
            <Route path="/shows" element={<ShowList />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="/" element={<Default />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
          <Footer />
        </Fragment>
      </Router>
    </div>
  );
}

export default App;
