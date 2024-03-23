import React from "react";
import styles from './Repo.module.css'

function repo(props){
    return(
        <div id={props.id} className={styles.routes} onClick={()=>props.startGittle(props.branch, props.root)}>
            <img className={styles.folder} src={process.env.PUBLIC_URL + '/icons/folder.png'} alt="folder" />
            {props.root}
        </div>
    )
}

export default repo;