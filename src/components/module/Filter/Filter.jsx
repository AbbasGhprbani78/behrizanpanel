import { useState } from "react";
import styles from "./Filter.module.css";
import { IoIosArrowDown } from "react-icons/io";
export default function Filter({ setOpenmodal, all, filters = [] }) {
  const [itemActive, setItemActive] = useState(1);
  return (
    <div className={styles.filterwrapper}>
      فیلتر بر اساس
      <IoIosArrowDown className={styles.arrow_icon} />
      <div className={styles.wrap_items_filter}>
        <div
          className={`${styles.item_filter} ${styles.item_first} ${
            itemActive === 1 && styles.active
          }`}
          onClick={() => {
            all();
            setOpenmodal(false);
            setItemActive(1);
          }}
        >
          همه
        </div>
        <div
          className={`${styles.item_filter} ${styles.item_second} ${
            itemActive === 2 && styles.active
          }`}
          onClick={() => {
            setItemActive(2);
            setOpenmodal(true);
          }}
        >
          تاریخ
        </div>
        {filters.map((filter, index) => (
          <div
            key={index}
            className={`${styles.item_filter} ${
              itemActive === index + 2 && styles.active
            }`}
            onClick={() => {
              setItemActive(index + 2);
              setOpenmodal(true);
              filter.onClick?.();
            }}
          >
            {filter.label}
          </div>
        ))}
      </div>
    </div>
  );
}
