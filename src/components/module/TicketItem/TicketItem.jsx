

import React, { useEffect, useState } from 'react'
import styles from './TicketItem.module.css'
import { HiOutlineMailOpen } from "react-icons/hi";
import { HiOutlineMail } from "react-icons/hi";
export default function TicketItem({ onClick, ticket }) {


  const [windowWidth, setWindowWidth] = useState(0)

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fa-IR");
  };

  useEffect(() => {

    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    updateWindowWidth();
    window.addEventListener('resize', updateWindowWidth);

    return () => {
      window.removeEventListener('resize', updateWindowWidth);
    };
  }, []);

  return (
    <>
      {
        windowWidth < 768 ?
          <>
            <div className={styles.TicketLine_m} onClick={onClick}>
              <div>
                {
                  ticket.close ?
                    <HiOutlineMail className={styles.ticketicon} /> :
                    <HiOutlineMailOpen className={styles.ticketicon} />
                }
              </div>

              <div className='my-4'>
                <span className='fw-bold'>{ticket?.informations[0]?.title}</span>
              </div>
              <div className='d-flex justify-content-between align-items-center'>
                <p
                  className={`fw-bold ${styles.status_ticket} ${ticket.close ? styles.closed : styles.open}`}>
                  {ticket.close ? "بسته" : "باز "}
                </p>
                <span>{formatDate(ticket?.informations[0]?.date)}</span>
              </div>

            </div>
          </>
          :
          <>
            <div className={`${styles.TicketLine} `} onClick={onClick}>
              <div className="d-flex align-items-center">
                {
                  ticket.close ?
                    <HiOutlineMail className={styles.ticketicon} /> :
                    <HiOutlineMailOpen className={styles.ticketicon} />
                }

                <span className='fw-bold'>{ticket?.informations[0]?.title}</span>
                <p
                  className={`fw-bold ${styles.status_ticket} ${ticket.close ? styles.closed : styles.open} mx-4`}>
                  {ticket.close ? "تیکت بسته" : "تیکت باز "}
                </p>
              </div>
              <span>{formatDate(ticket?.informations[0]?.date)}</span>
            </div>
          </>
      }
    </>

  )
}
