import { useEffect, useState } from "react";
import styles from "./InfoUser.module.css";
import { CiUser } from "react-icons/ci";
import ModalUser from "../ModalUser/ModalUser";
import axios from "axios";
import Loading from "../Loading/Loading";
export default function Infouser() {
  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  function convertToPersianNumbers(number) {
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return number.toString().replace(/\d/g, (digit) => persianDigits[digit]);
  }

  const getUserHandler = async () => {
    setLoading(true);
    const access = localStorage.getItem("access");
    const headers = {
      Authorization: `Bearer ${access}`,
    };

    try {
      const response = await axios.get(
        `${apiUrl}/user/get-user-informations/`,
        {
          headers,
        }
      );

      if (response.status === 200) {
        setUserInfo(response.data[0]);
        console.log(response.data[0]);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserHandler();
  }, []);

  return (
    <>
      <ModalUser
        setShowModal={setShowModal}
        showModal={showModal}
        userInfo={userInfo}
        getUserHandler={getUserHandler}
      />
      <div className={styles.infouserwrapper}>
        <div className={styles.infousertop}>
          <div className={styles.iconwrapper}>
            <CiUser className={styles.iconuser} />
          </div>
          <p className={styles.userfullname}>{userInfo?.full_name}</p>
        </div>
        <div className={styles.userabout}>
          <div className={styles.useraboutitem}>
            <span className={styles.userabouttitle}>شماره تماس :</span>
            <span className={styles.useraboutsub}>
              {userInfo?.phone_number
                ? convertToPersianNumbers(userInfo.phone_number)
                : ""}
            </span>
          </div>
          <div className={styles.useraboutitem}>
            <span className={styles.userabouttitle}>ایمیل :</span>
            <span className={styles.useraboutsub}>{userInfo?.email}</span>
          </div>
          <div className={styles.useraboutitem}>
            <span className={styles.userabouttitle}>آدرس :</span>
            <span className={styles.useraboutsub}>
              {userInfo.user_details && userInfo?.user_details[0]?.address}
            </span>
          </div>
        </div>
        <div className={styles.btnwrapper}>
          <button
            className={styles.btnedituser}
            onClick={() => setShowModal(true)}
          >
            ویرایش
          </button>
        </div>
      </div>

      {loading && <Loading />}
    </>
  );
}
