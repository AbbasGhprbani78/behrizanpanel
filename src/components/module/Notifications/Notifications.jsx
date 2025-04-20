import styles from "./Notifications.module.css";
import NotifItem from "../NotifItem/NotifItem";
import { FaBell } from "react-icons/fa";
import useSWR from "swr";
import apiClient from "../../../config/axiosConfig";
import { useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;

const fetcher = async (url) => {
  const response = await apiClient.get(url);
  return response.data;
};

export default function Notifications() {
  const { data: notifications, error } = useSWR(
    `${apiUrl}/app/get-notif/`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 15 * 60 * 1000,
    }
  );
  return (
    <div className={styles.notificationwrapper}>
      <div className={styles.notificationheader}>
        <FaBell className={styles.notificon} />
        <span className={styles.notification}>اعلانات</span>
      </div>
      <div className={styles.notificationcontent}>
        {notifications?.length > 0 ? (
          notifications.map((notif) => (
            <NotifItem key={notif.id} notif={notif} />
          ))
        ) : (
          <p className="text-center" style={{ color: "gray" }}>
            اعلانی وجود ندارد
          </p>
        )}
      </div>
    </div>
  );
}
