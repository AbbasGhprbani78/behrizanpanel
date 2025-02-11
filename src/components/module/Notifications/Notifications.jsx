import { useEffect} from "react";
import styles from "./Notifications.module.css";
import NotifItem from "../NotifItem/NotifItem";
import { FaBell } from "react-icons/fa";
import axios from "axios";
import { goToLogin } from "../../../utils/helper";
import useSWR from "swr";
const apiUrl = import.meta.env.VITE_API_URL;

const fetcher = async (url) => {
  const access = localStorage.getItem("access");

  const headers = {
    Authorization: `Bearer ${access}`,
  };
  const response = await axios.get(url, {
    headers,
  });
  if (response.status === 200) {
    return response.data;
  }
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
  useEffect(() => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("access");
      goToLogin();
    }
  }, [error]);

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
