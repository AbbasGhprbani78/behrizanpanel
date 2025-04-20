import styles from "./NotifItem.module.css";
import { FaRegUser } from "react-icons/fa";
import swal from "sweetalert";
export default function NotifItem({ notif }) {
  const showNotifItem = () => {
    swal({
      title: notif?.text,
      button: "باشه",
    });
  };
  return (
    <div className={styles.notifItemwrapper} onClick={showNotifItem}>
      <div className={styles.notifItem}>
        <div className="d-flex align-items-center">
          <FaRegUser />
          <span className={styles.notiftitle}>{notif?.title}</span>
        </div>
        <p className={styles.notiftext}>{notif?.text}</p>
      </div>
    </div>
  );
}
