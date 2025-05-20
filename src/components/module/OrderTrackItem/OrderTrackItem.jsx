import { useEffect, useState } from "react";
import styles from "./OrderTrackItem.module.css";
import { IoBagAddOutline } from "react-icons/io5";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { IoMdDoneAll } from "react-icons/io";
import { FiTruck } from "react-icons/fi";
import { HiOutlineNewspaper } from "react-icons/hi2";
import { BsBox2 } from "react-icons/bs";
import { FaWpforms } from "react-icons/fa6";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import {
  addSlashesToDate,
  convertToPersianNumbers,
} from "../../../utils/helper";
import apiClient from "../../../config/axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function OrderTrackItem({ order, number, setOrderItemId }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [latestItem, setLatestItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  function getFieldByStatus(order) {
    let fieldValue = "فیلد نامعتبر";
    switch (order?.status) {
      case "1":
        fieldValue = order.sal_order_date;
        break;
      case "2":
        fieldValue = order.confirm_date;
        break;
      case "3":
        fieldValue = order.final_confirm_date;
        break;
      case "4":
        fieldValue = order?.last_trans_doc_date;
        break;
      case "5":
        fieldValue = order?.request_date;
        break;
      case "6":
        fieldValue = order?.last_trans_doc_date;
        break;
      case "7":
        fieldValue = order?.request_date;
        break;
      case "8":
        fieldValue = order?.request_date;
        break;
      default:
        fieldValue = "فیلد نامعتبر";
    }

    return fieldValue;
  }

  const deleteHandler = async (id) => {
    const willDelete = await swal({
      title: "آیا از حذف اطمینان دارید ؟",
      icon: "warning",
      buttons: ["خیر", "بله"],
    });

    if (willDelete) {
      try {
        setIsLoading(true);
        const response = await apiClient.delete(`/app/orders-delete/${id}`);
        if (response.status === 200) {
          swal({
            title: "با موفقیت حذف شد",
            icon: "success",
            button: "باشه",
          });
          setOrderItemId(id);
        }
      } catch (e) {
        if (e.response?.status === 500) {
          toast.error(e.response?.data?.message || "مشکلی سمت سرور پیش آمده", {
            position: "top-left",
          });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    setLatestItem(order?.status);
  }, []);

  useEffect(() => {
    switch (latestItem) {
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
  }, [latestItem]);

  return (
    <>
      <div className={styles.ordertrackitemwrapper}>
        <div className={styles.ordertrackdetail}>
          <div className={styles.rightdetail}>
            <span className={`${styles.titlebold} ${styles.number_order}`}>
              سفارش {convertToPersianNumbers(number + 1)}
            </span>
            <div className={styles.reqnumberwrapper}>
              <span className={styles.titlebold}>شماره درخواست :</span>
              <span style={{ marginRight: "10px" }}>
                {convertToPersianNumbers(order?.id)}
              </span>
            </div>
          </div>

          <div className={styles.leftdetail}>
            <div className={`${styles.numberorder}`}>
              <span style={{ marginLeft: "15px" }}>تعداد اقلام :</span>
              <span>{convertToPersianNumbers(order?.order_details_count)}</span>
            </div>
            <div>
              <span style={{ marginLeft: "15px" }}> تاریخ درخواست:</span>
              <span>
                {addSlashesToDate(convertToPersianNumbers(order?.request_date))}
              </span>
            </div>
          </div>
        </div>
        <div className={`${styles.mapstatus} mt-4`}>
          <div className={styles.wrap_detail_icon}>
            <button
              className={`${styles.detailbtn} ${
                isLoading && styles.detailbtn1
              }`}
              onClick={() => navigate(`/orders/${order.id}`)}
              disabled={isLoading}
            >
              جزئیات
            </button>
            {order?.status == 8 && (
              <button
                className={`${styles.detailbtn} ${
                  isLoading && styles.detailbtn1
                }`}
                style={{ background: "#b50d0d" }}
                onClick={() => deleteHandler(order.id)}
                disabled={isLoading}
              >
                حذف
              </button>
            )}
          </div>
          <div className={styles.wrapper} style={{ direction: "ltr" }}>
            <div className={`${styles.progressc}`}>
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
        </div>
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div className={styles.orderdetailitem}>
            <span className={styles.orderdetailtitle}>
              {order.status == 5 ? "علت مختومه :" : "تاریخ اخرین وضعیت : "}
            </span>
            <span className={styles.orderdetailtext}>
              {order.status == 5
                ? order?.dismissreason
                : order?.request_date
                ? addSlashesToDate(
                    convertToPersianNumbers(getFieldByStatus(order))
                  )
                : "N/A"}
            </span>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
