import React from "react";
import { useLocation } from "react-router-dom";
import BranchList from "./BranchList";
import CreateBranch from "./CreateBranch";
import GitHelp from "./GitHelp";
import TerminalButton from "./TerminalButton";
import styles from "./SideBar.module.css";

function SideBar() {
  const location = useLocation();
  if (location.pathname === "/") return null;
  return (
    <div className={styles.container}>
      <BranchList />

      <div>
        <CreateBranch />
        <div className={styles.infoContainer}>
          <TerminalButton />
          <GitHelp />
        </div>
      </div>
    </div>
  );
}

export default SideBar;
