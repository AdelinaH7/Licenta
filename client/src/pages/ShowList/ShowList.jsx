import React from "react";
import ItemListShow from "../../components/ItemListShow/ItemListShow";
import styles from "./ShowList.module.css";

function ShowList() {
  return (
    <div className={styles.content}>
      <ItemListShow />
    </div>
  );
}

export default ShowList;
