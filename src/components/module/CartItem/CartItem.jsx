import React from 'react'
import styles from './CartItem.module.css'
import Table from 'react-bootstrap/Table';
import { IoCloseSharp } from "react-icons/io5";
import { MdModeEditOutline } from "react-icons/md";
export default function CartItem({ setShowModalBuy,
    isConfirmation,
    setShowDeleteModal,
    prodcut,
    setValue,
    setMainCode,
    setMainProduct
}) {

    const apiUrl = import.meta.env.VITE_API_URL;

    return (
        <div className={styles.cartItemwrappper}>
            <Table className='text-center'>
                <thead className={styles.headtable}>
                    <tr>
                        {
                            !isConfirmation &&
                            <th>< IoCloseSharp className={styles.deleteicon} onClick={() => {
                                setShowDeleteModal(true)
                                setMainCode(prodcut.id)
                            }} />
                            </th>
                        }

                        <th className={styles.itemhead}>کد کالا</th>
                        <th className={styles.itemhead}>شرح محصول</th>
                        <th className={styles.itemhead}>مقدار</th>
                        <th className={styles.itemhead}>واحد {`(${prodcut.property_name})`}</th>
                        <th sclassName={styles.itemhead}></th>
                    </tr>
                </thead>
                <tbody className={styles.bodytable}>
                    <tr >
                        {
                            !isConfirmation &&
                            <td>
                                <MdModeEditOutline className={styles.editicon} onClick={() => {
                                    setValue(prodcut.count)
                                    setMainCode(prodcut.id)
                                    setMainProduct(prodcut)
                                    setShowModalBuy(true)

                                }
                                } />
                            </td>
                        }

                        <td className={styles.bodyitem}>
                            {prodcut.item_code}
                        </td>
                        <td className={styles.bodyitem}>
                            {prodcut.descriptions}
                        </td>
                        <td className={styles.bodyitem}>
                            {prodcut.count}
                        </td>
                        <td className={styles.bodyitem}>
                            {prodcut.property_value}عدد
                        </td>
                        <td className={styles.bodyitemimage}>
                            <img src={`${apiUrl}${prodcut.img}`} className={styles.image} />
                        </td>
                    </tr>
                </tbody>
            </Table>
        </div>
    )
}
