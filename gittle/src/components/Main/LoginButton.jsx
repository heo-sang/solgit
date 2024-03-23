import React,{ useEffect, useState } from "react";
import styles from "./LoginButton.module.css"
import Modal from "../common/Modal";



// const CLIENT_ID = process.env.REACT_APP_GITHUB_CLIENT_ID

// const ACCESS_TOKEN_API_URL = `${process.env.REACT_APP_SERVER_BASE_URL}/getAccessToken?code=`
const USER_DATA_API_URL = `${process.env.REACT_APP_SERVER_BASE_URL}/getUserData`
const DEVICE_FLOW_START = `${process.env.REACT_APP_SERVER_BASE_URL}/getUserCode`
const DEVICE_FLOW_TOKEN = `${process.env.REACT_APP_SERVER_BASE_URL}/getDeviceAccessToken?code=`


function Login(){

  const [rerender, setRerender] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [userData, setUserData] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  
    const  nonHover= <span><img className={styles.logo} src={process.env.PUBLIC_URL + '/icons/github-logo-silhouette-in-a-square.png'} alt="gittle-Logo" /></span>
    const  hovered = <span><img className={styles.logo} src={process.env.PUBLIC_URL + '/icons/github3.png'} alt="gittle-Logo" /></span>
    

    //기존방식 (web flow github oauth)

    // useEffect(() => {
    //         const queryString = window.location.search;
    // const urlParams = new URLSearchParams(queryString);
    //   const codeParam = urlParams.get("code");
      

    // if (codeParam && localStorage.getItem("accessToken") === null) {
    //   async function getAccessTokenAndData() {
    //     await fetch(`${ACCESS_TOKEN_API_URL}` + codeParam, {
    //       method: "GET",
    //     })
    //       .then((response) => {
    //         return response.json();
    //       })
    //       .then((data) => {
    //         if (data.access_token) {
    //           localStorage.setItem("accessToken", data.access_token);
    //           setRerender(!rerender);
    //         }
    //       });
    //       await fetch(`${USER_DATA_API_URL}`, {
    //         method: "GET",
    //         headers: {
    //           Authorization: "Bearer " + localStorage.getItem("accessToken"),
    //         },
    //       })
    //         .then((response) => {
    //           return response.json();
    //         })
    //         .then((data) => {
    //           //데이터를 object로
    //           setUserData(data);
    //           localStorage.setItem("userInfo", data.login);
    //         });
    //     }
    //   getAccessTokenAndData();
    //   }
    // },[])




 //device flow github oauth

 async function loginWithGithub() {

  //user_code 받기
  await fetch (`${DEVICE_FLOW_START}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();

    })
    .then((data) => {

      localStorage.removeItem("userCode");
      localStorage.removeItem("deviceCode");
      localStorage.setItem("userCode", data.user_code);

      window.open("https://github.com/login/device", "github", "top=200");
      setModalOpen(true);
    });

    }
    
    async function toNextStep(){
      //accessToken 요청
      await fetch (`${DEVICE_FLOW_TOKEN}` + localStorage.getItem("deviceCode"), {
        method: "GET",
      })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        localStorage.setItem("accessToken", data.access_token);
        setRerender(!rerender);
      });
  
      //user data 요청
      await fetch(`${USER_DATA_API_URL}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          //데이터를 object로
          setUserData(data);
          localStorage.setItem("userInfo", data.login);
          localStorage.removeItem("userCode");
          localStorage.removeItem("deviceCode");
        });
    }
    
    function closeModal(){
      setModalOpen(false);
    }

      
     

    return(
        <div className={styles.login}>

            {localStorage.getItem("userInfo") ? (
                <>
                <button className={styles.button} onMouseOver={()=> setIsHover(true)} onMouseOut={()=>setIsHover(false)} onClick={() => {
              localStorage.removeItem("accessToken");
              localStorage.removeItem("userInfo");
              setRerender(!rerender);
                    }}>{
                            isHover ? nonHover : hovered}
                <br/>github 로그아웃</button>
                </>
            )
                : (
            <button className={styles.button} onMouseOver={()=> setIsHover(true)} onMouseOut={()=>setIsHover(false)} onClick={loginWithGithub}>
                {isHover? nonHover : hovered}
                <br/>
                github 로그인
            </button>
        )
        }
        

        <Modal
        open={modalOpen}
        content={
          <>
            <div className={styles.forMargin}>
              <div><p style={{fontSize:"17px", fontWeight: "500"}}>아래 코드를 입력/전송 후 완료 버튼을 눌러주세요.</p></div>
              <div style={{display: "flex", justifyContent: "center"}}><p style={{fontSize: "20px", fontWeight: "600"}}>{localStorage.getItem("userCode")}</p></div>
            </div>
          </>
        }
      >

        <div className={styles.btnSet}
         style={{display: "flex", justifyContent: "center"}}>
          <button className={styles.userCodeBtn}
             onClick={() => {
              toNextStep();
              closeModal();
              }}
            style={{ borderColor: "#1FA431", color: "#1FA431"}}
          >완료</button>
          <button className={styles.userCodeBtn}
            onClick={closeModal}
            style={{
              borderColor: "#818181", color:"#818181" }}
          >취소</button>
                    {/* <button className={styles.rulePlusBtn2}
            onClick={() => {
              toNextStep();
              closeModal();
              }}
            style={{ backgroundColor: "#6BCC78", color: "white"}}
          >완료</button>
          <button className={styles.rulePlusBtn2}
            onClick={closeModal}
            style={{
              backgroundColor: "#DCDCDC" }}
          >취소</button> */}
        </div>
      </Modal>


        </div>


    )
}


export default Login;