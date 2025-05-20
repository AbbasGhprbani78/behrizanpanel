import styles from "./StatusLastProduct.module.css";
import StatusProduct from "../StatusProdcut/StatusProduct";
import { Link } from "react-router-dom";
import {
  addSlashesToDate,
  convertToPersianNumbers,
} from "../../../utils/helper";

export default function StatusLastProduct({ product }) {
  function getFieldByStatus(product) {
    let fieldValue = "فیلد نامعتبر";
    switch (product?.status) {
      case "1":
        fieldValue = product.sal_order_date;
        break;
      case "2":
        fieldValue = product.confirm_date;
        break;
      case "3":
        fieldValue = product.final_confirm_date;
        break;
      case "4":
        fieldValue = product?.last_trans_doc_date;
        break;
      case "5":
        fieldValue = product?.request_date;
        break;
      case "6":
        fieldValue = product?.last_trans_doc_date;
        break;
      case "7":
        fieldValue = product?.request_date;
        break;
      case "8":
        fieldValue = product?.request_date;
        break;
      default:
        fieldValue = "فیلد نامعتبر";
    }

    return fieldValue;
  }

  return (
    <div className={styles.statusproduct}>
      <p className={styles.statustext}>وضعیت آخرین درخواست</p>
      <StatusProduct status={product?.status} />
      <div className={styles.statusproductbottom}>
        <div className={styles.orderdeatil}>
          <div className={styles.orderdetailitem}>
            <span className={styles.orderdetailtitle}>تعداد اقلام :</span>
            <span className={styles.orderdetailtext}>
              {convertToPersianNumbers(product?.order_details_count)}
            </span>
          </div>
          <div className={styles.orderdetailitem}>
            <span className={styles.orderdetailtitle}>تاریخ درخواست :</span>
            <span className={styles.orderdetailtext}>
              {product?.request_date
                ? addSlashesToDate(
                    convertToPersianNumbers(product?.request_date)
                  )
                : "N/A"}
            </span>
          </div>
          <div className={styles.orderdetailitem}>
            <span className={styles.orderdetailtitle}>
              {product.status == 5 ? "علت مختومه :" : "تاریخ اخرین وضعیت :"}
            </span>
            <span className={styles.orderdetailtext}>
              {product.status == 5
                ? product?.dismissreason
                : product?.request_date
                ? addSlashesToDate(
                    convertToPersianNumbers(getFieldByStatus(product))
                  )
                : "N/A"}
            </span>
          </div>
        </div>
        <Link to={`/orders/${product?.cart_id}`} className={styles.historybtn}>
          تاریخچه
        </Link>
      </div>
    </div>
  );
}
