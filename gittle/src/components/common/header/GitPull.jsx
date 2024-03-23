import React, { useState } from "react";
import Button from "../Button";
import Modal from "../Modal";
import { useRecoilState } from "recoil";
import { currentBranch } from "../../../atoms";
import { useNavigate } from "react-router-dom";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./GitPull.module.css";

function GitPull() {
  const navigate = useNavigate();
  const [curBranch, setCurBranch] = useRecoilState(currentBranch);
  const [modalOpen, setModalOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [targetBranch, setTargetBranch] = useState("");
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const { ipcRenderer } = window.require("electron");
  const pullRequest = (targetBranch) => {
    const pull = ipcRenderer.sendSync(
      "gitPull",
      localStorage.getItem("currentRepo"),
      targetBranch
    );
    return pull;
  };
  const remoteBranches = ipcRenderer.sendSync(
    "remoteBranchList",
    localStorage.getItem("currentRepo")
  );

  const remoteBranchList = remoteBranches[0]
    .split("\n")
    .filter((branch) => branch)
    .filter((branch) => !branch.includes("->"))
    .filter((branch) => branch !== curBranch)
    .map((branch) => branch.trim())
    .map((branch) => branch.replace("origin/", ""));

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setListOpen(false);
    setTargetBranch("");
  };
  const showBranches = () => {
    setListOpen(!listOpen);
  };
  const getTargetBranch = (e) => {
    let branch = e.target.firstChild.data;
    setTargetBranch(branch);
  };

  const pullData = () => {
    pullRequest(targetBranch) === "error"
      ? setErrorModalOpen(true)
      : pullRequest(targetBranch);
    closeModal();
    setListOpen(false);
    setTargetBranch("");
  };

  const goCommit = () => {
    setErrorModalOpen(false);
    navigate("/add");
    setListOpen(false);
    setTargetBranch("");
  };
  const handleMouseEnter = () => {
    setIsHovering(true);
  };
  const handleMouseLeave = () => {
    setIsHovering(false);
  };
  return (
    <div>
      <Button
        action={openModal}
        content={"pull"}
        style={{
          border: "2px solid #ff6b6b",
          backgroundColor: isHovering ? "rgb(255, 107, 107, 0.8)" : "",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      <Modal
        style={{ height: "250px", width: "400px" }}
        open={modalOpen}
        content={
          <div className={styles.modal}>
            <div className={styles.container}>
              <div className={styles.selectorContainer}>
                <p className={styles.targetBranch} onClick={showBranches}>
                  {targetBranch ? `${targetBranch} 에서 ` : "pull해 올 branch "}
                  {listOpen ? (
                    <FontAwesomeIcon icon={faCaretUp} />
                  ) : (
                    <FontAwesomeIcon icon={faCaretDown} />
                  )}
                  <div
                    className={
                      listOpen
                        ? `${styles.selector} ${styles.openList}`
                        : `${styles.list}`
                    }
                  >
                    {remoteBranchList.map((branch, idx) => (
                      <div onClick={getTargetBranch} key={idx}>
                        <div className={styles.branch}>{branch}</div>
                      </div>
                    ))}
                  </div>
                </p>
              </div>

              <div className={styles.curBranch}>
                {curBranch} <span>{targetBranch ? "(으)로" : ""}</span>
              </div>
            </div>
            <div className={styles.buttonContainer}>
              <Button action={pullData} content={"pull 받기"} />
              <Button
                action={closeModal}
                content={"취소"}
                style={{ border: "1px solid #7B7B7B" }}
              />
            </div>
          </div>
        }
      ></Modal>
      <Modal
        open={errorModalOpen}
        content={
          <>
            <div>
              <p>변경사항이 있으면 pull 받을 수 없습니다.</p>
              <p>먼저 commit해주세요</p>
            </div>
            <div className={styles.buttonContainer}>
              <button
                className={styles.goToCommit}
                onClick={goCommit}
                style={{ backgroundColor: "#6BCC78", color: "white" }}
              >
                commit하러 가기
              </button>
            </div>
          </>
        }
      ></Modal>
    </div>
  );
}

export default GitPull;
