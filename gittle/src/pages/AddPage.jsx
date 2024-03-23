import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { commandLine } from "../atoms";
import GitDiff from "../components/addPage/GitDiff";
import GitCommitButton from "../components/addPage/GitCommitButton";
import StatusComp from "../components/addPage/StatusComp";
import Command from "../components/common/underbar/Command";
import styles from "./AddPage.module.css";

function AddPage() {
  const [files, setFiles] = useState({});
  const [codes, setCodes] = useState([]);
  const [cmd, SetCmd] = useRecoilState(commandLine);
  const { ipcRenderer } = window.require("electron");

  useEffect(() => {
    SetCmd(`cd "${localStorage.getItem("currentRepo")}"`);
    // commitButton();
  }, []);

  const getFile = (file) => {
    setFiles(file);
  };
  const getDiff = (diff) => {
    setCodes(diff);
  };
  const updateCmd = (arg) => {
    SetCmd(arg);
  };
  // const commitButton = () => {
  //   const statusValue = ["M", "T", "A", "R", "C", "U", "D"];
  //   const gitStatus = ipcRenderer
  //     .sendSync("gitStatus", localStorage.getItem("currentRepo"))
  //     .split("\n")
  //     .filter((element) => element !== "");
  //   let c = true;
  //   for (let status of gitStatus) {
  //     if (statusValue.findIndex((e) => e === status[0]) !== -1) {
  //       c = false;
  //       console.log("asdfasfdsafdsfdafsdasfdsadfsadf");
  //     }
  //   }
  //   if (c) return;
  //   else return <GitCommitButton />;
  // };
  return (
    <div>
      <div className={styles.container}>
        {/* 깃커밋버튼 */}
        {/* <div className={styles.commitButton}>{commitButton()}</div> */}

        <GitDiff diffFiles={files} diff={codes} />

        <StatusComp
          getFile={getFile}
          getDiff={getDiff}
          cmd={cmd}
          updateCmd={updateCmd}
        />
      </div>

      <footer className={styles.cmdDiv}>
        <Command></Command>
      </footer>
    </div>
  );
}

export default AddPage;
