import { useEffect, useState } from "react";
import styles from "./InfoUser.module.css";
import { CiUser } from "react-icons/ci";
import ModalUser from "../ModalUser/ModalUser";
import Loading from "../Loading/Loading";
import { convertToPersianNumbers } from "../../../utils/helper";
import apiClient from "../../../config/axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Infouser() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [infoUser, setInfoUser] = useState("");

  const getInfouser = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/user/get-user-informations/");
      if (response.status === 200) {
        setInfoUser(response.data[0]);
      }
    } catch (error) {
      if (error.response?.status === 500) {
        toast.error(
          error.response?.data?.message || "مشکلی سمت سرور پیش آمده",
          {
            position: "top-left",
          }
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInfouser();
  }, []);

  return (
    <>
      <ModalUser
        setShowModal={setShowModal}
        showModal={showModal}
        userInfo={infoUser}
      />
      <div className={styles.infouserwrapper}>
        <div className={styles.infousertop}>
          <div className={styles.iconwrapper}>
            <CiUser className={styles.iconuser} />
          </div>
          <p className={styles.userfullname}>{infoUser?.full_name}</p>
        </div>
        <div className={styles.userabout}>
          <div className={styles.useraboutitem}>
            <span className={styles.userabouttitle}>شماره تماس :</span>
            <span className={styles.useraboutsub}>
              {infoUser?.phone_number
                ? convertToPersianNumbers(infoUser.phone_number)
                : ""}
            </span>
          </div>
          <div className={styles.useraboutitem}>
            <span className={styles.userabouttitle}>ایمیل :</span>
            <span className={styles.useraboutsub}>{infoUser?.email}</span>
          </div>
          <div className={styles.useraboutitem}>
            <span className={styles.userabouttitle}>آدرس :</span>
            <span className={styles.useraboutsub}>
              {infoUser?.user_details && infoUser?.user_details[0]?.address}
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
      <ToastContainer />
    </>
  );
}
