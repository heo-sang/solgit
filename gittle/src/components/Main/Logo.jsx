import React from "react";
import styles from "./Logo.module.css";
function logo() {
  return (
    <div className={styles.logo}>
      <img
        class="gittle_logo"
        src={process.env.PUBLIC_URL + "/gittle_logo.png"}
        alt="gittle-Logo"
      />
    </div>
  );
}

export default logo;
