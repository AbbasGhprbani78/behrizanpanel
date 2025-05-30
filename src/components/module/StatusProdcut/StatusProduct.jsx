import { useEffect, useState } from "react";
import styles from "./StatusProduct.module.css";
import { IoBagAddOutline } from "react-icons/io5";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { IoMdDoneAll } from "react-icons/io";
import { FiTruck } from "react-icons/fi";
import { HiOutlineNewspaper } from "react-icons/hi2";
import { BsBox2 } from "react-icons/bs";
import { FaWpforms } from "react-icons/fa6";

export default function StatusProduct({ style, status }) {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    switch (status) {
      case "8":
        setCurrentStep(1);
        break;
      case "1":
        setCurrentStep(2);
        break;
      case "2":
        setCurrentStep(3);
        break;
      case "3":
        setCurrentStep(4);
        break;
      case "4":
        setCurrentStep(5);
        break;
      case "5":
        setCurrentStep(7);
        break;
      case "6":
        setCurrentStep(6);
        break;
    }
  }, [status]);

  return (
    <div
      className={`${styles.pragresswrapper} d-flex justify-content-between`}
      style={{ direction: "ltr" }}
    >
      <div className={`${styles.progressc} ${styles[style]}`}>
        <div className={`${styles.pragressContainer}`}>
          <div
            className={styles.progress}
            style={{ width: `${(currentStep - 1) * 16.66}%` }}
          ></div>
          <div
            className={`${styles.circle} ${
              currentStep >= 1 ? `${styles.active}` : ""
            }`}
          >
            <FaWpforms
              className={`${styles.iconstatus} ${
                currentStep >= 1 ? `${styles.activeicon}` : ""
              }`}
            />
            <p className={styles.itemprogtext}>صدور درخواست</p>
          </div>
          {/* <div className={`${styles.circle} ${currentStep >= 2 ? `${styles.active}` : ''}`}>
            <AiOutlineFileDone className={`${styles.iconstatus} ${currentStep >= 2 ? `${styles.activeicon}` : ''}`} />
            <p className={styles.itemprogtext}>تایید درخواست</p>
          </div> */}
          <div
            className={`${styles.circle} ${
              currentStep >= 2 ? `${styles.active}` : ""
            }`}
          >
            <IoBagAddOutline
              className={`${styles.iconstatus} ${
                currentStep >= 2 ? `${styles.activeicon}` : ""
              }`}
            />
            <p className={styles.itemprogtext}>صدور سفارش</p>
          </div>
          <div
            className={`${styles.circle} ${
              currentStep >= 3 ? `${styles.active}` : ""
            }`}
          >
            <MdOutlineShoppingCartCheckout
              className={`${styles.iconstatus} ${
                currentStep >= 3 ? `${styles.activeicon}` : ""
              }`}
            />
            <p className={styles.itemprogtext}>تایید فروش</p>
          </div>
          <div
            className={`${styles.circle} ${
              currentStep >= 4 ? `${styles.active}` : ""
            }`}
          >
            <IoMdDoneAll
              className={`${styles.iconstatus} ${
                currentStep >= 4 ? `${styles.activeicon}` : ""
              }`}
            />
            <p className={styles.itemprogtext}>تایید نهایی</p>
          </div>
          <div
            className={`${styles.circle} ${
              currentStep >= 5 ? `${styles.active}` : ""
            }`}
          >
            <FiTruck
              className={`${styles.iconstatus} ${
                currentStep >= 5 ? `${styles.activeicon}` : ""
              }`}
            />
            <p className={styles.itemprogtext}>در حال ارسال</p>
          </div>
          <div
            className={`${styles.circle} ${
              currentStep >= 6 ? `${styles.active}` : ""
            }`}
          >
            <BsBox2
              className={`${styles.iconstatus} ${
                currentStep >= 6 ? `${styles.activeicon}` : ""
              }`}
            />
            <p className={styles.itemprogtext}>کامل ارسال شده</p>
          </div>
          <div
            className={`${styles.circle} ${
              currentStep >= 7 ? `${styles.active}` : ""
            }`}
          >
            <HiOutlineNewspaper
              className={`${styles.iconstatus} ${
                currentStep >= 7 ? `${styles.activeicon}` : ""
              }`}
            />
            <p className={styles.itemprogtext}>مختومه</p>
          </div>
        </div>
      </div>
    </div>
  );
}
