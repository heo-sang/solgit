import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { commandLine } from "../../atoms";
import Modal from "../common/Modal";
import Dropdown from "react-bootstrap/Dropdown";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import styles from "./GitCommitPage.module.css";

const { ipcRenderer } = window.require("electron");
const getCommitRules = () => {
  return JSON.parse(
    ipcRenderer.sendSync("ReadCommitRules", localStorage.getItem("currentRepo"))
  );
};

function GitCommit(props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [commitType, setCommitType] = useState("");
  const [commitExplanation, setCommitExplanation] = useState("");
  const [commitRules, setCommitRules] = useState(getCommitRules());
  const [newType, setNewType] = useState("");
  const [newExplanation, setNewExplanation] = useState("");
  const [commitDescription, setCommitDescription] = useState("");
  const [commitMessage, setCommitMessage] = useState("");
  const [cmd, SetCmd] = useRecoilState(commandLine);
  // let lastCommitDescription = ipcRenderer.sendSync("lastCommitDescription","git log --pretty=format:'%s' --no-merges -n 1")
  const onChangeNewType = (e) => {
    setNewType(e.target.value);
  };
  const onChangeNewExplanation = (e) => {
    setNewExplanation(e.target.value);
  };

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };
  const addCommitRules = () => {
    const commitRules = ipcRenderer.sendSync("WriteCommitRules", {
      type: newType,
      explanation: newExplanation,
    });
    setNewType("");
    setNewExplanation("");
    setCommitRules(commitRules);
    closeModal();
  };
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {props}
    </Tooltip>
  );
  const onChangeCommitDescription = (e) => {
    setCommitDescription(e.target.value);
  };
  const commit = () => {
    if (commitType === "") {
      alert("Commit 타입을 지정해주세요");
      return;
    }
    if (commitDescription === "") {
      alert("Commit 설명을 작성해주세요");
      return;
    }
    // const commitMessage = commitType + " : " + commitDescription
    const commitMessage = commitType + commitDescription;
    const data = ipcRenderer.sendSync("gitCommit", commitMessage);
    closeModal();
    SetCmd(`${cmd} \n git commit -m "${commitMessage}"`);

    setCommitDescription("");
    setCommitType("");
  };
  return (
    <>
      <Dropdown>
        <div className={styles.typeContainer}>
          <Dropdown.Toggle
            id="commit-rule"
            style={{
              backgroundColor: "#DCDCDC",
              border: "0",
              color: "#525252",
              margintBottm: "1px",
            }}
          >
            {commitType === "" ? <>Commit 타입</> : <>{commitType}</>}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {(() => {
              const arr = [];
              for (let i of commitRules) {
                arr.push(
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip(i.explanation)}
                  >
                    <Dropdown.Item
                      value={i.type}
                      onClick={() => {
                        setCommitType(i.type);
                      }}
                    >
                      {i.type}
                    </Dropdown.Item>
                  </OverlayTrigger>
                );
              }
              return arr;
            })()}
          </Dropdown.Menu>
          <button
            className={styles.rulePlusBtn1}
            onClick={openModal}
            style={{
              backgroundColor: "#6BCC78",
              color: "white",
              width: "100px",
            }}
          >
            추가
          </button>
        </div>
      </Dropdown>

      <div>
        <textarea
          type="text"
          placeholder={"커밋메시지를 입력해주세요."}
          onChange={onChangeCommitDescription}
          value={commitDescription}
          style={{
            width: "98%",
            height: "10rem",
            marginTop: "2%",
            marginBottom: "2%",
            borderRadius: "0.3rem",
          }}
        />
      </div>

      <div>
        <div style={{ marginBottom: "1%" }}>
          <span style={{ color: "#FF8B8B", fontSize: "14.5px" }}>
            &nbsp;커밋메시지 미리보기
          </span>
        </div>
        <span style={{ fontSize: "14.5px" }}>&nbsp;{commitType}</span>
        <span style={{ fontSize: "14.5px" }}>{commitDescription}</span>
      </div>

      <div className={styles.toRight}>
        <button
          className={styles.commitBtn}
          onClick={() => {
            commit();
            props.modalClose();
          }}
          style={{
            width: "100px",
            backgroundColor: "#FF6B6B",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Commit
        </button>
      </div>

      <Modal
        open={modalOpen}
        content={
          <>
            <div className={styles.forMargin}>
              <label>타입</label>
              <input
                className={styles.commitPlusInput}
                type="text"
                placeholder="Feat : "
                onChange={onChangeNewType}
                value={newType}
                style={{ margin: "1%", width: "98%" }}
              />
            </div>
            <div>
              <label>설명</label>
              <input
                className={styles.commitPlusInput}
                style={{ margin: "1%", width: "98%" }}
                type="text"
                placeholder="새로운 기능을 추가한 경우"
                onChange={onChangeNewExplanation}
                value={newExplanation}
              />
            </div>
          </>
        }
      >
        <div className={styles.btnSet}>
          <button
            className={styles.rulePlusBtn2}
            onClick={addCommitRules}
            style={{ backgroundColor: "#6BCC78", color: "white" }}
          >
            추가
          </button>
          <button
            className={styles.rulePlusBtn2}
            onClick={closeModal}
            style={{
              backgroundColor: "#DCDCDC",
            }}
          >
            취소
          </button>
        </div>
      </Modal>
    </>
  );
}

export default GitCommit;
