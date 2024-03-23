import React, { useState } from "react";
import styles from "./GitPush.module.css";
import Committed from "../components/pushPage/Committed";
import Push from "../components/pushPage/Push";
import CommentBox from "../components/pushPage/CommentBox";
import Command from "../components/common/underbar/Command";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { pushedData, commandLine, isLoading, pushBtn, cmtList } from "../atoms";
import Button from "../components/common/Button";

function PushPage() {
  const [selBranch, setSelBranch] = useState("");
  const { ipcRenderer } = window.require("electron");
  const navigate = useNavigate();
  const [committedList, setCommittedList] = useState([]);
  const [pushData, setPushData] = useRecoilState(pushedData);
  const [isMerge, setIsMerge] = useState(false);
  const [cmd, SetCmd] = useRecoilState(commandLine);
  const [isLoad, SetIsLoad] = useRecoilState(isLoading);
  const [selButton, SetSelButton] = useRecoilState(pushBtn);
  const [commitList, SetCommitList] = useRecoilState(cmtList);

  const pushStart = () => {
    SetIsLoad(true);
    if (selBranch === "") {
      SetIsLoad(false);
      alert("브랜치를 선택해주세요!");
      return;
    }
    const value = ipcRenderer.sendSync("git-Push", {
      repoRoot: localStorage.getItem("currentRepo"),
      branch: selBranch,
    });

    if (value === "error") {
      SetIsLoad(false);
      alert(
        "해당 브랜치에 푸시할 수 없습니다. 먼저 풀을 당겨서 원격 브랜치와 로컬 브린치의 버전을 맞춰주세요"
      );
      return;
    }

    const result = { branch: selBranch, commitList: committedList };
    setPushData(result);
    let text = cmd + "\n" + `git push origin ${selBranch}`;

    SetCmd(text);

    setIsMerge(true);
    SetIsLoad(false);
    SetCommitList([]);
  };

  const moveToMerge = () => {
    navigate("/merge/ready");
    SetSelButton("merge/ready");
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.divide}>
          <div className={styles.committed}>
            <CommentBox location="local"></CommentBox>
            <Committed
              settingCommittedData={(arg) => {
                setCommittedList(arg);
              }}
            />
          </div>
          {/* <div className={styles.arrow}>
            <img
              src={process.env.PUBLIC_URL + "/right-arrow.png"}
              alt="arrow"
              className={styles.arrowImg}
            />
            Push
          </div> */}

          <div className={styles.push}>
            <CommentBox location="remote"></CommentBox>
            <Push
              changeBranch={(arg) => {
                setSelBranch(arg);
              }}
            />
          </div>
          <div className={styles.buttonArea}>
            {commitList.length ? (
              <Button
                action={pushStart}
                content={"Push"}
                // style={{ width: "200px" }}
              />
            ) : (
              <div className={styles.disabled}>Push</div>
            )}

            {/* <button
              className={styles.button}
              onClick={() => {
                pushStart();
                // SetIsPush(true)
                SetCommitList([])
              }}

              disabled={commitList.length===0 ? true : false}
              
            >
              Push
            </button> */}
            <Button
              action={moveToMerge}
              content={"Merge"}
              // style={{ width: "200px" }}
            />
            {/* <button
              className={styles.mergeButton}
              onClick={() => {
                navigate("/merge/ready");
                SetSelButton("merge/ready")
              }}

              // disabled={isPush ? false : true}
            >
              Merge
            </button> */}
          </div>
        </div>
      </div>
      <footer className={styles.cmdDiv}>
        <Command></Command>
      </footer>
    </>
  );
}

export default PushPage;
