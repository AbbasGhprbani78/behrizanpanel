
import React, { useEffect, useState } from 'react'
import styles from './OrderItem.module.css'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material"
export default function OrderItem({ item }) {

  const [windowWidth, setWindowWidth] = useState(0)
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {

    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    updateWindowWidth();
    window.addEventListener('resize', updateWindowWidth);

    return () => {
      window.removeEventListener('resize', updateWindowWidth);
    };
  }, []);

  return (
    <>
      {
        windowWidth < 600 ?
          <>
            <div className={styles.CartItemmwrapper}>
              <div className={styles.imageorder_wrapper}>
                <img src={`${apiUrl}${item?.product?.image}`} alt="" />
              </div>
              <div className='mt-4'>
                <span className={styles.carttext}> {item?.product?.descriptions}</span>
              </div >
              <div className={styles.cartinfowrapper}>
                <div className={styles.cartinfoitem}>
                  <span className={styles.infoitem}>کد کالا</span>
                  <span> {item?.product?.item_code}</span>
                </div>
                <div className={styles.cartinfoitem}>
                  <span className={styles.infoitem}>تعداد</span>
                  <span>{item?.number_sold}</span>
                </div>
                <div className={styles.cartinfoitem}>
                  <span className={styles.infoitem}>گنجایش {`(${item?.product?.specifications[0]?.property_name})`}</span>
                  <span> {item?.product?.specifications[0]?.value}</span>
                </div>
                <div className={styles.cartinfoitem}>
                  {/* مقدار کل */}
                  <span className={styles.infoitem}>مقدار کل</span>
                  <span>{item?.product?.specifications[0]?.total_value}</span>
                </div>
              </div>
            </div>
          </> :
          <>
            <div className='d-flex flex-column' style={{ marginBottom: "1.3rem" }}>
              <div className={styles.cartItemwrappper} >
                <TableContainer component={Paper} style={{ maxHeight: 400 }}>
                  <Table sx={{ minWidth: 750, typography: "inherit" }}>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" style={{ position: "sticky", top: 0, backgroundColor: "#fff" }}>کد کالا</TableCell>
                        <TableCell align="center" style={{ position: "sticky", top: 0, backgroundColor: "#fff" }}>شرح محصول</TableCell>
                        <TableCell align="center" style={{ position: "sticky", top: 0, backgroundColor: "#fff" }}>تعداد</TableCell>
                        <TableCell align="center" style={{ position: "sticky", top: 0, backgroundColor: "#fff" }}>گنجایش {`(${item?.product?.specifications[0]?.property_name})`}</TableCell>
                        <TableCell align="center" style={{ position: "sticky", top: 0, backgroundColor: "#fff" }}>مقدار کل</TableCell>
                        <TableCell align="center" style={{ position: "sticky", top: 0, backgroundColor: "#fff" }}>تصویر</TableCell>

                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow >
                        <TableCell align="center" sx={{ width: "240px" }}>{item?.product?.item_code}</TableCell>
                        <TableCell align="center" sx={{ width: "300px" }}>{item?.product?.descriptions}</TableCell>
                        <TableCell align="center">{item?.number_sold}</TableCell>
                        <TableCell align="center">{item?.product?.specifications[0]?.value}</TableCell>
                        <TableCell align="center">{item?.product?.specifications[0]?.total_value}</TableCell>
                        <TableCell align="center"><img src={`${apiUrl}${item?.product?.image}`} alt="" style={{ width: "70px", height: "70px" }} /></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div >
            </div>
          </>
      }
    </>

  )
}




