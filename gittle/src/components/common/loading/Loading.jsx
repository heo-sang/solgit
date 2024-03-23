import React from "react";
import styles from './Loading.module.css'


function Loading(){

    return(
        <>
        <div className={styles.loading}></div>
        <img src={process.env.PUBLIC_URL + "/Blue Cat-1s-200px.gif"} alt="loading spinner" className={styles.spinner} />
        </>
        
    )

}


export default Loading