import { useContext } from "react";
import styles from "./Sidebar.module.css";
import { Link } from "react-router-dom";
import { MdWindow } from "react-icons/md";
import { FaBoxArchive } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa";
import { FaHeadphones } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import swal from "sweetalert";
import { CountContext } from "../../../context/CartContext";

export default function SideBar() {
  const { isSubMenuOpen, setIsSubMenuOpen } = useContext(CountContext);
  const naviagte = useNavigate();
  const { pathname } = useLocation();

  const toggleSubMenu = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };

  const logoutHandler = () => {
    swal({
      title: "آیا از خروج اطمینان دارید ؟",
      icon: "warning",
      buttons: ["خیر", "بله"],
    }).then((willLogout) => {
      if (willLogout) {
        localStorage.removeItem("refresh");
        localStorage.removeItem("access");
        naviagte("/login");
      }
    });
  };

  return (
    <div className={styles.sidebarcontainer}>
      <div className={styles.sidebarcontent}>
        <div className={styles.sidebarheader}>
          <img src="/images/logo.svg" alt="logo" />
        </div>
        <div className={styles.sidebarlistwrapper}>
          <ul className={styles.sidebarlist}>
            <Link
              to={"/"}
              className={`${styles.listitem} ${
                pathname === "/" ? styles.active : ""
              }`}
            >
              <MdWindow className={styles.iconsidebar} />
              <span className={styles.listitemtext}>خانه</span>
            </Link>
            <li
              className={`${styles.listitem} ${styles.parentsub}`}
              onClick={toggleSubMenu}
            >
              <div
                className={`${styles.orderside} ${
                  pathname === "/products" || pathname === "/trackorders"
                    ? styles.active
                    : ""
                }`}
              >
                <div>
                  <FaBoxArchive className={styles.iconsidebar} />
                  <span className={styles.listitemtext}>درخواست ها</span>
                </div>
                {isSubMenuOpen ? <FaAngleUp /> : <FaAngleDown />}
              </div>
              {isSubMenuOpen && (
                <ul className={styles.submenu}>
                  <li
                    className={`${styles.submenuitem} ${
                      pathname === "/products" ? styles.active : ""
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link to={"/products"}>ثبت درخواست جدید</Link>
                  </li>
                  <li
                    onClick={(e) => e.stopPropagation()}
                    className={`${styles.submenuitem} ${
                      pathname === "/trackorders" ? styles.active : ""
                    }`}
                  >
                    <Link to={"/trackorders"}>پیگیری درخواست</Link>
                  </li>
                </ul>
              )}
            </li>
            {/* <Link to={"/report"} className={`${styles.listitem} ${pathname === "/report" ? styles.active : ""}`}>
                            <FaBookmark className={styles.iconsidebar} />
                            <span className={styles.listitemtext}>گزارشات</span>
                        </Link> */}
            <Link
              to={"/ticket"}
              className={`${styles.listitem} ${
                pathname === "/ticket" ? styles.active : ""
              }`}
            >
              <FaHeadphones className={styles.iconsidebar} />
              <span className={styles.listitemtext}>پشتیبانی</span>
            </Link>
            <Link
              onClick={logoutHandler}
              className={`${styles.listitem} ${styles.logoutsidebar}`}
            >
              <FiLogOut className={styles.iconsidebar} />
              <span className={styles.listitemtext}>خروج</span>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
}
