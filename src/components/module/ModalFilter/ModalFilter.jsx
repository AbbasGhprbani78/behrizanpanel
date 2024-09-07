
import React, { useState } from 'react';
import styles from './ModalFilter.module.css';
import { CiCalendarDate } from "react-icons/ci";
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { Calendar } from 'react-multi-date-picker';



export default function ModalFilter({
    setOpenmodal,
    openModal,
    filterOrdersByDate,
}) {


    const [selectedDayRange, setSelectedDayRange] = useState([null, null]);

    const handleDateFilter = () => {
        const [from, to] = selectedDayRange;
        if (from && to) {
            filterOrdersByDate(from.toDate(), to.toDate());
            setOpenmodal('');
        }
    };

    const renderCustomInput = ({ ref }) => (
        <input
            readOnly
            ref={ref}
            placeholder="Select a day range"
            value={
                selectedDayRange.from && selectedDayRange.to
                    ? `از ${selectedDayRange.from.day}/${selectedDayRange.from.month}/${selectedDayRange.from.year} تا ${selectedDayRange.to.day}/${selectedDayRange.to.month}/${selectedDayRange.to.year}`
                    : ""
            }
            style={{
                textAlign: "center",
                padding: "0.5rem 1rem",
                fontSize: "1.1rem",
                border: "1px solid #9c88ff",
                borderRadius: "5px",
                color: "#4a4a4a",
                outline: "none",
            }}
        />
    );


    return (
        <div className={`${styles.modal_container} ${openModal ? styles.active : ""}`}>
            <div className={styles.close_modal} onClick={() => setOpenmodal(false)}></div>
            <div className={`${styles.modal_content} ${openModal ? styles.data_content : ""}`}>
                <div className={styles.date_picker_container}>
                    <div className={styles.date_header}>
                        <span className={styles.date_text}>انتخاب تاریخ</span>
                    </div>
                    <div className={styles.wrapper_calender}>
                        <div className={styles.date_show_range}>
                            <div className='mb-4'>
                                <p>از تاریخ</p>
                                <div className={styles.date_input_wrapper}>
                                    <input
                                        type="text"
                                        className={styles.date_input}
                                        value={
                                            selectedDayRange[0]
                                                ? `${selectedDayRange[0].format("YYYY/MM/DD")}`
                                                : ""
                                        }
                                        readOnly
                                    />
                                    <CiCalendarDate className={styles.icon_ca} />
                                </div>
                            </div>
                            <div className='mb-4'>
                                <p>تا تاریخ</p>
                                <div className={styles.date_input_wrapper}>
                                    <input
                                        type="text"
                                        className={styles.date_input}
                                        value={
                                            selectedDayRange[1]
                                                ? `${selectedDayRange[1].format("YYYY/MM/DD")}`
                                                : ""
                                        }
                                        readOnly
                                    />
                                    <CiCalendarDate className={styles.icon_ca} />
                                </div>
                            </div>
                        </div>
                        <Calendar
                            range
                            value={selectedDayRange}
                            onChange={setSelectedDayRange}
                            calendar={persian}
                            locale={persian_fa}
                            weekStartDayIndex={6}
                            className={styles.custom_calendar}
                        />
                    </div>
                    <div className='text-center'>
                        <button
                            className={styles.calender_btn}
                            onClick={handleDateFilter}
                        >
                            اعمال
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}



