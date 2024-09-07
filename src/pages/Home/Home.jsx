
import React, { useEffect, useState } from 'react'
import styles from "../../styles/Home.module.css"
import SideBar from '../../components/module/SideBar/SideBar'
import Header from '../../components/module/Header/Header'
import Infouser from '../../components/module/Infouser/Infouser'
import Notifications from '../../components/module/Notifications/Notifications'
import Chart from '../../components/module/Chart/Chart'
import StatusLastProduct from '../../components/module/StatusLastProduct/StatusLastProduct'
import axios from 'axios';
import Chat from '../../components/templates/chat/Chat'

export default function Home() {

    const [product, setProduct] = useState([]);
    const apiUrl = import.meta.env.VITE_API_URL;

    const getLastStatusProduct = async () => {
        const access = localStorage.getItem("access");
        const headers = {
            Authorization: `Bearer ${access}`,
        };

        try {
            const response = await axios.get(`${apiUrl}/app/get-cart-detail/`, {
                headers,
            });

            if (response.status === 200) {
                setProduct(response.data);
            }

        } catch (e) {
            console.log(e);
            if (e.response?.status === 401) {
            }
        }

    };

    useEffect(() => {
        getLastStatusProduct();
    }, []);

    return (
        <>
            <div className={styles.wrapperpage}>
                <SideBar />
                <div className={styles.pagecontent}>
                    <Header title={"خانه"} />
                    <div className={styles.maincontent}>
                        <div className={styles.hometop}>
                            <div className={styles.item1}>
                                <Notifications />
                            </div>
                            <div className={styles.item2}>
                                <Infouser />
                            </div>
                            <div className={styles.item3}>
                                <Chart />
                            </div>
                        </div>
                        {
                            product.length > 0 &&
                            <div className='pb-4'>
                                <StatusLastProduct product={product} />
                            </div>
                        }
                    </div>
                </div>
            </div>
            <Chat />
        </>

    )
}

// App/orders-per/month

