import React, { useState } from "react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router";
import styles from "./Committed.module.css";
import { committedFiles, isLoading, pushBtn, cmtList } from "../../atoms";
import { useRecoilState } from "recoil";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Committed(props) {
  const repoRoot = localStorage.getItem("currentRepo");
  const { ipcRenderer } = window.require("electron");
  const [isLoad, SetIsLoad] = useRecoilState(isLoading);
  const [selectedPage, SetSelectedPage] = useRecoilState(pushBtn);
  const [commitList, SetCommitList] = useRecoilState(cmtList);
  const [willPush, SetWillPush] = useRecoilState(committedFiles);
  const navigate = useNavigate();

  const callFiles = () => {
    SetIsLoad(true);

    const returnValue = ipcRenderer.sendSync("call-committed-files", repoRoot);

    const resultArr = [];
    if (returnValue === "no") {
      alert("커밋된 것이 없습니다.");
      navigate("/add");
      SetSelectedPage("add");
      SetIsLoad(false);
    } else if (returnValue.length !== 0) {
      const tempArr = returnValue.split("\n");

      for (let i = 0; i < tempArr.length; i++) {
        if (tempArr[i] !== "") {
          resultArr.push(tempArr[i]);
        }
      }
    }

    SetCommitList(resultArr);
    SetWillPush(resultArr);
    SetIsLoad(false);
  };

  useEffect(() => {
    callFiles();
    props.settingCommittedData(commitList);
  }, []);

  return (
    <div className={styles.box}>
      <div className={styles.title}>commit 완료된 파일</div>
      {commitList.length ? (
        <div className={styles.commit}>
          {commitList.map((item, idx) => (
            <div key={idx} className={styles.commitBox}>
              <FontAwesomeIcon icon={faFile} className={styles.icon} />
              <div className={styles.name}>{item}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.commit}>push 할 파일이 없습니다!</div>
      )}
    </div>
  );
}

export default Committed;
