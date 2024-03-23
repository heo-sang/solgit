import React, { useState } from "react";
import Button from "../Button";
import Modal from "../Modal";
import Dropdown from 'react-bootstrap/Dropdown';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const { ipcRenderer } = window.require("electron"); 
const getCommitRules = () => {
  return JSON.parse(ipcRenderer.sendSync("ReadCommitRules"))
}

function AddCommitRules() {
  const [modalOpen, setModalOpen] = useState(false);
  const [commitType, setCommitType] = useState('')
  const [commitExplanation, setCommitExplanation] = useState('')
  const [commitRules, setCommitRules] = useState(getCommitRules())
  const [newType, setNewType] = useState('')
  const [newExplanation, setNewExplanation] = useState('')
  const [commitDescription, setCommitDescription] = useState('')
  const lastCommitDescription = ipcRenderer.sendSync("lastCommitDescription","git log --pretty=format:'%s' --no-merges -n 1")
  //setType(commitRules[0].type)
  const onChangeNewType = (e) => {
    setNewType(e.target.value)
  };
  const onChangeNewExplanation = (e) => {
    setNewExplanation(e.target.value)
  };

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };
  const addCommitRules = () => {
    const commitRules = ipcRenderer.sendSync("WriteCommitRules",{type:newType,explanation:newExplanation})
    setNewType('')
    setNewExplanation('')
    setCommitRules(commitRules)
    closeModal()
  }
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {props}
    </Tooltip>
  );
  const onChangeCommitDescription = (e) => {
    setCommitDescription(e.target.value)
  };
  const commit = () => {
    if(commitType ===''){
      alert("Commit 타입을 지정해주세요")
      return;
    }
    if(commitDescription === ''){
      alert("Commit 설명을 작성해주세요")
      return;
    }
    const commitMessage = commitType + " : " + commitDescription
    const command = `git commit -m "${commitMessage}"`
    const data = ipcRenderer.sendSync("gitCommit",command)
    setCommitDescription('')
    setCommitType('')
  }
  return (
    <>
      <Dropdown>
        <Dropdown.Toggle id="commit-rule">
          {commitType === '' ? <>Commit 타입</> : <>{commitType}</>}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {(() => {
            const arr = [];
            for (let i of commitRules) {
                arr.push(
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip(i.explanation)}
                  >
                    <Dropdown.Item value={i.type} onClick={() =>{setCommitType(i.type)}}>{i.type}</Dropdown.Item>
                  </OverlayTrigger>
                );
            }
            return arr;
          })()}
        </Dropdown.Menu>
        <Button 
          action={openModal}
          content={"추가"}
          style={{ backgroundColor: "#6BCC78", color: "white" }}
        />
      </Dropdown>
      <div>
        <input 
          type="text"
          placeholder={lastCommitDescription}
          onChange={onChangeCommitDescription}
          value={commitDescription}
        />
        <Button 
          action={commit}
          content={"Commit"}
          style={{ backgroundColor: "#4D96FF", color: "white" }}
        />
      </div>      




      <Modal
        open={modalOpen}
        content={
          <>
            <div>
              <label>타입</label>
              <input 
                type="text"
                placeholder="Feat"
                onChange={onChangeNewType}
                value={newType}
              />
            </div>
            <br/>
            <div>
              <label>설명</label>
              <input 
                type="text"
                placeholder="기능 변경"
                onChange={onChangeNewExplanation}
                value={newExplanation} 
              />
            </div>
          </>
        }
      >
        <div>
          <Button 
            action={addCommitRules}  
            content={"추가"} 
            style={{ backgroundColor: "#6BCC78" }} 
          />
          <Button
            action={closeModal}
            content={"취소"}
            style={{ border: "1px solid #7B7B7B" }}
          />
        </div>
      </Modal>
    </>
  );
}

export default AddCommitRules;
