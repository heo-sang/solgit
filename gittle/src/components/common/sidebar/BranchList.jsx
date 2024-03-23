import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  currentBranch,
  selectBranch,
  commandLine,
  createBtn,
  deleteBtn,
} from "../../../atoms";
import LogCheck from "./LogCheck";

import DeleteBranch from "./DeleteBranch";
import Modal from "../Modal";
import Button from "../Button";
import { useNavigate } from "react-router-dom";
import {
  faCodeBranch,
  faCaretDown,
  faCaretUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./BranchList.module.css";

function BranchList() {
  const navigate = useNavigate();
  const [curBranch, setCurBranch] = useRecoilState(currentBranch);
  const [selectedBranch, setSelectedBranch] = useRecoilState(selectBranch);
  const [cmd, SetCmd] = useRecoilState(commandLine);
  const [isDelete, setIsDelete] = useRecoilState(deleteBtn);
  const [isCreate, setIsCreate] = useRecoilState(createBtn);
  const [localBranches, setLocalBranches] = useState([]);
  const [localListOpen, setLocalListOpen] = useState(false);
  const [remoteListOpen, setRemoteListOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);

  const { ipcRenderer } = window.require("electron");
  const currentRepo = localStorage.getItem("currentRepo");

  const localBranchList = ipcRenderer.sendSync("localBranchList", currentRepo);

  // setCurBranch(ipcRenderer.sendSync("gitBranch", currentRepo));
  const getCurBranch = () => {
    setCurBranch(ipcRenderer.sendSync("gitBranch", currentRepo));
  };

  const getLocalBranches = () => {
    const local = localBranchList[0]
      .split("\n")
      .filter((branch) => branch)
      .map((branch) => branch.trim())
      .map((branch) =>
        branch.includes("*") ? branch.replace("* ", "") : branch
      );
    setLocalBranches(local);
  };

  useEffect(() => {
    getCurBranch();
  }, [localBranches]);
  useEffect(() => {
    getLocalBranches();
  }, [isDelete, isCreate]);
  const remoteBranches = ipcRenderer.sendSync("remoteBranchList", currentRepo);

  const remoteBranchList = remoteBranches[0]
    .split("\n")
    .filter((branch) => branch)
    .filter((branch) => !branch.includes("->"))
    .map((branch) => branch.trim())
    .map((branch) => (branch.includes("*") ? curBranch : branch));

  const showLocalBranches = () => {
    setLocalListOpen(!localListOpen);
  };
  const showRemoteBranches = () => {
    setRemoteListOpen(!remoteListOpen);
  };

  const changeBranch = (selectedBranch) => {
    return ipcRenderer.sendSync("change branch", currentRepo, selectedBranch);
  };

  const branchSelector = (e) => {
    let branch = e.target.dataset.branch;
    setSelectedBranch(branch);
  };

  const branchChanger = () => {
    setCurBranch(selectedBranch);
    changeBranch(selectedBranch) === "error"
      ? setErrorModalOpen(true)
      : changeBranch(selectedBranch) &&
        SetCmd(`${cmd} \n git switch ${selectedBranch}`);
  };

  const goCommit = () => {
    setErrorModalOpen(false);
    navigate("/add");
  };

  return (
    <div className={styles.container}>
      <div className={styles.curStatus}>
        <div className={styles.curBranch}>
          현재 branch <p>{curBranch}</p>
        </div>
        <LogCheck />
      </div>
      <div className={styles.branchContainer}>
        <div className={styles.branchList}>
          <div className={styles.branchMenu} onClick={showLocalBranches}>
            branch{" "}
            {localListOpen ? (
              <FontAwesomeIcon icon={faCaretUp} />
            ) : (
              <FontAwesomeIcon icon={faCaretDown} />
            )}
          </div>
          <div
            className={localListOpen ? `${styles.openList}` : `${styles.list}`}
          >
            {localBranches.map((branch, idx) => (
              <div
                key={idx}
                className={
                  curBranch === branch
                    ? `${styles.branch} ${styles.clicked}`
                    : `${styles.branch}`
                }
                onClick={branchSelector}
                onDoubleClick={branchChanger}
                data-branch={branch}
              >
                <div>
                  <FontAwesomeIcon
                    icon={faCodeBranch}
                    className={styles.icon}
                  />
                  {branch}
                </div>
                <DeleteBranch branch={branch} />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.branchList}>
          <div onClick={showRemoteBranches}>remote</div>
          <div
            className={remoteListOpen ? `${styles.openList}` : `${styles.list}`}
          >
            {remoteBranchList.map((branch, idx) => (
              <div key={idx} className={styles.branch} data-branch={branch}>
                {branch}

                <DeleteBranch branch={branch} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal
        open={errorModalOpen}
        content={
          <>
            <p>변경사항이 있으면 branch 이동을 할 수 없습니다.</p>
            <p>먼저 commit해주세요</p>
            <div className={styles.buttonContainer}>
              <Button
                action={goCommit}
                content={"commit하러 가기"}
                style={{ backgroundColor: "#6BCC78" }}
              />
            </div>
          </>
        }
      ></Modal>
    </div>
  );
}

export default BranchList;
