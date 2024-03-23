import React from "react";
import { Link, useLocation } from "react-router-dom";
import GitPull from "./GitPull";
import HelpGuide from "./HelpGuide";
import Button from "../Button";
import { useRecoilState } from "recoil";
import { pushBtn } from "../../../atoms";
import MenuBar from "./MenuBar";
import styles from "./Header.module.css";

function Header() {
  const location = useLocation();
  const [selectedPage, SetSelectedPage] = useRecoilState(pushBtn);

  const changeSelectedPage = (arg) => {
    SetSelectedPage(arg);
  };

  if (location.pathname === "/") return null;
  return (
    <div className={styles.container}>
      <h2>
        <Link to="/">
          <img
            className={styles.gittleLogo}
            src={process.env.PUBLIC_URL + "/gittle_logo.png"}
            alt="gittle-logo"
          />
        </Link>
      </h2>
      {/* <div className={styles.buttonBox}>
        <div className={styles.localToRemote}>
          <Button
            page="add"
            whenClick={changeSelectedPage}
            selPage={selectedPage}
          ></Button>

          <Button
            page="push"
            whenClick={changeSelectedPage}
            selPage={selectedPage}
          ></Button>

          <Button
            page="merge/ready"
            whenClick={changeSelectedPage}
            selPage={selectedPage}
          ></Button>
        </div>
        <div className={styles.log}>
          <Button
            page="merge/request"
            whenClick={changeSelectedPage}
            selPage={selectedPage}
          ></Button>
          <Button
            page="log"
            whenClick={changeSelectedPage}
            selPage={selectedPage}
          ></Button>
        </div>
      </div> */}
      <MenuBar />
      <div className={styles.box}>
        <GitPull />
        <HelpGuide />
      </div>
    </div>
  );
}

export default Header;
