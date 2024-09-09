
import React, { useEffect, useState } from 'react'
import styles from './StatusLastProduct.module.css'
import StatusProduct from '../StatusProdcut/StatusProduct';
import { Link } from 'react-router-dom';


export default function StatusLastProduct({ product }) {

    const [allNumberSold, setAllNumberSold] = useState(0)

    const calcTotalNumberSold = () => {
        let number = 0;
        if (product) {
            number = product[0]?.order_details?.reduce(
                (prev, current) => prev + current.number_sold,
                0
            );
            setAllNumberSold(number);
        }

        setAllNumberSold(number);
    }

    useEffect(() => {
        calcTotalNumberSold()
    }, [product])


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("fa-IR");
    };
    return (
        <div className={styles.statusproduct}>
            <p className={styles.statustext}>وضعیت آخرین سفارش</p>
            <StatusProduct product={product[0]?.order_details[0]} />
            <div className={styles.statusproductbottom}>
                <div className={styles.orderdeatil}>
                    <div className={styles.orderdetailitem}>
                        <span className={styles.orderdetailtitle}>تعداد اقلام :</span>
                        <span className={styles.orderdetailtext}>
                            {allNumberSold}
                        </span>
                    </div>
                    <div className={styles.orderdetailitem}>
                        <span className={styles.orderdetailtitle}>تاریخ سفارش :</span>
                        <span className={styles.orderdetailtext}>
                            {product[0]?.date_time ? formatDate(product[0]?.date_time) : "N/A"}
                        </span>
                    </div>
                </div>
                <Link to={`/orders/${product[0]?.cart_id}`} className={styles.historybtn}>تاریخچه</Link>
            </div>
        </div>
    );
}
