import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCodeMerge,
  faListCheck,
  faPlus,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./MenuBar.module.css";

function MenuBar() {
  const location = useLocation().pathname;
  const navigate = useNavigate();

  const [openMerge, setOpenMerge] = useState(false);
  const openMergeMenu = () => setOpenMerge(!openMerge);

  return (
    <div className={styles.container}>
      <div className={styles.orderContainer}>
        <div
          className={
            location === "/add"
              ? `${styles.button} ${styles.clicked}`
              : `${styles.button}`
          }
          onClick={() => navigate("/add")}
        >
          <FontAwesomeIcon icon={faPlus} />
          <p>Add</p>
        </div>
        <div
          className={
            location === "/push"
              ? `${styles.button} ${styles.clicked}`
              : `${styles.button}`
          }
          onClick={() => navigate("/push")}
        >
          <FontAwesomeIcon icon={faUpload} />
          <p>Push</p>
        </div>
        {/* <div className={styles.merge} onClick={openMergeMenu}> */}
        <div
          className={
            location === "/merge/ready"
              ? `${styles.button} ${styles.clicked}`
              : `${styles.button}`
          }
          onClick={() => navigate("/merge/ready")}
        >
          <FontAwesomeIcon icon={faCodeMerge} />
          <p>Merge</p>
        </div>
      </div>
      <div
        className={
          location === "/merge/request"
            ? `${styles.button} ${styles.merge} ${styles.clicked}`
            : `${styles.button} ${styles.merge} `
        }
        onClick={() => navigate("/merge/request")}
      >
        <FontAwesomeIcon icon={faListCheck} />
        <p>Merge Request</p>
      </div>
      {/* <div>
        {openMerge ? (
          <div className={styles.mergeMenu}>
            <div
              className={
                location === "/merge/ready" ? `${styles.clicked}` : null
              }
              onClick={() => navigate("/merge/ready")}
            >
              Merge
            </div>
            <div
              className={
                location === "/merge/ready" ? `${styles.clicked}` : null
              }
              onClick={() => navigate("/merge/request")}
            >
              Merge Request
            </div>
          </div>
        ) : null}
      </div> */}
    </div>
  );
}

export default MenuBar;
