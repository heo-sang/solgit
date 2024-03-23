import React from "react";
import Button from "../common/Button";
import Modal from "../common/Modal";
import { Octokit } from "octokit";
import styles from "./Review.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useRecoilState } from "recoil";
import { reviewModal } from "../../atoms";

export default function Review({ files, sha, pull }) {
  const user = localStorage.getItem("userInfo");
  const location = localStorage.getItem("currentRepo");
  const repoArr = location.split("\\");
  const repo = repoArr[repoArr.length - 1];
  const owner = localStorage.getItem("owner")
  const token = localStorage.getItem("accessToken");

  const [file, setFile] = useState("");
  const [line, setLine] = useState(0)
  // 설명 저장하기
  const [description, setDescription] = useState("");
  const [modal, setModal] = useRecoilState(reviewModal);

  const navigate = useNavigate();
  const reviewOpen = useRecoilValue(reviewModal);

  const saveFile = (e) => {
    setFile(e.target.value);
    files.map((each) => {
      if (each.filename === e.target.value) {
        const index = files.indexOf(each)
        const patch = files[index].patch
        const minus = patch.indexOf('-') + 1
        const comma = patch.indexOf(',')
        setLine(Number(patch.substring(minus, comma).replace(" ", "")))
      }
    })
    // console.log(Number(patch.substring(comma, plus).replace(" ", "")))
    // return e.target.value;
  };
  // 설명 저장하기
  const onDesChange = (e) => {
    setDescription(e.target.value);
    // return e.target.value;
  };

  const closeModal = () => {
    setModal(false);
  };

  async function saveReview() {
    const octokit = new Octokit({
      auth: token,
    });

    const review = await octokit.request(
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/comments",
      {
        owner: owner,
        repo: repo,
        pull_number: pull,
        body: description,
        commit_id: sha,
        path: file,
        line: line,
      }
    );
    
    
    setDescription("");
    setModal(false);
  }

  return (
    <Modal
      open={reviewOpen}
      content={
        <div>
          <div className={styles.review}>
            <div className={styles.comment}>검토</div>
            <div className={styles.commentbox}>
              <div className={styles.des}>
                해당 commit에서 검토한 파일을 체크해주세요.
              </div>
              <div>
                {files.map((file, index) => (
                  <div key={index}>
                    <label className={styles.label}>
                      <input
                        id="filename"
                        type="radio"
                        value={file.filename}
                        name={file.filename}
                        onChange={saveFile}
                      />
                      <div className={styles.radio}>{file.filename}</div>
                    </label>
                  </div>
                ))}
              </div>
              <div className={styles.des}>검토한 내용을 적어주세요.</div>
              <textarea
                id="description"
                name="description"
                cols="50"
                rows="3"
                onChange={onDesChange}
                value={description}
                className={styles.input}
              ></textarea>
            </div>
          </div>
          <div className={styles.buttons}>
            <Button
              action={saveReview}
              content={"작성하기"}
              style={{
                backgroundColor: "#6BCC78",
                border: "2px solid #6BCC78",
                fontWeight: "600",
              }}
            />
            <Button
              action={closeModal}
              content={"닫기"}
              style={{
                backgroundColor: "white",
                border: "2px solid #6BCC78",
                fontWeight: "600",
              }}
            />
          </div>
        </div>
      }
    ></Modal>
  );
}
