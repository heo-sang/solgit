import React, { useState, useEffect } from "react";
import { Octokit } from "octokit";
import { useRecoilState, useRecoilValue } from "recoil";
import { logsList } from "../atoms";
import Graph from "../components/graphPage/Graph";

export default function GraphPage() {
  const user = localStorage.getItem("userInfo");
  const location = localStorage.getItem("currentRepo").split("\\");
  const repo = location[location.length - 1];

  const [branches, setBranches] = useState([]);
  const [commits, setCommits] = useState([]);
  const [logs, setLogs] = useRecoilState(logsList);
  const logArr = useRecoilValue(logsList);
  const token = localStorage.getItem("accessToken");


  async function getBranches() {
    const octokit = new Octokit({
      auth: token,
    });

    const branches = await octokit.request(
      "GET /repos/{owner}/{repo}/branches",
      {
        owner: user,
        repo: repo,
      }
    );

    console.log("111", branches);
    setBranches(branches.data);
    return branches.data;
  }

  async function getCommits(branchList) {
    const logList = [];

    await branchList.map(async (branch) => {
      const octokit = new Octokit({
        auth: token,
      });
      const commitResults = await octokit.request(
        "GET /repos/{owner}/{repo}/commits",
        {
          owner: user,
          repo: repo,
          sha: branch.name,
        }
      );

      console.log(branch.name, commitResults);
      commitResults.data.map((commit) => {
        logList.push({
          branch: branch.name,
          author: commit.author.login,
        });
      });
    });

    console.log(logList);
    return logList;
  }

  useEffect(async () => {
    const gotBranches = await getBranches();
    const response = await getCommits(gotBranches);
    console.log("fffff", response);
  }, []);

  return (
    <>
      <Graph />
    </>
  );
}
