import { useEffect, useState } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { mergeRequest, mergeCommit, reviewModal } from "../../atoms";
import styles from "./Detail.module.css";
import {
  faCircleArrowRight,
  faCaretDown,
  faCaretUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../common/Button";
import { Octokit } from "octokit";
import { useNavigate } from "react-router-dom";
import Review from "../mergeDetailPage/Review";

export default function Detail() {
  const mergeReqInfo = useRecoilValue(mergeRequest);
  const mergeCommitInfo = useRecoilValue(mergeCommit);
  const [overview, setOverview] = useState(true);
  const [commit, setCommit] = useState("");
  const [commitIdx, setCommitIdx] = useState(0);
  // 마지막 커밋 변경 파일 목록
  const [files, setFiles] = useState([]);
  const [commitId, setCommitId] = useState("");
  // 마지막 커밋에서 모든 파일의 코드
  const [codeBefore, setCodeBefore] = useState([]);
  const [codeAfter, setCodeAfter] = useState([]);
  const [fileIdx, setFileIdx] = useState(0);
  const [file, setFile] = useState("");
  // 설명 저장하기
  const [description, setDescription] = useState("");
  const [clicked, setClicked] = useState("");
  const [modalOpen, setModalOpen] = useRecoilState(reviewModal);
  const [comment, setComment] = useState(false);

  const [commitReview, setCommitReview] = useState([]);
  const isOpen = useRecoilValue(reviewModal);

  const navigate = useNavigate();

  const user = localStorage.getItem("userInfo");
  const location = localStorage.getItem("currentRepo");
  const repoArr = location.split("\\");
  const repo = repoArr[repoArr.length - 1];
  const owner = localStorage.getItem("owner");
  const token = localStorage.getItem("accessToken");


  useEffect(() => {
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("userInfo");
    const location = localStorage.getItem("currentRepo").split("\\");
    const repo = location[location.length - 1];
    const owner = localStorage.getItem("owner");
    const token = localStorage.getItem("accessToken");

    async function getCommit() {
      const octokit = new Octokit({
        auth: token,
      });

      const commitInfo = await octokit.request(
        "GET /repos/{owner}/{repo}/commits/{ref}",
        {
          owner: owner,
          repo: repo,
          ref: commit,
        }
      );

      setFiles(commitInfo.data.files);
      setCommitId(commitInfo.data.sha);
      let fileBefore = [];
      let fileAfter = [];
      commitInfo.data.files.map((file) => {
        // setCodes((prev) => [...prev, file.patch.split("\n")]);
        let before = [];
        let after = [];
        let lines = file.patch.split("\n");
        lines.map((line) => {
          if (line[0] === "-") {
            before.push(line);
          } else if (line[0] === "+") {
            after.push(line);
          } else {
            before.push(line);
            after.push(line);
          }
        });
        fileBefore.push(before);
        fileAfter.push(after);
      });
      setCodeBefore(fileBefore);
      setCodeAfter(fileAfter);
      setFileIdx(0);
    }
    async function getReview() {
      const octokit = new Octokit({
        auth: token,
      });

      const reviews = await octokit.request(
        "GET /repos/{owner}/{repo}/pulls/{pull_number}/comments",
        {
          owner: owner,
          repo: repo,
          pull_number: mergeReqInfo.number,
        }
      );

      const reviewArr = [];
      reviews.data.map((review) => {
        if (review.original_commit_id === commit) {
          reviewArr.push(review);
        }
      });
      // console.log("커밋", commit);
      setCommitReview(reviewArr);
    }
    getCommit();
    getReview();
  }, [commit, isOpen]);

  const showOverview = () => {
    setOverview(true);
  };

  const showHistory = () => {
    setOverview(false);
  };

  const showDiff = (sha, index) => {
    setCommit(sha);
    setCommitIdx(index);
    setClicked("");
    setComment(false);
  };

  const showCode = (index) => {
    setFileIdx(index);
  };

  const showFile = (name) => {
    // if (name.length) {
    // setClicked("");
    setClicked(name);
    // }
  };

  const showComment = () => {
    if (comment) {
      setComment(false);
    } else {
      setComment(true);
    }
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const mergeAccept = () => {
    window.open(`https://github.com/${owner}/${repo}/pull/${mergeReqInfo.number}`, '_blank')
    navigate("/merge/request");
  }

  const goList = () => {
    navigate("/merge/request");
  };

  return (
    <div className={styles.container}>
      <div className={styles.reqtitle}>{mergeReqInfo.title}</div>
      {mergeReqInfo.merged ? (
        <div className={styles.merged}>merge 완료</div>
      ) : (
        <div className={styles.needmerge}>merge 대기</div>
      )}
      {/* <div>merge 여부 : {String(mergeReqInfo.merged)}</div> */}
      {/* <div>merge 가능 여부 : {String(mergeReqInfo.mergeable)}</div> */}
      <div className={styles.info}>
        <div className={styles.profile}>
          <div className={styles.bold}>요청자</div>
          <img
            src={mergeReqInfo.user.avatar_url}
            alt="avatar"
            className={styles.reqavatar}
          />
          <div>{mergeReqInfo.user.login} |</div>
        </div>
        <div className={styles.date}>
          <div className={styles.profile}>
            <div className={styles.bold}>요청 일자</div>
            <div>
              {mergeReqInfo.created_at.replace("T", " ").replace("Z", "")} |
            </div>
          </div>
          <div className={styles.profile}>
            <div className={styles.bold}>수정 일자</div>
            <div>
              {mergeReqInfo.updated_at.replace("T", " ").replace("Z", "")}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.overview}>
        <div className={styles.tabs}>
          <div className={styles.tab} onClick={showOverview}>
            {overview ? (
              <div className={styles.selected}>개요</div>
            ) : (
              <div>개요</div>
            )}
          </div>
          <div
            className={styles.tab}
            onClick={(event) => {
              event.stopPropagation();
              showHistory();
            }}
          >
            {overview ? (
              <div>변경사항</div>
            ) : (
              <div className={styles.selected}>변경사항</div>
            )}
          </div>
        </div>
        <div className={styles.tabbox}>
          {overview ? (
            <div>
              <div className={styles.request}>
                <div className={styles.push}>
                  <div className={styles.branch}>push 완료 된 branch</div>
                  <div className={styles.pushbranch}>
                    {mergeReqInfo.head.ref}
                  </div>
                </div>
                <div className={styles.arrow}>
                  <FontAwesomeIcon
                    icon={faCircleArrowRight}
                    className={styles.icon}
                  />
                  <div>merge</div>
                </div>
                <div className={styles.merge}>
                  <div className={styles.branch}>merge 할 branch</div>
                  <div className={styles.mergebranch}>
                    {mergeReqInfo.base.ref}
                  </div>
                </div>
              </div>
              <div>
                <div className={styles.bold}>내용</div>
                <div>{mergeReqInfo.body}</div>
              </div>
            </div>
          ) : (
            <div>
              <div className={styles.bold}>commit 내역</div>
              <div>
                {mergeCommitInfo.map((commit, index) => (
                  <div key={index}>
                    <div className={styles.logbox}>
                      <div
                        className={styles.commitprofile}
                        onClick={(event) => {
                          event.stopPropagation();
                          showDiff(commit.sha, index);
                        }}
                      >
                        <img
                          src={commit.author.avatar_url}
                          alt="avatar"
                          className={styles.avatar}
                        />
                        <div className={styles.textbox}>
                          <div className={styles.message}>
                            {commit.commit.message}
                          </div>
                          <div className={styles.authortime}>
                            <div className={styles.name}>
                              {commit.commit.author.name}
                            </div>
                            <div className={styles.time}>
                              {commit.commit.author.date
                                .replace("T", " ")
                                .replace("Z", "")}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        {files.length &&
                        codeBefore.length &&
                        codeAfter.length &&
                        commit.sha === commitId ? (
                          <div>
                            <div className={styles.codearea}>
                              <div className={styles.codebox}>
                                {files.map((file, index) => (
                                  <div
                                    key={index}
                                    className={styles.file}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      showCode(index);
                                      showFile(file.filename);
                                    }}
                                  >
                                    {index === fileIdx ? (
                                      <div className={styles.active}>
                                        {file.filename}
                                      </div>
                                    ) : (
                                      <div className={styles.filename}>
                                        {file.filename}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                              <div className={styles.code}>
                                <div className={styles.codebefore}>
                                  <div className={styles.title}>변경 전</div>
                                  <div className={styles.box}>
                                    {codeBefore[fileIdx].map((code, index) => (
                                      <div key={index}>
                                        {code[0] === "-" ? (
                                          <div className={styles.minus}>
                                            {code}
                                          </div>
                                        ) : (
                                          <div className={styles.zero}>
                                            {code}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div className={styles.codeafter}>
                                  <div className={styles.title}>변경 후</div>
                                  <div className={styles.box}>
                                    {codeAfter[fileIdx].map((code, index) => (
                                      <div key={index}>
                                        {code[0] === "+" ? (
                                          <div className={styles.plus}>
                                            {code}
                                          </div>
                                        ) : (
                                          <div className={styles.zero}>
                                            {code}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div>
                              <div
                                className={styles.comments}
                                onClick={showComment}
                              >
                                <div>comments</div>
                                {comment ? (
                                  <FontAwesomeIcon
                                    icon={faCaretUp}
                                    className={styles.dropicon}
                                  />
                                ) : (
                                  <FontAwesomeIcon
                                    icon={faCaretDown}
                                    className={styles.dropicon}
                                  />
                                )}
                              </div>
                              {/* <div>{files[fileIdx].file_name}</div> */}
                              {/* {clicked.length ? (
                                <div>{clicked}</div>
                              ) : (
                                <div>{files[0].filename}</div>
                              )} */}
                              {comment ? (
                                <>
                                  {" "}
                                  {clicked.length ? (
                                    <div>
                                      {commitReview.map((review, index) => (
                                        <div key={index}>
                                          {review.path === clicked ? (
                                            <div className={styles.commentbox}>
                                              <img
                                                src={review.user.avatar_url}
                                                alt="avatar"
                                                className={styles.commentavatar}
                                              />
                                              <div className={styles.content}>
                                                <div className={styles.comment}>
                                                  <div
                                                    className={
                                                      styles.commentuser
                                                    }
                                                  >
                                                    {review.user.login}
                                                  </div>
                                                  <div
                                                    className={
                                                      styles.commentdate
                                                    }
                                                  >
                                                    {review.created_at
                                                      .replace("T", " ")
                                                      .replace("Z", "")
                                                      .slice(0, 10)}
                                                  </div>
                                                </div>
                                                <div>{review.body}</div>
                                              </div>
                                              {/* <div>{review.path}</div> */}
                                            </div>
                                          ) : null}
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div>
                                      {commitReview.map((review, index) => (
                                        <div key={index}>
                                          {review.path === files[0].filename ? (
                                            <div className={styles.commentbox}>
                                              <img
                                                src={review.user.avatar_url}
                                                alt="avatar"
                                                className={styles.commentavatar}
                                              />
                                              <div className={styles.content}>
                                                <div className={styles.comment}>
                                                  <div
                                                    className={
                                                      styles.commentuser
                                                    }
                                                  >
                                                    {review.user.login}
                                                  </div>
                                                  <div
                                                    className={
                                                      styles.commentdate
                                                    }
                                                  >
                                                    {review.created_at
                                                      .replace("T", " ")
                                                      .replace("Z", "")
                                                      .slice(0, 10)}
                                                  </div>
                                                </div>
                                                <div>{review.body}</div>
                                              </div>
                                              {/* <div>{review.path}</div> */}
                                            </div>
                                          ) : null}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </>
                              ) : null}

                              {/* <div>
                                {commitReview.map((review, index) => (
                                  <div
                                    key={index}
                                    className={styles.commentbox}
                                  >
                                    <img
                                      src={review.user.avatar_url}
                                      alt="avatar"
                                      className={styles.commentavatar}
                                    />
                                    <div className={styles.content}>
                                      <div className={styles.comment}>
                                        <div className={styles.commentuser}>
                                          {review.user.login}
                                        </div>
                                        <div className={styles.commentdate}>
                                          {review.created_at
                                            .replace("T", " ")
                                            .replace("Z", "")
                                            .slice(0, 10)}
                                        </div>
                                      </div>
                                      <div>{review.body}</div>
                                    </div>
                                    <div>{review.path}</div>
                                  </div>
                                ))}
                              </div> */}
                            </div>

                            {/* <Button
                              action={openModal}
                              content={"comment 작성하기"}
                              style={{
                                backgroundColor: "#6BCC78",
                                border: "2px solid #6BCC78",
                                fontWeight: "600",
                                width: "9rem",
                                marginTop: "1rem",
                              }}
                            /> */}
                            <Review
                              files={files}
                              sha={commit.sha}
                              pull={mergeReqInfo.number}
                            ></Review>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.buttons}>
        {!mergeReqInfo.merged ? (
          mergeReqInfo.mergeable ? (
            // mergeReqInfo.assignee.login === user ? (
              <Button
                action={mergeAccept}
                content={"merge"}
                style={{
                  backgroundColor: "#6BCC78",
                  border: "2px solid #6BCC78",
                  fontWeight: "600",
                }}
              />
            // ) : mergeReqInfo.requested_reviewers
          ) : (
            <Button
              content={"conflict를 해결해주세요"}
              style={{
                border: "2px solid #ff6b6b",
                backgroundColor: "#ff6b6b",
                width: "13rem",
                fontWeight: "600",
              }}
            />
          )
        ) : null}
        <Button
          action={goList}
          content={"목록 가기"}
          style={{ border: "2px solid #6BCC78", fontWeight: "600" }}
        />
      </div>
    </div>
  );
}
