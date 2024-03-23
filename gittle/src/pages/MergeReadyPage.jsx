import React from "react";
import Local from "../components/mergeReadyPage/Local";
import Remote from "../components/mergeReadyPage/Remote";
import styles from "./MergeReadyPage.module.css";

function MergeReadyPage() {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <Local />
        <Remote />
      </div>
    </div>
  );
}

export default MergeReadyPage;
