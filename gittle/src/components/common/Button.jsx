import React from "react";
import styles from "./Button.module.css";

function Button(props) {
  const { action, content, style, onMouseEnter, onMouseLeave, value } = props;
  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        style={style}
        onClick={action}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        value={value}
      >
        {content}
      </button>
    </div>
  );
}

export default Button;
