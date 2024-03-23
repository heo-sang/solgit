import React from "react";
import Button from "../Button";
import { useNavigate } from "react-router-dom";

function LogCheck(props) {
  const navigate = useNavigate();
  const goLog = () => {
    navigate("/log");
  };
  return (
    <div>
      <Button action={goLog} content={"로그 확인"} />
    </div>
  );
}

export default LogCheck;
