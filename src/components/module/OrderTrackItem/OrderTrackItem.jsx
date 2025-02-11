import { useEffect, useState } from "react";
import styles from "./OrderTrackItem.module.css";
import { IoBagAddOutline } from "react-icons/io5";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { IoMdDoneAll } from "react-icons/io";
import { FiTruck } from "react-icons/fi";
import { HiOutlineNewspaper } from "react-icons/hi2";
import { BsBox2 } from "react-icons/bs";
import { FaWpforms } from "react-icons/fa6";
import { AiOutlineFileDone } from "react-icons/ai";
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading/Loading";
import { FaArrowLeftLong } from "react-icons/fa6";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import {
  addSlashesToDate,
  convertToPersianNumbers,
  goToLogin,
} from "../../../utils/helper";

const StyledTableContainer = styled(TableContainer)({
  maxHeight: 400,
  "&::-webkit-scrollbar": {
    width: "4px",
    height: "8px",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "#f0f0f0",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#888",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "#555",
  },
});

export default function OrderTrackItem({
  order,
  number,
  onDetailsClick,
  setSelectedOrderId,
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [latestItem, setLatestItem] = useState(null);
  const [isShowDetail, setIsShowDetail] = useState(false);
  const [detailProduct, setDetailProduct] = useState([]);
  const [openTableIndex, setOpenTableIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const toggleTable = (index) => {
    setOpenTableIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fa-IR");
  };

  const getDetails = async (id) => {
    setLoading(true);
    const access = localStorage.getItem("access");
    const headers = {
      Authorization: `Bearer ${access}`,
    };
    try {
      const response = await axios.get(
        `${apiUrl}/app/order-detail-bill-code/${id}`,
        {
          headers,
        }
      );
      if (response.status === 200) {
        setIsShowDetail(true);
        setDetailProduct(response.data);
      }
    } catch (e) {
      if (e.response?.status === 401) {
        localStorage.removeItem("access");
        goToLogin();
      }
    } finally {
      setLoading(false);
    }
  };

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
        fieldValue = order?.deliever_date_max;
        break;
      case "5":
        fieldValue = order?.deliever_date_max;
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

  useEffect(() => {
    setLatestItem(order?.status);
  }, []);

  useEffect(() => {
    switch (latestItem) {
      case "7":
        setCurrentStep(1);
        break;
      case "8":
        setCurrentStep(2);
        break;
      case "1":
        setCurrentStep(3);
        break;
      case "2":
        setCurrentStep(4);
        break;
      case "3":
        setCurrentStep(5);
        break;
      case "4":
        setCurrentStep(6);
        break;
      case "5":
        setCurrentStep(7);
        break;
      case "6":
        setCurrentStep(8);
        break;
    }
  }, [latestItem]);

  return (
    <>
      <div className={styles.ordertrackitemwrapper}>
        {isShowDetail && (
          <div className="d-flex justify-content-end mb-4 d-sm-none">
            <button
              className={styles.back_btn}
              onClick={() => {
                setSelectedOrderId(null);
                setIsShowDetail(false);
              }}
            >
              <FaArrowLeftLong />
            </button>
          </div>
        )}
        <div className={styles.ordertrackdetail}>
          <div className={styles.rightdetail}>
            <span className={styles.titlebold}>
              سفارش {convertToPersianNumbers(number + 1)}
            </span>
            <div
              className={styles.reqnumberwrapper}
              style={{ marginRight: "30px" }}
            >
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
            {isShowDetail && (
              <div className="d-flex justify-content-end mb-4 mb-md-0 d-none d-md-block">
                <button
                  className={styles.back_btn}
                  onClick={() => {
                    setSelectedOrderId(null);
                    setIsShowDetail(false);
                  }}
                >
                  <FaArrowLeftLong />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className={`${styles.mapstatus} mt-4`}>
          <div className={styles.wrap_detail_icon}>
            <button
              disabled={loading}
              className={`${styles.detailbtn} ${loading && "disable"}`}
              onClick={() => {
                if (isShowDetail) {
                  navigate(`/orders/${order.id}`);
                  setIsShowDetail(false);
                } else {
                  getDetails(order?.id);
                  onDetailsClick();
                }
              }}
            >
              {isShowDetail ? "مشاهده محصول" : "جزئیات محصول"}
            </button>
          </div>
          <div className={styles.wrapper} style={{ direction: "ltr" }}>
            <div className={`${styles.progressc}`}>
              <div className={`${styles.pragressContainer}`}>
                <div
                  className={styles.progress}
                  style={{ width: `${(currentStep - 1) * 14.28}%` }}
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
                  <AiOutlineFileDone
                    className={`${styles.iconstatus} ${
                      currentStep >= 2 ? `${styles.activeicon}` : ""
                    }`}
                  />
                  <p className={styles.itemprogtext}>تایید درخواست</p>
                </div>
                <div
                  className={`${styles.circle} ${
                    currentStep >= 3 ? `${styles.active}` : ""
                  }`}
                >
                  <IoBagAddOutline
                    className={`${styles.iconstatus} ${
                      currentStep >= 3 ? `${styles.activeicon}` : ""
                    }`}
                  />
                  <p className={styles.itemprogtext}>صدور سفارش</p>
                </div>
                <div
                  className={`${styles.circle} ${
                    currentStep >= 4 ? `${styles.active}` : ""
                  }`}
                >
                  <MdOutlineShoppingCartCheckout
                    className={`${styles.iconstatus} ${
                      currentStep >= 4 ? `${styles.activeicon}` : ""
                    }`}
                  />
                  <p className={styles.itemprogtext}>تایید فروش</p>
                </div>
                <div
                  className={`${styles.circle} ${
                    currentStep >= 5 ? `${styles.active}` : ""
                  }`}
                >
                  <IoMdDoneAll
                    className={`${styles.iconstatus} ${
                      currentStep >= 5 ? `${styles.activeicon}` : ""
                    }`}
                  />
                  <p className={styles.itemprogtext}>تایید نهایی</p>
                </div>
                <div
                  className={`${styles.circle} ${
                    currentStep >= 6 ? `${styles.active}` : ""
                  }`}
                >
                  <FiTruck
                    className={`${styles.iconstatus} ${
                      currentStep >= 6 ? `${styles.activeicon}` : ""
                    }`}
                  />
                  <p className={styles.itemprogtext}>در حال ارسال</p>
                </div>
                <div
                  className={`${styles.circle} ${
                    currentStep >= 7 ? `${styles.active}` : ""
                  }`}
                >
                  <BsBox2
                    className={`${styles.iconstatus} ${
                      currentStep >= 7 ? `${styles.activeicon}` : ""
                    }`}
                  />
                  <p className={styles.itemprogtext}>کامل ارسال شده</p>
                </div>
                <div
                  className={`${styles.circle} ${
                    currentStep >= 8 ? `${styles.active}` : ""
                  }`}
                >
                  <HiOutlineNewspaper
                    className={`${styles.iconstatus} ${
                      currentStep >= 8 ? `${styles.activeicon}` : ""
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
              {order.status == 6 ? "علت مختومه :" : "تاریخ اخرین وضعیت : "}
            </span>
            <span className={styles.orderdetailtext}>
              {order.status == 6
                ? order?.dismissreason
                : order?.request_date
                ? addSlashesToDate(
                    convertToPersianNumbers(getFieldByStatus(order))
                  )
                : "N/A"}
            </span>
          </div>
        </div>

        {isShowDetail && (
          <>
            <p className="mt-4">وضعیت ارسال ها :</p>

            {detailProduct.length > 0 &&
              detailProduct.map((item, i) => (
                <div className={styles.detail_orders_wrap} key={item.bill}>
                  <div className={styles.status_send}>
                    <div className={styles.bilLading_date_wrap}>
                      <div
                        style={{ cursor: "pointer" }}
                        className="d-flex align-items-center gap-2 cursour"
                        onClick={() => toggleTable(i)}
                      >
                        <div className={styles.wrap_icon}>
                          {openTableIndex === i ? (
                            <FaAngleUp />
                          ) : (
                            <FaAngleDown />
                          )}
                        </div>
                        <span>بارنامه : </span>
                        <span>{convertToPersianNumbers(item?.bill)}</span>
                      </div>
                      <div className={styles.wrap_date_detail}>
                        <span>تاریخ : </span>
                        <span>{formatDate(item?.deliver_date)}</span>
                      </div>
                    </div>
                  </div>
                  {openTableIndex === i && (
                    <div className={styles.wrap_table}>
                      <StyledTableContainer component={Paper}>
                        <Table
                          stickyHeader
                          aria-label="sticky table"
                          sx={{ minWidth: 750, typography: "inherit" }}
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell
                                align="center"
                                style={{
                                  position: "sticky",
                                  top: 0,
                                  backgroundColor: "#fff",
                                  fontFamily: "iranYekan",
                                  fontWeight: "bold",
                                }}
                              >
                                کد کالا
                              </TableCell>
                              <TableCell
                                align="center"
                                style={{
                                  position: "sticky",
                                  top: 0,
                                  backgroundColor: "#fff",
                                  fontFamily: "iranYekan",
                                  fontWeight: "bold",
                                }}
                              >
                                شرح محصول
                              </TableCell>
                              <TableCell
                                align="center"
                                style={{
                                  position: "sticky",
                                  top: 0,
                                  backgroundColor: "#fff",
                                  fontFamily: "iranYekan",
                                  fontWeight: "bold",
                                }}
                              >
                                تعداد
                              </TableCell>
                              <TableCell
                                align="center"
                                style={{
                                  position: "sticky",
                                  top: 0,
                                  backgroundColor: "#fff",
                                  fontFamily: "iranYekan",
                                  fontWeight: "bold",
                                }}
                              >
                                گنجایش واحد
                              </TableCell>
                              <TableCell
                                align="center"
                                style={{
                                  position: "sticky",
                                  top: 0,
                                  backgroundColor: "#fff",
                                  fontFamily: "iranYekan",
                                  fontWeight: "bold",
                                }}
                              >
                                مقدار کل
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {item?.products.map((rowDetail, j) => (
                              <TableRow key={j}>
                                <TableCell
                                  align="center"
                                  sx={{
                                    fontFamily: "iranYekan",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {convertToPersianNumbers(
                                    rowDetail?.item_code
                                  )}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  sx={{
                                    fontFamily: "iranYekan",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {convertToPersianNumbers(
                                    rowDetail?.descriptions
                                  )}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  sx={{
                                    fontFamily: "iranYekan",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {convertToPersianNumbers(rowDetail?.box_qty)}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  sx={{
                                    fontFamily: "iranYekan",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {convertToPersianNumbers(rowDetail?.box_cap)}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  sx={{
                                    fontFamily: "iranYekan",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {convertToPersianNumbers(rowDetail?.qty)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </StyledTableContainer>
                    </div>
                  )}
                </div>
              ))}
          </>
        )}
      </div>
    </>
  );
}
