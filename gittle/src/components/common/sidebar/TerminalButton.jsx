import React from "react";
import styles from "./TerminalButton.module.css"
const { ipcRenderer } = window.require("electron");
function TerminalButton() {
  return (
    <>
      <button className={styles.terminalButton}><img style={{ width: "40px", height: "40px" }}
      src={process.env.PUBLIC_URL + '/icons/terminal.png'} 
      alt="terminal" onClick={() => {ipcRenderer.send("openTerminal", localStorage.getItem("currentRepo"))}} />
      <br/>
      터미널
      </button>
    </>
  );
}

export default TerminalButton;
