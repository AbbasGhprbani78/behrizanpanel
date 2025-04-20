import styles from "./CartItemM.module.css";
import { IoCloseSharp } from "react-icons/io5";
import { MdModeEditOutline } from "react-icons/md";
import { convertToPersianNumbers } from "../../../utils/helper";
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

      <div
        className={`${styles.imagecart} ${
          prodcut?.image && styles.image_mobile
        }`}
      >
        <img
          src={`${
            prodcut?.img
              ? `${apiUrl}${prodcut.img}`
              : "/public/images/image1.png"
          }`}
          alt="product"
        />
      </div>
      <div className={`${styles.cart_item_content} mt-3`}>
        <p className={`${styles.carttext} mb-4`}>
          {convertToPersianNumbers(prodcut.descriptions)}
        </p>
        <div className="d-flex align-items-center justify-content-between">
          <span className={styles.infoitem}>کد کالا</span>
          <span>{convertToPersianNumbers(prodcut?.item_code)}</span>
        </div>
        <div
          className={`${styles.cartinfoitem} align-items-center justify-content-between  mb-4`}
        >
          <span className={styles.infoitem}>مقدار درخواست</span>
          <div>{convertToPersianNumbers(prodcut.request_qty)}</div>
        </div>
        <div className="d-flex align-items-center justify-content-between">
          <span className={styles.infoitem}>واحد</span>
          <span>{convertToPersianNumbers(prodcut.unitdesc)}</span>
        </div>
      </div>

      <div className="text-center d-flex justify-content-center mt-3">
        <button
          className={styles.add_btn}
          onClick={() => {
            setValue(prodcut.request_qty);
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
