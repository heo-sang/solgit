import React, { useState } from "react";
import { useRecoilState } from "recoil";
import Button from "../Button";
import Modal from "../Modal";
import { currentBranch, deleteBtn } from "../../../atoms";
import styles from "./DeleteBranch.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function DeleteBranch(props) {
  const { branch } = props;

  const [curBranch, setCurBranch] = useRecoilState(currentBranch);
  const [isDelete, setIsDelete] = useRecoilState(deleteBtn);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentErrorModalOpen, setCurrentErrorModalOpen] = useState(false);

  const { ipcRenderer } = window.require("electron");
  const currentRepo = localStorage.getItem("currentRepo");

  const deleteLocalBranches = (branch) => {
    const deletebranch = ipcRenderer.sendSync(
      "deleteLocalBranch",
      currentRepo,
      branch
    );
    return deletebranch;
  };

  const deleteRemoteBranches = (branch) => {
    ipcRenderer.sendSync("deleteRemoteBranch", currentRepo, branch);
  };

  const openModal = () => {
    branch === curBranch ? setCurrentErrorModalOpen(true) : setModalOpen(true);
  };

  const closeModal = () => {
    branch === curBranch
      ? setCurrentErrorModalOpen(false)
      : setModalOpen(false);
  };

  const branchDeleter = () => {
    branch.includes("origin/")
      ? deleteRemoteBranches(branch.replace("origin/", ""))
      : deleteLocalBranches(branch);
    setIsDelete(true);
    closeModal();
  };
  setIsDelete(false);

  return (
    <>
      <FontAwesomeIcon
        icon={faTrash}
        className={styles.icon}
        onClick={openModal}
      />

      <Modal
        open={modalOpen}
        content={
          <>
            <p>
              <span className={styles.branchName}>{branch}</span> branch를
              정말로 삭제하시겠습니까?
            </p>
            <p>(삭제한 branch는 복구가 불가능합니다.)</p>
          </>
        }
      >
        <div className={styles.buttonContainer}>
          <Button
            action={branchDeleter}
            content={"예"}
            // style={{ backgroundColor: "#6BCC78" }}
          />
          <Button
            action={closeModal}
            content={"아니오"}
            style={{ border: "1px solid #7B7B7B" }}
          />
        </div>
      </Modal>
      <Modal
        open={currentErrorModalOpen}
        content={
          <>
            <p>현재 브랜치는 삭제할 수 없습니다.</p>
          </>
        }
      >
        <div className={styles.buttonContainer}>
          <Button
            action={closeModal}
            content={"돌아가기"}
            style={{ backgroundColor: "#6BCC78" }}
          />
        </div>
      </Modal>
    </>
  );
}

export default DeleteBranch;
