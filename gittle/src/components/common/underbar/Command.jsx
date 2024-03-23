import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { commandBranch, commandLine } from "../../../atoms";

import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Command.module.css";

function Command(props) {
  const [cmd, setCmd] = useRecoilState(commandLine);
  let arr = cmd.split("\n");
  const [isActive, SetIsActive] = useState(false);

  return (
    <>
      <div className={!isActive ? styles.cmdBox : styles.bigCmdBox}>
        <div
          className={styles.button}
          onClick={() => {
            SetIsActive(!isActive);
          }}
        >
          {!isActive && (
            <FontAwesomeIcon icon={faCaretUp} className={styles.dropicon} />
          )}
          {isActive && (
            <FontAwesomeIcon icon={faCaretDown} className={styles.dropicon} />
          )}
        </div>
        <div className={styles.wordBox}>
          {!isActive && (
            <div className={styles.lastWord}>{arr[arr.length - 1]}</div>
          )}

          {isActive &&
            arr.map((item, idx) => (
              <div
                key={idx}
                className={
                  idx === arr.length - 1 ? styles.lastWord : styles.cmd
                }
              >
                {item}
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default Command;
