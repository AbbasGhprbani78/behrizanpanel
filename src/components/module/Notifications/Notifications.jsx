
import React, { useEffect, useState } from 'react'
import styles from './Notifications.module.css'
import NotifItem from '../NotifItem/NotifItem'
import { FaBell } from "react-icons/fa";
import axios from 'axios';

export default function Notifications() {
    const apiUrl = import.meta.env.VITE_API_URL;

    const [notifications, setNotifications] = useState([])


    const getNotifications = async () => {
        const access = localStorage.getItem("access");

        const headers = {
            Authorization: `Bearer ${access}`,
        };

        try {
            const response = await axios.get(`${apiUrl}/app/get-notif/`, {
                headers,
            });

            if (response.status === 200) {
                setNotifications(response.data);
            }

        } catch (e) {
            console.log(e)
        }

    };

    useEffect(() => {
        getNotifications();
    }, []);

    return (
        <div className={styles.notificationwrapper}>
            <div className={styles.notificationheader}>
                <FaBell className={styles.notificon} />
                <span className={styles.notification}>اعلانات</span>
            </div>
            <div className={styles.notificationcontent}>
                {
                    notifications?.length > 0 ?
                        notifications.map(notif => (
                            <NotifItem key={notif.id} notif={notif} />
                        ))
                        :
                        <p className='text-center' style={{ color: "gray" }}>اعلانی وجود ندارد</p>

                }
            </div>
        </div>
    )
}


