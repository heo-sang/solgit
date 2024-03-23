import React,{ useState} from "react";
import Button from "./Button"
import Modal from "./Modal"
import styles from './Buttons.module.css'

function Buttons(){

    const [isOpen , setIsOpen] = useState(false);

    const closeModal = ()=>{
        setIsOpen(false)
    }

    const modalArray = [
        {name:"생성",isRoot:true,number:0},
        {name:"열기",isRoot:false,number:1},
        {name:"복제",isRoot:true,number:2}
    ]
    
    const [chosen , setChosen] = useState(-1);


    return(
        <>
        <div className={styles.buttons}>
            <Button comment="생성" isOpen={isOpen} name="create"  
                callModal={()=>{
                    setIsOpen(true)
                    setChosen(0)
                }}
             />

            <Button comment="열기" isOpen={isOpen} name="open" 
                callModal={()=>{
                    setIsOpen(true)
                    setChosen(1)
                }}
            />

            <Button comment="복제" isClone={isOpen}  name="clone" 
                callModal={()=>{
                    setIsOpen(true)
                    setChosen(2)
                }}
            />
        </div>
        {isOpen && <Modal  setModalOpen={modalArray[chosen]} close={closeModal}/>}
        </>
    )
    
}

export default Buttons;