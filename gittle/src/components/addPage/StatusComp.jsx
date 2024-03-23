import React, { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { commandLine } from "../../atoms";
import { Table, Row, Col, Card, Empty } from "antd";
import "antd/dist/antd.css";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Button from "../common/Button";
import GitCommitButton from "./GitCommitButton";
import {
  mutliDragAwareReorder,
  multiSelectTo as multiSelect,
} from "./StatusUtils";
import "./StatusStyle.css";
/**
 * git add
 * git status 상태 값
 * file:///C:/Program%20Files/Git/mingw64/share/doc/git-doc/git-status.html
 */

let unstagedIds = [];
let stagedIds = [];
let changedFile = [];
function statusData(gitStatus) {
  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //반쪽짜리
  //둘다 있을때 안사람짐 초기화 한번 해야됨
  unstagedIds = [];
  stagedIds = [];
  changedFile = [];
  let count = 0;

  const statusValue = ["M", "T", "A", "R", "C", "U", "D"];
  for (let status of gitStatus) {
    let statusArray = status
      .trim()
      .split(" ")
      .filter((element) => element !== "");
    if (statusValue.findIndex((e) => e === status[0]) !== -1) {
      stagedIds.push(count.toString());
      changedFile.push({
        id: count.toString(),
        type: status[0],
        title: statusArray[1],
      });
      count++;
    }
    if (
      statusValue.findIndex((e) => e === status[1]) !== -1 ||
      status[1] === "?"
    ) {
      unstagedIds.push(count.toString());
      changedFile.push({
        id: count.toString(),
        type: status[1],
        title: statusArray[1],
      });
      count++;
    }
  }
}

let entitiesMock = {
  tasks: changedFile,
  columnIds: ["unstaged", "staged"],
  columns: {
    unstaged: {
      id: "unstaged",
      title: "Unstaged",
      taskIds: unstagedIds,
    },
    staged: {
      id: "staged",
      title: "Staged",
      taskIds: stagedIds,
    },
  },
};
const COLUMN_ID_DONE = "staged";

// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
const PRIMARY_BUTTON_NUMBER = 0;

function MultiTableDrag({ getFile, getDiff, cmd, updateCmd }) {
  const { ipcRenderer } = window.require("electron");
  const currentRepo = localStorage.getItem("currentRepo");
  const [cmdLine, SetCmdLine] = useRecoilState(commandLine);
  const gitStatus = ipcRenderer
    .sendSync("gitStatus", currentRepo)
    .split("\n")
    .filter((element) => element !== "");
  statusData(gitStatus);
  entitiesMock.tasks = changedFile;
  entitiesMock.columns.unstaged.taskIds = unstagedIds;
  entitiesMock.columns.staged.taskIds = stagedIds;

  const [entities, setEntities] = useState(entitiesMock);
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [draggingTaskId, setDraggingTaskId] = useState(null);
  const [selectedTaskTitles, setSelectedTaskTitles] = useState([]);
  const [selectedCodes, setSelectedCodes] = useState([]);
  const [filenames, setFilename] = useState([]);
  //이거가 테이블 헤더? 그거
  const tableColumns = [
    {
      dataIndex: "title",
    },
  ];

  // unstaged 목록에서 클릭한 파일들에 대해 git diff 실행하는 함수
  useEffect(() => {
    const showDiff = (arr) => {
      //임시로 deleted 된거 선택하면 alert 주고 배열에서 삭제함
      let test = entities.tasks.filter((t) => arr.find((e) => e === t.title));
      for (let i in test) {
        if (test[i].type === "D") {
          alert(`${test[i].title} is deleted!!!!!!!!!!!!!`);
          arr.splice(i, 1);
        }
      }
      if (arr.length) {
        const gitDiff = ipcRenderer.sendSync("gitDiff", arr);
        // return gitDiff;
        setSelectedCodes(gitDiff);
        // 부모 요소에 unstaged 목록에서 선택한 파일 목록 보내기
        getFile(arr);
        // 부모 요소에 unstaged 목록에서 선택한 파일 변경 사항 보내기
        getDiff(gitDiff);
      }
    };
    showDiff(selectedTaskTitles);
    // getDiff(selectedCodes);
  }, [selectedTaskTitles]);

  useEffect(() => {
    const gitStatus = ipcRenderer
      .sendSync("gitStatus", currentRepo)
      .split("\n")
      .filter((element) => element !== "");
    statusData(gitStatus);
    entitiesMock.tasks = changedFile;
    entitiesMock.columns.unstaged.taskIds = unstagedIds;
    entitiesMock.columns.staged.taskIds = stagedIds;

    setEntities(entitiesMock);
  }, [entities, setEntities]);

  /**
   * On window click
   * 선택한 행 초기화
   */
  const onWindowClick = useCallback((e) => {
    if (e.defaultPrevented) {
      return;
    }
    // 정현 컴포넌트 누르면 초기화되길래 일단 주석 처리 해둠!
    // setSelectedTaskIds([]);
    // setSelectedTaskTitles([]);
  }, []);

  /**
   * On window key down
   * esc 클릭 시 선택한 행 초기화
   */
  const onWindowKeyDown = useCallback((e) => {
    if (e.defaultPrevented) {
      return;
    }

    if (e.key === "Escape") {
      // 정현 컴포넌트 누르면 초기화되길래 일단 주석 처리 해둠!
      // setSelectedTaskIds([]);
      // setSelectedTaskTitles([]);
    }
  }, []);

  /**
   * Event Listener
   */
  useEffect(() => {
    window.addEventListener("click", onWindowClick);
    window.addEventListener("keydown", onWindowKeyDown);

    return () => {
      window.removeEventListener("click", onWindowClick);
      window.removeEventListener("keydown", onWindowKeyDown);
    };
  }, [onWindowClick, onWindowKeyDown]);

  /**
   * Droppable table body
   */
  const DroppableTableBody = ({ columnId, tasks, ...props }) => {
    return (
      <Droppable
        droppableId={columnId}
        // isDropDisabled={columnId === 'unstaged'}
      >
        {(provided, snapshot) => (
          <tbody
            ref={provided.innerRef}
            {...props}
            {...provided.droppableProps}
            className={`${props.className} ${
              snapshot.isDraggingOver && columnId === COLUMN_ID_DONE
                ? "is-dragging-over"
                : ""
            }`}
          ></tbody>
        )}
      </Droppable>
    );
  };

  /**
   * Draggable table row
   */
  const DraggableTableRow = ({ index, record, columnId, tasks, ...props }) => {
    if (!tasks.length) {
      return (
        <tr className="ant-table-placeholder row-item" {...props}>
          <td colSpan={tableColumns.length} className="ant-table-cell">
            <div className="ant-empty ant-empty-normal">
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
          </td>
        </tr>
      );
    }

    const isSelected = selectedTaskIds.some(
      (selectedTaskId) => selectedTaskId === record.id
    );

    const isGhosting =
      isSelected && Boolean(draggingTaskId) && draggingTaskId !== record.id;

    return (
      <Draggable
        key={props["data-row-key"]}
        draggableId={props["data-row-key"]}
        index={index}
      >
        {(provided, snapshot) => {
          return (
            <tr
              ref={provided.innerRef}
              {...props}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={`row-item ${isSelected ? "row-selected" : ""} ${
                isGhosting ? "row-ghosting" : ""
              } ${snapshot.isDragging ? "row-dragging" : ""}`}
              // onClick={onClick}
              // onKeyDown={event => onKeyDown(event, provided, snapshot)}
            ></tr>
          );
        }}
      </Draggable>
    );
  };

  /**
   * Get tasks
   */
  const getTasks = (entities, id) => {
    return entities.columns[id].taskIds.map((taskId) =>
      entities.tasks.find((item) => item.id === taskId)
    );
  };

  /**
   * On before capture
   */
  const onBeforeCapture = (start) => {
    const draggableId = start.draggableId;
    const selected = selectedTaskIds.find((taskId) => taskId === draggableId);
    // if dragging an item that is not selected - unselect all items
    // 드래그 중인 아이템이 선택된 것이 아닐 때 초기화
    if (!selected) {
      setSelectedTaskIds([]);
      setSelectedTaskTitles([]);
    }
    //드래그 중인 아이템에 현재 드래그 중인 행 추가
    // setDraggingTaskId(draggableId);   얘가 문제!!!!!!!!!!!!!!!!!!!!!!!
  };
  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 이 밑으로 쭉 바꿈 리턴 바로위까지
  /**
   * On drag end
   */
  const onDragEnd = (result) => {
    const destination = result.destination;
    const source = result.source;
    let files = "";
    // 같은 테이블 or 테이블 밖이면 초기화
    if (
      !destination ||
      destination.droppableId === source.droppableId ||
      result.reason === "CANCEL"
    ) {
      setDraggingTaskId(null);
      return;
    }
    for (let i of selectedTaskIds) {
      files +=
        " " +
        entitiesMock.tasks.find((element) => element.id === i.toString()).title;
    }
    if (destination.droppableId === "staged") {
      ipcRenderer.send("gitAdd", files);
      // let nextCmd=gitStatus.cmd + `\n` + files
      let nextCmd = `${cmdLine} \n git add ${files}`;
      SetCmdLine(nextCmd);
    } else if (destination.droppableId === "unstaged") {
      ipcRenderer.send("gitReset", files);
      let nextCmd = `${cmdLine} \n git reset ${files}`;
      // let nextCmd=gitStatus.cmd + `\n` + `git add ${files}`
      SetCmdLine(nextCmd);
    }
    const processed = mutliDragAwareReorder({
      entities,
      selectedTaskIds,
      source,
      destination,
    });

    setEntities(processed.entities);
    setDraggingTaskId(null);
  };

  /**
   * Toggle selection
   * 키 안누르고 행 선택할 때
   */
  const toggleSelection = (task) => {
    const wasSelected = selectedTaskIds.includes(task.id);
    const wasSelctedFiles = selectedTaskTitles.includes(task.title);
    const newTaskIds = (() => {
      // Task was not previously selected
      // now will be the only selected item
      // 선택 안 되어 있었으면 추가
      if (!wasSelected) {
        return [task.id];
      }

      // Task was part of a selected group
      // will now become the only selected item
      // 여러개 선택되어 있었으면 그 행만 선택, 나머지 초기화
      if (selectedTaskIds.length > 1) {
        return [task.id];
      }
      // task was previously selected but not in a group
      // we will now clear the selection
      // 선택 되어있었으면 빼기
      return [];
    })();

    const newTaskTitles = (() => {
      if (!wasSelctedFiles) {
        return [task.title];
      }
      if (setSelectedTaskTitles.length > 1) {
        return [task.title];
      }
      return [];
    })();

    setSelectedTaskIds(newTaskIds);
    setSelectedTaskTitles(newTaskTitles);
  };

  /**
   * Toggle selection in group
   * ctrl키 누르고 선택 시
   */
  const toggleSelectionInGroup = (task) => {
    const index = selectedTaskIds.indexOf(task.id);
    const title = selectedTaskTitles.indexOf(task.title);
    // if not selected - add it to the selected items
    // 선택 안되어 있었으면 추가
    if (index === -1) {
      setSelectedTaskIds([...selectedTaskIds, task.id]);
      setSelectedTaskTitles([...selectedTaskTitles, task.title]);
      return;
    }

    // it was previously selected and now needs to be removed from the group
    // 선택 되어 있었으면 빼기
    const shallow = [...selectedTaskIds];
    const shallowTitles = [...selectedTaskTitles];
    shallow.splice(index, 1);
    shallowTitles.splice(title, 1);

    setSelectedTaskIds(shallow);
    setSelectedTaskTitles(shallowTitles);
  };

  /**
   * Multi select to
   * This behaviour matches the MacOSX finder selection
   * shift키 선택시
   */
  const multiSelectTo = (task) => {
    //util.js 확인
    const updated = multiSelect(entities, selectedTaskIds, task.id);
    if (updated == null) {
      return;
    }

    const updatedTitles = multiSelect(entities, selectedTaskTitles, task.title);
    if (updatedTitles == null) {
      return;
    }

    setSelectedTaskIds(updated);
    setSelectedTaskTitles(updatedTitles);
  };

  /**
   * On click to row
   * Using onClick as it will be correctly
   * preventing if there was a drag
   */
  const onClickRow = (e, record) => {
    if (e.defaultPrevented) {
      return;
    }
    //좌클릭 아니면 반응 X
    if (e.button !== PRIMARY_BUTTON_NUMBER) {
      return;
    }

    // marking the event as used
    e.preventDefault();
    performAction(e, record);
  };

  /**
   * Was toggle in selection group key used
   * Determines if the platform specific toggle selection in group key was used
   * ctrl키 누르고 있는지 boolean 값 반환
   */
  const wasToggleInSelectionGroupKeyUsed = (e) => {
    const isUsingWindows = navigator.platform.indexOf("Win") >= 0;
    return isUsingWindows ? e.ctrlKey : e.metaKey;
  };

  /**
   * Was multi select key used
   * Determines if the multiSelect key was used
   * shift키 사용한 다중 선택
   */
  const wasMultiSelectKeyUsed = (e) => e.shiftKey;

  /**
   * Perform action
   * 행 선택했을 때 ctrl, shift, 기본 별 분기점
   */
  const performAction = (e, record) => {
    //ctrl
    if (wasToggleInSelectionGroupKeyUsed(e)) {
      toggleSelectionInGroup(record);
      return;
    }

    //shift
    if (wasMultiSelectKeyUsed(e)) {
      multiSelectTo(record);
      return;
    }

    //default
    toggleSelection(record);
  };

  useEffect(() => {
    // SetCmd(`cd "${localStorage.getItem("currentRepo")}"`);
    commitButton();
  }, []);

  const commitButton = () => {
    const statusValue = ["M", "T", "A", "R", "C", "U", "D"];
    const gitStatus = ipcRenderer
      .sendSync("gitStatus", localStorage.getItem("currentRepo"))
      .split("\n")
      .filter((element) => element !== "");
    let c = true;
    for (let status of gitStatus) {
      if (statusValue.findIndex((e) => e === status[0]) !== -1) {
        c = false;
      }
    }
    if (c) return;
    else return <GitCommitButton />;
  };

  return (
    <>
      <Card className={`c-multi-drag-table`}>
        <br />
        <DragDropContext
          onBeforeCapture={onBeforeCapture}
          onDragEnd={onDragEnd}
        >
          <Row gutter={24}>
            <Col key="unstaged" span={12}>
              <div className="inner-col-unstaged">
                <Row>
                  <p className="stageStatus">Unstaged</p>
                </Row>
                <Table
                  dataSource={getTasks(entities, "unstaged")}
                  columns={tableColumns}
                  pagination={false}
                  scroll={{ y: 200 }}
                  rowKey="id"
                  components={{
                    body: {
                      // Custom tbody
                      wrapper: (val) =>
                        DroppableTableBody({
                          columnId: entities.columns["unstaged"].id,
                          tasks: getTasks(entities, "unstaged"),
                          ...val,
                        }),
                      // Custom td
                      row: (val) =>
                        DraggableTableRow({
                          tasks: getTasks(entities, "unstaged"),
                          ...val,
                        }),
                    },
                  }}
                  // Set props on per row (td)
                  onRow={(record, index) => ({
                    index,
                    record,
                    onClick: (e) => onClickRow(e, record),
                  })}
                />
              </div>
            </Col>
            <Col key="Staged" span={12}>
              <div className="inner-col-staged">
                <Row justify="space-between" align="middle">
                  <p className="stageStatus">Staged</p>
                </Row>
                <Table
                  dataSource={getTasks(entities, "staged")}
                  columns={tableColumns}
                  pagination={false}
                  scroll={{ y: 200 }}
                  rowKey="id"
                  components={{
                    body: {
                      // Custom tbody
                      wrapper: (val) =>
                        DroppableTableBody({
                          columnId: entities.columns["staged"].id,
                          tasks: getTasks(entities, "staged"),
                          ...val,
                        }),
                      // Custom td
                      row: (val) =>
                        DraggableTableRow({
                          tasks: getTasks(entities, "staged"),
                          ...val,
                        }),
                    },
                  }}
                  // Set props on per row (td)
                  onRow={(record, index) => ({
                    index,
                    record,
                    onClick: (e) => onClickRow(e, record),
                  })}
                />
              </div>
            </Col>
          </Row>
        </DragDropContext>
      </Card>

      <div className="buttonContainer">
        <Button
          content={"전체 add"}
          action={() => {
            ipcRenderer.send("gitAdd", ".");
            SetCmdLine(`${cmd} \n git add .`);
          }}
        />
        <div>{commitButton()}</div>
      </div>
    </>
  );
}

export default MultiTableDrag;
