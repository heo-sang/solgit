import React, { useEffect } from "react";
import Logo from "../components/Main/Logo";
import Buttons from "../components/Main/Buttons";
import Tutorial from "../components/Main/Tutorial";
import Repositories from "../components/Main/Repositories";
import LoginButton from "../components/Main/LoginButton";
import styles from "./MainPage.module.css";

function MainPage() {
  useEffect(() => {
    // if(localStorage.getItem('currentRepo')!==''){
    localStorage.removeItem("currentRepo");
    // }
  }, []);

  return (
    <div className={styles.container}>
      <Logo />
      <Buttons />
      <Tutorial />
      <Repositories />
      <LoginButton />
    </div>
  );
}

export default MainPage;
