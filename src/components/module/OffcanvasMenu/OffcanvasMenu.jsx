
import React, { useEffect } from 'react'
import { useState } from 'react';
import styles from './Offcanvas.module.css'
import { IoCloseSharp } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { MdWindow } from "react-icons/md";
import { FaBoxArchive } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa"
import { FaHeadphones } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingCart } from "react-icons/fa";
import swal from 'sweetalert';


export default function OffcanvasMenu({ setShowSideBar, showSideBar }) {

    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    const naviagte = useNavigate()
    const { pathname } = useLocation()


    const toggleSubMenu = () => {
        setIsSubMenuOpen(!isSubMenuOpen);
    };

    const handleClickOutside = (event) => {
        const sidebar = document.querySelector(`.${styles.sidebar}`);
        if (sidebar && !sidebar.contains(event.target)) {
            setShowSideBar(false);
        }
    };

    const logoutHandler = () => {
        swal({
            title: "آیا از خروج اطمینان دارید ؟",
            icon: "warning",
            buttons: ["خیر", "بله"]
        }).then((willLogout) => {
            if (willLogout) {
                localStorage.removeItem("refresh");
                localStorage.removeItem("access");
                naviagte("/login")
            }

        });
    };



    useEffect(() => {
        if (showSideBar) {

            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSideBar]);



    return (
        <div className={`${styles.sidebar} ${showSideBar ? styles.show : ""}`}>
            <div className='d-flex justify-content-end'>
                <IoCloseSharp className={styles.closeIconside} onClick={() => setShowSideBar(false)} />
            </div>
            <div className={styles.sidebarlistwrapper}>
                <ul className={styles.sidebarlist}>
                    <Link to={"/"} className={`${styles.listitem} ${pathname === "/" ? styles.active : ""}`}>
                        <MdWindow className={styles.iconsidebar} />
                        <span className={styles.listitemtext}>خانه</span>
                    </Link>
                    <li className={`${styles.listitem} ${styles.parentsub}`} onClick={toggleSubMenu}>
                        <div className={`${styles.orderside} ${pathname === "/products" || pathname === "/trackorders" ? styles.active : ""}`}>
                            <div>
                                <FaBoxArchive className={styles.iconsidebar} />
                                <span className={styles.listitemtext}>سفارشات</span>
                            </div>
                            {isSubMenuOpen ? <FaAngleUp /> : <FaAngleDown />}
                        </div>
                        {isSubMenuOpen && (
                            <ul className={styles.submenu}>
                                <li className={`${styles.submenuitem}  ${pathname === "/products" ? styles.active : ""}`}>
                                    <Link to={"/products"}>ثبت سفارش جدید</Link>
                                </li>
                                <li className={`${styles.submenuitem} ${pathname === "/trackorders" ? styles.active : ""}`}>
                                    <Link to={"/trackorders"}>پیگیری سفارشات</Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    <Link to={"/cart"} className={`${styles.listitem} ${pathname === "/report" ? styles.active : ""}`}>
                        <FaShoppingCart className={styles.iconsidebar} />
                        <span className={styles.listitemtext}>سبد سفارش</span>
                    </Link>
                    {/* <Link to={"/report"} className={`${styles.listitem}  ${pathname === "/cart" ? styles.active : ""}`}>
                        <FaBookmark className={styles.iconsidebar} />
                        <span className={styles.listitemtext}>گزارشات</span>
                    </Link> */}
                    <Link to={"/ticket"} className={`${styles.listitem} ${pathname === "/ticket" ? styles.active : ""}`}>
                        <FaHeadphones className={styles.iconsidebar} />
                        <span className={styles.listitemtext}>پشتیبانی</span>
                    </Link>
                    <Link to={"#"} className={`${styles.listitem} ${styles.logoutsidebar}`}>
                        <FiLogOut className={styles.iconsidebar} />
                        <span className={styles.listitemtext} onClick={logoutHandler}>خروج</span>
                    </Link>
                </ul>
            </div >
        </div>
    )
}
