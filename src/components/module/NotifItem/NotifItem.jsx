import React from 'react'
import styles from './NotifItem.module.css'
import { FaRegUser } from "react-icons/fa";
export default function NotifItem({ notif }) {
    return (
        <div className={styles.notifItemwrapper}>
            <div className={styles.notifItem}>
                <div className='d-flex align-items-center'>
                    <FaRegUser />
                    <span className={styles.notiftitle}>{notif?.title}</span>
                </div>
                <p className={styles.notiftext}>
                    {notif?.text}</p>
            </div>
        </div>
    )
}
