import React, { useState, useEffect } from "react";
import { Octokit } from "octokit";
import { useRecoilValue } from "recoil";
import { logsList } from "../../atoms";
import styles from "./Graph.module.css";

export default function Graph() {
  const logs = useRecoilValue(logsList);
  useEffect(() => {
    console.log("aaaaaaaaaaaa", logs);
  }, []);

  return <>{/* <div>{logs[0].commit}</div> */}</>;
}
