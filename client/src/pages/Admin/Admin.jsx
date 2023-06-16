import { React, useState, useEffect } from "react";
import styles from "./Admin.module.css";
import { Link, useNavigate } from "react-router-dom";
import { Buffer } from "buffer";

function Admin() {
  const [userData, setUserData] = useState({});
  const [profilePicture, setProfilePicture] = useState("");
  const [users, setUsers] = useState([]);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [showAdmins, setShowAdmins] = useState(false);
  const [showNonAdmins, setShowNonAdmins] = useState(false);
  const history = useNavigate();

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
    fetchUserData();
  }, []);

  useEffect(() => {
    // Check isAdmin status and redirect if not an admin
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (!isAdmin) {
      history("/profile");
    } else {
      fetchUsers();
    }
  }, [history]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setUsers(data);
      setShowAllUsers(true); // Set showAllUsers to true when fetching users
    } catch (err) {
      console.log(err);
    }
  };

  const deleteUser = async (userId, username) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the user ${username}?`
    );
    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/user/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        fetchUsers();
      } else {
        console.log("Failed to delete user");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const makeUserAdmin = async (userId, username) => {
    const confirmMakeAdmin = window.confirm(
      `Are you sure you want to make ${username} an admin?`
    );
    if (!confirmMakeAdmin) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isAdmin: true }),
      });
      if (response.ok) {
        // User is now an admin, update the users list
        fetchUsers();
      } else {
        console.log("Failed to make user admin");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const removeUserAdmin = async (userId, username) => {
    const confirmRemoveAdmin = window.confirm(
      `Are you sure you want to remove admin privileges from ${username}?`
    );
    if (!confirmRemoveAdmin) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isAdmin: false }),
      });
      if (response.ok) {
        // Admin privileges removed, update the users list
        fetchUsers();
      } else {
        console.log("Failed to remove user admin privileges");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const filteredUsers = showAllUsers
    ? users
    : showAdmins
    ? users.filter((user) => user.isAdmin)
    : showNonAdmins
    ? users.filter((user) => !user.isAdmin)
    : [];

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
              <Link to="/add-movie">
                <p className={styles.button}>Add Movie</p>
              </Link>
              <Link to="/add-show">
                <p className={styles.button}>Add Show</p>
              </Link>
            </div>
          </div>
        </div>
        <div className={styles.containerRight}>
          <h2>All Users</h2>
          <div className={styles.filterButtons}>
            <button
              className={`${styles.filterButton} ${
                showAllUsers ? styles.activeFilter : ""
              }`}
              onClick={() => {
                setShowAllUsers(true);
                setShowAdmins(false);
                setShowNonAdmins(false);
              }}
            >
              All Users
            </button>
            <button
              className={`${styles.filterButton} ${
                showNonAdmins ? styles.activeFilter : ""
              }`}
              onClick={() => {
                setShowNonAdmins(true);
                setShowAdmins(false);
                setShowAllUsers(false);
              }}
            >
              Non-Admin Users
            </button>
            <button
              className={`${styles.filterButton} ${
                showAdmins ? styles.activeFilter : ""
              }`}
              onClick={() => {
                setShowAdmins(true);
                setShowNonAdmins(false);
                setShowAllUsers(false);
              }}
            >
              Admin Users
            </button>
          </div>
          {filteredUsers.length > 0 ? (
            <table className={styles.usersTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Admin</th>
                  <th>Delete</th>
                  <th>Privileges</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.user_id}>
                    <td>{user.user_id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.isAdmin ? "Yes" : "No"}</td>
                    <td>
                      <button
                        className={styles.deleteButton}
                        onClick={() => deleteUser(user.user_id, user.username)}
                      >
                        Delete
                      </button>
                    </td>
                    <td>
                      {user.isAdmin ? (
                        <button
                          className={styles.removeAdminButton}
                          onClick={() =>
                            removeUserAdmin(user.user_id, user.username)
                          }
                        >
                          Remove Admin
                        </button>
                      ) : (
                        <button
                          className={styles.makeAdminButton}
                          onClick={() =>
                            makeUserAdmin(user.user_id, user.username)
                          }
                        >
                          Make Admin
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;
