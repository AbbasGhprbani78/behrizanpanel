import { useState } from "react";
import styles from "./Filter.module.css";
import { IoIosArrowDown } from "react-icons/io";
export default function Filter({ setOpenmodal, all, filters = [] }) {
  const [itemActive, setItemActive] = useState(1);
  const [openSubmenuIndex, setOpenSubmenuIndex] = useState(null);

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
            setItemActive(1);
            all();
            setOpenmodal(false);
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
          <div key={index} className={styles.filter_item_with_submenu}>
            <div
              className={`${styles.item_filter} ${
                itemActive === index + 3 && styles.active
              }`}
              onClick={() => {
                setItemActive(index + 3);

                if (filter.submenuItems?.length) {
                  setOpenSubmenuIndex(
                    openSubmenuIndex === index ? null : index
                  );
                } else {
                  setOpenSubmenuIndex(null);
                }
              }}
            >
              {filter.label}
              <IoIosArrowDown />
            </div>

            {filter.submenuItems?.length > 0 && openSubmenuIndex === index && (
              <div className={styles.submenu}>
                {filter.submenuItems.map((subItem, subIndex) => (
                  <div
                    key={subIndex}
                    className={styles.submenu_item}
                    onClick={() => {
                      subItem.onClick?.();
                      setOpenSubmenuIndex(null);
                    }}
                  >
                    {subItem.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
