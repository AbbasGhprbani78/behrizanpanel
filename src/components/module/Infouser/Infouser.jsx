import { useState } from "react";
import styles from "./InfoUser.module.css";
import { CiUser } from "react-icons/ci";
import ModalUser from "../ModalUser/ModalUser";
import Loading from "../Loading/Loading";
import useSWR from "swr";
const apiUrl = import.meta.env.VITE_API_URL;

const fetcher = async (url) => {
  const response = await apiClient.get(url);
  return response.data[0];
};

import { convertToPersianNumbers } from "../../../utils/helper";
import apiClient from "../../../config/axiosConfig";
export default function Infouser() {
  const [showModal, setShowModal] = useState(false);

  const {
    data: userInfo,
    error,
    isLoading,
  } = useSWR(`${apiUrl}/user/get-user-informations/`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 15 * 60 * 1000,
  });

  return (
    <>
      <ModalUser
        setShowModal={setShowModal}
        showModal={showModal}
        userInfo={userInfo}
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
              {userInfo?.user_details && userInfo?.user_details[0]?.address}
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

      {isLoading && <Loading />}
    </>
  );
}
