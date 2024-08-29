
import React, { useEffect, useState } from 'react'
import styles from '../../styles/TrackOrders.module.css'
import SideBar from '../../components/module/SideBar/SideBar'
import Header from '../../components/module/Header/Header'
import OrderTrackItem from '../../components/module/OrderTrackItem/OrderTrackItem'
import SearchBox from '../../components/module/SearchBox/SearchBox'
import Filter from '../../components/module/Filter/Filter'
import axios from 'axios'
import NoneSearch from '../../components/module/NoneSearch/NoneSearch'
import EmptyProduct from '../../components/module/EmptyProduct/EmptyProduct'

export default function TrackOrders() {
    const [search, setSearch] = useState("")
    const [filterValue, setFilterValue] = useState([])
    const [allOrders, setAllorders] = useState([])
    const apiUrl = import.meta.env.VITE_API_URL;


    const getAllOrders = async () => {

        const access = localStorage.getItem("access")
        const headers = {
            Authorization: `Bearer ${access}`
        };
        try {
            const response = await axios.get(`http://5.9.108.174:9500/app/get-cart-detail/`, {
                headers,
            })

            if (response.status === 200) {
                setAllorders(response.data)
                setFilterValue(response.data)
                console.log(response.data)
            }

        } catch (e) {
        }
    }


    const searchHandler = (e) => {

        const searchTerm = e.target.value.toLowerCase();
        setSearch(searchTerm);

        const filterProducts = allOrders.filter(
            (product) =>
                product.cart_id.toString().includes(searchTerm) ||
                product.order_details[0].number_sold.toString().includes(searchTerm)
        );

        setFilterValue(filterProducts);
    }


    useEffect(() => {
        getAllOrders()
    }, [])



    return (
        <div className={styles.wrapperpage}>
            <SideBar />
            <div className={styles.pagecontent}>
                <Header title={"پیگیری سفارشات"} />
                <div className={styles.ordercontent}>
                    {
                        allOrders.length > 0 ?
                            <>
                                <div className={styles.topsec}>
                                    <SearchBox
                                        value={search}
                                        onChange={searchHandler}
                                    />
                                </div>
                                {
                                    filterValue.length > 0 ?
                                        filterValue.slice().reverse().map((order, index) => (
                                            <OrderTrackItem
                                                key={order.cart_id}
                                                order={order}
                                                number={index}
                                            />
                                        )) :
                                        <>
                                            <NoneSearch />
                                        </>
                                }
                            </>
                            :
                            <>
                                <EmptyProduct />
                            </>
                    }
                </div>
            </div>
        </div>
    )
}



