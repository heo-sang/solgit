import React, { useState, useEffect } from "react";
import styles from "./Push.module.css";
import { faCodeBranch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Push(props) {
  const repoRoot = localStorage.getItem("currentRepo");

  const { ipcRenderer } = window.require("electron");
  const [branchArr, setBranchArr] = useState([]);
  const [selected, setSelected] = useState("");
  const [actived, setActived] = useState(-1);

  const gitBranch = () => {
    setBranchArr(ipcRenderer.sendSync("git-Branch", repoRoot));
  };

  useEffect(() => {
    gitBranch();
  }, []);

  return (
    <div className={styles.box}>
      <div className={styles.title}>branches</div>
      <div className={styles.push}>
        {branchArr.map((item, idx) => (
          <div
            key={idx}
            className={
              idx === actived ? styles.activeBranchBox : styles.branchBox
            }
            onClick={() => {
              setActived(idx);
              setSelected(item);
              props.changeBranch(item);
            }}
          >
            <FontAwesomeIcon icon={faCodeBranch} className={styles.icon} />
            <div>{item}</div>
          </div>
        ))}
      </div>
      <div className={styles.selected}>{selected}</div>
    </div>
  );
}

export default Push;
