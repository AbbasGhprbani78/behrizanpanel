import React from 'react'
import styles from './CartItemM.module.css'
import { IoCloseSharp } from "react-icons/io5";
import { MdModeEditOutline } from "react-icons/md";
export default function CartItemM({ setShowDeleteModal,
    isConfirmation,
    setShowModalBuy,
    prodcut,
    setValue,
    setMainCode,
    setMainProduct
}) {

    const apiUrl = import.meta.env.VITE_API_URL;
    return (

        <div className={styles.CartItemmwrapper}>
            {
                !isConfirmation &&
                <IoCloseSharp className={styles.delete} onClick={() => {
                    setShowDeleteModal(true)
                    setMainCode(prodcut.id)
                }} />
            }

            <div className={styles.imagecart}>
                <img src={`${apiUrl}${prodcut.img}`} alt="" className={""} />
            </div>
            <div className={`${styles.cart_item_content} mt-3`}>
                <p className={`${styles.carttext} mb-4`}>{prodcut.descriptions}</p>
                <div className='d-flex align-items-center justify-content-between'>
                    <span className={styles.infoitem}>کد کالا</span>
                    <span>{prodcut.item_code}</span>
                </div>
                <div className={`${styles.cartinfoitem} align-items-center justify-content-between  mb-4`}>
                    <span className={styles.infoitem}>مقدار</span>
                    <div>{prodcut.count}</div>
                </div>
                <div className='d-flex align-items-center justify-content-between'>
                    <span className={styles.infoitem}> واحد {`(${prodcut.property_name})`}</span>
                    <span> {prodcut.property_value}عدد</span>
                </div>
            </div>

            <div className='text-center d-flex justify-content-center mt-3'>
                <button className={styles.add_btn} onClick={() => {
                    setValue(prodcut.count)
                    setMainCode(prodcut.id)
                    setMainProduct(prodcut)
                    setShowModalBuy(true)

                }
                }>
                    ویرایش
                    <MdModeEditOutline className='mx-2' />
                </button>
            </div>
        </div>
    )
}
