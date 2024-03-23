import React from "react";
import { Octokit } from "octokit";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { allRequests, mergeRequest, mergeCommit } from "../../atoms";
import styles from "./All.module.css";
import { useNavigate } from "react-router-dom";

export default function All() {
  const [allReq, setAllReq] = useRecoilState(allRequests);
  const [detail, setDetail] = useRecoilState(mergeRequest);
  const [commits, setCommits] = useRecoilState(mergeCommit);
  const navigate = useNavigate();

  const user = localStorage.getItem("userInfo");
  const location = localStorage.getItem("currentRepo");
  const repoArr = location.split("\\");
  const repo = repoArr[repoArr.length - 1];
  const owner = localStorage.getItem("owner")
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    async function getAll() {
      const octokit = new Octokit({
        auth: token,
      });

      const result = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
        owner: owner,
        repo: repo,
        state: "all",
      });

      setAllReq(result.data);
    }
    getAll();
  }, []);

  const reqDetail = async (number) => {
    const result = await showRequest(number);
    navigate("/merge/detail");
  };

  async function showRequest(number) {
    const user = localStorage.getItem("userInfo");
    const location = localStorage.getItem("currentRepo").split("\\");
    const repo = location[location.length - 1];

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
    <>
    {allReq.length ? (
      <div>
      {allReq.map((req, index) => (
        <div
          key={index}
          className={styles.box}
          onClick={() => reqDetail(req.number)}
        >
          <div className={styles.titletag}>
            <div className={styles.title}>{req.title}</div>
            {req.merged_at ? (
              <div className={styles.mergetag}>
                <div>merge 완료</div>
              </div>
            ) : (
              <div className={styles.needmergetag}>
                <div>merge 대기</div>
              </div>
            )}
          </div>
          <div className={styles.body}>
            <div className={styles.person}>요청자</div>
            <img
              className={styles.image}
              src={req.user.avatar_url}
              alt="avatar"
            />
            <div className={styles.text}>{req.user.login}</div>
            <div className={styles.text}>|</div>
            {req.assignee ? (
              <div className={styles.assignee}>
                <div className={styles.person}>담당자</div>
                <img
                  className={styles.image}
                  src={req.assignee.avatar_url}
                  alt="avatar"
                />
                <div className={styles.text}>{req.assignee.login}</div>
                <div className={styles.text}>|</div>
              </div>
            ) : null}
            {req.merged_at ? (
              <div className={styles.text}>
                {req.merged_at.replace("T", " ").replace("Z", "")} 에 merge
                완료
              </div>
            ) : (
              <div className={styles.text}>
                {req.created_at.replace("T", " ").replace("Z", "")} 에 요청됨
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
    ) : (
      <div>아직 요청이 없습니다!</div>
    )}
      
    </>
  );
}
