import React from "react";
import { useRecoilValue } from "recoil";
import { pushedBranch, mergingBranch } from "../../atoms";
import { faCircleArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Request.module.css";
import { useEffect, useState } from "react";
import { Octokit } from "octokit";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";

export default function Request() {
  // push된 브랜치와 merge할 브랜치 받아오기
  const pushed = useRecoilValue(pushedBranch);
  const merging = useRecoilValue(mergingBranch);
  // user와 현재 repo 받아오기
  const user = localStorage.getItem("userInfo");
  const location = localStorage.getItem("currentRepo");
  const repoArr = location.split("\\");
  const repo = repoArr[repoArr.length - 1];
  const owner = localStorage.getItem("owner")
  const token = localStorage.getItem("accessToken");

  // collaborator 저장하기
  const [collab, setCollab] = useState([]);
  // reviewer 저장하기
  const [reviewer, setReviewer] = useState([]);
  // 제목 저장하기
  const [title, setTitle] = useState("");
  // 설명 저장하기
  const [description, setDescription] = useState("");
  // 담당자 저장하기
  const [assignees, setAssignees] = useState("");
  // 리뷰어 저장하기
  const [reviewers, setReviewers] = useState("");
  const navigate = useNavigate();

  // merge request 보내는 함수
  async function mergeRequest() {
    try {
  
      const octokit = new Octokit({
        auth: token,
      });
  
      const merge = await octokit.request("POST /repos/{owner}/{repo}/pulls", {
        owner: owner,
        repo: repo,
        title: title,
        body: description,
        head: pushed,
        base: merging,
      });
  
      return merge.data.number;
    } catch (error) {
      console.log(error)
      alert(`merge 요청을 보낼 수 없습니다.\n\n에러 메세지 : ${error.message}`)
    }
  }

  // assignee 등록하고, review 요청 보내는 함수
  async function reviewRequest(pullNum) {
    const octokit = new Octokit({
      auth: token,
    });

    const assignee = await octokit.request(
      "POST /repos/{owner}/{repo}/issues/{issue_number}/assignees",
      {
        owner: owner,
        repo: repo,
        issue_number: pullNum,
        assignees: [assignees],
      }
    );

    const review = await octokit.request(
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers",
      {
        owner: owner,
        repo: repo,
        pull_number: pullNum,
        reviewers: [reviewers],
      }
    );

    return { assignee, review };
  }

  // 현재 repo에서 collaborator 정보 받아오는 함수
  useEffect(() => {
    async function getCollab() {
      const octokit = new Octokit({
        auth: token,
      });

      const collaborator = await octokit.request(
        "GET /repos/{owner}/{repo}/collaborators",
        {
          owner: owner,
          repo: repo,
        }
      );
      const members = [{ value: "null", name: "선택 안 함" }];
      const exceptMe = [{ value: "null", name: "선택 안 함" }];
      collaborator.data.map((member) => {
        const each = {};
        each.value = member.login;
        each.name = member.login;
        members.push(each);
        // 테스트하느라 주석 처리 => 나중에 꼭 해제해(109, 111번 줄)
        if (each.name !== user) {
          exceptMe.push(each);
        }
      });
      setCollab(members);
      setReviewer(exceptMe);
    }
    getCollab();
  }, []);

  // 제목 저장하기
  const onTitleChange = (e) => {
    setTitle(e.target.value);
  };

  // 설명 저장하기
  const onDesChange = (e) => {
    setDescription(e.target.value);
  };

  // 담당자 저장하기
  const onAssigneeChange = (e) => {
    setAssignees(e.target.value);
  };

  // 리뷰어 저장하기
  const onReviewerChange = (e) => {
    setReviewers(e.target.value);
  };

  // 한꺼번에 요청 보내기!
  const sendRequest = async () => {
    const pullNumber = await mergeRequest();
    const response = await reviewRequest(pullNumber);
    navigate("/merge/request");
    return response;
  };

  // 뒤로 가기
  const mergeReady = () => {
    navigate("/merge/ready");
  };

  return (
    <div className={styles.main}>
      <div className={styles.merge}>
        <div className={styles.text}>
          <p className={styles.pushedbranch}>{pushed}</p>
          <p className={styles.line}>branch 에서</p>
        </div>
        <div className={styles.arrow}>
          <FontAwesomeIcon icon={faCircleArrowRight} className={styles.icon} />
          <p>merge</p>
        </div>
        <div className={styles.text}>
          <p className={styles.mergingbranch}>{merging}</p>
          <p className={styles.line}>branch 로</p>
        </div>
      </div>
      <div>
        <p className={styles.title}>제목</p>
        <input
          type="text"
          onChange={onTitleChange}
          value={title}
          className={styles.titleinput}
        />
      </div>
      <div>
        <p className={styles.title}>설명</p>
        <textarea
          name="description"
          cols="50"
          rows="10"
          onChange={onDesChange}
          value={description}
          className={styles.input}
        ></textarea>
      </div>
      <div className={styles.review}>
        <div>
          <p className={styles.title}>담당자</p>
          <select onChange={onAssigneeChange} className={styles.select}>
            {collab.map((member) => (
              <option
                key={member.value}
                value={member.value}
                defaultValue={member.value === "null"}
                className={styles.option}
              >
                {member.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.reviewer}>
          <p className={styles.title}>검토자</p>
          <select onChange={onReviewerChange} className={styles.select}>
            {reviewer.map((member) => (
              <option
                key={member.value}
                value={member.value}
                defaultValue={member.value === "null"}
                className={styles.option}
              >
                {member.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className={styles.buttons}>
        <Button
          action={sendRequest}
          content={"merge 요청하기"}
          style={{
            backgroundColor: "#6BCC78",
            width: "150px",
            border: "2px solid #6BCC78",
            margin: "0 20px",
            cursor: "pointer",
          }}
        />
        <Button
          action={mergeReady}
          content={"취소"}
          style={{
            backgroundColor: "white",
            width: "150px",
            border: "2px solid #6BCC78",
            margin: "0 20px",
            cursor: "pointer",
          }}
        />
      </div>
    </div>
  );
}
