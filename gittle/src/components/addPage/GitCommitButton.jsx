import React, { useState } from "react";
import Modal from "../common/Modal";
import GitCommitPage from "./GitCommitPage";
import Button from "../common/Button";
import styles from "./GitCommitButton.module.css";

function GitCommitButton() {
  const [modalOpen, setModalOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };
  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div style={{ zIndex: 99 }}>
      <Button
        style={{
          borderColor: "#47b5ff",
          backgroundColor: isHovering ? "rgba(71, 181, 255, 0.8)" : "",
        }}
        content={"commit"}
        action={openModal}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      <Modal
        open={modalOpen}
        content={
          <>
            <div
              className={styles.closeBtn}
              onClick={closeModal}
              style={{
                cursor: "pointer",
                position: "relative",
                right: "3px",
              }}
            >
              x
            </div>
            <GitCommitPage style={{ width: "500px" }} modalClose={closeModal} />
          </>
        }
        style={{ width: "500px" }}
      ></Modal>
    </div>
  );
}

export default GitCommitButton;
