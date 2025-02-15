import styles from './EmptyProduct.module.css'
import { FaPlus } from "react-icons/fa6";
import { Link } from 'react-router-dom';

export default function EmptyProduct() {
    return (
        <div className={styles.cartempty}>
            <div className={styles.imgcartwrapper}>
                <img src="/images/carticon.svg" alt="basket" />
            </div>
            <p className={styles.text_empty}>فعلا سفارش جدیدی وجود ندارد</p>
            <Link to={"/products"} className={styles.btnempty}>
                ثبت سفارش
                <FaPlus className={styles.iconplus} />
            </Link>
        </div>
    )
}
