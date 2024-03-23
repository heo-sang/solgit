import React, { useState } from "react";
import styles from "./Modal.module.css"
import { useNavigate } from "react-router";
import { useRecoilState } from "recoil";
import {commandLine} from "../../atoms"



function Modal(props){
    

    //페이지 넘어가기 위한 변수
    const navigate=useNavigate()

    //페이지 넘어갈 때 필요한 두 가지(저장소 이름, 저장소 폴더 위치)
    const [repoName,setRepoName]=useState("");
    const [repoRoot, setRepoRoot]= useState("");
    //클론 주소
    const [cloneRoot, setCloneRoot]=useState("");
    const [folderName, setFolderName]=useState("")
    //폴더 위치 가져오기 위한 변수선언
    const {ipcRenderer} = window.require('electron')

    const [cmd , SetCmd] = useRecoilState(commandLine)

    

    //폴더 위치 가져오는 함수
    const findDirectoryRoot = ()=>{
        setRepoRoot(ipcRenderer.sendSync("click",'start'))
    }

    const updateMyRepo= (folder)=>{
            let arr;
            if(localStorage.getItem('repoList')===null || localStorage.getItem('repoList')===""){
                arr=[]
            }else{
                arr =JSON.parse(localStorage.getItem('repoList'))
            }

            if(props.setModalOpen.number===0){

                arr.unshift({branch:repoName,root:repoRoot+"\\"+repoName})
            }else if(props.setModalOpen.number===1){
                arr.unshift({branch:repoName,root:repoRoot})
            }else{
                arr.unshift({branch:repoName,root:repoRoot+"\\"+folder})
            }

            if(arr.length===4){
                arr.pop()
            }
            localStorage.setItem('repoList',JSON.stringify(arr))

            setRepoRoot(repoName+"\\"+repoName)
    }

    const cloneMyRepo=()=>{
        
        const folderName=ipcRenderer.sendSync('git-Clone',{repoRoot:repoRoot,cloneRoot:cloneRoot})
        setFolderName(folderName)
        return folderName
    }

    const initMyRepo=()=>{
        ipcRenderer.sendSync('git-Init',{repoName:repoName ,repoRoot:repoRoot})
        const temp=repoRoot
        
    }

    //최근 사용한 Repo로 값 넣어주기

    //저장소 이름 가져오기
    const repositoryName =(
            <div className={styles.inputBlock}>
                <div className={styles.names}>Repository 이름</div>
                <input type="text" className={styles.noButton} onChange={(e)=>{
                    setRepoName(e.target.value)
                }}/>
            </div>
        )
    

    //경로 가져오기
    const localPath=(
            <div  className={styles.inputBlock}>
                <div className={styles.names}>Local 경로</div>
                <div onClick={findDirectoryRoot}>
                    <input className={styles.localPath} type="text" readOnly value={repoRoot}/>
                    <button className={styles.pathButton}>
                        <img className={styles.directoryImage} src={process.env.PUBLIC_URL + '/icons/directoryImage.png'}/>
                        </button>
                </div>
            </div>
        )

    //깃 클론용 주소
    const clonePath =(
        <div className={styles.inputBlock}>
            <div className={styles.names}>깃 클론 주소</div>
            <input type="text" className={styles.noButton} onChange={(e)=>{
                setCloneRoot(e.target.value)
            }}/>
        </div>
    )

    //.git 폴더가 있는지 확인
    const checkGitFolder=()=>{
        const result = ipcRenderer.sendSync("check-git-folder",repoRoot)
        return result
    }
    

    //버튼 모음
    const buttonFooter=(
            <div className={styles.buttonLayer}>
                <button className={styles.positiveButton} onClick={()=>{
                    if(props.setModalOpen.number===0){
                        //git init 
                        initMyRepo(repoName)
                        updateMyRepo('')
                        localStorage.setItem('currentRepo',repoRoot+"\\"+repoName)
                        SetCmd(repoRoot+"\\"+repoName+"\n"+"git init")
                        navigate("/add",{state:{name:repoName,root:repoRoot}})
                    }else if(props.setModalOpen.number===1){
                        //폴더 바꿔주기
                        if(checkGitFolder()==='false'){
                            alert('git이 시작되지 않았습니다. 레포지토리를 생성하거나, 폴더 주소를 확인해주세요')
                            return
                        }
                        updateMyRepo('')
                        ipcRenderer.send("create-localStorage",repoRoot)
                        localStorage.setItem('currentRepo',repoRoot)
                        navigate("/add",{state:{name:repoName,root:repoRoot}})
                    }else{
                        const folder=cloneMyRepo()
                        updateMyRepo(folder)
                        const result=repoRoot+"\\"+folder
                        localStorage.setItem('currentRepo',result)
                        SetCmd(`git clone ${cloneRoot} \n cd "${result}"`)
                        navigate("/add",{state:{name:repoName,root:result}})
                    }
                    
                }}>
                    {props.setModalOpen.number===1 ? "열기":"만들기"}
                </button>
                <button className={styles.negativeButton} onClick={()=>props.close()}>취소</button>
            </div>
        )

    return(
        <div className={styles.modal}>
            <div className={styles.nameTag}>
                {'Repository'+props.setModalOpen.name}
            </div>

            {props.setModalOpen.number===0 && repositoryName}
            {props.setModalOpen.number===2 && clonePath}

            {localPath}

            {buttonFooter}
            
        </div>
    )
}



export default Modal;