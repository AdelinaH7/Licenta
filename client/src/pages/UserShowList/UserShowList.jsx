import React from "react";
import ShowCard from "../../components/ShowCard/ShowCard";
import styles from "./UserShowList.module.css";

function UserShowList() {
  return (
    <div className={styles.container}>
      UserShowList
      <ShowCard />
    </div>
  );
}

export default UserShowList;
