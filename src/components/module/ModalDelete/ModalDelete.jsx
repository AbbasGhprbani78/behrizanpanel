import React from 'react'
import styles from './Modal.module.css'
export default function ModalDelete({
    showDeleteModal,
    setShowDeleteModal,
    handleDelete
}) {
    return (
        <div className={`${styles.modalcontainer}  ${showDeleteModal ? styles.showmodal : ""}`}>
            <div className={styles.modalhide} ></div>
            <div className={styles.modalwrapper}>
                <div className={styles.modaldelete}>
                    <div>
                        <span>از حذف محصول اطمینان دارید ؟</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mt-4">
                        <button className={`${styles.ysebtn} ${styles.aciondelete}`} onClick={handleDelete}>بله</button>
                        <button className={`${styles.nobtn} ${styles.aciondelete}`} onClick={() => setShowDeleteModal(false)}>خیر</button>
                    </div>
                </div>
            </div>
        </div>




    )
}
