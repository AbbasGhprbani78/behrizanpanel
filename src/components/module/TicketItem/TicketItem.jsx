import { useEffect, useState } from "react";
import styles from "./TicketItem.module.css";
import { HiOutlineMailOpen } from "react-icons/hi";
import { HiOutlineMail } from "react-icons/hi";
import { convertToPersianNumbers } from "../../../utils/helper";
export default function TicketItem({ onClick, ticket }) {
  const [windowWidth, setWindowWidth] = useState(0);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fa-IR");
  };

  useEffect(() => {
    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    updateWindowWidth();
    window.addEventListener("resize", updateWindowWidth);

    return () => {
      window.removeEventListener("resize", updateWindowWidth);
    };
  }, []);

  return (
    <>
      {windowWidth < 768 ? (
        <>
          <div className={styles.TicketLine_m} onClick={onClick}>
            <div className="d-flex align-items-end flex-wrap mb-4 ">
              {ticket.close ? (
                <HiOutlineMail className={styles.ticketicon} />
              ) : (
                <HiOutlineMailOpen className={styles.ticketicon} />
              )}
              <span className={styles.number_ticket}>
                {convertToPersianNumbers(ticket.ticket_id)}_
              </span>
              <span className="fw-bold">{ticket?.informations[0]?.title}</span>
            </div>
            <div className={styles.wrap_date}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span className={styles.open} style={{ marginLeft: "5px" }}>
                  تاریخ ایجاد تیکت
                </span>
                <span> : {formatDate(ticket?.date)}</span>
              </div>
              {ticket.close && (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span className={styles.closed} style={{ marginLeft: "5px" }}>
                    تاریخ بسته شدن تیکت
                  </span>
                  <span> : {formatDate(ticket?.close_date)}</span>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={`${styles.TicketLine} `} onClick={onClick}>
            <div className="d-flex align-items-center">
              {ticket.close ? (
                <HiOutlineMail className={styles.ticketicon} />
              ) : (
                <HiOutlineMailOpen className={styles.ticketicon} />
              )}
              <span className={styles.number_ticket}>
                {convertToPersianNumbers(ticket.ticket_id)}_
              </span>
              <span className="fw-bold">{ticket?.informations[0]?.title}</span>
            </div>
            <div className={styles.wrap_date}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span className={styles.open} style={{ marginLeft: "5px" }}>
                  تاریخ ایجاد تیکت
                </span>
                <span> : {formatDate(ticket?.date)}</span>
              </div>
              {ticket.close && (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span className={styles.closed} style={{ marginLeft: "5px" }}>
                    تاریخ بسته شدن تیکت
                  </span>
                  <span> : {formatDate(ticket?.close_date)}</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
