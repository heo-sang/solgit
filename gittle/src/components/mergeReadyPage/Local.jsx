import React, { useEffect, useState } from "react";
import styles from "./Local.module.css";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRecoilValue } from "recoil";
import { committedFiles } from "../../atoms";

export default function Local() {
  const pushed = useRecoilValue(committedFiles);

  return (
    <>
      <div className={styles.local}>
        <div className={styles.tag}>
          <div className={styles.localbox}>local</div>
        </div>
        <div className={styles.box}>
          <div className={styles.title}>push 완료된 파일</div>
          <div className={styles.list}>
            {pushed.map((file, index) => (
              <div key={index} className={styles.file}>
                <FontAwesomeIcon icon={faFile} className={styles.icon} />
                <div className={styles.name}>{file}</div>
              </div>
            ))}
            {/* <div className={styles.file}>
              <FontAwesomeIcon icon={faFile} className={styles.icon} />
              <div className={styles.name}>파일 10</div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
