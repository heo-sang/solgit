import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import styles from "./GitHelp.module.css";

const gitCommandExample = [
  "git help : git 명령어에 대한 도움을 받을 수 있습니다.",
  "git init : git을 사용한 버전 관리를 시작할 수 있습니다.",
  "git add : 작업 사항을 staging area로 올릴 수 있습니다.",
  "git commit : staging area의 작업 사항을 내 지역 저장소에 새로운 버전으로 저장합니다.",
  "git status : 현재 작업 상황을 확인할 수 있습니다.",
  "git branch : branch의 목록을 확인할 수 있습니다.",
  "git push : 지역 저장소의 내용을 원격 저장소에 저장합니다.",
  "git fetch : 원격 저장소의 변경 내역을 불러와 지역 저장소에서 확인할 수 있습니다.",
  "git merge : 원격 저장소의 변경 사항을 지역 저장소에 병합합니다.",
  // "git pull : fetch와 merge 기능을 합친 기능입니다.(권장하지않음)",
  "git pull : fetch와 merge 기능을 합친 기능입니다.",
  "",
];
function GitHelp() {
  return (
    <Dropdown drop="down" size="sm">
      <Dropdown.Toggle variant="white" size="sm" className={styles.question}>
        <img
          style={{ width: "40px", height: "40px" }}
          src={process.env.PUBLIC_URL + "/icons/question.png"}
        ></img>
        <br />
        <span>깃 명렁어</span>
      </Dropdown.Toggle>
      <Dropdown.Menu variant="dark">
        {(() => {
          const arr = [];
          for (let i of gitCommandExample) {
            arr.push(<Dropdown.Item>{i}</Dropdown.Item>);
          }
          return arr;
        })()}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default GitHelp;
