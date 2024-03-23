import React, { useEffect, useState } from "react";
import { Octokit } from "octokit";
import styles from "./GitLog.module.css";
import { useRecoilValue } from "recoil";
import { currentBranch } from "../../atoms";

export default function GitLog() {
  const [logs, setLogs] = useState([]);
  const [commit, setCommit] = useState("");
  // 마지막 커밋 변경 파일 목록
  const [files, setFiles] = useState([]);
  const [commitId, setCommitId] = useState("");
  // 마지막 커밋에서 모든 파일의 코드
  const [codeBefore, setCodeBefore] = useState([]);
  const [codeAfter, setCodeAfter] = useState([]);
  const [commitIdx, setCommitIdx] = useState(0);
  const [fileIdx, setFileIdx] = useState(0);
  const branch = useRecoilValue(currentBranch);


  useEffect(() => {
    async function getLog() {
      const user = localStorage.getItem("userInfo");
      const location = localStorage.getItem("currentRepo").split("\\");
      const repo = location[location.length - 1];
      const owner = localStorage.getItem("owner")
      const token = localStorage.getItem("accessToken");


      const octokit = new Octokit({
        auth: token,
      });

      const result = await octokit.request(
        "GET /repos/{owner}/{repo}/commits",
        {
          owner: owner,
          repo: repo,
          sha: branch,
        }
      );

      setLogs(result.data);
    }
    getLog();
  }, [branch]);

  useEffect(() => {
    async function getCommit() {
      const user = localStorage.getItem("userInfo");
      const location = localStorage.getItem("currentRepo").split("\\");
      const repo = location[location.length - 1];
      const owner = localStorage.getItem("owner")
      const token = localStorage.getItem("accessToken");


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
    getCommit();
  }, [commit]);

  const showDiff = (sha, index) => {
    setCommit(sha);
    setCommitIdx(index);
  };
  const showCode = (index) => {
    setFileIdx(index);
  };
  return (
    <div className={styles.container}>
      {branch}
      {logs.map((log, index) => (
        <div
          className={styles.logbox}
          key={index}
          onClick={() => showDiff(log.sha, index)}
        >
          <div className={styles.profile}>
            <img
              src={log.committer.avatar_url}
              alt="avatar"
              className={styles.avatar}
            />
            <div className={styles.textbox}>
              <div className={styles.message}>{log.commit.message}</div>
              <div className={styles.authortime}>
                <div className={styles.name}>{log.committer.login}</div>
                <div className={styles.time}>
                  {log.commit.author.date.replace("T", " ").replace("Z", "")}
                </div>
              </div>
            </div>
          </div>
          <div>
            {files.length &&
            codeBefore.length &&
            codeAfter.length &&
            log.sha === commitId ? (
              <div className={styles.codearea}>
                <div className={styles.codebox}>
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className={styles.file}
                      onClick={() => showCode(index)}
                    >
                      {index === fileIdx ? (
                        <div className={styles.active}>{file.filename}</div>
                      ) : (
                        <div className={styles.filename}>{file.filename}</div>
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
                            <div className={styles.minus}>{code}</div>
                          ) : (
                            <div className={styles.zero}>{code}</div>
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
                            <div className={styles.plus}>{code}</div>
                          ) : (
                            <div className={styles.zero}>{code}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
