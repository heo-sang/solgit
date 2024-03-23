import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { faCircleInfo, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../Modal";
import styles from "./HelpGuide.module.css";

function HelpGuide(props) {
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [pathname, setPathName] = useState("/add");

  const showInfo = () => {
    setPathName(location.pathname);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  return (
    <div className={styles.container}>
      <FontAwesomeIcon
        icon={faQuestion}
        onClick={showInfo}
        className={styles.icon}
      />

      <Modal
        open={modalOpen}
        content={
          <>
            <p onClick={closeModal}>x</p>
            <div>
              {/* 구분용 */}
              {pathname.replace("/", "")} 페이지
              {pathname == "/add" ? (
                <img />
              ) : pathname === "/push" ? (
                <img />
              ) : pathname === "/merge/ready" ? (
                <img />
              ) : pathname === "/merge" ? (
                <img />
              ) : pathname === "merge/detail" ? (
                <img />
              ) : (
                // log
                <img />
              )}
            </div>
          </>
        }
        style={{ width: "95vw", height: "95vh" }}
      ></Modal>
    </div>
  );
}

export default HelpGuide;
