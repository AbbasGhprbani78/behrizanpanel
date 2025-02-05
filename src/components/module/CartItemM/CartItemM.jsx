import React from "react";
import styles from "./CartItemM.module.css";
import { IoCloseSharp } from "react-icons/io5";
import { MdModeEditOutline } from "react-icons/md";
export default function CartItemM({
  setShowDeleteModal,
  isConfirmation,
  setShowModalBuy,
  prodcut,
  setValue,
  setMainCode,
  setMainProduct,
}) {
  const apiUrl = import.meta.env.VITE_API_URL;
  return (
    <div className={styles.CartItemmwrapper}>
      {!isConfirmation && (
        <IoCloseSharp
          className={styles.delete}
          onClick={() => {
            setShowDeleteModal(true);
            setMainCode(prodcut.item_code);
          }}
        />
      )}

      <div className={styles.imagecart}>
        <img
          src={`${
            prodcut?.img
              ? `${apiUrl}${prodcut.img}`
              : "/public/images/image1.png"
          }`}
          alt="product"
          className={!prodcut.image && styles.image_mobile}
        />
      </div>
      <div className={`${styles.cart_item_content} mt-3`}>
        <p className={`${styles.carttext} mb-4`}>{prodcut.descriptions}</p>
        <div className="d-flex align-items-center justify-content-between">
          <span className={styles.infoitem}>کد کالا</span>
          <span>{prodcut.item_code}</span>
        </div>
        <div
          className={`${styles.cartinfoitem} align-items-center justify-content-between  mb-4`}
        >
          <span className={styles.infoitem}>تعداد</span>
          <div>{prodcut.count}</div>
        </div>
        <div className="d-flex align-items-center justify-content-between">
          <span className={styles.infoitem}>واحد</span>
          <span>{prodcut.unitdesc}</span>
        </div>
      </div>

      <div className="text-center d-flex justify-content-center mt-3">
        <button
          className={styles.add_btn}
          onClick={() => {
            setValue(prodcut.count);
            setMainCode(prodcut.item_code);
            setMainProduct(prodcut);
            setShowModalBuy(true);
          }}
        >
          ویرایش
          <MdModeEditOutline className="mx-2" />
        </button>
      </div>
    </div>
  );
}
