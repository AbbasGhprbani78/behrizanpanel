import styles from "./ProductItem.module.css";
import { BsCart2 } from "react-icons/bs";

export default function ProductItem({
  setShowModalBuy,
  product,
  setMainProduct,
}) {
  const apiUrl = import.meta.env.VITE_API_URL;
  return (
    <>
      <div className={styles.ProductItem1}>
        <table className="table text-center ">
          <thead className={styles.thead}>
            <tr>
              <th style={{ width: "25%" }} className={styles.Th}></th>
              <th style={{ width: "25%" }} className={styles.Th}>
                کد کالا
              </th>
              <th style={{ width: "25%" }} className={styles.Th}>
                شرح محصول
              </th>
              <th style={{ width: "25%" }} className={styles.Th}></th>
            </tr>
          </thead>
          <tbody className={styles.Tbody}>
            <tr className={styles.Tr}>
              <td style={{ width: "25%" }} className={styles.Td}>
                <div
                  className={styles.Button}
                  onClick={() => {
                    setShowModalBuy(true);
                    setMainProduct(product);
                  }}
                >
                  <div className={styles.text}>
                    <span>افزودن</span>
                  </div>
                  <div className={styles.icon1}>
                    <BsCart2 style={{ fontSize: "1rem" }} />
                  </div>
                </div>
              </td>
              <td style={{ width: "10%" }} className={styles.Td}>
                {product.item_code}
              </td>
              <td style={{ width: "40%" }} className={styles.Td}>
                {product.descriptions}
              </td>
              <td style={{ width: "25%" }} className={styles.imageBox}>
                <img
                  src={`${apiUrl}${product.image}`}
                  className={styles.image}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={styles.ProductItem2}>
        <div className={styles.imagecart}>
          <img src={`${apiUrl}${product.image}`} alt="product" />
        </div>
        <div className="d-flex align-items-center justify-content-between mt-3">
          <span>کد کالا</span>
          <span>{product.item_code}</span>
        </div>
        <p className={styles.product_des}>{product.descriptions}</p>
        <div className={styles.Box3}>
          <div
            className={styles.Button}
            onClick={() => {
              setShowModalBuy(true);
              setMainProduct(product);
            }}
          >
            <div className={styles.text}>
              <span> افزودن</span>
            </div>
            <div className={styles.iconF}>
              <BsCart2 />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
