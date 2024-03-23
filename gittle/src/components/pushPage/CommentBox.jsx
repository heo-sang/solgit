import React from "react";
import styles from "./CommentBox.module.css";

function Box(props) {
  return (
    <div
      className={
        props.location === "local" ? styles.localBox : styles.remoteBox
      }
    >
      {props.location}
    </div>
  );
}

export default Box;
