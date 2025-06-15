import styles from "./Notifications.module.css";
import NotifItem from "../NotifItem/NotifItem";
import { FaBell } from "react-icons/fa";
import useSWR from "swr";
import apiClient from "../../../config/axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const fetcher = async (url) => {
  try {
    const response = await apiClient.get(url);
    return response.data;
  } catch (e) {
    if (e.response?.status === 500) {
      toast.error(e.response?.data?.message || "مشکلی سمت سرور پیش آمده", {
        position: "top-left",
      });
    }
  }
};

export default function Notifications() {
  const { data: notifications } = useSWR(`/app/get-notif/`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 0,
  });
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
      <ToastContainer />
    </div>
  );
}
