import React from "react";
import { Octokit } from "octokit";
import { useEffect } from "react";
import { useState } from "react";
import styles from "./Reviewer.module.css";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { mergeRequest, mergeCommit } from "../../atoms";

export default function Reviewer() {
  const [reviews, setReviews] = useState([]);
  const [detail, setDetail] = useRecoilState(mergeRequest);
  const [commits, setCommits] = useRecoilState(mergeCommit);
  const navigate = useNavigate();
  
  useEffect(() => {
    const user = localStorage.getItem("userInfo");
    const location = localStorage.getItem("currentRepo").split("\\");
    const repo = location[location.length - 1];
    const owner = localStorage.getItem("owner")
    const token = localStorage.getItem("accessToken");


    async function getReview() {
      const octokit = new Octokit({
        auth: token,
      });

      const result = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
        owner: owner,
        repo: repo,
        state: "open",
      });

      const myReview = [];
      result.data.map((each) => {
        each.requested_reviewers.map((reviewer) => {
          if (reviewer.login === user) {
            myReview.push(each);
          }
        });
      });
      setReviews(myReview);
    }
    getReview();
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
      <div className={styles.title}>나에게 merge 검토가 요청된 내역</div>
      <div className={styles.assigned}>
      {reviews.length ? (
        <div>
          {reviews.map((review, index) => (
            <div
              key={index}
              className={styles.box}
              onClick={() => reqDetail(review.number)}
            >
              <div className={styles.title}>{review.title}</div>
              <div className={styles.body}>
                <div className={styles.texttitle}>요청자</div>
                <img
                  className={styles.image}
                  src={review.user.avatar_url}
                  alt="avatar"
                />
                <div className={styles.text}>{review.user.login}</div>
                <div className={styles.text}>|</div>
                <div className={styles.text}>
                  {review.created_at.replace("T", " ").replace("Z", "")} 에
                  요청됨
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          아직 요청된 내역이 없습니다!
        </div>
      )}
      </div>
      
    </div>
  );
}
