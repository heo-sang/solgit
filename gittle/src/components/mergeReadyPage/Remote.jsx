import React, { useEffect, useState } from "react";
import { Octokit } from "octokit";
import styles from "./Remote.module.css";
import { faCodeBranch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRecoilState, useRecoilValue } from "recoil";
import { pushedBranch, mergingBranch } from "../../atoms";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";
import { pushedData } from "../../atoms";

// push된 브랜치 이름 받아오기
export default function Remote() {
  const [branches, setBranches] = useState([]);
  const [push, setPush] = useRecoilState(pushedBranch);
  const [merge, setMerge] = useRecoilState(mergingBranch);
  const pushed = useRecoilValue(pushedData);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = localStorage.getItem("currentRepo").split("\\");
  const repo = location[location.length - 1];
  const owner = localStorage.getItem("owner");

  useEffect(() => {
    const user = localStorage.getItem("userInfo");
    const location = localStorage.getItem("currentRepo").split("\\");
    const repo = location[location.length - 1];
    const owner = localStorage.getItem("owner");
    const token = localStorage.getItem("accessToken");


    async function getBranches() {
      const octokit = new Octokit({
        auth: token,
      });

      const branch = await octokit.request(
        "GET /repos/{owner}/{repo}/branches",
        {
          owner: owner,
          repo: repo,
        }
      );
      setBranches(branch.data);
    }
    getBranches();
    // push된 branch 받아오기
    setPush(pushed.branch);
    // setPush("test9");
  }, []);

  const selectBranch = (branch) => {
    setMerge(branch);
  };

  const openModal = () => {
    if (merge) {
      setModalOpen(true);
    } else {
      alert("merge 할 branch를 선택해주세요!");
    }
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  const StartMerge = () => {
    closeModal();
    // navigate("/merge");
    window.open(`https://github.com/${owner}/${repo}/compare/${merge}...${push}`, '_blank')
    navigate("/merge/request")
  };

  return (
    <div className={styles.main}>
      <div className={styles.remote}>
        <div className={styles.remotebox}>remote</div>
        <div className={styles.listandbtn}>
          {branches.length ? (
            <div>
              <div className={styles.box}>
                <div className={styles.title}>branches</div>
                <div className={styles.list}>
                  {branches.map((branch, index) =>
                    push === branch.name ? (
                      <div key={index} className={styles.pushbranch}>
                        <FontAwesomeIcon
                          icon={faCodeBranch}
                          className={styles.icon}
                        />
                        <div>{branch.name}</div>
                      </div>
                    ) : merge === branch.name ? (
                      <div key={index} className={styles.mergebranch}>
                        <FontAwesomeIcon
                          icon={faCodeBranch}
                          className={styles.icon}
                        />
                        <div>{branch.name}</div>
                      </div>
                    ) : (
                      <div key={index} className={styles.branch}>
                        <FontAwesomeIcon
                          icon={faCodeBranch}
                          className={styles.icon}
                        />
                        <div onClick={() => selectBranch(branch.name)}>
                          {branch.name}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
              <div className={styles.info}>
                <div className={styles.push}></div>
                <div className={styles.text}>push 완료된 branch</div>
              </div>
              <div className={styles.info}>
                <div className={styles.merge}></div>
                <div className={styles.text}>merge 할 branch</div>
              </div>
            </div>
          ) : null}
          <Button
            action={openModal}
            content={"merge"}
            style={{
              backgroundColor: "#C9A6FF",
              borderColor: "#C9A6FF",
              height: "2.5rem",
              fontSize: "1.2rem",
            }}
          />
        </div>
        <Modal
          open={modalOpen}
          content={
            <div className={styles.modal}>
              <div className={styles.pushtext}>{push}</div>
              <div>branch를</div>
              <div className={styles.mergetext}>{merge}</div>
              <div>branch로 merge 하시겠습니까?</div>
            </div>
          }
        >
          <div className={styles.buttons}>
            <Button
              action={StartMerge}
              content={"예"}
              style={{ backgroundColor: "#6BCC78" }}
            />
            <Button
              action={closeModal}
              content={"아니오"}
              style={{ border: "1px solid #7B7B7B" }}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
}
