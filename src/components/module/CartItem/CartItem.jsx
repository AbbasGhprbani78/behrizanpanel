import styles from "./CartItem.module.css";
import Table from "react-bootstrap/Table";
import { IoCloseSharp } from "react-icons/io5";
import { MdModeEditOutline } from "react-icons/md";
import { convertToPersianNumbers } from "../../../utils/helper";
export default function CartItem({
  setShowModalBuy,
  setShowDeleteModal,
  prodcut,
  setValue,
  setMainCode,
  setMainProduct,
}) {
  const apiUrl = import.meta.env.VITE_API_URL;

  return (
    <div className={styles.cartItemwrappper}>
      <Table className="text-center">
        <thead className={styles.headtable}>
          <tr>
            <th>
              <IoCloseSharp
                className={styles.deleteicon}
                onClick={() => {
                  setShowDeleteModal(true);
                  setMainCode(prodcut.item_code);
                }}
              />
            </th>
            <th className={styles.itemhead}>کد کالا</th>
            <th className={styles.itemhead}>شرح محصول</th>
            <th className={styles.itemhead}>تعداد</th>
            <th className={styles.itemhead}>واحد</th>
            <th sclassName={styles.itemhead}>تصویر</th>
          </tr>
        </thead>
        <tbody className={styles.bodytable}>
          <tr>
            <td>
              <MdModeEditOutline
                className={styles.editicon}
                onClick={() => {
                  setValue(prodcut.count);
                  setMainCode(prodcut.item_code);
                  setMainProduct(prodcut);
                  setShowModalBuy(true);
                }}
              />
            </td>
            <td className={styles.bodyitem} style={{ width: "240px" }}>
              {convertToPersianNumbers(prodcut.item_code)}
            </td>
            <td className={styles.bodyitem} style={{ width: "280px" }}>
              {convertToPersianNumbers(prodcut.descriptions)}
            </td>
            <td className={styles.bodyitem}>
              {convertToPersianNumbers(prodcut.count)}
            </td>
            <td className={styles.bodyitem}>{prodcut.unitdesc}</td>
            <td className={styles.bodyitemimage}>
              <img
                src={`${
                  prodcut?.img
                    ? `${apiUrl}${prodcut.img}`
                    : "/public/images/image1.png"
                }`}
                className={styles.image}
              />
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
