import React from "react";
import { useEffect, useState } from "react";
import { Octokit } from "octokit";
import styles from "./Assignee.module.css";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { mergeRequest, mergeCommit } from "../../atoms";

export default function Assignee() {
  const [requests, setRequests] = useState([]);
  const [detail, setDetail] = useRecoilState(mergeRequest);
  const [commits, setCommits] = useRecoilState(mergeCommit);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("userInfo");
    const location = localStorage.getItem("currentRepo").split("\\");
    const repo = location[location.length - 1];
    const owner = localStorage.getItem("owner")
    const token = localStorage.getItem("accessToken");


    async function getAssigned() {
      const octokit = new Octokit({
        auth: token,
      });
      const assigned = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
        owner: owner,
        repo: repo
      })
      const issues = [];
      assigned.data.map((each) => {
        const issue = {};
        if (each.assignee.login === user) {
          issue.number = each.number;
          issue.title = each.title;
          issue.body = each.body;
          issue.user = each.user.login;
          issue.avatar = each.user.avatar_url;
          issue.created = each.created_at;
          issue.updated = each.updated_at;
          issues.push(issue);
        }
      });
      setRequests(issues);
    }
    getAssigned();
  }, []);

  const reqDetail = async (number) => {
    const result = await showRequest(number);
    navigate("/merge/detail");
  };

  async function showRequest(number) {
    const user = localStorage.getItem("userInfo");
    const location = localStorage.getItem("currentRepo").split("\\");
    const repo = location[location.length - 1];
    const owner = localStorage.getItem("owner")
    const token = localStorage.getItem("accessToken");


    const octokit = new Octokit({
      auth: token,
    });

    const info = await octokit.request(
      "GET /repos/{owner}/{repo}/pulls/{pull_number}",
      {
        owner: owner,
        repo: repo,
        pull_number: number,
      }
    );

    const commit = await octokit.request(
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/commits",
      {
        owner: owner,
        repo: repo,
        pull_number: number,
      }
    );

    setDetail(info.data);
    setCommits(commit.data);
  }

  return (
    <div className={styles.main}>
      <div className={styles.title}>나에게 merge가 할당된 내역</div>
      <div className={styles.assigned}>
        {requests.length ? (
          <div>
            {requests.map((request, index) => (
          <div
            key={index}
            className={styles.box}
            onClick={() => reqDetail(request.number)}
          >
            <div className={styles.title}>{request.title}</div>
            <div className={styles.body}>
              <div className={styles.texttitle}>요청자</div>
              <img className={styles.image} src={request.avatar} alt="avatar" />
              <div className={styles.text}>{request.user}</div>
              <div className={styles.text}>|</div>
              <div className={styles.text}>
                {request.created.replace("T", " ").replace("Z", "")} 에 요청됨
              </div>
            </div>
          </div>
        ))}
          </div>
        ) : (
          <div>아직 할당된 내역이 없습니다!</div>
        )}
        
      </div>
      
    </div>
  );
}
